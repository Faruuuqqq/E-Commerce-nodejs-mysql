const pool = require('../database/connection');
const bcrypt = require('bcryptjs');
// const { generateAccessAndRefreshToken, refreshToken } = require('../utils/token');

exports.register = async (email, password, isAdmin, fname, lname) => {
  try {
    const userExists = await checkUserExist(email);
    if (userExists) {
      throw new Error('User already exist');
    }

    const hashedPassword = await hashPassword(password);

    const result = await insertUser(email, password, isAdmin, fname, lname);
      return result;
  } catch (error) {
    throw error;
  }
};

const checkUserExist = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows.length > 0;
}

const hashPassword = async (email, password, isAdmin, fname, lname) => {
  return await bcrypt.hash(password, 10);
}

const insertUser = async (email, password, isAdmin, fname, lname) => {
  const [result] = await pool.query(
    'INSERT INTO users (email, password, isAdmin, fname, lname) VALUES (?, ?, ?, ?, ?)',
    [email, password, isAdmin, fname, lname]
  );
  return result;
};

exports.login = async (email, password) => {
  try {
    // Fetch user data from the database
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // verify the password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // generate tokens
    const userData = {
      userId: user.userId,
      isAdmin: user.isAdmin,
    };

    // prepare the response
    return {
      ...userData,
      token,
      refreshToken,
    };
  } catch (error) {
    throw error;
  }
}

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