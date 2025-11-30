const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ➕ ADD item to cart
exports.addToCart = async (req, res) => {
  try {
    console.log("ADD TO CART BODY:", req.body);

    const { userId, productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      const item = cart.items.find(
        (i) => i.product.toString() === productId
      );

      if (item) {
        item.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    res.json({
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📦 GET user cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (error) {
    console.error("GET CART ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};


// ❌ REMOVE item from cart
exports.removeItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const cart = await Cart.findOneAndUpdate(
      { "items._id": itemId },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    );

    res.json({ message: "Item removed", cart });
  } catch (error) {
    console.error("REMOVE ITEM ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};
