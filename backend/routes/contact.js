const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const {
  sendContactForm,
  getMessages,
  markMessageRead,
  replyToMessage,
  getUserMessages,
  sendShippingUpdate,
} = require('../controllers/contactController');

router.post('/send', sendContactForm);

router.get('/messages', authenticateToken, requireAdmin, getMessages);
router.patch('/messages/:id/read', authenticateToken, requireAdmin, markMessageRead);
router.post('/messages/:id/reply', authenticateToken, requireAdmin, replyToMessage);

router.post('/shipping-update', authenticateToken, requireAdmin, sendShippingUpdate);

router.get('/user-messages', authenticateToken, getUserMessages);

module.exports = router;
