const pool = require("../database/connection");

exports.getAllOrders = async () => {
  try {
    const query = `
      SELECT 
        O.orderId, U.fname, U.lname, O.createdDate, O.totalPrice, O.status
      FROM 
        orders O 
      INNER JOIN 
        users U 
      ON 
        O.userId = U.userId;
    `;
    const [result] = await pool.query(query);
    return result;
  } catch (error) {
    throw new Error("Error fetching all orders: " + error.message);
  }
};

exports.getOrderById = async (orderId) => {
  try {
    const query = `
      SELECT 
        U.fname, U.lname, O.totalPrice, O.createdDate, O.address 
      FROM 
        orders O 
      INNER JOIN 
        users U 
      ON 
        O.userId = U.userId 
      WHERE 
        O.orderId = ?;
    `;
    const [result] = await pool.query(query, [orderId]);
    return result;
  } catch (error) {
    throw new Error("Error fetching order by ID: " + error.message);
  }
};

exports.getProductsByOrder = async (orderId) => {
  try {
    const query = `
      SELECT
        P2.productId, P2.name, P.quantity, P.totalPrice 
      FROM 
        orders O 
      INNER JOIN 
        productsInOrder P 
      ON 
        O.orderId = P.orderId 
      INNER JOIN 
        product P2 
      ON 
        P.productId = P2.productId 
      WHERE 
        O.orderId = ?;
    `;
    const [result] = await pool.query(query, [orderId]);
    return result;
  } catch (error) {
    throw new Error("Error fetching products by order ID: " + error.message);
  }
};

exports.updateOrder = async (orderId, newData) => {
  try {
    const query = `
      UPDATE 
        orders 
      SET 
        ? 
      WHERE 
        orderId = ?;
    `;
    const [result] = await pool.query(query, [newData, orderId]);
    return result;
  } catch (error) {
    throw new Error("Error updating order: " + error.message);
  }
};

exports.getPastOrdersByCustomerID = async (userId) => {
  try {
    const query = `
      SELECT 
       O.orderId,
       O.createdDate,
       GROUP_CONCAT(P.name, ' (x', PIN.quantity, ')' SEPARATOR ', ') AS products,
       SUM(PIN.totalPrice) AS totalPrice
      FROM orders O
      INNER JOIN productsinorder PIN ON O.orderId = PIN.orderId
      INNER JOIN product P ON PIN.productId = P.productId
      WHERE O.userId = ?
      GROUP BY O.orderId
      ORDER BY O.orderId DESC;
    `;
    const [result] = await pool.query(query, [userId]);
    return result;
  } catch (error) {
    throw new Error("Error fetching past orders by customer ID: " + error.message);
  }
};
