const cartModel = require("../models/cartModel");
const userModel = require("../models/userModel");

exports.getShoppingCart = async (req, res) => {
  try {
    const { userId, isAdmin }  = req.user;
    const { address } = req.body;
    
    // const user = await userModel.getUserById(userId);
    const cartItems = await cartModel.getShoppingCart(userId);
    
    return res.render("cart", { cartItems, user: req.user, address});
  } catch (error) {
    console.error("Error fetching shopping cart:", error.message);
    res.status(500).json({ error: "Failed to fetch shopping cart." });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;  
    const { userId } = req.user;
    
    if (!productId || !quantity || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: "Invalid product ID or quantity." });
    }
    if (!userId) {
      return res.status(401).json({ error: "Please log in first" });
    }

    // console.log("Checking if product exists in cart...");
    const existingItem = await cartModel.findCartItem(userId, productId);

    if (existingItem) {
      // console.log("Product exists in cart. Updating quantity...");
      await cartModel.updateCartQuantity(userId, productId, existingItem.quantity + parseInt(quantity));
    } else {
      // console.log("Product not found in cart. Adding new item...");
      await cartModel.addToCart(userId, productId, parseInt(quantity));
    }

    res.status(200).json({ success: true, message: "Product added to cart successfully." });

  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ error: "Failed to add product to cart." });
  }
};


exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.user;

    if (!productId) return res.status(400).json({ error: "Product ID is required." });

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

exports.updateCartQuantity = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1"});
    }

    const result = await cartModel.updateCartQuantity(userId, productId, quantity);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found in cart." });
    }

    // Fetch updated cart and calculate total price
    const updatedCart = await cartModel.getShoppingCart(userId);
    const totalCartPrice = updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const updatedItem = updatedCart.find(item => item.productId == productId);

    res.status(200).json({
      result,
      success: true,
      newTotal: updatedItem ? updatedItem.price * updatedItem.quantity : 0,
      totalCartPrice
    });
  } catch (error) {
    console.error("Error updating cart quantity:", error.message);
    res.status(500).json({ error: "Failed to update quantity." });
  }
};

exports.buy = async (req, res) => {
  try {
    const { userId } = req.user;
    const { address } = req.body;

    if (!address) return res.status(400).json({ error: "Shipping address is required." });

    const result = await cartModel.buy(userId, address);
    res.status(200).json({ message: "Purchase successful.", result });
  } catch (error) {
    console.error("Error processing purchase:", error.message);
    res.status(500).json({ error: "Failed to process purchase." });
  }
};