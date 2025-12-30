// // backend/config/db.js
// import pkg from "pg";
// const { Pool } = pkg;

// if (!process.env.DATABASE_URL && process.env.NODE_ENV === "production") {
//   console.error("❌ DATABASE_URL is missing in production");
// }

// export const pool = new Pool(
//   process.env.DATABASE_URL
//     ? {
//         connectionString: process.env.DATABASE_URL,
//         ssl: { rejectUnauthorized: false },
//       }
//     : {
//         user: process.env.DB_USER,
//         host: process.env.DB_HOST,
//         database: process.env.DB_NAME,
//         password: process.env.DB_PASSWORD || process.env.DB_PASS,
//         port: process.env.DB_PORT,
//       }
// );

// pool.on("connect", () => {
//   console.log(
//     process.env.DATABASE_URL
//       ? "✅ Connected to Supabase (Production DB)"
//       : "✅ Connected to Local PostgreSQL"
//   );
// });
import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.connect()
  .then(() => console.log("✅ Connected to Supabase DB"))
  .catch(err => console.error("❌ DB connection error:", err));
