//backend/models/User.js
import { pool } from "../config/db.js";

export const findUserByEmail = async (email) => {
  const res = await pool.query(
    "SELECT id, email, password_hash, role, created_at FROM users WHERE email = $1",
    [email]
  );
  return res.rows[0];
};

export const createUser = async (email, passwordHash, role) => {
  const res = await pool.query(
    `INSERT INTO users (email, password_hash, role)
     VALUES ($1, $2, $3)
     RETURNING id, email, role, created_at`,
    [email, passwordHash, role]
  );
  return res.rows[0];
};

