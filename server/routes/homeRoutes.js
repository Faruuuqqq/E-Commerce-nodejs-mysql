const express = require("express");
const router = express.Router();
const productModel = require("../models/productModel");
const authenticateUser = require("../middleware/authenticateUser");
const userModel = require("../models/userModel");

router.get("/", authenticateUser, async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.render("home", { user: req.user, products });
  } catch (error) {
    console.error("Error rendering homepage:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
