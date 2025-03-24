const express = require("express");
const router = express.Router();
const productModel = require("../models/productModel");
const authenticateUser = require("../middleware/authenticateUser");
const userModel = require("../models/userModel");

router.get("/", authenticateUser, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    
    const { products, pagination } = await productModel.getAllProducts(page, limit);
    res.render("home", { 
      user: req.user, 
      isAdmin: req.user.isAdmin,
      products,
      pagination
    });
  } catch (error) {
    console.error("Error rendering homepage:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
