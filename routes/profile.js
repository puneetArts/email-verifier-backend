//backend/routes/profile.js
import express from "express";
import { pool } from "../config/db.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET user profile
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, email, name, role FROM users WHERE id = $1",
      [req.user.id]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

/**
 * UPDATE user profile
 */
router.put("/", requireAuth, async (req, res) =>{
  const { name } = req.body;

  try {
    await pool.query(
      "UPDATE users SET name = $1 WHERE id = $2",
      [name, req.user.id]
    );

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

export default router;
