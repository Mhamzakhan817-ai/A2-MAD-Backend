const Product = require('../models/Product');


exports.getAllProducts = async (req, res) => {
try {
const products = await Product.find();
res.json(products);
} catch (err) {
res.status(500).json({ message: err.message });
}
};


exports.getFeatured = async (req, res) => {
try {
const featured = await Product.find({ featured: true }).limit(5);
res.json(featured);
} catch (err) {
res.status(500).json({ message: err.message });
}
};


exports.getProductById = async (req, res) => {
try {
const product = await Product.findById(req.params.id);
if (!product) return res.status(404).json({ message: 'Product not found' });
res.json(product);
} catch (err) {
res.status(500).json({ message: err.message });
}
};