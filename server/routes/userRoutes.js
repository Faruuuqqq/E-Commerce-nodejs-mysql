const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const tokenController = require("../controllers/tokenController");
const authenticateUser = require("../middleware/authenticateUser");

// Route for user registration
router.post("/register", userController.register);
router.get("/register", (req, res) => {
  res.render('auth/register')
} )

// Route for user login
router.post("/login", authenticateUser, userController.login);
router.get("/login", (req, res) => {
  res.render('auth/login');
})

// route for change user password
router.post("/changepassword", userController.changePassword);
router.get("/changepassword", (req, res) => {
  res.render('auth/changepassword');
})

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
  res.render('auth/login');
})

module.exports = router;
