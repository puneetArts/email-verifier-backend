// backend/routes/emailRoutes.js
import express from "express";
import { verifyEmail, fetchWeeklyGoodEmails } from "../controllers/emailController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// 🌍 PUBLIC (JWT optional)
router.post("/verify", verifyEmail);

// 🔒 ADMIN ONLY
router.get(
  "/weekly-good",
  requireAuth,
  requireAdmin,
  fetchWeeklyGoodEmails
);

export default router;
