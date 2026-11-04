import { createDatabasePool, closeDatabasePool } from '../server/db.mjs';

const command = process.argv[2] || 'summary';
const pool = createDatabasePool({ max: 2 });

try {
  if (command === 'summary') {
    const result = await pool.query(
      `SELECT status, count(*)::integer AS count
       FROM enquiries
       WHERE deleted_at IS NULL
       GROUP BY status
       ORDER BY status`
    );
    console.table(result.rows);
  } else if (command === 'unresolved') {
    const result = await pool.query(
      `SELECT e.id AS correlation_id, e.status, e.created_at, j.state AS delivery_state,
        j.attempt_count, j.next_attempt_at, j.last_error_class
       FROM enquiries e
       JOIN delivery_jobs j ON j.enquiry_id = e.id
       WHERE e.deleted_at IS NULL
         AND e.status IN ('delivery_pending', 'delivery_uncertain', 'delivery_failed')
       ORDER BY e.created_at
       LIMIT 200`
    );
    console.table(result.rows);
  } else {
    throw new Error('Usage: npm run enquiry:ops -- [summary|unresolved]');
  }
} finally {
  await closeDatabasePool(pool);
}
