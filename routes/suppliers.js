const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');

// GET /api/suppliers
router.get('/', async (req, res) => {
  const list = await Supplier.find({});
  res.json(list);
});

// GET /api/suppliers/:id
router.get('/:id', async (req, res) => {
  try {
    const s = await Supplier.findById(req.params.id);
    if (!s) return res.status(404).json({ error: 'Supplier not found' });
    res.json(s);
  } catch (err) {
    res.status(400).json({ error: 'Invalid id' });
  }
});

// POST /api/suppliers
router.post('/', async (req, res) => {
  try {
    const sup = new Supplier(req.body);
    await sup.save();
    res.status(201).json(sup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/suppliers/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Supplier not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/suppliers/:id
router.delete('/:id', async (req, res) => {
  try {
    const removed = await Supplier.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ message: 'Deleted', id: removed._id });
  } catch (err) {
    res.status(400).json({ error: 'Invalid id' });
  }
});

module.exports = router;
