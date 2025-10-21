require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const Order = require('../models/Order');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory';

async function seed() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Seeding DB...');

  await Product.deleteMany({});
  await Supplier.deleteMany({});
  await Order.deleteMany({});

  const p1 = await Product.create({ sku: 'SKU-1001', name: 'Widget A', price: 9.99, stock: 100 });
  const p2 = await Product.create({ sku: 'SKU-1002', name: 'Widget B', price: 19.99, stock: 50 });
  const p3 = await Product.create({ sku: 'SKU-1003', name: 'Gadget C', price: 4.5, stock: 200 });

  const s1 = await Supplier.create({ name: 'Acme Supplies', contact: 'acme@example.com' });
  const s2 = await Supplier.create({ name: 'Global Parts', contact: 'contact@globalparts.com' });

  // Pending order
  const o1 = await Order.create({
    items: [
      { productId: p1._id, qty: 20, price: p1.price },
      { productId: p2._id, qty: 10, price: p2.price }
    ],
    supplierId: s1._id,
    status: 'pending'
  });

  // Received order — also increment stock now to reflect received status
  const o2 = await Order.create({
    items: [
      { productId: p3._id, qty: 50, price: p3.price }
    ],
    supplierId: s2._id,
    status: 'received',
    receivedAt: new Date()
  });
  p3.stock += 50; await p3.save();

  console.log('Seed complete.');
  console.log({
    products: [p1, p2, p3].map(p => ({ id: p._id, sku: p.sku, name: p.name })),
    suppliers: [s1, s2].map(s => ({ id: s._id, name: s.name })),
    orders: [o1, o2].map(o => ({ id: o._id, status: o.status }))
  });

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
