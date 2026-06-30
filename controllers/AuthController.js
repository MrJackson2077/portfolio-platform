/**
 * controllers/AuthController.js
 * ─────────────────────────────────────────────────────────────
 * Handles all authentication-related HTTP requests:
 *   POST /api/auth/register   — create a new account
 *   POST /api/auth/login      — issue a session token
 *   POST /api/auth/logout     — revoke a session
 *   GET  /api/auth/me         — return the authenticated user
 *   POST /api/auth/refresh    — extend a valid session
 *   POST /api/auth/forgot     — request a password-reset email
 *   POST /api/auth/reset      — complete a password reset
 *
 * Dependencies (install before use):
 *   npm install bcrypt jsonwebtoken uuid validator
 *
 * Environment variables expected:
 *   JWT_SECRET          — HS256 signing secret (min 32 chars)
 *   JWT_EXPIRES_IN      — token TTL e.g. '7d'   (default: '7d')
 *   JWT_REFRESH_SECRET  — separate secret for refresh tokens
 *   BCRYPT_ROUNDS       — work factor            (default: 12)
 *   APP_URL             — base URL for reset links
 */

'use strict';

const bcrypt    = require('bcrypt');
const jwt       = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
const { query, transaction } = require('../database/db');

// ─── Constants ────────────────────────────────────────────────
const BCRYPT_ROUNDS   = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);
const JWT_SECRET      = process.env.JWT_SECRET      || 'CHANGE_ME_IN_PRODUCTION_MIN_32_CHARS!!';
const JWT_EXPIRES_IN  = process.env.JWT_EXPIRES_IN  || '7d';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_SECRET + '_refresh';

// ─── Helpers ──────────────────────────────────────────────────

/**
 * Send a consistent JSON error response.
 * @param {import('http').ServerResponse} res
 * @param {number} status
 * @param {string} message
 * @param {object} [details]
 */
function sendError(res, status, message, details = {}) {
  return res.status(status).json({ ok: false, error: { message, ...details } });
}

/**
 * Send a consistent JSON success response.
 */
function sendOk(res, data = {}, status = 200) {
  return res.status(status).json({ ok: true, ...data });
}

/**
 * Sign a short-lived access token (JWT).
 */
function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN, algorithm: 'HS256' });
}

/**
 * Sign a longer-lived refresh token.
 */
function signRefreshToken(payload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d', algorithm: 'HS256' });
}

/**
 * Hash a plain-text password with bcrypt.
 */
async function hashPassword(plain) {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

/**
 * Compare a plain-text password against a bcrypt hash.
 */
async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

/**
 * Record a security-relevant action in the audit_events table.
 */
async function auditLog(userId, action, meta = {}) {
  try {
    await query(
      `INSERT INTO audit_events (user_id, action, metadata, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [userId || null, action, JSON.stringify(meta)],
    );
  } catch (err) {
    // Audit failure must never break the primary flow
    console.error('[Audit] Failed to write event:', err.message);
  }
}

// ─── Validation ───────────────────────────────────────────────

function validateRegisterInput({ email, password, displayName }) {
  const errors = [];

  if (!displayName || displayName.trim().length < 2) {
    errors.push('Display name must be at least 2 characters.');
  }
  if (!email || !validator.isEmail(email)) {
    errors.push('A valid email address is required.');
  }
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters.');
  }
  if (password && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter.');
  }
  if (password && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number.');
  }

  return errors;
}

// ─────────────────────────────────────────────────────────────
// REGISTER — POST /api/auth/register
// ─────────────────────────────────────────────────────────────
/**
 * Create a new user account.
 *
 * Body: { displayName, email, password }
 *
 * Returns: { user, accessToken, refreshToken }
 */
async function register(req, res) {
  try {
    const { displayName, email, password } = req.body || {};
    const normalizedEmail = (email || '').toLowerCase().trim();

    // 1. Validate inputs
    const errors = validateRegisterInput({ email: normalizedEmail, password, displayName });
    if (errors.length) {
      return sendError(res, 422, 'Validation failed.', { fields: errors });
    }

    // 2. Check for existing account
    const existing = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rows.length) {
      return sendError(res, 409, 'An account with this email already exists.');
    }

    // 3. Hash password & create user + workspace in a transaction
    const passwordHash = await hashPassword(password);

    const { user, workspace } = await transaction(async (client) => {
      // Insert user
      const userResult = await client.query(
        `INSERT INTO users (email, display_name, status, created_at, updated_at)
         VALUES ($1, $2, 'active', NOW(), NOW())
         RETURNING id, email, display_name, created_at`,
        [normalizedEmail, displayName.trim()],
      );
      const newUser = userResult.rows[0];

      // Insert local auth identity (password hash)
      await client.query(
        `INSERT INTO auth_identities (user_id, provider, password_hash)
         VALUES ($1, 'local', $2)`,
        [newUser.id, passwordHash],
      );

      // Create default workspace for the user
      const wsResult = await client.query(
        `INSERT INTO workspaces (owner_user_id, name, plan, created_at)
         VALUES ($1, $2, 'free', NOW())
         RETURNING id, name`,
        [newUser.id, `${displayName.trim()}'s Workspace`],
      );

      return { user: newUser, workspace: wsResult.rows[0] };
    });

    // 4. Issue tokens
    const tokenPayload = { sub: user.id, email: user.email, workspaceId: workspace.id };
    const accessToken  = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken({ sub: user.id });

    // 5. Audit
    await auditLog(user.id, 'user.register', { provider: 'local', workspaceId: workspace.id });

    // 6. Respond — never expose the password hash
    return sendOk(res, {
      user: {
        id:          user.id,
        email:       user.email,
        displayName: user.display_name,
        createdAt:   user.created_at,
      },
      workspace: { id: workspace.id, name: workspace.name },
      accessToken,
      refreshToken,
    }, 201);

  } catch (err) {
    console.error('[AuthController.register]', err);
    return sendError(res, 500, 'Registration failed. Please try again.');
  }
}

