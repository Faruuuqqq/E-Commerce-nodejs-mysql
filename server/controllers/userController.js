const userModel = require('../models/userModel');
const jwt = require("jsonwebtoken");

// User registration
exports.register = async (req, res) => {
  const { email, password, isAdmin, fname, lname } = req.body;

// Validate input
  if (!email || !password || !fname || !lname) {
    return res.status(400).json({ error: "Email, password, first name, and last name are required" });
  }
  try {
    const result = await userModel.register(email, password, isAdmin, fname, lname);
    console.log('User registered successfully');
    // res.status(201).json({ message: "Registration successful", result });
    res.redirect('/users/login')
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// User login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Ambil data user dari userModel
    const result = await userModel.login(email, password);
    
    if (!result) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Buat token JWT
    const token = jwt.sign(
      { userId: result.userId, isAdmin: result.isAdmin },
      "secret-key",
      { expiresIn: "1h" }
    );

    // Simpan token di cookies
    res.cookie("token", token, { httpOnly: true, secure: false });

    // Redirect ke home setelah login sukses
    res.redirect("/home");
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
      const result = await userModel.changePassword(email, oldPassword, newPassword);

      console.log("Password changed successfully");
      // res.status(200).json({ message: "Password changed successfully" });
      res.redirect("/users/login");
    } catch (error) {
      console.error("Error changing password:", error.message);
      res.status(400).json({ error: error.message });
  }
};

// exports.logout = (req, res) => {
//   req.session.destroy(() => {
//     res.redirect('/users/login');
//   })
// }