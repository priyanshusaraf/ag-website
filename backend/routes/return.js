const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { createReturnRequest, getUserReturnRequests, getAllReturnRequests, updateReturnStatus } = require('../controllers/returnController');

// Customer routes
router.post('/', authenticateToken, createReturnRequest);
router.get('/my', authenticateToken, getUserReturnRequests);

// Admin routes
router.get('/admin', authenticateToken, requireAdmin, getAllReturnRequests);
router.patch('/admin/:id', authenticateToken, requireAdmin, updateReturnStatus);

module.exports = router;
