const productModel = require("../models/productModel");
const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const adminModel = require("../models/adminModel");

exports.getAdminDashboard = async (req, res) => {
  try {
    const totalProducts = await adminModel.countProducts();
    const totalOrders = await adminModel.countOrders();
    const totalUsers = await adminModel.countUsers();

    res.render("admin/dashboard", {
      totalProducts,
      totalOrders,
      totalUsers
    });
  } catch (error) {
      console.error("Error fetching admin dashboard:", error);
      res.status(500).send("Error loading dashboard");
  }
};

exports.getOrdersPage = async (req, res) => {
  try {
    const orders = await orderModel.getAllOrders();
    res.render("admin/orders", { orders });
  } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).send("Error loading orders");
  }
}

exports.getProductsPage = async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.render("admin/products", { products });
  } catch (error) {
      console.error("Error ferthing products:", error);
      res.status(500).send("Error loading products");
  }
};

exports.getUsersPage = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.render("admin/users", { users });
  } catch (error) {
      console.error("Error ferching users:", error);
      res.status(500).send("Error loading users");
  }
}