/**
 * Order Model
 * Tracks complete order lifecycle from cart to delivery
 */

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     { type: String, required: true },
  image:    { type: String, required: true },
  price:    { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    street:  { type: String, required: true },
    city:    { type: String, required: true },
    state:   { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
    phone:   { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'stripe', 'cod'],
    required: true,
  },
  paymentResult: {
    id:         { type: String },
    status:     { type: String },
    updateTime: { type: String },
    email:      { type: String },
  },
  itemsPrice:    { type: Number, required: true, default: 0 },
  taxPrice:      { type: Number, required: true, default: 0 },
  shippingPrice: { type: Number, required: true, default: 0 },
  totalPrice:    { type: Number, required: true, default: 0 },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidAt: Date,
  isDelivered: {
    type: Boolean,
    default: false,
  },
  deliveredAt: Date,
  trackingNumber: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// ─── Generate order number ─────────────────────────────────────────────────
orderSchema.pre('save', function (next) {
  if (!this.trackingNumber && this.isNew) {
    this.trackingNumber = 'SW' + Date.now().toString(36).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
