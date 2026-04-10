const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
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
const wishlistRoutes = require('./routes/wishlist');
const couponRoutes = require('./routes/coupon');
const returnRoutes = require('./routes/return');

// Load environment variables
dotenv.config();

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: function (origin, callback) {
    const allowed = (process.env.FRONTEND_URL || 'http://localhost:3000')
      .split(',')
      .map(u => u.trim());

    // Reject requests with no origin in production to reduce credentialed misuse risk
    if (!origin) {
      if (process.env.NODE_ENV === 'production') {
        return callback(new Error('Origin required'));
      }
      return callback(null, true);
    }
    if (allowed.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Auth rate limiting — 20 attempts per 15 min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many requests from this IP. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

// Webhook must receive raw body for correct HMAC signature verification
// Mount BEFORE express.json() so this path gets the raw Buffer
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// Standard JSON parsing for all other routes
app.use(express.json());
app.use('/api', apiLimiter);

// Serve static files for uploaded images
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Lightweight endpoint for uptime monitors
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

app.use('/api/auth', authLimiter, authRoutes);
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
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/returns', returnRoutes);

module.exports = app; 