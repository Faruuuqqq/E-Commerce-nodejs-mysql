const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const productController = require("../controllers/productController");
const authorizeAdmin = require("../middleware/authorizeAdmin");
const authenticateUser = require("../middleware/authenticateUser");

router.get("/", authenticateUser, authorizeAdmin, adminController.getAdminDashboard);

router.get("/products", authenticateUser, authorizeAdmin, adminController.getProductsPage);

router.get("/products/update/:productId", productController.updateProduct);

route.post("/products/delete/:id", productController.deleteProduct);

router.get("/orders", authenticateUser, authorizeAdmin, adminController.getOrdersPage);

router.get("/users", authenticateUser, authorizeAdmin, adminController.getUsersPage);


module.exports = router;