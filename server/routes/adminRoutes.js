const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const productController = require("../controllers/productController");
const orderController = require("../controllers/orderController");
const userController = require("../controllers/userController");

const authorizeAdmin = require("../middleware/authorizeAdmin");
const authenticateUser = require("../middleware/authenticateUser");

router.get("/", authenticateUser, authorizeAdmin, adminController.getAdminDashboard);

// ============ route admin for product ============
router.get("/products", authenticateUser, authorizeAdmin, adminController.getProductsPage);

router.put("/products/update/:productId", productController.updateProduct);
router.get("/products/update/:productId", adminController.getUpdateProductPage);

router.delete("/products/delete/:productId", productController.deleteProduct);

router.post("/products/create", productController.createProduct);
router.get("/products/create", adminController.getCreateProductPage);

// ============ route admin for order ============ 
router.get("/orders", authenticateUser, authorizeAdmin, adminController.getOrdersPage);
router.put("/orders/update/:orderId", orderController.updateOrder);
router.get("/orders/update/:orderId", adminController.getUpdateOrderPage);
router.delete("/orders/delete/:orderId", orderController.deleteOrder); 

router.get("/users", authenticateUser, authorizeAdmin, adminController.getUsersPage);
router.delete("/users/delete/:userId", userController.deleteUser);

module.exports = router;