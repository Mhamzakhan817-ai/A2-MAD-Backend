const Order = require("../models/Order");
const Cart = require("../models/Cart");

exports.createOrder = async (req, res) => {
  try {
    const { userId, items, total, paymentMethod } = req.body;

    // 1. Create Order
    const order = await Order.create({
      user: userId,
      items: items.map(i => ({
        product: i.productId,
        quantity: i.quantity
      })),
      total,
      paymentMethod
    });

    // 2. Clear user cart after order
    await Cart.findOneAndUpdate(
      { user: userId },
      { items: [] },
      { new: true }
    );

    res.json({
      message: "Order created successfully",
      order
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const userId = req.params.user_id;

    const orders = await Order.find({ user: userId }).populate("items.product");

    res.json(orders);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};
