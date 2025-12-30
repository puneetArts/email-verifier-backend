
// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import emailRoutes from "./routes/emailRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { pool } from "./config/db.js"; // use centralized pool


dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://email-verifier-silk.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());

// Test DB connection on startup
pool.connect()
  .then(() => console.log("✅ PostgreSQL connected successfully"))
  .catch(err => console.error("❌ Database connection failed:", err.message));

app.use("/api/email", emailRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
