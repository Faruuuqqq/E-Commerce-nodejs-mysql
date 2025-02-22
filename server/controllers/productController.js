const productModel = require("../models/productModel");

exports.getAllProducts = async (req, res) => {
    try {
        const products = await productModel.getAllProducts();
        // console.log("Products Data:", products); // Debugging
        // console.log("Session user di /products:", req.user.user);
        res.render("products", { user: req.user, products });
        return products;
    } catch (error) {
        console.error("error: cannot fetching all products")
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
        const products = await productModel.allOrderByProductId(productId);
        res.json(products); 
    } catch (error) {
        console.error('error : fetching products by product id');
        res.status(500).json({error:'internal server error'})
    }
}

exports.createProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const result = await productModel.createProduct(name, price, description);
        res.json(result);
    } catch (error) {
        console.error('error : creating product');
        res.status(500).json({error:'internal server error'});
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const { productId } = req.params;
        const result = await productModel.updateProduct(productId, name, price, description);
        res.json(result);
    } catch (error) { 
        console.error('error : updating product');
        res.status(500).json({error:'internal server error'});
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params
        await productModel.deleteProduct(productId);
        res.status(204).send();
    } catch (error) {
        console.error('error : deleting product');
        res.status(500).json({error:'internal server error'});
    }
}