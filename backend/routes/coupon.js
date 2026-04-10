const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateCoupon, getAllCoupons, createCoupon, updateCoupon, deleteCoupon } = require('../controllers/couponController');

// User routes
router.post('/validate', authenticateToken, validateCoupon);

// Admin routes
router.get('/admin', authenticateToken, requireAdmin, getAllCoupons);
router.post('/admin', authenticateToken, requireAdmin, createCoupon);
router.put('/admin/:id', authenticateToken, requireAdmin, updateCoupon);
router.delete('/admin/:id', authenticateToken, requireAdmin, deleteCoupon);

module.exports = router;
