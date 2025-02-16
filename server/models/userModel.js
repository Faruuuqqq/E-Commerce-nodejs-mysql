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
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify the password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens (mock example; replace with your logic)
    const userData = {
      userId: user.userId,
      isAdmin: user.isAdmin,
    };

    const token = process.env.JWT_SECRET_KEY_ACCESS_TOKEN; // Replace with real token generation
    // const refreshToken = 'mock_refresh_token'; // Replace with real token generation

    // Return the response
    return {
      ...userData,
      token,
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

exports.getUserById = async(userId) => {
  try {
    const [rows] = await pool.query(
      'SELECT userId, email, isAdmin, fname, lname, FROM users WHERE userId = ?',
      [userId]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
}