
/**
 * Drizzle Kit Configuration
 * 
 * This file configures Drizzle Kit, the CLI tool for managing database migrations
 * and schema generation. It defines how Drizzle should connect to the database
 * and where to store migration files.
 * 
 * Key Configuration Points:
 * - Database: PostgreSQL via Neon serverless
 * - Schema Location: ./shared/schema.ts
 * - Migrations Output: ./migrations directory
 * - Connection: Uses DATABASE_URL environment variable
 * 
 * Usage:
 * - Generate migrations: npm run db:generate
 * - Push schema changes: npm run db:push
 * - Run migrations: npm run db:migrate
 */

import { defineConfig } from "drizzle-kit";

/**
 * Environment Variable Validation
 * 
 * Ensures DATABASE_URL is set before proceeding with database operations.
 * This URL should point to a PostgreSQL database (Neon serverless in production).
 * 
 * Example DATABASE_URL format:
 * postgresql://user:password@host:5432/database?sslmode=require
 */
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

/**
 * Drizzle Kit Configuration Export
 * 
 * Configuration object that defines:
 * 
 * @property {string} out - Directory where migration SQL files will be generated
 *   - Migrations are timestamped and contain both up and down SQL
 *   - Used by db:migrate to apply schema changes
 * 
 * @property {string} schema - Path to the TypeScript file containing table definitions
 *   - Drizzle reads this to understand your database structure
 *   - Changes here trigger new migrations when running db:generate
 * 
 * @property {string} dialect - Database type (postgresql, mysql, sqlite)
 *   - Determines SQL dialect and features available
 *   - Set to "postgresql" for Neon and other PostgreSQL databases
 * 
 * @property {object} dbCredentials - Database connection configuration
 *   - url: Full PostgreSQL connection string from environment
 *   - Used by introspection and migration commands
 */
export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
