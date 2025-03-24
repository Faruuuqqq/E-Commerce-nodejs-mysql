const db = require("../database/connection");
const productModel = require("../models/productModel");
const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const adminModel = require("../models/adminModel");
const path = require("path");
const fs = require("fs");

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
    const { products } = await productModel.getAllProducts(1, 100, true); // Set isAdmin to true
    res.render("admin/products", { products });
  } catch (error) {
      console.error("Error fetching products:", error);
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
      const [categories] = await db.query("SELECT * FROM categories;");

      if (!product) {
          return res.status(404).json({ error: "Product not found" });
      }
      // console.log("Received categoryId:", categories);

      res.render("admin/updateProducts", { user: req.user, product, categories });
  } catch (error) {
      console.error("Error fetching product details:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getCreateProductPage = async (req, res) => {
  try {
      const [categories] = await db.query("SELECT * FROM categories;");
      res.render("admin/createProduct", { categories });
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

exports.createProduct = async (req, res) => {
    try {
        const { name, price, description, stock, categoryId } = req.body;
        const imageUrl = req.file ? req.file.filename : null; 
    
        if (!name || !price || !description || !stock || !imageUrl || !categoryId) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const newProduct = await productModel.createProduct(
            name,
            price,
            description,
            stock,
            imageUrl,
            categoryId
        );
    
        res.status(201).json({ 
            success: true,
            message: "Product added successfully!", 
            product: newProduct 
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ 
            success: false,
            message: "An error occurred while adding the product" 
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, price, description, stock, categoryId } = req.body;
        const categoryIdInt = parseInt(categoryId);

        const product = await productModel.getProductDetailsById(productId);
        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: "Product not found." 
            });
        }

        let newImage = product.imageUrl;
        if (req.file) {
            newImage = req.file.filename;
    
            // Delete old image file
            const oldPath = path.join(__dirname, "..", "public", "uploads", product.imageUrl);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }
        
        await productModel.updateProduct(
            productId,
            name, 
            price, 
            description, 
            stock, 
            newImage, 
            categoryIdInt
        );
    
        res.status(200).json({ 
            success: true,
            message: "Product updated successfully" 
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error" 
        });          
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await productModel.getProductDetailsById(productId);
        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: "Product not found" 
            });
        }

        // Delete product image file
        const imagePath = path.join(__dirname, "..", "public", "uploads", product.imageUrl);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await productModel.deleteProduct(productId);

        res.json({ 
            success: true, 
            message: "Product deleted successfully" 
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error" 
        });
    }
};

exports.getProductOrders = async (req, res) => {
    try {
        const { productId } = req.params;
        const orders = await productModel.allOrderByProductId(productId);
        
        res.json({ 
            success: true, 
            orders 
        });
    } catch (error) {
        console.error("Error fetching orders by product ID:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error" 
        });
    }
};
