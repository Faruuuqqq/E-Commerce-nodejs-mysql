const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateUser = require("../middleware/authenticateUser");

// Route for user registration
router.post("/register", userController.register);
router.get("/register", (req, res) => res.render('auth/register'))

// Route for user login
router.post("/login", userController.login);
router.get("/login", (req, res) => res.render('auth/login'))

// route for change user password
router.post("/changepassword", userController.changePassword);
router.get("/changepassword", (req, res) => res.render('auth/changepassword'))

// route for user logout
router.get("/logout", userController.logout);

// route for user profile
router.get("/profile", authenticateUser, userController.getUserProfile);
router.put("/profile", authenticateUser, userController.updateUserProfile);

module.exports = router;
