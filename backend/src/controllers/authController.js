/**
 * Auth Controller
 * Register, Login, Profile management
 */

const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// ─── Helper: send token response ──────────────────────────────────────────
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id:    user._id,
      name:   user.name,
      email:  user.email,
      role:   user.role,
      avatar: user.avatar,
    },
  });
};

// ─── @desc   Register user
// ─── @route  POST /api/auth/register
// ─── @access Public
const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const user = await User.create({ name, email, password });
  sendTokenResponse(user, 201, res);
});

// ─── @desc   Login user
// ─── @route  POST /api/auth/login
// ─── @access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  if (!user.isActive) {
    return res.status(403).json({ success: false, message: 'Account has been deactivated' });
  }

  sendTokenResponse(user, 200, res);
});

// ─── @desc   Get current user profile
// ─── @route  GET /api/auth/me
// ─── @access Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('wishlist', 'name price images')
    .populate('viewedProducts.product', 'name price images');

  res.json({ success: true, user });
});

// ─── @desc   Update profile
// ─── @route  PUT /api/auth/profile
// ─── @access Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  );

  res.json({ success: true, user });
});

// ─── @desc   Change password
// ─── @route  PUT /api/auth/change-password
// ─── @access Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// ─── @desc   Toggle wishlist
// ─── @route  POST /api/auth/wishlist/:productId
// ─── @access Private
const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;

  const idx = user.wishlist.indexOf(productId);
  if (idx > -1) {
    user.wishlist.splice(idx, 1);
  } else {
    user.wishlist.push(productId);
  }
  await user.save();

  res.json({ success: true, wishlist: user.wishlist });
});

module.exports = { register, login, getMe, updateProfile, changePassword, toggleWishlist };
