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
    const { productId, quantity, isPresent } = req.body;
    const userId = req.user.userId;
    const result = await cartModel.addToCart(userId, productId, quantity, isPresent);
    res.status(200).json({ message: "Product added to cart successfully.", result });
  } catch (error) {
    console.error("Error adding product to cart:", error.message);
    res.status(500).json({ error: "Failed to add product to cart." });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.user.userId;
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
    const address = req.body.address;
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
    console.error("Error fetching shopping aart for EJS:", error.message);
    return [];
  }
}