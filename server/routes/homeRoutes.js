const express = require('express');
const router = express.Router();
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const authenticateUser = require("../middleware/authenticateUser");

router.get("/home", authenticateUser, async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.render("home", { user: req.user, products });
  } catch (error) {
    console.error("Error rendering homepage:", error);
    res.status(500).send("internal server error");
  }
})

module.exports = router;