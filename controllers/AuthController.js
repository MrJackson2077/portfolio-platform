/**
 * controllers/AuthController.js
 * ─────────────────────────────────────────────────────────────
 * HTTP handlers for authentication routes.
 * All business logic and DB access is delegated to userService.
 *
 * Routes:
 *   POST /api/auth/register   — create account
 *   POST /api/auth/login      — issue JWT tokens
 *   POST /api/auth/logout     — revoke session
 *   GET  /api/auth/me         — return authenticated user
 *   POST /api/auth/refresh    — exchange refresh → access token
 *   POST /api/auth/forgot     — request password-reset email
 *   POST /api/auth/reset      — complete password reset
 */

'use strict';

const jwt       = require('jsonwebtoken');
const validator = require('validator');
const userService = require('../services/userService');

// ─── Constants ────────────────────────────────────────────────
const JWT_SECRET         = process.env.JWT_SECRET         || 'CHANGE_ME_IN_PRODUCTION_MIN_32_CHARS!!';
const JWT_EXPIRES_IN     = process.env.JWT_EXPIRES_IN     || '7d';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_SECRET + '_refresh';

// ─── Token helpers ────────────────────────────────────────────

function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN, algorithm: 'HS256' });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d', algorithm: 'HS256' });
}

// ─── Response helpers ─────────────────────────────────────────

function sendError(res, status, message, details = {}) {
  return res.status(status).json({ ok: false, error: { message, ...details } });
}

function sendOk(res, data = {}, status = 200) {
  return res.status(status).json({ ok: true, ...data });
}

// ─── Input validation ─────────────────────────────────────────

function validateRegisterInput({ email, password, displayName }) {
  const errors = [];
  if (!displayName || displayName.trim().length < 2)
    errors.push('Display name must be at least 2 characters.');
  if (!email || !validator.isEmail(email))
    errors.push('A valid email address is required.');
  if (!password || password.length < 8)
    errors.push('Password must be at least 8 characters.');
  if (password && !/[A-Z]/.test(password))
    errors.push('Password must contain at least one uppercase letter.');
  if (password && !/[0-9]/.test(password))
    errors.push('Password must contain at least one number.');
  return errors;
}

// ─────────────────────────────────────────────────────────────
// REGISTER — POST /api/auth/register
// ─────────────────────────────────────────────────────────────
async function register(req, res) {
  try {
    const { displayName, email, password } = req.body || {};
    const normalizedEmail = (email || '').toLowerCase().trim();

    // 1. Validate
    const errors = validateRegisterInput({ email: normalizedEmail, password, displayName });
    if (errors.length) return sendError(res, 422, 'Validation failed.', { fields: errors });

    // 2. Check for duplicate email
    if (await userService.emailExists(normalizedEmail)) {
      return sendError(res, 409, 'An account with this email already exists.');
    }

    // 3. Delegate creation to the service (hashing + transaction inside)
    const { user, workspace } = await userService.createUser({
      displayName,
      email: normalizedEmail,
      password,
    });

    // 4. Issue tokens
    const tokenPayload = { sub: user.id, email: user.email, workspaceId: workspace.id };
    const accessToken  = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken({ sub: user.id });

    // 5. Audit
    await userService.auditLog(user.id, 'user.register', {
      provider: 'local',
      workspaceId: workspace.id,
    });

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
async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return sendError(res, 400, 'Email and password are required.');

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Fetch user + password hash + workspace via service
    const user = await userService.findForLogin(normalizedEmail);

    // 2. Constant-time password check (handles null user gracefully)
    const passwordMatch = await userService.verifyPassword(password, user?.password_hash || null);

    if (!user || !passwordMatch) {
      await userService.auditLog(null, 'user.login.failed', { email: normalizedEmail });
      return sendError(res, 401, 'Invalid email or password.');
    }

    // 3. Account status guard
    if (user.status === 'suspended') {
      return sendError(res, 403, 'Your account has been suspended. Please contact support.');
    }
    if (user.status === 'deleted') {
      return sendError(res, 403, 'This account no longer exists.');
    }

    // 4. Issue tokens
    const tokenPayload = { sub: user.id, email: user.email, workspaceId: user.workspace_id };
    const accessToken  = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken({ sub: user.id });

    // 5. Audit
    await userService.auditLog(user.id, 'user.login.success', {
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
async function logout(req, res) {
  try {
    const userId = req.user?.sub;
    if (!userId) return sendError(res, 401, 'Not authenticated.');

    await userService.auditLog(userId, 'user.logout');
    return sendOk(res, { message: 'Logged out successfully.' });
  } catch (err) {
    console.error('[AuthController.logout]', err);
    return sendError(res, 500, 'Logout failed.');
  }
}

// ─────────────────────────────────────────────────────────────
// ME — GET /api/auth/me
// ─────────────────────────────────────────────────────────────
async function me(req, res) {
  try {
    const userId = req.user?.sub;
    if (!userId) return sendError(res, 401, 'Not authenticated.');

    // Service handles the join to workspaces
    const u = await userService.findWithWorkspace(userId);
    if (!u) return sendError(res, 404, 'User not found.');

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

    // Use service to load fresh user data
    const u = await userService.findWithWorkspace(payload.sub);
    if (!u) return sendError(res, 401, 'User not found or account inactive.');

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
async function forgotPassword(req, res) {
  const GENERIC_MSG = 'If an account with that email exists, a reset link has been sent.';

  try {
    const { email } = req.body || {};
    if (!email || !validator.isEmail(email)) {
      return sendError(res, 400, 'A valid email address is required.');
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await userService.findByEmail(normalizedEmail);

    // Always return the same response to prevent user enumeration
    if (!user || user.status !== 'active') {
      return sendOk(res, { message: GENERIC_MSG });
    }

    // Service creates and stores the reset token
    const token    = await userService.createResetToken(user.id);
    const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    // TODO: send email via your provider (Resend, SendGrid, SES…)
    console.log(`[Auth] Reset link for ${normalizedEmail}: ${resetUrl}`);

    await userService.auditLog(user.id, 'user.password.reset_requested');

    return sendOk(res, { message: GENERIC_MSG });

  } catch (err) {
    console.error('[AuthController.forgotPassword]', err);
    return sendOk(res, { message: 'If an account with that email exists, a reset link has been sent.' });
  }
}

// ─────────────────────────────────────────────────────────────
// RESET PASSWORD — POST /api/auth/reset
// ─────────────────────────────────────────────────────────────
async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body || {};
    if (!token || !newPassword) {
      return sendError(res, 400, 'Reset token and new password are required.');
    }
    if (newPassword.length < 8) {
      return sendError(res, 422, 'New password must be at least 8 characters.');
    }

    // Service handles token validation + password update
    const success = await userService.consumeResetToken(token, newPassword);
    if (!success) {
      return sendError(res, 400, 'Reset token is invalid or has expired. Please request a new one.');
    }

    return sendOk(res, { message: 'Password reset successfully. You can now log in.' });

  } catch (err) {
    console.error('[AuthController.resetPassword]', err);
    return sendError(res, 500, 'Password reset failed. Please request a new link.');
  }
}

// ─── Exports ──────────────────────────────────────────────────
module.exports = {
  register,
  login,
  logout,
  me,
  refresh,
  forgotPassword,
  resetPassword,
};
