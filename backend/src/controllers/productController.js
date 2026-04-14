/**
 * Product Controller
 * CRUD, search, filters, reviews
 */

const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const User = require('../models/User');

// ─── @desc   Get all products with filters/search/pagination
// ─── @route  GET /api/products
// ─── @access Public
const getProducts = asyncHandler(async (req, res) => {
  const {
    keyword, category, brand, minPrice, maxPrice,
    rating, sort, page = 1, limit = 12, featured,
  } = req.query;

  // Build query
  const query = { isActive: true };

  // ✅ Sirf name, brand aur tags mein search — relevant results aayenge
  if (keyword) {
    const searchRegex = new RegExp(keyword, 'i');
    query.$or = [
      { name:  { $regex: searchRegex } },
      { brand: { $regex: searchRegex } },
      { tags:  { $in: [searchRegex] } },
    ];
  }

  if (category)  query.category = new RegExp(category, 'i');
  if (brand)     query.brand = new RegExp(brand, 'i');
  if (featured)  query.isFeatured = true;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (rating) query.rating = { $gte: Number(rating) };

  // Sort options
  const sortOptions = {
    newest:     { createdAt: -1 },
    oldest:     { createdAt: 1 },
    price_asc:  { price: 1 },
    price_desc: { price: -1 },
    rating:     { rating: -1 },
    popular:    { sold: -1 },
  };
  const sortBy = sortOptions[sort] || sortOptions.newest;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(query);

  const products = await Product.find(query)
    .sort(sortBy)
    .skip(skip)
    .limit(Number(limit))
    .select('-reviews');

  res.json({
    success: true,
    products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// ─── @desc   Get single product
// ─── @route  GET /api/products/:id
// ─── @access Public
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    $or: [
      { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
      { slug: req.params.id }
    ],
    isActive: true,
  }).populate('reviews.user', 'name avatar');

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Track view for recommendations
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        viewedProducts: {
          $each: [{ product: product._id }],
          $slice: -20,
        },
      },
    });
  }

  res.json({ success: true, product });
});

// ─── @desc   Get search suggestions (navbar dropdown)
// ─── @route  GET /api/products/suggestions
// ─── @access Public
const getSuggestions = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json({ success: true, suggestions: [] });

  const searchRegex = new RegExp(q, 'i');

  const products = await Product.find({
    $or: [
      { name:  { $regex: searchRegex } },
      { brand: { $regex: searchRegex } },
      { tags:  { $in: [searchRegex] } },
    ],
    isActive: true,
  }).select('name category images price brand').limit(8);

  res.json({ success: true, suggestions: products });
});

// ─── @desc   Create product (admin)
// ─── @route  POST /api/products
// ─── @access Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({ ...req.body });
  res.status(201).json({ success: true, product });
});

// ─── @desc   Update product (admin)
// ─── @route  PUT /api/products/:id
// ─── @access Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  });
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, product });
});

// ─── @desc   Delete product (admin)
// ─── @route  DELETE /api/products/:id
// ─── @access Admin
const deleteProduct = asyncHandler(async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Product removed successfully' });
});

// ─── @desc   Add review
// ─── @route  POST /api/products/:id/reviews
// ─── @access Private
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

  const alreadyReviewed = product.reviews.find(
    r => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    return res.status(400).json({ success: false, message: 'You already reviewed this product' });
  }

  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ success: true, message: 'Review added' });
});

// ─── @desc   Get categories list
// ─── @route  GET /api/products/categories
// ─── @access Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category', { isActive: true });
  res.json({ success: true, categories });
});

module.exports = {
  getProducts, getProduct, getSuggestions, createProduct,
  updateProduct, deleteProduct, addReview, getCategories,
};