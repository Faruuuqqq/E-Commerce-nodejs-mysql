const mysql = require("mysql2/promise");
require("dotenv").config();

let connectionParams = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
};

console.log("Using individual database parameters");

// Create a connection pool
const pool = mysql.createPool({
  ...connectionParams,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("DB Connection Successful");

    connection.release();
  } catch (error) {
    console.error("DB Connection Failed:", error.message);
    process.exit(1); // Exit app if DB connection fails
  }
})();

module.exports = pool;
