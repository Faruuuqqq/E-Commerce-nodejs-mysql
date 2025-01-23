const productModel = require("../models/productModel");

// Fetch all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get product details by ID
exports.getProductDetailsById = async (req, res) => {
  const productId = req.params.id;
  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  try {
    const product = await productModel.getProductDetailsById(productId);
    if (!product.length) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch all orders by product ID
exports.allOrderByProductId = async (req, res) => {
  const productId = req.params.id;
  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  try {
    const orders = await productModel.allOrderByProductId(productId);
    if (!orders.length) {
      return res.status(404).json({ error: "No orders found for this product" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  const { name, price, description } = req.body;

  if (!name || !price || !description) {
    return res.status(400).json({ error: "Name, price, and description are required" });
  }

  try {
    const result = await productModel.createProduct(name, price, description);
    res.status(201).json({ message: "Product created successfully", result });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update an existing product
exports.updateProduct = async (req, res) => {
  const { id, name, price, description } = req.body;

  if (!id || !name || !price || !description) {
    return res.status(400).json({ error: "ID, name, price, and description are required" });
  }

  try {
    const result = await productModel.updateProduct(id, name, price, description);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product updated successfully", result });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  try {
    const result = await productModel.deleteProduct(productId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully", result });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
