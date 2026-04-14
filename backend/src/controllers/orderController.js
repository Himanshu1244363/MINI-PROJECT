/**
 * Order Controller
 * Create, retrieve, update orders
 */

const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

// ─── @desc   Create new order
// ─── @route  POST /api/orders
// ─── @access Private
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems?.length) {
    return res.status(400).json({ success: false, message: 'No order items' });
  }

  // Calculate prices & verify stock
  let itemsPrice = 0;
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
    if (product.stock < item.quantity) {
      return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
    }
    itemsPrice += product.price * item.quantity;
  }

  const taxPrice      = Math.round(itemsPrice * 0.18 * 100) / 100; // 18% GST
  const shippingPrice = itemsPrice > 499 ? 0 : 49;
  const totalPrice    = itemsPrice + taxPrice + shippingPrice;

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  // Update stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity, sold: item.quantity },
    });
  }

  res.status(201).json({ success: true, order });
});

// ─── @desc   Get order by ID
// ─── @route  GET /api/orders/:id
// ─── @access Private
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name images');

  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  // Allow only owner or admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  res.json({ success: true, order });
});

// ─── @desc   Get logged-in user's orders
// ─── @route  GET /api/orders/my
// ─── @access Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate('orderItems.product', 'name images');

  res.json({ success: true, orders });
});

// ─── @desc   Update order to paid
// ─── @route  PUT /api/orders/:id/pay
// ─── @access Private
const markAsPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  order.isPaid = true;
  order.paidAt = Date.now();
  order.orderStatus = 'confirmed';
  order.paymentResult = {
    id:         req.body.id,
    status:     req.body.status,
    updateTime: req.body.update_time,
    email:      req.body.email_address,
  };

  await order.save();
  res.json({ success: true, order });
});

// ─── @desc   Get all orders (admin)
// ─── @route  GET /api/orders
// ─── @access Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const query = status ? { orderStatus: status } : {};

  const total  = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .populate('user', 'name email');

  res.json({ success: true, orders, total });
});

// ─── @desc   Update order status (admin)
// ─── @route  PUT /api/orders/:id/status
// ─── @access Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus: status, ...(status === 'delivered' ? { isDelivered: true, deliveredAt: Date.now() } : {}) },
    { new: true }
  );
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, order });
});

module.exports = { createOrder, getOrder, getMyOrders, markAsPaid, getAllOrders, updateOrderStatus };
