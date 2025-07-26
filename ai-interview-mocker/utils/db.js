import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { schema } from "./schema.js";

const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.NEXT_PUBLIC_DRIZZLE_DB_URL;

if (!connectionString) {
  throw new Error('Database connection string is missing. Please set DATABASE_URL, NEON_DATABASE_URL, or NEXT_PUBLIC_DRIZZLE_DB_URL in your environment variables.');
}

const sql = neon(connectionString);
export const db = drizzle(sql, {schema});