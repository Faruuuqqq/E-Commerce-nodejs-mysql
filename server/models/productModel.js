const pool = require('../database/connection');

// Reusable query execution function
const executeQuery = async (query, params = []) => {
  try {
    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error('Database Error:', error.message);
    throw new Error(`Query Execution Error: ${error.message}`);
  }
};

// Get all products
exports.getAllProducts = async () => {
  try {
    const query = 'SELECT * FROM product;';
    const result = await executeQuery(query);
    return result;
  } catch (error) {
    console.error('Error in getAllProducts:', error.message);
    throw error;
  }
};

// Get product details by ID
exports.getProductDetailsById = async (productId) => {
  try {
    const query = 'SELECT * FROM product WHERE productId = ?;';
    const result = await executeQuery(query, [productId]);
    if (result.length === 0) {
      throw new Error('Product not found');
    }
    return result[0]; // Mengembalikan satu produk
  } catch (error) {
    console.error('Error in getProductDetailsById:', error.message);
    throw error;
  }
};

// Create a new product
exports.createProduct = async (name, price, description, stock) => {
  try {
    const query = 'INSERT INTO product (name, price, description, stock) VALUES (?, ?, ?, ?);';
    const result = await executeQuery(query, [name, price, description, stock]);
    return { productId: result.insertId }; // Mengembalikan ID produk baru
  } catch (error) {
    console.error('Error in createProduct:', error.message);
    throw error;
  }
};

// Update an existing product
exports.updateProduct = async (productId, name, price, description, stock) => {
  try {
    const query = 'UPDATE product SET name = ?, price = ?, description = ?, stock = ? WHERE productId = ?;';
    const result = await executeQuery(query, [name, price, description, stock, productId]);
    if (result.affectedRows === 0) {
      throw new Error('Product not found or no changes made');
    }
    return { message: 'Product updated successfully' };
  } catch (error) {
    console.error('Error in updateProduct:', error.message);
    throw error;
  }
};


// Delete a product by ID
exports.deleteProduct = async (productId) => {
  try {
    const query = 'DELETE FROM product WHERE productId = ?;';
    const result = await executeQuery(query, [productId]);
    if (result.affectedRows === 0) {
      throw new Error('Product not found');
    }
    return { message: 'Product deleted successfully' };
  } catch (error) {
    console.error('Error in deleteProduct:', error.message);
    throw error;
  }
};

// Get all orders for a specific product
exports.allOrderByProductId = async (productId) => {
  try {
    const query = `
      SELECT O.orderId, U.fname, U.lname, O.createdDate, PIN.quantity, PIN.totalPrice
      FROM users U
      INNER JOIN orders O ON U.userId = O.userId
      INNER JOIN productsInOrder PIN ON O.orderId = PIN.orderId
      INNER JOIN product P ON PIN.productId = P.productId
      WHERE PIN.productId = ?;
    `;
    const result = await executeQuery(query, [productId]);
    if (result.length === 0) {
      throw new Error('No orders found for this product');
    }
    return result;
  } catch (error) {
    console.error('Error in allOrderByProductId:', error.message);
    throw error;
  }
};
