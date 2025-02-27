const cartModel = require("../models/cartModel");

exports.getShoppingCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await cartModel.getShoppingCart(userId);
    if (!result || result.length === 0) {
      return res.status(404).json({ error: "Shopping cart is empty or user not found." });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching shopping cart:", error.message);
    res.status(500).json({ error: "Failed to fetch shopping cart." });
  }
};

exports.addToCart = async (req, res) => {
    try {
        const { quantity, isPresent } = req.body;
        const { productId } = req.params;  // Product ID dari URL
        const userId = req.user.userId;

        console.log("Received request to add to cart:");
        console.log("User ID:", userId);
        console.log("Product ID:", productId);
        console.log("Quantity:", quantity);

        if (!productId || !quantity) {
            return res.status(400).json({ error: "Product ID and quantity are required."});
        }

        if (!userId) return res.status(401).json({ success: false, message: "Please log in first" });

        const result = await cartModel.addToCart(userId, productId, quantity, isPresent);
        res.status(200).json({ success: true, message: "Product added to cart successfully.", result });
    } catch (error) {
        console.error("Error adding product to cart:", error.message);
        res.status(500).json({ error: "Failed to add product to cart." });
    }
};


exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required"});
    }

    const result = await cartModel.removeFromCart(productId, userId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found in cart or user does not exist." });
    }
    res.status(200).json({ message: "Product removed from cart successfully.", result });
  } catch (error) {
    console.error("Error removing product from cart:", error.message);
    res.status(500).json({ error: "Failed to remove product from cart." });
  }
};

exports.buy = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: "Shipping address is required."});
    }
    const result = await cartModel.buy(userId, address);
    res.status(200).json({ message: "Purchase successful.", result });
  } catch (error) {
    console.error("Error processing purchase:", error.message);
    res.status(500).json({ error: "Failed to process purchase." });
  }
};

exports.getShoppingCartEJS = async (userId) => {
  try {
    const result = await cartModel.getShoppingCart(userId);
    return result;
  } catch (error) {
    console.error("Error fetching shopping cart for EJS:", error.message);
    return [];
  }
};

exports.updateCartQuantity = async (userId, productId, quantity) => {
  try {
    const result = await cartModel.updateCartQuantity(userId, productId, quantity);
    const updatedCart = await cartModel.getShoppingCart(userId);

    const totalCartPrice = updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const updatedItem = updatedCart.find(item => item.productId == productId);

    return {
      success: true,
      newTotal: updatedItem.price * updatedItem.quantity,
      totalCartPrice
    };
  } catch (error) {
    console.error("Error updating cart quantity:", error.message);
    return { success: false, error: "Failed to update quantity."};
  }
};