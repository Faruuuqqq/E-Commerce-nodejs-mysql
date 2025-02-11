const express = require('express');
const router = express.Router();
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken');

// middleware to get user from JWT token
const authenticateUser = async (req, res, next) => {
  try {
      const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // check token, on cookies or headeer
      if (!token) {
          return res.redirect("/users/login");
      }

      const decoded = jwt.verify(token, "secret-key");
      const user = await userModel.getUserById(decoded.userId);
      if (!user) {
          return res.redirect("/users/login");
      }

      req.user = user;
      next();
  } catch (error) {
      console.error("Authentication error:", error);
      return res.redirect("/users/login");
  }
};

router.get("/home", authenticateUser, async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.sender("home", { user: req.user, products });
  } catch (error) {
    console.error("Error rendering homepage:", error);
    res.status(500).send("internal server error");
  }
})

module.exports = router;