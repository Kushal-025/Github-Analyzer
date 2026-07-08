require("dotenv").config();
const mysql = require("mysql2/promise");

// Pool configured WITH the database name so no USE statement is needed per-query
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "github_analyzer",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Reconnect automatically if the connection drops
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

const initializeDatabase = async () => {
  // Use a separate one-shot connection (without the DB name) to create it if missing
  const bootstrapPool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    waitForConnections: true,
    connectionLimit: 1,
  });

  try {
    // 1. Create the database if it doesn't exist
    await bootstrapPool.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || "github_analyzer"}\``
    );
    console.log(`Database '${process.env.DB_NAME || "github_analyzer"}' checked/created.`);

    // 2. Create the table inside the main pool (which is scoped to the DB)
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS search_history (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        username    VARCHAR(255) NOT NULL,
        avatar_url  VARCHAR(500),
        rating      DECIMAL(3,1),
        rating_reason TEXT,
        searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_searched_at (searched_at DESC)
      )
    `;
    await pool.query(createTableQuery);
    console.log("Table 'search_history' checked/created.");
  } finally {
    // Always close the bootstrap pool
    await bootstrapPool.end().catch(() => {});
  }
};

module.exports = { pool, initializeDatabase };
