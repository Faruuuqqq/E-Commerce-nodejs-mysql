const userModel = require("../models/userModel");
const { generateAccessAndRefreshToken } = require("../utils/token");
const jwt = require("jsonwebtoken");

// User Registration
exports.register = async (req, res) => {
  const { email, password, isAdmin, fname, lname } = req.body;

  if (!email || !password || !fname || !lname) {
    return res.status(400).json({ error: "Email, password, first name, and last name are required" });
  }

  try {
    await userModel.register(email, password, isAdmin, fname, lname);
    console.log("User registered successfully");
    res.redirect("/users/login"); // Redirect ke halaman login setelah registrasi
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await userModel.login(email, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate Access & Refresh Tokens
    const { token, refreshToken } = generateAccessAndRefreshToken({
      userId: user.userId,
      isAdmin: user.isAdmin,
    });

    // // (optional) store token in cookies
    // res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });
    // res.redirect("/home");
    res.status(200).json({ token })
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    await userModel.changePassword(email, oldPassword, newPassword);
    console.log("Password changed successfully");
    res.redirect("/users/login"); // Redirect ke halaman login setelah ganti password
  } catch (error) {
    console.error("Error changing password:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// User Logout
exports.logout = (req, res) => {
  res.clearCookie("refreshToken"); // Hapus refresh token dari cookie
  res.redirect("/users/login"); // Redirect ke halaman login
};
