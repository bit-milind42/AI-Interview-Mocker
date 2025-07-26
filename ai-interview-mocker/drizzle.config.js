/** @type {import('drizzle-kit').Config} */

export default{
    schema: "./utils/schema.js",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL,
    },
}