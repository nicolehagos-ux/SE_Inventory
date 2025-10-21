const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

// attach product price if missing and validate existence
async function enrichItems(items) {
  const enriched = [];
  for (const it of items) {
    if (!it.productId || !it.qty) throw new Error('Each item requires productId and qty');
    const prod = await Product.findById(it.productId);
    if (!prod) throw new Error('Product not found: ' + it.productId);
    enriched.push({
      productId: prod._id,
      qty: it.qty,
      price: (typeof it.price === 'number') ? it.price : prod.price
    });
  }
  return enriched;
}

// GET /api/orders
router.get('/', async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const orders = await Order.find(filter).populate('supplierId').populate('items.productId');
  res.json(orders);
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const o = await Order.findById(req.params.id).populate('supplierId').populate('items.productId');
    if (!o) return res.status(404).json({ error: 'Order not found' });
    res.json(o);
  } catch (err) {
    res.status(400).json({ error: 'Invalid id' });
  }
});

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const { items, supplierId } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'items required' });
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) return res.status(400).json({ error: 'supplier not found' });

    const enriched = await enrichItems(items);
    const order = await Order.create({ items: enriched, supplierId });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/orders/:id
// - update items/supplier/status
// - if status moves to 'received' from not-received, increment product stock and set receivedAt
router.put('/:id', async (req, res) => {
  try {
    const o = await Order.findById(req.params.id);
    if (!o) return res.status(404).json({ error: 'Order not found' });

    if (req.body.items) {
      o.items = await enrichItems(req.body.items);
    }
    if (req.body.supplierId) {
      const supplier = await Supplier.findById(req.body.supplierId);
      if (!supplier) return res.status(400).json({ error: 'supplier not found' });
      o.supplierId = req.body.supplierId;
    }
    if (req.body.status && ['pending','received','cancelled'].includes(req.body.status)) {
      // handle received transition
      if (o.status !== 'received' && req.body.status === 'received') {
        for (const it of o.items) {
          const prod = await Product.findById(it.productId);
          if (prod) {
            prod.stock += it.qty;
            await prod.save();
          }
        }
        o.receivedAt = new Date();
      }
      o.status = req.body.status;
    }

    await o.save();
    const populated = await Order.findById(o._id).populate('supplierId').populate('items.productId');
    res.json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/orders/:id
router.delete('/:id', async (req, res) => {
  try {
    const removed = await Order.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Deleted', id: removed._id });
  } catch (err) {
    res.status(400).json({ error: 'Invalid id' });
  }
});

module.exports = router;
