const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products
router.get('/', async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Product not found' });
    res.json(p);
  } catch (err) {
    res.status(400).json({ error: 'Invalid id' });
  }
});

// POST /api/products
router.post('/', async (req, res) => {
  try {
    const { sku, name, price, stock } = req.body;
    const prod = new Product({ sku, name, price, stock });
    await prod.save();
    res.status(201).json(prod);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const removed = await Product.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Deleted', id: removed._id });
  } catch (err) {
    res.status(400).json({ error: 'Invalid id' });
  }
});

module.exports = router;
