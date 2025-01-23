const userModel = require('../models/userModel');

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
    res.status(201).json({ message: "Registration successful", result });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// User login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const result = await userModel.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error logging in:', error.message);
    if (error.message === "Invalid email or password") {
      res.status(401).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
