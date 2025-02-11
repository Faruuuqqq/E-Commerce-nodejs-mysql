const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const tokenController = require("../controllers/tokenController");

// Route for user registration
router.post("/register", userController.register);
router.get("/register", (req, res) => {
  res.render('auth/register')
} )

// Route for user login
router.post("/login", userController.login);
router.get("/login", (req, res) => {
  res.render('auth/login');
})

// route for change user password
router.post("/changepassword", userController.changePassword);
router.get("/changepassword", (req, res) => {
  res.render('auth/changepassword');
})

module.exports = router;
