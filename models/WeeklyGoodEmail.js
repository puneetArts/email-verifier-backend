//backend/modles/WeeklyGoodEmails.js
import { pool } from "../config/db.js";

// Save multiple good emails for a week
export const saveWeeklyGoodEmails = async (emails) => {
  if (!emails || emails.length === 0) return;

  // Get Monday of this week
  const now = new Date();
  const day = now.getDay(); // 0 (Sun) - 6 (Sat)
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const weekStart = new Date(now.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);

  const query = `
    INSERT INTO weekly_good_emails (email, week_start)
    VALUES ${emails.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(", ")}
    ON CONFLICT (email, week_start) DO NOTHING
  `;
  const values = emails.flatMap((email) => [email, weekStart]);
  await pool.query(query, values);
};

// Fetch all weekly good emails
export const getWeeklyGoodEmails = async () => {
  const res = await pool.query(`
    SELECT email, week_start
    FROM weekly_good_emails
    ORDER BY week_start DESC, email ASC
  `);
  return res.rows;
};
