// ============================================================
// authRoutes.js
// ============================================================
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getMe, updateProfile, changePassword, toggleWishlist } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

router.post('/register', registerValidation, register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/wishlist/:productId', protect, toggleWishlist);

module.exports = router;
