//backend/controllers/emailController.js
import { validateEmail } from "../utils/validateEmail.js";
import {
  saveWeeklyGoodEmails,
  getWeeklyGoodEmails,
} from "../models/WeeklyGoodEmail.js";

/**
 * Verify a single email
 */
export const verifyEmail = async (req, res) => {
  const { email } = req.body;

  console.log("📩 Incoming verification request:", email);

  const result = await validateEmail(email);

  // ✅ Save good email automatically
  if (result.status === "Good") {
    await saveWeeklyGoodEmails([email]);
  }

  res.json(result);
};

/**
 * Fetch all weekly good emails
 */
export const fetchWeeklyGoodEmails = async (req, res) => {
  try {
    const emails = await getWeeklyGoodEmails();
    res.json({ emails });
  } catch (err) {
    console.error("Error fetching weekly emails:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
