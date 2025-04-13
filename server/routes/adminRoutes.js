const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const orderController = require("../controllers/orderController");
const userController = require("../controllers/userController");

const authorizeAdmin = require("../middleware/authorizeAdmin");
const authenticateUser = require("../middleware/authenticateUser");
const { upload, handleUploadError, optimizeImage, cleanupOldFiles } = require("../middleware/upload");

// Admin Dashboard
router.get("/", authenticateUser, authorizeAdmin, adminController.getAdminDashboard);

// Admin Product Routes
router.get("/products", authenticateUser, authorizeAdmin, adminController.getProductsPage);
router.get("/products/create", authenticateUser, authorizeAdmin, adminController.getCreateProductPage);
router.post("/products/create", 
    authenticateUser, 
    authorizeAdmin, 
    upload.single("image"),
    handleUploadError,
    optimizeImage,
    cleanupOldFiles,
    adminController.createProduct
);

router.get("/products/update/:productId", authenticateUser, authorizeAdmin, adminController.getUpdateProductPage);
router.put("/products/update/:productId", 
    authenticateUser, 
    authorizeAdmin, 
    upload.single("image"),
    handleUploadError,
    optimizeImage,
    cleanupOldFiles,
    adminController.updateProduct
);

router.delete("/products/delete/:productId", authenticateUser, authorizeAdmin, adminController.deleteProduct);
router.get("/products/:productId/orders", authenticateUser, authorizeAdmin, adminController.getProductOrders);

// Admin Order Routes
router.get("/orders", authenticateUser, authorizeAdmin, adminController.getOrdersPage);
router.get("/orders/update/:orderId", authenticateUser, authorizeAdmin, adminController.getUpdateOrderPage);
router.put("/orders/update/:orderId", authenticateUser, authorizeAdmin, orderController.updateOrder);
router.delete("/orders/delete/:orderId", authenticateUser, authorizeAdmin, orderController.deleteOrder);

// Admin User Routes
router.get("/users", authenticateUser, authorizeAdmin, adminController.getUsersPage);
router.delete("/users/delete/:userId", authenticateUser, authorizeAdmin, userController.deleteUser);

module.exports = router;