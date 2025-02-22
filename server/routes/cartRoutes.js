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
    res.render("cart", { cartItems, user: userId });
  } catch (error) {
    return res.status(500).send("Error loading shopping cart");
  }
});

router.put("/update/:productId", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const productId = req.params.productId;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1"});
    }

    const result = await cartController.updateCartQuantity(userId, productId, quantity);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating cart:", error.message);
    res.status(500).json({ error: "Failed to update cart." });
  }
});

module.exports = router;