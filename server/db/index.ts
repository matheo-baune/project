import { Pool } from 'pg';
import { convertKeysToCamelCase } from '../utils/caseConversion';

// Create a new Pool instance with connection details
const pool = new Pool({
  user: process.env.POSTGRES_USER ?? 'admin',
  password: process.env.POSTGRES_PASSWORD ?? 'admin',
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port: parseInt(process.env.POSTGRES_PORT ?? '5432'),
  database: process.env.POSTGRES_DB ?? 'admin',
});

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Helper function to run queries
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, rows: res.rowCount });

    // Convert snake_case keys to camelCase
    if (res.rows && res.rows.length > 0) {
      res.rows = convertKeysToCamelCase(res.rows);
    }

    return res;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
};

// Export the pool for direct use
export default pool;
