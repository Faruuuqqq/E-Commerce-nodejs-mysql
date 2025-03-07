const productModel = require("../models/productModel");

exports.getAllProducts = async (req, res) => {
    try {
        const products = await productModel.getAllProducts();
                // console.log("Products Data:", products); // Debugging
                // console.log("Session user di /products:", req.user.user);
        res.render("products", { user: req.user, products });
    } catch (error) {
        console.error("error: cannot fetching all products", error);
        res.status(500).json({error: 'internal server error'});
    }
}

exports.getProductDetailsById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await productModel.getProductDetailsById(productId);
        
        if (!product) {
            return res.status(404).send("Product not found");
        }
        
        res.render("productDetail", { user: req.user, product });
    } catch (error) {
        console.error('Error fetching product details:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.allOrderByProductId = async (req, res) => {
    try {
        const { productId } = req.params;
        const orders = await productModel.allOrderByProductId(productId);
        res.json({ success: true, orders }); 
    } catch (error) {
        console.error('error : fetching products by product ID', error);
        res.status(500).json({error:'internal server error'})
    }
}

exports.createProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const result = await productModel.createProduct(name, price, description);
        res.status(201).json({ success: true, message: "Product created successfully", productId: result.productId });
    } catch (error) {
        console.error('error : creating product');
        res.status(500).json({error:'internal server error'});
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, price, description } = req.body;
        const result = await productModel.updateProduct(productId, name, price, description);
        
        if (!result) {
            return res.status(404).json({ error: "Product not found or no changes made" });
        }
        
        res.json({ success: true, message: "Product updated successfully" });
    } catch (error) { 
        console.error('error : updating product');
        res.status(500).json({error:'internal server error'});
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params
        await productModel.deleteProduct(productId);
        
        if (!result) {
            return res.status(404).json({ error: "Product not found" });
        }
        
        res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error('error : deleting product', error);
        res.status(500).json({error:'internal server error'});
    }
}