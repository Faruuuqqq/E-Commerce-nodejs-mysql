const express = require('express');
const router = express.Router();
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken');

// middleware to get user from JWT token
const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
      return res.status(401).json({ error: "Authentication error: No token provided" });
  }

  try {
      const decoded = jwt.verify(token, "secret-key");
      req.user = decoded;
      next();
  } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
  }
};


router.get("/home", authenticateUser, async (req, res) => {
  try {
    // const products = await productModel.getAllProducts();
    res.render("home", { user: req.user });
  } catch (error) {
    console.error("Error rendering homepage:", error);
    res.status(500).send("internal server error");
  }
})

module.exports = router;