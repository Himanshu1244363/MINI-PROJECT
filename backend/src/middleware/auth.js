/**
 * Auth Middleware
 * JWT verification and role-based access control
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── Protect routes - verify JWT ──────────────────────────────────────────
const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header (Bearer token)
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please log in.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    // Attach user to request (exclude password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user || !req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or account deactivated.',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};

// ─── Admin-only middleware ─────────────────────────────────────────────────
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access forbidden. Admins only.',
    });
  }
  next();
};

// ─── Optional auth (doesn't fail if no token) ─────────────────────────────
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      req.user = await User.findById(decoded.id).select('-password');
    }
  } catch {
    // Silently ignore - user is just not authenticated
  }
  next();
};

module.exports = { protect, adminOnly, optionalAuth };
