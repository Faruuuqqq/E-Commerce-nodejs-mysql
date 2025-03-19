const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");
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

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const { userId, address, isAdmin } = req.user;
    const user = await userModel.getUserById(userId); // Ambil data user
    const orders = await orderModel.getPastOrdersByCustomerID(userId); // Ambil riwayat pesanan
      // console.log("address", address)
    res.render("profile", { 
      user,
      orders,
      isAdmin,
      address
    });
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ error: "Failed to fetch user profile." });
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fname, lname, email, address } = req.body;

    if (!fname || !lname || !email ) {
      return res.status(400).json({ error: "First name, last name, and email are required." });
    }

    const result = await userModel.updateUser(userId, { fname, lname, email, address });
    res.status(200).json({ message: "Profile updated successfully.", result });
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    res.status(500).json({ error: "Failed to update user profile." });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await userModel.deleteUser(userId);

    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", result });

  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Failed to delete user" });
  }
}