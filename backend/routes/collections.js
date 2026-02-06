const express = require('express');
const router = express.Router();
const AdminSettings = require('../models/adminSettings');

const COLLECTIONS_SETTINGS_KEY = 'collections_data_v1';

// Endpoint to get hardcoded defaults (for import) - MUST be before /:slug
router.get('/defaults', async (req, res) => {
  // Return empty - frontend already has hardcoded defaults as fallback
  res.json({ collections: [] });
});

// Public endpoint for all collections
router.get('/', async (req, res) => {
  try {
    const raw = await AdminSettings.get(COLLECTIONS_SETTINGS_KEY);
    if (!raw) return res.json({ collections: [] });
    try {
      return res.json(JSON.parse(raw));
    } catch (e) {
      return res.json({ collections: [] });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get a specific collection by slug
router.get('/:slug', async (req, res) => {
  try {
    const raw = await AdminSettings.get(COLLECTIONS_SETTINGS_KEY);
    if (!raw) return res.status(404).json({ message: 'Collection not found' });

    const data = JSON.parse(raw);
    const collection = (data.collections || []).find((c) => c.slug === req.params.slug);
    if (!collection) return res.status(404).json({ message: 'Collection not found' });

    return res.json(collection);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
