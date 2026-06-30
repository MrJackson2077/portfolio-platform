/**
 * database/db.js
 * ─────────────────────────────────────────────────────────────
 * PostgreSQL database connection and query helper.
 *
 * Uses the `pg` (node-postgres) library to provide a connection
 * pool shared across the entire backend process.
 *
 * Environment variables expected:
 *   DB_HOST     — Postgres host          (default: localhost)
 *   DB_PORT     — Postgres port          (default: 5432)
 *   DB_NAME     — Database name          (default: yourwork)
 *   DB_USER     — Database user          (default: postgres)
 *   DB_PASSWORD — Database password      (required in production)
 *   DATABASE_URL — Full connection string (overrides individual vars)
 *   NODE_ENV    — 'production' | 'development' | 'test'
 */

'use strict';

const { Pool } = require('pg');

// ─── Connection pool ──────────────────────────────────────────
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false,
    }
  : {
      host:     process.env.DB_HOST     || 'localhost',
      port:     parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME     || 'yourwork',
      user:     process.env.DB_USER     || 'postgres',
      password: process.env.DB_PASSWORD || '',
      ssl:      process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false,
    };

const pool = new Pool({
  ...poolConfig,
  max:              20,   // max connections in the pool
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

// ─── Event listeners ──────────────────────────────────────────
pool.on('connect', () => {
  console.log('[DB] New client connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected error on idle client:', err.message);
  // In production you may want to alert here and let the process restart
});

// ─── Query helpers ────────────────────────────────────────────

/**
 * Execute a single parameterised query using the pool.
 *
 * @param {string} text   - SQL query string with $1, $2 … placeholders
 * @param {Array}  params - Parameter values
 * @returns {Promise<import('pg').QueryResult>}
 *
 * @example
 * const { rows } = await query(
 *   'SELECT * FROM users WHERE id = $1',
 *   [userId]
 * );
 */
async function query(text, params = []) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DB] query executed in ${duration}ms — rows: ${result.rowCount}`);
    }

    return result;
  } catch (err) {
    console.error('[DB] Query error:', { text, params, error: err.message });
    throw err;
  }
}

/**
 * Acquire a dedicated client for multi-statement transactions.
 * Always call client.release() in a finally block.
 *
 * @returns {Promise<import('pg').PoolClient>}
 *
 * @example
 * const client = await getClient();
 * try {
 *   await client.query('BEGIN');
 *   await client.query('INSERT INTO ...', [...]);
 *   await client.query('COMMIT');
 * } catch (err) {
 *   await client.query('ROLLBACK');
 *   throw err;
 * } finally {
 *   client.release();
 * }
 */
async function getClient() {
  const client = await pool.connect();
  const origQuery = client.query.bind(client);
  const origRelease = client.release.bind(client);

  // Detect clients that are checked out for too long (>= 5 seconds)
  const timeout = setTimeout(() => {
    console.error('[DB] A client has been checked out for more than 5 seconds.');
  }, 5_000);

  client.query = (...args) => {
    client.lastQuery = args;
    return origQuery(...args);
  };

  client.release = () => {
    clearTimeout(timeout);
    client.query = origQuery;
    client.release = origRelease;
    return origRelease();
  };

  return client;
}

/**
 * Execute multiple queries inside a single transaction.
 * Automatically commits on success, rolls back on error.
 *
 * @param {Function} callback - Async function that receives the client
 * @returns {Promise<any>}    - Whatever the callback returns
 *
 * @example
 * const result = await transaction(async (client) => {
 *   await client.query('INSERT INTO portfolios ...', [...]);
 *   await client.query('INSERT INTO portfolio_blocks ...', [...]);
 *   return { ok: true };
 * });
 */
async function transaction(callback) {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[DB] Transaction rolled back:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Verify the database connection is alive.
 * Call this on application startup.
 *
 * @returns {Promise<void>}
 */
async function testConnection() {
  const { rows } = await query('SELECT NOW() AS current_time, version() AS pg_version');
  console.log('[DB] Connection verified ✓');
  console.log(`[DB] Server time : ${rows[0].current_time}`);
  console.log(`[DB] PG version  : ${rows[0].pg_version.split(' ')[1]}`);
}

/**
 * Gracefully drain the pool and close all connections.
 * Call this on SIGTERM / SIGINT.
 *
 * @returns {Promise<void>}
 */
async function closePool() {
  await pool.end();
  console.log('[DB] Connection pool closed.');
}

// ─── Schema bootstrapping (development only) ─────────────────
// In production run migrations via a proper migration tool
// (e.g. node-pg-migrate, Flyway, or Liquibase).
const BOOTSTRAP_SQL = `
  -- Users and identity
  CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           TEXT UNIQUE NOT NULL,
    display_name    TEXT NOT NULL,
    avatar_asset_id UUID,
    status          TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'suspended', 'deleted')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS auth_identities (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider         TEXT NOT NULL,          -- 'local' | 'google' | 'github'
    provider_subject TEXT,                   -- OAuth subject or NULL for local
    password_hash    TEXT,                   -- bcrypt hash for local accounts
    verified_at      TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (provider, provider_subject)
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    ip_address TEXT,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- Workspaces and portfolios
  CREATE TABLE IF NOT EXISTS workspaces (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name          TEXT NOT NULL,
    plan          TEXT NOT NULL DEFAULT 'free',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS portfolios (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id       UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    slug               TEXT UNIQUE NOT NULL,
    title              TEXT NOT NULL,
    template_id        TEXT NOT NULL DEFAULT 'minimal_professional',
    status             TEXT NOT NULL DEFAULT 'draft'
                       CHECK (status IN ('draft', 'published', 'archived')),
    visibility         TEXT NOT NULL DEFAULT 'draft'
                       CHECK (visibility IN ('draft', 'unlisted', 'public')),
    active_revision_id UUID,
    seo_title          TEXT,
    seo_description    TEXT,
    published_at       TIMESTAMPTZ,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_portfolios_workspace ON portfolios(workspace_id);
  CREATE INDEX IF NOT EXISTS idx_portfolios_slug      ON portfolios(slug);

  -- Projects
  CREATE TABLE IF NOT EXISTS projects (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id      UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    title             TEXT NOT NULL,
    role              TEXT,
    start_date        TEXT,
    end_date          TEXT,
    summary           TEXT,
    confidentiality   TEXT NOT NULL DEFAULT 'public'
                      CHECK (confidentiality IN ('public', 'redact', 'private')),
    status            TEXT NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft', 'complete')),
    sort_order        INTEGER NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- Assets
  CREATE TABLE IF NOT EXISTS assets (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    file_name     TEXT NOT NULL,
    media_type    TEXT NOT NULL,
    mime_type     TEXT NOT NULL,
    byte_size     BIGINT NOT NULL,
    storage_key   TEXT NOT NULL UNIQUE,
    scan_status   TEXT NOT NULL DEFAULT 'pending'
                  CHECK (scan_status IN ('pending', 'clean', 'flagged', 'failed')),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- Audit events
  CREATE TABLE IF NOT EXISTS audit_events (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    action      TEXT NOT NULL,
    target_type TEXT,
    target_id   UUID,
    ip_hash     TEXT,
    metadata    JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_audit_user   ON audit_events(user_id);
  CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_events(action);
`;

/**
 * Bootstrap the database schema (dev/test only).
 * Runs the CREATE TABLE IF NOT EXISTS statements above.
 *
 * @returns {Promise<void>}
 */
async function bootstrapSchema() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('[DB] bootstrapSchema() must not be called in production. Use migrations instead.');
  }
  await query(BOOTSTRAP_SQL);
  console.log('[DB] Schema bootstrapped ✓');
}

// ─── Exports ──────────────────────────────────────────────────
module.exports = {
  pool,
  query,
  getClient,
  transaction,
  testConnection,
  closePool,
  bootstrapSchema,
};
