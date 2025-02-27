const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authenticateUser = require("../middleware/authenticateUser");

// Route to get all orders
router.get("/", authenticateUser, orderController.getUserOrders);

// Route to get order details by ID
router.get("/:id", orderController.getOrderById);

// Route to get getProductsByOrder
router.get("/getProductsByOrder/:id", orderController.getProductsByOrder);

// Route to update an existing order
router.put("/update/:id", orderController.updateOrder);

// Route to get past orders by customerId
router.get("/myPastOrders/:id", orderController.getPastOrdersByCustomerID);

module.exports = router;
