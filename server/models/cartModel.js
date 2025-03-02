const pool = require("../database/connection");

// get data from shoppingcart based on userId
exports.getShoppingCart = async (userId) => {
  try {
    const query = `
      SELECT S.quantity, P.name, P.price, P.productId 
      FROM shoppingCart S 
      INNER JOIN product P ON S.productId = P.productId 
      WHERE S.userId = ?;
    `;
    const [result] = await pool.query(query, [userId]);
    return result;
  } catch (error) {
    throw new Error("Error fetching shopping cart: " + error.message);
  }
};

// check the product is in the cart 
exports.findCartItem = async (userId, productId) => {
  try {
    const query = `SELECT * FROM shoppingCart WHERE userId = ? AND productId = ?`;
    const [rows] = await pool.query(query, [userId, productId]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("❌ Error checking cart item:", error);
    throw new Error(`Database error: ${error.message}`);
  }
};

exports.addToCart = async (userId, productId, quantity) => {
  try {
    const query = `INSERT INTO shoppingCart (userId, productId, quantity) VALUES (?, ?, ?)`;
    const [result] = await pool.query(query, [userId, productId, quantity]);

    return result;
  } catch (error) {
    console.error("❌ Error adding product to cart:", error);
    throw new Error(`Database error: ${error.message}`);
  }
};

exports.removeFromCart = async (productId, userId) => {
  try {
    const query = `
      DELETE FROM shoppingCart 
      WHERE productId = ? AND userId = ?;
    `;
    const [result] = await pool.query(query, [productId, userId]);
    return result;
  } catch (error) {
    throw new Error("Error removing from cart: " + error.message);
  }
};

exports.buy = async (userId, address) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const createOrderQuery = `
      INSERT INTO orders (userId, address) 
      VALUES (?, ?);
    `;
    const [orderResult] = await connection.query(createOrderQuery, [userId, address]);
    const orderId = orderResult.insertId;

    const addProductsQuery = `
      INSERT INTO productsInOrder (orderId, productId, quantity, totalPrice)
      SELECT ?, S.productId, S.quantity, P.price * S.quantity 
      FROM shoppingCart S 
      INNER JOIN product P ON S.productId = P.productId 
      WHERE S.userId = ?;
    `;
    await connection.query(addProductsQuery, [orderId, userId]);

    const updateTotalPriceQuery = `
      UPDATE orders 
      SET totalPrice = (
        SELECT SUM(PIO.totalPrice) 
        FROM productsInOrder PIO 
        WHERE PIO.orderId = ?
      )
      WHERE orderId = ?;
    `;
    await connection.query(updateTotalPriceQuery, [orderId, orderId]);

    const clearCartQuery = `DELETE FROM shoppingCart WHERE userId = ?;`;
    await connection.query(clearCartQuery, [userId]);

    await connection.commit();
    return { orderId };
  } catch (error) {
    await connection.rollback();
    throw new Error("Error completing purchase: " + error.message);
  } finally {
    connection.release();
  }
};

exports.updateCartQuantity = async (userId, productId, quantity) => {
  try {
    const query = `
      UPDATE shoppingCart 
      SET quantity = ? 
      WHERE userId = ? AND productId = ?;
    `;
    const [result] = await pool.query(query, [quantity, userId, productId]);
    return result;
  } catch (error) {
    throw new Error("Error updating cart quantity: " + error.message);
  }
};
