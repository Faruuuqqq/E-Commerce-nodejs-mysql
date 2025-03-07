const cartModel = require("../models/cartModel");
const userModel = require("../models/userModel");

exports.getCheckoutPage = async (req, res) => {
  try {
      if (!req.user || !req.user.userId) {
          return res.status(401).json({ message: "Unauthorized - User not found" });
      }

      const { userId } = req.user;
      const user = await userModel.getUserById(userId);
      const cartItems = await cartModel.getShoppingCart(userId);
      
      res.render("checkout", { cartItems, user });
  } catch (error) {
      console.error("Error loading checkout page:", error);
      res.status(500).send("Error loading checkout page");
  }
};