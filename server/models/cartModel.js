const pool = require("../database/connection");

exports.getShoppingCart = async (userId) => {
  try {
    const query = `
      SELECT S.quantity, P.name, P.price, P.id as productId 
      FROM shoppingCart S 
      INNER JOIN product P ON S.productId = P.id 
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
        UPDATE shoppingCart 
        SET quantity = quantity + ? 
        WHERE productId = ? AND userId = ?;
      `
      : `
        INSERT INTO shoppingCart (userId, productId, quantity) 
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
      DELETE FROM shoppingCart 
      WHERE productId = ? AND userId = ?;
    `;
    const [result] = await pool.promise().query(query, [productId, userId]);
    return result;
  } catch (error) {
    throw new Error("Error removing from cart: " + error.message);
  }
};

exports.buy = async (customerId, address) => {
  const connection = await pool.promise().getConnection();
  try {
    await connection.beginTransaction();

    // Buat pesanan
    const createOrderQuery = `
      INSERT INTO orders (userId, address) 
      VALUES (?, ?);
    `;
    const [orderResult] = await connection.query(createOrderQuery, [customerId, address]);
    const orderId = orderResult.insertId;

    // Pindahkan item dari cart ke productsInOrder
    const addProductsQuery = `
      INSERT INTO productsInOrder (orderId, productId, quantity, totalPrice)
      SELECT ?, S.productId, S.quantity, P.price * S.quantity 
      FROM shoppingCart S 
      INNER JOIN product P ON S.productId = P.id 
      WHERE S.userId = ?;
    `;
    await connection.query(addProductsQuery, [orderId, customerId]);

    // Update total harga dalam tabel orders
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

    // Kosongkan shopping cart
    const clearCartQuery = `DELETE FROM shoppingCart WHERE userId = ?;`;
    await connection.query(clearCartQuery, [customerId]);

    await connection.commit();
    return { orderId };
  } catch (error) {
    await connection.rollback();
    throw new Error("Error completing purchase: " + error.message);
  } finally {
    connection.release(); // Pastikan koneksi selalu ditutup
  }
};
