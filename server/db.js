require("dotenv").config();
const mysql = require("mysql2/promise");

// Create a connection pool instead of a single connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  // We don't specify database here initially so we can create it if it doesn't exist
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const initializeDatabase = async () => {
  try {
    // 1. Create database if not exists
    await pool.query(`CREATE DATABASE IF NOT EXISTS github_analyzer`);
    console.log("Database 'github_analyzer' checked/created successfully.");

    // 2. Switch to the database
    await pool.query(`USE github_analyzer`);

    // 3. Create the table for search history
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS search_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(500),
        rating DECIMAL(3,1),
        rating_reason TEXT,
        searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createTableQuery);
    console.log("Table 'search_history' checked/created successfully.");
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    console.error("Did you make sure MySQL is running and accessible with user 'root' and no password?");
    // Don't exit process, just let it log.
  }
};

module.exports = {
  pool,
  initializeDatabase,
};
