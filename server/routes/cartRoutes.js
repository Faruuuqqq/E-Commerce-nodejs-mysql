const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authenticateUser = require("../middleware/authenticateUser");

// Route to get the shopping cart
router.get("/", authenticateUser, cartController.getShoppingCart);

// Route to add a product to the shopping cart
router.post("/add/:productId", authenticateUser, cartController.addToCart);

// Route to remove a product from the shopping cart
router.delete("/remove/:productId/", authenticateUser, cartController.removeFromCart);

// Route to purchase some product
router.post("/buy", authenticateUser, cartController.buy);

// Route to update the quantity of a product in the shopping cart
router.put("/update/:productId", authenticateUser, cartController.updateCartQuantity);

module.exports = router;