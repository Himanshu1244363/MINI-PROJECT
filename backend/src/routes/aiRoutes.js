// aiRoutes.js
const express = require('express');
const aiRouter = express.Router();
const { getRecommendations, chatResponse, getTrending } = require('../controllers/aiController');
const { protect, optionalAuth } = require('../middleware/auth');

aiRouter.get('/recommendations', protect, getRecommendations);
aiRouter.post('/chat', chatResponse);
aiRouter.get('/trending', getTrending);

module.exports = aiRouter;
