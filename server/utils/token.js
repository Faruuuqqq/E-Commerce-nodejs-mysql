const jwt = require('jsonwebtoken');
const express = require("express");
require('dotenv').config();

class TokenService {
  static JWT_SECRET_KEY_ACCESS_TOKEN = process.env.JWT_SECRET_KEY_ACCESS_TOKEN;
  static JWT_SECRET_KEY_REFRESH_TOKEN = process.env.JWT_SECRET_KEY_REFRESH_TOKEN;

// Generate JWT access & refresh token
  static generateTokens(payload) {
    const accessToken = jwt.sign(payload, this.JWT_SECRET_KEY_ACCESS_TOKEN, { expiresIn: '15m' }); // Access token: 15 minutes
    const refreshToken = jwt.sign(payload, this.JWT_SECRET_KEY_REFRESH_TOKEN, { expiresIn: '7d' }); // Refresh token: 7 days

    return { accessToken, refreshToken };
  };

// Verify JWT token
  static async verifyAccessToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET_KEY_ACCESS_TOKEN, (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded);
        });
    });
  };

// Refresh JWT token
  static async refreshAccessToken(refreshToken) {
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, JWT_SECRET_KEY_REFRESH_TOKEN, (err, decoded) => {
            if (err) reject(err);
            else {
                // Generate new access and refresh tokens
                const { userId, isAdmin } = decoded;
                resolve(this.generateTokens({ userId, isAdmin }));
            }
        });
    });
};
}

module.exports = TokenService;