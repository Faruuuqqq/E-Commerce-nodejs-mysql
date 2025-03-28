const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateUser = require("../middleware/authenticateUser");

// view routes
router.get("/register", (req, res) => res.render("auth/register"));
router.get("/login", (req, res) => res.render("auth/login"));
router.get("/changepassword", (req, res) => res.render("auth/changepassword"));

// authentication routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.post("/changepassword", userController.changePassword);

// user profile
router.get("/profile", authenticateUser, userController.getUserProfile);
router.put("/profile", authenticateUser, userController.updateUserProfile);

module.exports = router;