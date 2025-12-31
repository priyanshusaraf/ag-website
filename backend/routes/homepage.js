const express = require('express');
const router = express.Router();
const AdminSettings = require('../models/adminSettings');

const HOMEPAGE_SETTINGS_KEY = 'homepage_lookbook_v1';

// Public endpoint for homepage content
router.get('/', async (req, res) => {
  try {
    const raw = await AdminSettings.get(HOMEPAGE_SETTINGS_KEY);
    if (!raw) return res.json(null);
    return res.json(JSON.parse(raw));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;





