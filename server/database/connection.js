const mysql = require("mysql2/promise");
require('dotenv').config();

let connectionParams;

// Use flag to toggle between localhost and server configurations

        connectionParams = {
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
        
        // Create sessions table if it doesn't exist
        await connection.query(`
            CREATE TABLE IF NOT EXISTS sessions (
                session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL,
                expires INT(11) UNSIGNED NOT NULL,
                data MEDIUMTEXT COLLATE utf8mb4_bin,
                PRIMARY KEY (session_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
        `);
        console.log("Sessions table checked/created");
        
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