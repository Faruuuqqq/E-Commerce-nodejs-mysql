const userModel = require("../models/userModel");
const { generateTokens } = require("../utils/token");

// User Registration
exports.register = async (req, res) => {
  const { email, password, isAdmin, fname, lname } = req.body;

  if (!email || !password || !fname || !lname) {
    return res.status(400).json({ error: "Email, password, first name, and last name are required" });
  }

  try {
    await userModel.register(email, password, isAdmin, fname, lname);
    console.log("User registered successfully");
    res.redirect("/users/login");
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
    const result = await userModel.login(email, password);
    if (!result) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    console.log("Login berhasil, user:", result);

    // Generate token & langsung simpan di cookies
    generateTokens({ userId: result.userId, isAdmin: result.isAdmin }, res);

    return res.redirect(302,'/');
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
  try {
    res.clearCookie("accesssToken");
    res.clearCookie("refreshToken");
    console.log("Logout successful");
    res.redirect("/users/login");
    // res.json({ message: "Logout successful" });
  } catch (error){
    console.error("Error logging out:", error.message)
    res.status(500).json({ error: "Internal server error" });
  }
};
