const Product = require('../models/Product');
const path    = require('path');

exports.getProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.cat) filter.category = req.query.cat;
    const limit = parseInt(req.query.limit) || 100;
    const products = await Product.find(filter).sort({ createdAt: -1 }).limit(limit);
    res.json({ success: true, products });
  } catch (e) { res.status(500).json({ success:false, message:'Could not fetch products.' }); }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success:false, message:'Product not found.' });
    res.json({ success:true, product });
  } catch (e) { res.status(500).json({ success:false, message:'Could not fetch product.' }); }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, oldPrice, description, sizes, badge } = req.body;
    const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    const images = (req.files || []).map(f => `/uploads/${f.filename}`);
    const product = await Product.create({
      name, category,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      description, sizes: parsedSizes,
      badge: badge || null,
      images,
    });
    res.status(201).json({ success:true, product });
  } catch (e) { console.error(e); res.status(500).json({ success:false, message:'Could not create product.' }); }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success:true });
  } catch (e) { res.status(500).json({ success:false, message:'Could not delete product.' }); }
};
