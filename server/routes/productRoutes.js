const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticatedUser = require("../middleware/authenticateUser");
const authorizeAdmin = require("../middleware/authorizeAdmin");
const upload = require("../middleware/upload");

// Route to get all products
router.get("/", authenticatedUser, productController.getAllProducts);

// Route to get product details by ID
router.get("/:productId", authenticatedUser, productController.getProductDetailsById);

// Route to create a new product
router.post("/create", authenticatedUser, productController.createProduct);

// Route to update an existing product
router.put("/update/:productId", productController.updateProduct);

// Route to delete a product by ID
router.delete("/delete/:productId", productController.deleteProduct);

// Route to get all orders product details by ID
router.get("/allOrder/:productId", authenticatedUser, productController.allOrderByProductId);

router.post("/add", upload.single("image"), productController.createProduct);

module.exports = router;