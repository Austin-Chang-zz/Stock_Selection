import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

/**
 * Database configuration and connection setup
 * Uses Neon serverless PostgreSQL database
 */

// Validate that DATABASE_URL environment variable is set
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create Neon database connection
const sql = neon(process.env.DATABASE_URL);

// Initialize Drizzle ORM with the Neon connection
export const db = drizzle(sql);