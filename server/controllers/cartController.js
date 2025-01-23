const cartModel = require("../models/cartModel");
const { verifyToken } = require('../utils/token');

exports.getShoppingCart = async (req, res) => {
  try {
    const userId = req.params.userId;
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
    const { customerId, productId, quantity, isPresent } = req.body;
    const result = await cartModel.addToCart(customerId, productId, quantity, isPresent);
    res.status(200).json({ message: "Product added to cart successfully.", result });
  } catch (error) {
    console.error("Error adding product to cart:", error.message);
    res.status(500).json({ error: "Failed to add product to cart." });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.params.userId;
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
    // Extract JWT token from the request headers
    const token = req.headers.authorization;

    // Check if token is present and properly formatted
    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Unauthorized: Missing or invalid token." });
    }

    // Extract the token value
    const tokenValue = token.split(' ')[1];

    // Verify the token
    const decoded = await verifyToken(tokenValue);

    // Token is valid, proceed with cartModel.buy function
    const customerId = req.params.id;
    const address = req.body.address;

    const result = await cartModel.buy(customerId, address);
    res.status(200).json({ message: "Purchase successful.", result });
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      console.error("Token verification failed:", error.message);
      return res.status(401).json({ error: "Unauthorized: Invalid or expired token." });
    }
    console.error("Error processing purchase:", error.message);
    res.status(500).json({ error: "Failed to process purchase." });
  }
};
