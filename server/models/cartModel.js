const pool = require("../database/connection");

exports.getShoppingCart = async (userId) => {
  try {
    const query = `
      SELECT S.quantity, P.name, P.price, P.productId 
      FROM shopingCart S 
      INNER JOIN product P ON S.productId = P.productId 
      WHERE S.userId = ?;
    `;
    const [result] = await pool.promise().query(query, [userId]);
    return result;
  } catch (error) {
    throw new Error("Error fetching shopping cart: " + error.message);
  }
};

exports.addToCart = async (customerId, productId, quantity, isPresent) => {
  try {
    const query = isPresent
      ? `
        UPDATE shopingCart 
        SET quantity = quantity + ? 
        WHERE productId = ? AND userId = ?;
      `
      : `
        INSERT INTO shopingCart (userId, productId, quantity) 
        VALUES (?, ?, ?);
      `;
    const params = isPresent
      ? [quantity, productId, customerId]
      : [customerId, productId, quantity];
    const [result] = await pool.promise().query(query, params);
    return result;
  } catch (error) {
    throw new Error("Error adding to cart: " + error.message);
  }
};

exports.removeFromCart = async (productId, userId) => {
  try {
    const query = `
      DELETE FROM shopingCart 
      WHERE productId = ? AND userId = ?;
    `;
    const [result] = await pool.promise().query(query, [productId, userId]);
    return result;
  } catch (error) {
    throw new Error("Error removing from cart: " + error.message);
  }
};

exports.buy = async (customerId, address) => {
  const connection = await pool.promise().getConnection(); // Begin transaction
  try {
    await connection.beginTransaction();

    // Create order
    const createOrderQuery = `
      INSERT INTO orders (userId, address) 
      VALUES (?, ?);
    `;
    const [orderResult] = await connection.query(createOrderQuery, [customerId, address]);
    const orderId = orderResult.insertId;

    // Move items from cart to productsInOrder
    const addProductsQuery = `
      INSERT INTO productsInOrder (orderId, productId, quantity, totalPrice)
      SELECT ?, S.productId, S.quantity, P.price * S.quantity 
      FROM shopingCart S 
      INNER JOIN product P ON S.productId = P.productId 
      WHERE S.userId = ?;
    `;
    await connection.query(addProductsQuery, [orderId, customerId]);

    // Update total price in orders table
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

    // Clear shopping cart
    const clearCartQuery = `
      DELETE FROM shopingCart 
      WHERE userId = ?;
    `;
    await connection.query(clearCartQuery, [customerId]);

    await connection.commit(); // Commit transaction
    connection.release();
    return { orderId };
  } catch (error) {
    await connection.rollback(); // Rollback transaction on error
    connection.release();
    throw new Error("Error completing purchase: " + error.message);
  }
};
