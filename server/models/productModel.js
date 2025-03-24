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

// Get all products with pagination
exports.getAllProducts = async (page = 1, limit = 12, isAdmin = false) => {
  try {
    const offset = (page - 1) * limit;
    
    // Get total count
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM product');
    const total = countResult[0].total;
    
    // Get products with different queries for admin and user views
    let query;
    let params;
    
    if (isAdmin) {
      // Admin view: get all products ordered by productId
      query = `
        SELECT p.*, c.categoryName 
        FROM product p 
        LEFT JOIN categories c ON p.categoryId = c.categoryId 
        ORDER BY p.productId ASC
      `;
      params = [];
    } else {
      // User view: get paginated products ordered by createdDate
      query = `
        SELECT p.*, c.categoryName 
        FROM product p 
        LEFT JOIN categories c ON p.categoryId = c.categoryId 
        ORDER BY p.createdDate DESC 
        LIMIT ? OFFSET ?
      `;
      params = [limit, offset];
    }
    
    const [products] = await pool.query(query, params);
    
    return {
      products,
      pagination: isAdmin ? null : {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
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
exports.createProduct = async (name, price, description, stock, imageUrl, categoryId) => {
  try {
    const query = 'INSERT INTO product (name, price, description, stock, imageUrl, categoryId, createdDate) VALUES (?, ?, ?, ?, ?, ?, NOW());';
    const result = await executeQuery(query, [name, price, description, stock, imageUrl, categoryId]);
    return { productId: result.insertId, name, price, description, stock, imageUrl, categoryId };
  } catch (error) {
    console.error('Error in createProduct:', error.message);
    throw error;
  }
};

// Update an existing product
exports.updateProduct = async (productId, name, price, description, stock, imageUrl, categoryId) => {
  try {
    const query = 'UPDATE product SET name = ?, price = ?, description = ?, stock = ?, imageUrl = ?, categoryId = ? WHERE productId = ?;';
    const result = await executeQuery(query, [ name, price, description, stock, imageUrl, categoryId, productId ]);
    if (result.affectedRows === 0) {
      console.warn("No changes made, but product exists");
    }
    console.log("Update result:", result);

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
