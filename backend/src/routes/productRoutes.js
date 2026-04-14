const express = require('express');
const router = express.Router();
const {
  getProducts, getProduct, getSuggestions, createProduct,
  updateProduct, deleteProduct, addReview, getCategories,
} = require('../controllers/productController');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

router.get('/categories', getCategories);
router.get('/suggestions', getSuggestions);
router.get('/', getProducts);
router.get('/:id', optionalAuth, getProduct);
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
