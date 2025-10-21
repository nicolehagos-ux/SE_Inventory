const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  contact: { type: String, trim: true, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Supplier', SupplierSchema);
