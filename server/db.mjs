import pg from 'pg';

const { Pool } = pg;

export function createDatabasePool(options = {}) {
  const connectionString = options.connectionString || process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is required for durable enquiry storage.');

  return new Pool({
    connectionString,
    max: Number(options.max || process.env.DATABASE_POOL_MAX || 5),
    idleTimeoutMillis: Number(options.idleTimeoutMillis || 30_000),
    connectionTimeoutMillis: Number(options.connectionTimeoutMillis || 5_000),
    ssl: options.ssl
  });
}

export async function closeDatabasePool(pool) {
  await pool?.end?.();
}

export async function verifyEnquirySchema(pool) {
  const result = await pool.query(
    `SELECT
      to_regclass('public.enquiries') AS enquiries,
      to_regclass('public.delivery_jobs') AS delivery_jobs,
      to_regclass('public.delivery_attempts') AS delivery_attempts,
      EXISTS (
        SELECT 1 FROM schema_migrations WHERE name = '002_runtime_roles.sql'
      ) AS current_migration`
  );
  const state = result.rows[0] || {};
  if (!state.enquiries || !state.delivery_jobs || !state.delivery_attempts || !state.current_migration) {
    throw new Error('Enquiry database schema is not ready. Run npm run db:migrate with the migration role.');
  }
}
