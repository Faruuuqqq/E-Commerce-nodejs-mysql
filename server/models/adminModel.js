const pool = require("../database/connection");

// Menghitung jumlah produk
exports.countProducts = async () => {
    try {
        const [rows] = await pool.query("SELECT COUNT(*) AS total FROM product");
        return rows[0].total;
    } catch (error) {
        throw new Error("Error counting products: " + error.message);
    }
};

// Menghitung jumlah user
exports.countUsers = async () => {
    try {
        const [rows] = await pool.query("SELECT COUNT(*) AS total FROM users");
        return rows[0].total;
    } catch (error) {
        throw new Error("Error counting users: " + error.message);
    }
};

// Menghitung jumlah orders
exports.countOrders = async () => {
    try {
        const [rows] = await pool.query("SELECT COUNT(*) AS total FROM orders");
        return rows[0].total;
    } catch (error) {
        throw new Error("Error counting orders: " + error.message);
    }
};

// Menghitung jumlah admin
exports.countAdmins = async () => {
    try {
        const [rows] = await pool.query("SELECT COUNT(*) AS total FROM users WHERE isAdmin = 1");
        return rows[0].total;
    } catch (error) {
        throw new Error("Error counting admins: " + error.message);
    }
};
