const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authenticateUser = require("../middleware/authenticateUser");

// Route to add a product to the shopping cart
router.post("/add/:productId", authenticateUser, cartController.addToCart);

// Route to remove a product from the shopping cart
router.delete("/remove/:productId/", authenticateUser, cartController.removeFromCart);

// Route to purchase some product
router.post("/buy", authenticateUser, cartController.buy);

// Route to render cart page
router.get("/", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const cartItems = await cartController.getShoppingCartEJS(userId);
    res.render("cart", { cartItems, user: req.user });
  } catch (error) {
    return res.status(500).send("Error loading shopping cart");
  }
});

module.exports = router;