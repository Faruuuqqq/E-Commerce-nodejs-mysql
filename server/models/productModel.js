const pool = require('../database/connection');

// Reusable query execution function
const executeQuery = async (query, params = []) => {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (err, result) => {
      if (err) {
        console.error('Database Error:', err.message);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

exports.getAllProducts = async () => {
  try {
    const query = 'SELECT * FROM product;';
    return await executeQuery(query);
  } catch (error) {
    throw error; // Propagate error to the caller
  }
};

exports.getProductDetailsById = async (productId) => {
  try {
    const query = 'SELECT * FROM product WHERE productId = ?;';
    return await executeQuery(query, [productId]);
  } catch (error) {
    throw error;
  }
};

exports.createProduct = async (name, price, description) => {
  try {
    const query = 'INSERT INTO product (name, price, description) VALUES (?, ?, ?);';
    const result = await executeQuery(query, [name, price, description]);
    return { productId: result.insertId }; // result.insertId berisi ID produk baru
  } catch (error) {
    throw error;
  }
};

exports.updateProduct = async (productId, name, price, description) => {
  try {
    const query = 'UPDATE product SET name = ?, price = ?, description = ? WHERE productId = ?;';
    return await executeQuery(query, [name, price, description, productId]);
  } catch (error) {
    throw error;
  }
};

exports.deleteProduct = async (productId) => {
  try {
    const query = 'DELETE FROM product WHERE productId = ?;';
    return await executeQuery(query, [productId]);
  } catch (error) {
    throw error;
  }
};

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
    return await executeQuery(query, [productId]);
  } catch (error) {
    throw error;
  }
};