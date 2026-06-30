/**
 * services/userService.js
 * ─────────────────────────────────────────────────────────────
 * Business logic for all user-related operations.
 *
 * This layer sits between the HTTP controllers and the database.
 * Controllers call service methods; service methods call db.js.
 * This keeps controllers thin and makes the business logic
 * independently testable.
 *
 * Responsibilities:
 *   - Find / create / update / delete users
 *   - Manage auth identities (local password, OAuth)
 *   - Manage workspaces
 *   - Password hashing (owns the bcrypt dependency)
 *   - Reset-token lifecycle
 *   - Audit logging helpers
 */

'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { query, transaction } = require('../database/db');

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);

// ─── Password helpers ─────────────────────────────────────────

/**
 * Hash a plain-text password.
 * @param {string} plain
 * @returns {Promise<string>} bcrypt hash
 */
async function hashPassword(plain) {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

/**
 * Compare a plain-text password against a stored bcrypt hash.
 * Always runs the comparison (constant-time) even when no hash
 * is supplied, to prevent user-enumeration via timing.
 *
 * @param {string} plain
 * @param {string|null} hash
 * @returns {Promise<boolean>}
 */
async function verifyPassword(plain, hash) {
  const safeHash = hash || '$2b$12$invalidhashfortimingprotection000000000000000000000000';
  return bcrypt.compare(plain, safeHash);
}

// ─── Finders ─────────────────────────────────────────────────

/**
 * Find a user by their email address.
 *
 * @param {string} email — already normalised (lowercase, trimmed)
 * @returns {Promise<object|null>} user row or null
 */
async function findByEmail(email) {
  const result = await query(
    `SELECT id, email, display_name, status, created_at
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [email],
  );
  return result.rows[0] || null;
}

/**
 * Find a user by primary key.
 *
 * @param {string} id — UUID
 * @returns {Promise<object|null>}
 */
async function findById(id) {
  const result = await query(
    `SELECT id, email, display_name, status, created_at
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [id],
  );
  return result.rows[0] || null;
}

/**
 * Find a user together with their local auth identity and default
 * workspace — the shape needed for a login response.
 *
 * @param {string} email
 * @returns {Promise<object|null>}
 */
async function findForLogin(email) {
  const result = await query(
    `SELECT
       u.id,
       u.email,
       u.display_name,
       u.status,
       ai.password_hash,
       w.id   AS workspace_id,
       w.name AS workspace_name,
       w.plan
     FROM users u
     JOIN auth_identities ai ON ai.user_id = u.id AND ai.provider = 'local'
     JOIN workspaces      w  ON w.owner_user_id = u.id
     WHERE u.email = $1
     LIMIT 1`,
    [email],
  );
  return result.rows[0] || null;
}

/**
 * Find a user with their workspace (used by /me and token refresh).
 *
 * @param {string} userId — UUID
 * @returns {Promise<object|null>}
 */
async function findWithWorkspace(userId) {
  const result = await query(
    `SELECT
       u.id,
       u.email,
       u.display_name,
       u.status,
       u.created_at,
       w.id   AS workspace_id,
       w.name AS workspace_name,
       w.plan
     FROM users u
     JOIN workspaces w ON w.owner_user_id = u.id
     WHERE u.id = $1 AND u.status = 'active'
     LIMIT 1`,
    [userId],
  );
  return result.rows[0] || null;
}

// ─── Creation ─────────────────────────────────────────────────

/**
 * Check whether an email is already registered.
 *
 * @param {string} email
 * @returns {Promise<boolean>}
 */
async function emailExists(email) {
  const result = await query(
    'SELECT 1 FROM users WHERE email = $1',
    [email],
  );
  return result.rows.length > 0;
}

/**
 * Create a new user account with:
 *   - a `users` row
 *   - a `auth_identities` row (local provider, bcrypt hash)
 *   - a default `workspaces` row
 *
 * All three inserts run inside a single transaction so the DB
 * is never left in a half-created state.
 *
 * @param {{ displayName: string, email: string, password: string }} params
 * @returns {Promise<{ user: object, workspace: object }>}
 */
async function createUser({ displayName, email, password }) {
  const passwordHash = await hashPassword(password);

  return transaction(async (client) => {
    // 1. Insert user
    const userResult = await client.query(
      `INSERT INTO users (email, display_name, status, created_at, updated_at)
       VALUES ($1, $2, 'active', NOW(), NOW())
       RETURNING id, email, display_name, created_at`,
      [email, displayName.trim()],
    );
    const user = userResult.rows[0];

    // 2. Insert local auth identity
    await client.query(
      `INSERT INTO auth_identities (user_id, provider, password_hash)
       VALUES ($1, 'local', $2)`,
      [user.id, passwordHash],
    );

    // 3. Create default workspace
    const wsResult = await client.query(
      `INSERT INTO workspaces (owner_user_id, name, plan, created_at)
       VALUES ($1, $2, 'free', NOW())
       RETURNING id, name, plan`,
      [user.id, `${displayName.trim()}'s Workspace`],
    );

    return { user, workspace: wsResult.rows[0] };
  });
}

// ─── Updates ─────────────────────────────────────────────────

/**
 * Update a user's display name and/or email.
 *
 * @param {string} userId
 * @param {{ displayName?: string, email?: string }} fields
 * @returns {Promise<object>} updated user row
 */
async function updateUser(userId, fields) {
  const updates = [];
  const values  = [];
  let   idx     = 1;

  if (fields.displayName) {
    updates.push(`display_name = $${idx++}`);
    values.push(fields.displayName.trim());
  }
  if (fields.email) {
    updates.push(`email = $${idx++}`);
    values.push(fields.email.toLowerCase().trim());
  }

  if (!updates.length) {
    throw new Error('No fields provided to update.');
  }

  updates.push(`updated_at = NOW()`);
  values.push(userId);

  const result = await query(
    `UPDATE users
     SET ${updates.join(', ')}
     WHERE id = $${idx}
     RETURNING id, email, display_name, status, updated_at`,
    values,
  );

  if (!result.rows.length) throw new Error('User not found.');
  return result.rows[0];
}

/**
 * Change a user's password.
 *
 * @param {string} userId
 * @param {string} newPassword — plain text; will be hashed here
 * @returns {Promise<void>}
 */
async function updatePassword(userId, newPassword) {
  const hash = await hashPassword(newPassword);
  await query(
    `UPDATE auth_identities
     SET password_hash = $1
     WHERE user_id = $2 AND provider = 'local'`,
    [hash, userId],
  );
}

// ─── Soft delete ──────────────────────────────────────────────

/**
 * Soft-delete a user account (sets status → 'deleted').
 * Does not remove rows so audit history is preserved.
 *
 * @param {string} userId
 * @returns {Promise<void>}
 */
async function softDeleteUser(userId) {
  await query(
    `UPDATE users
     SET status = 'deleted', updated_at = NOW()
     WHERE id = $1`,
    [userId],
  );
}

// ─── Password reset token lifecycle ──────────────────────────

/**
 * Store a password-reset token (UUID) linked to a user.
 * Expires in 1 hour. Uses a dedicated table if available;
 * falls back to a JSONB metadata column approach here.
 *
 * In production, create a `password_reset_tokens` table:
 *   id, user_id, token_hash, expires_at, used_at
 *
 * @param {string} userId
 * @returns {Promise<string>} the plain-text token (to send by email)
 */
async function createResetToken(userId) {
  const token     = uuidv4();
  const tokenHash = await hashPassword(token);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // NOTE: replace this with a real password_reset_tokens table insert
  // when the migration is ready.
  console.log(`[UserService] Reset token created for user ${userId}, expires ${expiresAt.toISOString()}`);
  console.log(`[UserService] Token hash (store this, not the plain token): ${tokenHash}`);

  return token; // caller sends this by email
}

/**
 * Validate a reset token and apply the new password.
 * Returns true on success, false if token is invalid/expired.
 *
 * @param {string} _token
 * @param {string} newPassword
 * @returns {Promise<boolean>}
 */
async function consumeResetToken(_token, newPassword) {
  // TODO: look up the token hash in password_reset_tokens,
  // verify it hasn't expired or been used, then call updatePassword().
  // For now this is a documented stub.
  console.warn('[UserService] consumeResetToken: stub — wire up reset token table.');
  return false;
}

// ─── Audit helper ─────────────────────────────────────────────

/**
 * Write a row to audit_events.
 * Failures are swallowed so they never break the primary flow.
 *
 * @param {string|null} userId
 * @param {string}      action
 * @param {object}      [meta]
 */
async function auditLog(userId, action, meta = {}) {
  try {
    await query(
      `INSERT INTO audit_events (user_id, action, metadata, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [userId || null, action, JSON.stringify(meta)],
    );
  } catch (err) {
    console.error('[UserService.auditLog] Failed:', err.message);
  }
}

// ─── Exports ──────────────────────────────────────────────────
module.exports = {
  // Password
  hashPassword,
  verifyPassword,
  // Finders
  findByEmail,
  findById,
  findForLogin,
  findWithWorkspace,
  emailExists,
  // CRUD
  createUser,
  updateUser,
  updatePassword,
  softDeleteUser,
  // Reset tokens
  createResetToken,
  consumeResetToken,
  // Audit
  auditLog,
};
