import { Pool } from 'pg';

// Create a new Pool instance with connection details
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT ?? '5432'),
  database: process.env.POSTGRES_DB,
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
    const res = pool.query(text, params);
    console.log('Executed query', text);
    return res;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
};

// Export the pool for direct use
export default pool;
