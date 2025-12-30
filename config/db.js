// backend/config/db.js
import pkg from "pg";
const { Pool } = pkg;

const isProduction = !!process.env.DATABASE_URL;

export const pool = new Pool(
  isProduction
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // REQUIRED for Supabase
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD || process.env.DB_PASS,
        port: process.env.DB_PORT,
      }
);

// Optional: log once to confirm
pool.on("connect", () => {
  console.log(
    isProduction
      ? "✅ Connected to Supabase (Production DB)"
      : "✅ Connected to Local PostgreSQL"
  );
});