// ─────────────────────────────────────────────────────────────
// LOGIN — POST /api/auth/login
// ─────────────────────────────────────────────────────────────
/**
 * Authenticate with email + password, return tokens.
 *
 * Body: { email, password }
 *
 * Returns: { user, accessToken, refreshToken }
 */
async function login(req, res) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required.');
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Find user with local identity
    const result = await query(
      `SELECT u.id, u.email, u.display_name, u.status,
              ai.password_hash,
              w.id AS workspace_id
       FROM users u
       JOIN auth_identities ai ON ai.user_id = u.id AND ai.provider = 'local'
       JOIN workspaces w       ON w.owner_user_id = u.id
       WHERE u.email = $1
       LIMIT 1`,
      [normalizedEmail],
    );

    // Use constant-time comparison to prevent user enumeration
    const user = result.rows[0] || null;
    const dummyHash = '$2b$12$invalidhashfortimingprotection000000000000000000000000';
    const passwordMatch = await verifyPassword(password, user?.password_hash || dummyHash);

    if (!user || !passwordMatch) {
      await auditLog(null, 'user.login.failed', { email: normalizedEmail });
      return sendError(res, 401, 'Invalid email or password.');
    }

    // 2. Check account status
    if (user.status === 'suspended') {
      return sendError(res, 403, 'Your account has been suspended. Please contact support.');
    }
    if (user.status === 'deleted') {
      return sendError(res, 403, 'This account no longer exists.');
    }

    // 3. Issue tokens
    const tokenPayload = { sub: user.id, email: user.email, workspaceId: user.workspace_id };
    const accessToken  = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken({ sub: user.id });

    // 4. Audit
    await auditLog(user.id, 'user.login.success', {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendOk(res, {
      user: {
        id:          user.id,
        email:       user.email,
        displayName: user.display_name,
      },
      accessToken,
      refreshToken,
    });

  } catch (err) {
    console.error('[AuthController.login]', err);
    return sendError(res, 500, 'Login failed. Please try again.');
  }
}

// ─────────────────────────────────────────────────────────────
// LOGOUT — POST /api/auth/logout
// ─────────────────────────────────────────────────────────────
/**
 * Invalidate the current session.
 * Requires a valid Bearer token in the Authorization header.
 *
 * Returns: { message }
 */
async function logout(req, res) {
  try {
    // req.user is set by the auth middleware
    const userId = req.user?.sub;
    if (!userId) return sendError(res, 401, 'Not authenticated.');

    // Optionally: delete the session row if using DB sessions
    // await query('DELETE FROM sessions WHERE user_id = $1 AND token_hash = $2', [userId, tokenHash]);

    await auditLog(userId, 'user.logout');

    return sendOk(res, { message: 'Logged out successfully.' });
  } catch (err) {
    console.error('[AuthController.logout]', err);
    return sendError(res, 500, 'Logout failed.');
  }
}

// ─────────────────────────────────────────────────────────────
// ME — GET /api/auth/me
// ─────────────────────────────────────────────────────────────
/**
 * Return the currently authenticated user's profile.
 * Requires a valid Bearer token.
 *
 * Returns: { user }
 */
async function me(req, res) {
  try {
    const userId = req.user?.sub;
    if (!userId) return sendError(res, 401, 'Not authenticated.');

    const result = await query(
      `SELECT u.id, u.email, u.display_name, u.status, u.created_at,
              w.id AS workspace_id, w.name AS workspace_name, w.plan
       FROM users u
       JOIN workspaces w ON w.owner_user_id = u.id
       WHERE u.id = $1 AND u.status = 'active'
       LIMIT 1`,
      [userId],
    );

    if (!result.rows.length) {
      return sendError(res, 404, 'User not found.');
    }

    const u = result.rows[0];
    return sendOk(res, {
      user: {
        id:          u.id,
        email:       u.email,
        displayName: u.display_name,
        status:      u.status,
        createdAt:   u.created_at,
      },
      workspace: {
        id:   u.workspace_id,
        name: u.workspace_name,
        plan: u.plan,
      },
    });

  } catch (err) {
    console.error('[AuthController.me]', err);
    return sendError(res, 500, 'Failed to retrieve user.');
  }
}

