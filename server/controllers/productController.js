const path = require("path");
const fs = require("fs");
const productModel = require("../models/productModel");

exports.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        
        const result = await productModel.getAllProducts(page, limit);
        
        res.render("products", { 
            user: req.user, 
            products: result.products,
            pagination: result.pagination
        });
    } catch (error) {
        console.error("Error: cannot fetch all products", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getProductDetailsById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await productModel.getProductDetailsById(productId);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.render("productDetail", { user: req.user, product });
    } catch (error) {
        console.error("Error fetching product details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.allOrderByProductId = async (req, res) => {
    try {
        const { productId } = req.params;
        const orders = await productModel.allOrderByProductId(productId);
        
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching orders by product ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.createProduct = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        console.log("Request File:", req.file);

        const { name, price, description, stock, categoryId } = req.body;
        const imageUrl = req.file ? req.file.filename : null; 
    
        if (!name || !price || !description || !stock || !imageUrl || !categoryId) {
          return res.status(400).json({ message: "field must have value!" });
        }

        console.log("Sending to DB:", { name, price, description, stock, imageUrl, categoryId });

        const newProduct = await productModel.createProduct(
          name,
          price,
          description,
          stock,
          imageUrl,
          categoryId
        );
    
        res.status(201).json({ message: "Product added successfully!", product: newProduct });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while adding the product" });
      }
};

exports.updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, price, description, stock, categoryId } = req.body;
        const categoryIdInt = parseInt(categoryId);

        const product = await productModel.getProductDetailsById(productId);
        if (!product) return res.status(404).send("Product not found.");

        let newImage = product.imageUrl;
        if (req.file) {
          newImage = req.file.filename;
    
          const oldPath = path.join(__dirname, "..", "public", "uploads", product.imageUrl);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        
        console.log("Updating with data:", { name, price, description, stock, categoryIdInt, image: newImage });

        await productModel.updateProduct(name, price, description, stock, newImage, categoryIdInt, productId);
    
        res.status(200).json({ message: "Product updated successfully" });
      } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Internal Server Error" });          
      }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await productModel.getProductDetailsById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        const result = await productModel.deleteProduct(productId);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.showAddProductForm = async (req, res) => {
    try {
        const [categories] = await db.query("SELECT * FROM categories;");
        res.render("admin/addProduct", { categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}