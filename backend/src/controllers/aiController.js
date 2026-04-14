/**
 * AI Controller
 * Recommendation engine and chatbot responses
 */

const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

// ─── @desc   Get personalized recommendations
// ─── @route  GET /api/ai/recommendations
// ─── @access Private
const getRecommendations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Fetch user with viewed products
  const user = await User.findById(userId).populate('viewedProducts.product', 'category tags');

  // Collect category & tag preferences from viewed products
  const categoryCount = {};
  const tagSet = new Set();

  user.viewedProducts.forEach(({ product }) => {
    if (!product) return;
    categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    product.tags?.forEach(t => tagSet.add(t));
  });

  // Top preferred category
  const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0];

  // Build recommendation query
  const viewedIds = user.viewedProducts.map(v => v.product?._id).filter(Boolean);

  let recommended = [];

  if (topCategory) {
    // Category-based recommendations (exclude already viewed)
    recommended = await Product.find({
      category: topCategory,
      _id: { $nin: viewedIds },
      isActive: true,
    }).sort({ rating: -1, sold: -1 }).limit(8).select('-reviews');
  }

  // Fill remaining with popular items
  if (recommended.length < 8) {
    const extra = await Product.find({
      _id: { $nin: [...viewedIds, ...recommended.map(p => p._id)] },
      isActive: true,
    }).sort({ sold: -1, rating: -1 }).limit(8 - recommended.length).select('-reviews');
    recommended = [...recommended, ...extra];
  }

  res.json({
    success: true,
    recommendations: recommended,
    basis: topCategory ? `Based on your interest in ${topCategory}` : 'Popular products you might like',
  });
});

// ─── @desc   Chatbot response (rule-based AI)
// ─── @route  POST /api/ai/chat
// ─── @access Public
const chatResponse = asyncHandler(async (req, res) => {
  const { message, sessionId } = req.body;
  const lowerMsg = message.toLowerCase();

  // Rule-based responses
  const responses = {
    greeting: {
      patterns: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'greet'],
      response: "Hello! 👋 Welcome to ShopWave! I'm your AI shopping assistant. How can I help you today?",
    },
    orders: {
      patterns: ['order', 'track', 'delivery', 'shipped', 'package', 'where is my'],
      response: "To track your order, go to **My Account → Orders** and you'll see the real-time status. You can also find your tracking number there. Need more help?",
    },
    return: {
      patterns: ['return', 'refund', 'cancel', 'exchange', 'money back'],
      response: "We have a **7-day return policy** on most items. To initiate a return:\n1. Go to My Orders\n2. Select the order\n3. Click 'Return/Refund'\n\nRefunds are processed within 3-5 business days.",
    },
    payment: {
      patterns: ['payment', 'pay', 'card', 'upi', 'razorpay', 'stripe', 'cod', 'cash'],
      response: "We accept multiple payment methods:\n• **Cards** (Visa, Mastercard, Amex)\n• **UPI** (via Razorpay)\n• **Net Banking**\n• **Cash on Delivery** (available for orders under ₹5000)\n\nAll payments are 100% secure.",
    },
    shipping: {
      patterns: ['shipping', 'delivery time', 'fast', 'express', 'free delivery', 'free shipping'],
      response: "Shipping details:\n• **Free delivery** on orders above ₹499\n• Standard delivery: 3-5 business days\n• Express delivery: 1-2 business days (₹99 extra)\n• Same-day delivery available in select cities",
    },
    discount: {
      patterns: ['coupon', 'discount', 'offer', 'promo', 'code', 'deal', 'sale'],
      response: "Current offers:\n• Use **FIRST10** for 10% off on first order\n• **SAVE20** for 20% off on orders above ₹1000\n• Check our **Sale** section for up to 70% off!\n\nAll offers are auto-applied at checkout.",
    },
    product: {
      patterns: ['product', 'recommend', 'suggest', 'best', 'top', 'popular', 'trending'],
      response: "Check out our **Trending** section on the homepage! I can also show personalized recommendations based on your browsing history when you're logged in. What category are you interested in?",
    },
    account: {
      patterns: ['account', 'login', 'register', 'sign up', 'password', 'forgot', 'profile'],
      response: "For account-related issues:\n• **Forgot password**: Click 'Forgot Password' on the login page\n• **Update profile**: Go to My Account → Profile\n• **Security**: We recommend enabling 2FA for your account\n\nNeed further help?",
    },
    bye: {
      patterns: ['bye', 'goodbye', 'thanks', 'thank you', 'that\'s all'],
      response: "You're welcome! Happy shopping at ShopWave! 🛍️ Feel free to reach out anytime.",
    },
  };

  // Find matching response
  let botResponse = null;
  for (const [key, data] of Object.entries(responses)) {
    if (data.patterns.some(p => lowerMsg.includes(p))) {
      botResponse = data.response;
      break;
    }
  }

  // Default fallback
  if (!botResponse) {
    botResponse = "I'm not sure I understand that. You can ask me about:\n• **Orders & tracking**\n• **Returns & refunds**\n• **Payment methods**\n• **Shipping & delivery**\n• **Discounts & offers**\n\nOr contact our support team at support@shopwave.in";
  }

  // Simulate slight delay for realism
  await new Promise(r => setTimeout(r, 300 + Math.random() * 400));

  res.json({
    success: true,
    message: botResponse,
    timestamp: new Date().toISOString(),
  });
});

// ─── @desc   Get trending products
// ─── @route  GET /api/ai/trending
// ─── @access Public
const getTrending = asyncHandler(async (req, res) => {
  const trending = await Product.find({ isActive: true })
    .sort({ sold: -1, rating: -1 })
    .limit(10)
    .select('-reviews');

  res.json({ success: true, trending });
});

module.exports = { getRecommendations, chatResponse, getTrending };
