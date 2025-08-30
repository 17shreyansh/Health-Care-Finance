const mongoose = require('mongoose');

const paymentSettingsSchema = new mongoose.Schema({
  qrCodeImage: { type: String, required: true },
  amount: { type: Number, default: 500 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('PaymentSettings', paymentSettingsSchema);