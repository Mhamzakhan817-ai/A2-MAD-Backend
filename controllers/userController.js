const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SIGNUP
exports.signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("SIGNUP BODY:", req.body);

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ error: error.message });
  }

};

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// WISHLIST TOGGLE (fix)
exports.toggleWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "User not found" });

    const exists = user.wishlist?.includes(productId);

    if (exists) {
      user.wishlist.pull(productId);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();

    res.json({ wishlist: user.wishlist });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};
