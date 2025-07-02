/** @type {import('drizzle-kit').Config} */

export default{
    schema: "./utils/schema.js",
    dialect: "postgresql",
    dbCredentials: {
        url:'postgresql://neondb_owner:npg_7MkfliECpI0L@ep-broad-sky-a8h77oz9-pooler.eastus2.azure.neon.tech/Ai-interview-Mocker?sslmode=require&channel_binding=require',
        
    },
}