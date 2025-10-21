const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 } // snapshot price when ordered
});

const OrderSchema = new mongoose.Schema({
  items: { type: [OrderItemSchema], required: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  status: { type: String, enum: ['pending','received','cancelled'], default: 'pending' },
  orderedAt: { type: Date, default: Date.now },
  receivedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
