const productModel = require("../models/productModel");

exports.getAllProducts = async (req, res) => {
    try {
        const products = await productModel.getAllProducts();
        
        // console.log("Products Data:", products);
        // console.log("Session user di /products:", req.user.user);

        res.render("products", { user: req.user, products });
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
        const { name, price, description, stock } = req.body;

        if (!name || !price || !description || !stock) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const result = await productModel.createProduct(name, price, description, stock);

        res.status(201).json({ success: true, message: "Product created successfully", productId: result.insertId });
        // res.redirect("/admin/products?success=true");
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, price, description, stock } = req.body;

        if (!name || !price || !description || !stock) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const result = await productModel.updateProduct(productId, name, price, description, stock);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Product not found or no changes made" });
        }

        res.json({ success: true, message: "Product updated successfully" });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

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
