const mysql = require("mysql2/promise"); // Use promise-based mysql2
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
        database: "market",
    };
} else {
    console.log("Using server database configuration...");
    connectionParams = {
        user: process.env.DB_SERVER_USER,
        host: process.env.DB_SERVER_HOST,
        password: process.env.DB_SERVER_PASSWORD,
        database: process.env.DB_SERVER_DATABASE,
    };
}

// Create a connection pool
const pool = mysql.createPool({
    ...connectionParams,
    waitForConnections: true,
    connectionLimit: 10, // Adjust based on your needs
    queueLimit: 0,
});


(async () => {
    try {
        const connection = await pool.getConnection();
        console.log("DB Connection Done");
        connection.release(); // Release the connection back to the pool
    } catch (err) {
        console.error("DB Connection Error:", err.message);
    }
})();


module.exports = pool;