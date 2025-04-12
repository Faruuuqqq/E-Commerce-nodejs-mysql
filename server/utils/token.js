const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config();

const JWT_SECRET_KEY_ACCESS_TOKEN = process.env.JWT_SECRET_KEY_ACCESS_TOKEN || "default_secret_access";
const JWT_SECRET_KEY_REFRESH_TOKEN = process.env.JWT_SECRET_KEY_REFRESH_TOKEN || "default_secret_refresh";
const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";
/**
 * Generate JWT access & refresh token dan simpan di cookies
 */
const generateTokens = (payload, res) => {
  const accessToken = jwt.sign(payload, JWT_SECRET_KEY_ACCESS_TOKEN, { expiresIn: "1d" });
  const refreshToken = jwt.sign(payload, JWT_SECRET_KEY_REFRESH_TOKEN, { expiresIn: "7d" });
  console.log("Secret:", process.env.JWT_SECRET_KEY_ACCESS_TOKEN);
  // Simpan token ke cookies
  if (res) {
    res.cookie("accessToken", accessToken, { httpOnly: true, secure: false, sameSite: "Strict", path: "/" });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false, sameSite: "Strict", path: "/" });
  }

  return { accessToken, refreshToken };
};

/**
 * Verifikasi JWT access token
 */
const verifyAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET_KEY_ACCESS_TOKEN, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
};

/**
 * Generate Access Token Baru dengan Refresh Token
 */
const refreshAccessToken = (refreshToken, res) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, JWT_SECRET_KEY_REFRESH_TOKEN, (err, decoded) => {
      if (err) reject(err);
      else {
        const { userId, isAdmin } = decoded;
        resolve(generateTokens({ userId, isAdmin }, res));
      }
    });
  });
};

module.exports = { generateTokens, verifyAccessToken, refreshAccessToken };
