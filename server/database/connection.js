const mysql = require("mysql2/promise");
require('dotenv').config();

let connectionParams;

// Use flag to toggle between localhost and server configurations
const useLocalhost = process.env.USE_LOCALHOST === 'true';

if (useLocalhost) {
    console.log("Using local database configuration...");
    connectionParams = {
        user: "root",
        host: "localhost",
        password: "",
        database: "marketplace",
        port: 3306
    };
} else {
    console.log("Using server database configuration...");
    // Use Railway's DATABASE_URL if available, otherwise use individual parameters
    if (process.env.DATABASE_URL) {
        const url = new URL(process.env.DATABASE_URL);
        connectionParams = {
            user: url.username,
            host: url.hostname,
            password: url.password,
            database: url.pathname.slice(1),
            port: url.port,
        };
    } else {
        connectionParams = {
            user: process.env.DB_SERVER_USER,
            host: process.env.DB_SERVER_HOST,
            password: process.env.DB_SERVER_PASSWORD,
            database: process.env.DB_SERVER_DATABASE,
            port: process.env.DB_SERVER_PORT || 3306,
        };
    }
}

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
    } catch (err) {
        console.error("DB Connection Error:", err.message);
        // Log more details about the connection parameters (without sensitive info)
        console.log("Connection Parameters:", {
            host: connectionParams.host,
            user: connectionParams.user,
            database: connectionParams.database,
            port: connectionParams.port
        });
    }
})();

module.exports = pool;