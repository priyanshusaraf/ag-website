const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payment');
const reviewRoutes = require('./routes/review');
const galleryRoutes = require('./routes/gallery');
const contactRoutes = require('./routes/contact');
const homepageRoutes = require('./routes/homepage');
const collectionsRoutes = require('./routes/collections');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors({
  origin: function (origin, callback) {
    const allowed = (process.env.FRONTEND_URL || 'http://localhost:3000')
      .split(',')
      .map(u => u.trim());

    // Allow requests with no origin (mobile apps, Postman, server-to-server, health checks)
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin} (allowed: ${allowed.join(', ')})`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Serve static files for uploaded images
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Lightweight endpoint for uptime monitors (UptimeRobot, cron-job.org, etc.)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/gallery-images', galleryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/collections', collectionsRoutes);

module.exports = app; 