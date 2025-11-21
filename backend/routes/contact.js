const express = require('express');
const router = express.Router();
const { sendContactForm } = require('../controllers/contactController');

// Contact form submission route
router.post('/send', sendContactForm);

module.exports = router;
