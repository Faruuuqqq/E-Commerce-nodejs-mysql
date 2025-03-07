const orderModel = require("../models/orderModel");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.getAllOrders();
        // res.status(200).json(result);
        // console.log("Orders data", orders);
    res.render("orders", { orders });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const result = await orderModel.getOrderById(orderId);
    if (!result || result.length === 0) {
      return res.status(404).json({ error: "Order not found." });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({ error: "Failed to fetch order." });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.user;
    const orders = await orderModel.getPastOrdersByCustomerID(userId);
    // console.log("User orders data:", orders); // debugging
    if (!orders) {
      return res.status(404).json({ error: "No orders found for this user." });
    }
    res.render("orders", { orders, user: req.user });
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({ error: "Failed to fetch order." });
  }
}

exports.getProductsByOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const result = await orderModel.getProductsByOrder(orderId);
    if (!result || result.length === 0) {
      return res.status(404).json({ error: "No products found for this order." });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching products by order:", error.message);
    res.status(500).json({ error: "Failed to fetch products for the order." });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const newData = req.body; // Assuming newData contains fields to be updated
    const result = await orderModel.updateOrder(orderId, newData);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Order not found or no changes made." });
    }
    res.status(200).json({ message: "Order updated successfully.", result });
  } catch (error) {
    console.error("Error updating order:", error.message);
    res.status(500).json({ error: "Failed to update order." });
  }
};

exports.getPastOrdersByCustomerID = async (req, res) => {
  try {
    const customerId = req.params.id;
    const result = await orderModel.getPastOrdersByCustomerID(customerId);
    if (!result || result.length === 0) {
      return res.status(404).json({ error: "No past orders found for this customer." });
    }
    // res.status(200).json(result);
    res.render("orders", { orders});
  } catch (error) {
    console.error("Error fetching past orders:", error.message);
    res.status(500).json({ error: "Failed to fetch past orders." });
  }
};
