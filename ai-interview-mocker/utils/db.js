const { neon } = require("@neondatabase/serverless");
const { drizzle } = require("drizzle-orm/singlestore/driver");
import { schema } from "./schema.js";
const sql = neon(process.env.NEON_DATABASE_URL);
export const db = drizzle(sql, {schema})