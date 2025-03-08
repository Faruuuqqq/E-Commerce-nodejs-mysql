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

exports.getUpdateProductPage = async (req, res) => {
  try {
      const { productId } = req.params;
      const product = await productModel.getProductDetailsById(productId);

      if (!product) {
          return res.status(404).json({ error: "Product not found" });
      }

      res.render("admin/updateProducts", { user: req.user, product });
  } catch (error) {
      console.error("Error fetching product details:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getCreateProductPage = async (req, res) => {
  try {
    res.render("admin/createProduct");
  } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUpdateOrderPage = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orders = await orderModel.getOrderById(orderId);

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    const order = orders[0];
    console.log(order);
    res.render("admin/updateOrders", { user: req.user, order });
  } catch (error) {
      console.error("Error fetching order details:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
}