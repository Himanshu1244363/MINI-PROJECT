// orderRoutes.js
const express = require('express');
const orderRouter = express.Router();
const { createOrder, getOrder, getMyOrders, markAsPaid, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

orderRouter.post('/', protect, createOrder);
orderRouter.get('/my', protect, getMyOrders);
orderRouter.get('/:id', protect, getOrder);
orderRouter.put('/:id/pay', protect, markAsPaid);
orderRouter.get('/', protect, adminOnly, getAllOrders);
orderRouter.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = orderRouter;
