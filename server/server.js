require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { pool, initializeDatabase } = require("./db");
const { createHistoryStore } = require("./historyStore");

const app = express();
const PORT = process.env.PORT || 5000;

// In-memory fallback for when MySQL is unavailable
const historyStore = createHistoryStore();

// Track whether DB is online
let dbOnline = false;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST"],
}));
app.use(express.json());

// ─── DB helpers ───────────────────────────────────────────────────────────────
const saveHistoryToDatabase = async (entry) => {
  if (!dbOnline) return null;
  try {
    const query = `
      INSERT INTO search_history (username, avatar_url, rating, rating_reason)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      entry.username,
      entry.avatar_url,
      entry.rating,
      entry.rating_reason,
    ]);
    return result.insertId;
  } catch (error) {
    console.warn("DB write failed, falling back to in-memory:", error.message);
    dbOnline = false;
    return null;
  }
};

const readHistoryFromDatabase = async () => {
  if (!dbOnline) return [];
  try {
    const query = `
      SELECT id, username, avatar_url, rating, rating_reason, searched_at
      FROM search_history
      ORDER BY searched_at DESC
      LIMIT 10
    `;
    const [rows] = await pool.query(query);
    return rows;
  } catch (error) {
    console.warn("DB read failed, falling back to in-memory:", error.message);
    dbOnline = false;
    return [];
  }
};

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check — shows DB status
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    db: dbOnline ? "connected" : "offline (using in-memory fallback)",
    uptime: Math.floor(process.uptime()),
  });
});

// Save a search
app.post("/api/history", async (req, res) => {
  const { username, avatar_url, rating, rating_reason } = req.body;

  if (!username || typeof username !== "string" || !username.trim()) {
    return res.status(400).json({ error: "username is required and must be a non-empty string." });
  }

  try {
    // Always save to in-memory store first (instant + reliable)
    const entry = historyStore.addSearch({
      username: username.trim(),
      avatar_url: avatar_url || null,
      rating: rating ?? null,
      rating_reason: rating_reason || null,
    });

    // Persist to DB in the background — don't block the response
    saveHistoryToDatabase(entry).catch(() => {});

    return res.status(201).json({ success: true, id: entry.id });
  } catch (error) {
    console.error("Error saving search history:", error);
    return res.status(500).json({ error: "Failed to save search." });
  }
});

// Get recent searches
app.get("/api/history", async (req, res) => {
  try {
    const dbHistory = await readHistoryFromDatabase();
    // If DB is offline, fall back to in-memory
    const history = dbHistory.length > 0 ? dbHistory : historyStore.getRecentSearches();
    return res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching search history:", error);
    // Ultimate fallback — never crash the server
    return res.status(200).json(historyStore.getRecentSearches());
  }
});

// 404 catch-all
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// ─── Boot ─────────────────────────────────────────────────────────────────────
const start = async () => {
  // Try to connect to MySQL — if it fails, run in in-memory mode
  try {
    await initializeDatabase();
    dbOnline = true;
    console.log("✅ MySQL connected — using persistent storage.");
  } catch (err) {
    console.warn("⚠️  MySQL unavailable — running in in-memory fallback mode.");
    console.warn("   Reason:", err.message);
    console.warn("   To enable MySQL: start the MySQL service and restart the server.");
    dbOnline = false;
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 DB status: ${dbOnline ? "MySQL (persistent)" : "In-memory (volatile)"}`);
  });
};

start();
