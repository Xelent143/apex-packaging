import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), 'migrations');
const MIGRATION_LOCK_ID = 8_074_291;

export async function runMigrations(pool, options = {}) {
  const directory = options.directory || migrationsDir;
  const client = await pool.connect();
  try {
    await client.query('SELECT pg_advisory_lock($1)', [MIGRATION_LOCK_ID]);
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    const files = (await readdir(directory))
      .filter((name) => /^\d+.*\.sql$/.test(name))
      .sort();

    for (const name of files) {
      const existing = await client.query('SELECT 1 FROM schema_migrations WHERE name = $1', [name]);
      if (existing.rowCount) continue;

      const sql = await readFile(join(directory, name), 'utf8');
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [name]);
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }
  } finally {
    await client.query('SELECT pg_advisory_unlock($1)', [MIGRATION_LOCK_ID]).catch(() => {});
    client.release();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { createDatabasePool, closeDatabasePool } = await import('./db.mjs');
  const pool = createDatabasePool();
  try {
    await runMigrations(pool);
    console.log('Enquiry database migrations complete.');
  } finally {
    await closeDatabasePool(pool);
  }
}
