const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authorizeAdmin = require("../middleware/authorizeAdmin");
const authenticateUser = require("../middleware/authenticateUser");


router.get("/", authenticateUser, authorizeAdmin, adminController.getAdminDashboard);

router.get("/products", authorizeAdmin, adminController.getProductsPage);

router.get("/orders", authorizeAdmin, adminController.getOrdersPage);

router.get("/users", authorizeAdmin, adminController.getUsersPage);

module.exports = router;