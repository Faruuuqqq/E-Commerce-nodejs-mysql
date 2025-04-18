const pool = require('../database/connection');
const bcrypt = require('bcryptjs');
require("dotenv").config();

// Register Function
exports.register = async (email, password, isAdmin, fname, lname) => {
  try {
    // Check if the user already exists
    const userExists = await checkUserExist(email);
    if (userExists) {
      throw new Error('User already exists');
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert the new user into the database
    const result = await insertUser(email, hashedPassword, isAdmin, fname, lname);
    return result;
  } catch (error) {
    throw error;
  }
};

const checkUserExist = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows.length > 0;
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const insertUser = async (email, password, isAdmin, fname, lname) => {
  const [result] = await pool.query(
    'INSERT INTO users (email, password, isAdmin, fname, lname) VALUES (?, ?, ?, ?, ?)',
    [email, password, isAdmin, fname, lname]
  );
  return result;
};

// Login Function
exports.login = async (email, password) => {
  try {
    // Fetch user data from the database
    const user = await getUserByEmail(email);
    if (!user) throw new Error('Invalid email or password');

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid email or password');

    return {
      userId: user.userId,
      isAdmin: user.isAdmin,
      message: 'Login successful',
    };
  } catch (error) {
    throw error;
  }
};

const getUserByEmail = async (email) => {
  const [rows] = await pool.query(
    'SELECT userId, password, isAdmin FROM users WHERE email = ?',
    [email]
  );
  return rows[0];
};

const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
}; 

exports.changePassword = async (email, oldPassword, newPassword) => {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await verifyPassword(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Old password is incorrect');
    }

    const hashedPassword = await hashPassword(newPassword);
  
    const result = await pool.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
    return { message: 'Password changed successfully'}
  } catch (error) {
    throw error;
  }
};

exports.getAllUsers = async () => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM users",
    );
    return rows;
  } catch (error) {
    throw new Error("Error fetching all user: " + error.message);
  }
}

exports.getUserById = async (userId) => {
  try {
    const [rows] = await pool.query(
      "SELECT userId, fname, lname, email, createdDate, address FROM users WHERE userId = ?",
      [userId]
    );
    return rows[0];
  } catch (error) {
    throw new Error("Error fetching user by ID: " + error.message);
  }
};

exports.updateUser = async (userId, newData) => {
  try {
    const query = "UPDATE users SET ? WHERE userId = ?";
    const [result] = await pool.query(query, [newData, userId]);
    return result;
  } catch (error) {
    throw new Error("Error updating user: " + error.message);
  }
};

exports.deleteUser = async (userId) => {
  try {
    const query = "DELETE FROM users WHERE userId = ?";
    const [result] = await pool.query(query, [userId]);
    return result;
  } catch (error) {
    throw new Error("Error deleting user:" + error.message);
  }
}