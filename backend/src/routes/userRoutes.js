// userRoutes.js
const express = require('express');
const userRouter = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const asyncHandler = require('express-async-handler');

// Admin: get all users
userRouter.get('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ success: true, users });
}));

// Admin: update user role
userRouter.put('/:id/role', protect, adminOnly, asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
  res.json({ success: true, user });
}));

// Admin: deactivate user
userRouter.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'User deactivated' });
}));

module.exports = userRouter;
