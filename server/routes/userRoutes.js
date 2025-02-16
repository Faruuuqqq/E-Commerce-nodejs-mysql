const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Route for user registration
router.post("/register", userController.register);
router.get("/register", (req, res) => res.render('auth/register'))

// Route for user login
router.post("/login", userController.login);
router.get("/login", (req, res) => res.render('auth/login'))

// route for change user password
router.post("/changepassword", userController.changePassword);
router.get("/changepassword", (req, res) => res.render('auth/changepassword'))

router.get("/logout", userController.logout);

module.exports = router;
