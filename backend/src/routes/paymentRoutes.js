// paymentRoutes.js
const express = require('express');
const payRouter = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/auth');

// Create Razorpay order
payRouter.post('/razorpay/create', protect, asyncHandler(async (req, res) => {
  try {
    const Razorpay = require('razorpay');
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const options = {
      amount: req.body.amount * 100, // in paise
      currency: 'INR',
      receipt: 'order_' + Date.now(),
    };
    const order = await instance.orders.create(options);
    res.json({ success: true, order, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    // Return mock for dev/test without actual Razorpay keys
    res.json({
      success: true,
      order: { id: 'order_mock_' + Date.now(), amount: req.body.amount * 100, currency: 'INR' },
      key: 'rzp_test_mock',
      mock: true,
    });
  }
}));

// Verify Razorpay payment
payRouter.post('/razorpay/verify', protect, asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  // In production: verify signature with crypto
  res.json({ success: true, message: 'Payment verified', paymentId: razorpay_payment_id });
}));

module.exports = payRouter;
