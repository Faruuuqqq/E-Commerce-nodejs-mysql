const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticatedUser = require("../middleware/authenticateUser");

// Route to get all products
router.get("/", authenticatedUser, productController.getAllProducts);

// Route to get product details by ID
router.get("/:id", authenticatedUser, productController.getProductDetailsById);

// Route to create a new product
router.post("/create", authenticatedUser, productController.createProduct);

// Route to update an existing product
router.post("/update", authenticatedUser, productController.updateProduct);

// Route to delete a product by ID
router.delete("/delete/:id", authenticatedUser, productController.deleteProduct);

// Route to get all orders product details by ID
router.get("/allOrderByProductId/:id", authenticatedUser, productController.allOrderByProductId);

module.exports = router;