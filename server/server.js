require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { pool, initializeDatabase } = require("./db");
const { createHistoryStore } = require("./historyStore");

const app = express();
const PORT = process.env.PORT || 5000;
const historyStore = createHistoryStore();

// Middleware
app.use(cors());
app.use(express.json());

const saveHistoryToDatabase = async (entry) => {
  try {
    await pool.query("USE github_analyzer");
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
    console.warn("Database unavailable, using in-memory history fallback:", error.message);
    return null;
  }
};

const readHistoryFromDatabase = async () => {
  try {
    await pool.query("USE github_analyzer");
    const query = `
      SELECT id, username, avatar_url, rating, rating_reason, searched_at
      FROM search_history
      ORDER BY searched_at DESC
      LIMIT 10
    `;
    const [rows] = await pool.query(query);
    return rows;
  } catch (error) {
    console.warn("Database unavailable, using in-memory history fallback:", error.message);
    return [];
  }
};

// Routes
app.post("/api/history", async (req, res) => {
  const { username, avatar_url, rating, rating_reason } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const entry = historyStore.addSearch({
      username,
      avatar_url,
      rating,
      rating_reason,
    });

    await saveHistoryToDatabase(entry);

    res.status(201).json({ success: true, id: entry.id });
  } catch (error) {
    console.error("Error saving search history:", error);
    res.status(500).json({ error: "Database error while saving search." });
  }
});

app.get("/api/history", async (req, res) => {
  try {
    const dbHistory = await readHistoryFromDatabase();
    const fallbackHistory = historyStore.getRecentSearches();
    const history = dbHistory.length > 0 ? dbHistory : fallbackHistory;

    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching search history:", error);
    res.status(500).json({ error: "Database error while fetching history." });
  }
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