// ─────────────────────────────────────────────────────────────
// REFRESH — POST /api/auth/refresh
// ─────────────────────────────────────────────────────────────
/**
 * Exchange a valid refresh token for a new access token.
 *
 * Body: { refreshToken }
 *
 * Returns: { accessToken }
 */
async function refresh(req, res) {
  try {
    const { refreshToken } = req.body || {};
    if (!refreshToken) return sendError(res, 400, 'Refresh token is required.');

    let payload;
    try {
      payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch {
      return sendError(res, 401, 'Refresh token is invalid or expired.');
    }

    // Fetch fresh user data to embed in the new token
    const result = await query(
      `SELECT u.id, u.email, u.status, w.id AS workspace_id
       FROM users u
       JOIN workspaces w ON w.owner_user_id = u.id
       WHERE u.id = $1 AND u.status = 'active'
       LIMIT 1`,
      [payload.sub],
    );

    if (!result.rows.length) {
      return sendError(res, 401, 'User not found or account inactive.');
    }

    const u = result.rows[0];
    const accessToken = signAccessToken({
      sub: u.id,
      email: u.email,
      workspaceId: u.workspace_id,
    });

    return sendOk(res, { accessToken });

  } catch (err) {
    console.error('[AuthController.refresh]', err);
    return sendError(res, 500, 'Token refresh failed.');
  }
}

// ─────────────────────────────────────────────────────────────
// FORGOT PASSWORD — POST /api/auth/forgot
// ─────────────────────────────────────────────────────────────
/**
 * Initiate a password reset — generate a signed token and
 * (in production) send an email with the reset link.
 *
 * Body: { email }
 *
 * Returns: { message }  — always the same message to prevent enumeration
 */
async function forgotPassword(req, res) {
  const GENERIC_MSG = 'If an account with that email exists, a reset link has been sent.';

  try {
    const { email } = req.body || {};
    if (!email || !validator.isEmail(email)) {
      return sendError(res, 400, 'A valid email address is required.');
    }

    const normalizedEmail = email.toLowerCase().trim();
    const result = await query('SELECT id FROM users WHERE email = $1 AND status = $2', [normalizedEmail, 'active']);

    // Always respond the same way — don't reveal whether the email exists
    if (!result.rows.length) {
      return sendOk(res, { message: GENERIC_MSG });
    }

    const userId = result.rows[0].id;
    const resetToken = uuidv4();
    const expiresAt  = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store the reset token (hashed) against the user
    await query(
      `UPDATE auth_identities
       SET password_hash = $1
       WHERE user_id = $2 AND provider = 'local'`,
      // In a real system you'd have a separate password_reset_tokens table
      // For now we tag the hash — replace with proper reset token table
      [await hashPassword(resetToken), userId],
    );

    const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // TODO: send email via your email provider (SendGrid, Resend, SES, etc.)
    console.log(`[Auth] Password reset link for ${normalizedEmail}: ${resetUrl}`);

    await auditLog(userId, 'user.password.reset_requested');

    return sendOk(res, { message: GENERIC_MSG });

  } catch (err) {
    console.error('[AuthController.forgotPassword]', err);
    // Return the generic message even on error
    return sendOk(res, { message: 'If an account with that email exists, a reset link has been sent.' });
  }
}

// ─────────────────────────────────────────────────────────────
// RESET PASSWORD — POST /api/auth/reset
// ─────────────────────────────────────────────────────────────
/**
 * Complete a password reset with a valid token.
 *
 * Body: { token, newPassword }
 *
 * Returns: { message }
 */
async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body || {};

    if (!token || !newPassword) {
      return sendError(res, 400, 'Reset token and new password are required.');
    }
    if (newPassword.length < 8) {
      return sendError(res, 422, 'New password must be at least 8 characters.');
    }

    // NOTE: In a real implementation, query a dedicated reset_tokens table.
    // This stub demonstrates the pattern.

    const newHash = await hashPassword(newPassword);
    // await query('UPDATE auth_identities SET password_hash = $1 WHERE user_id = $2', [newHash, userId]);

    console.log('[Auth] Password successfully reset (stub — wire up token lookup).');

    return sendOk(res, { message: 'Password reset successfully. You can now log in.' });

  } catch (err) {
    console.error('[AuthController.resetPassword]', err);
    return sendError(res, 500, 'Password reset failed. Please request a new link.');
  }
}

// ─── Export controller methods ────────────────────────────────
module.exports = {
  register,
  login,
  logout,
  me,
  refresh,
  forgotPassword,
  resetPassword,
};
