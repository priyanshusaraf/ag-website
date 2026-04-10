const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { productUpload, bannerUpload, heroUpload, homepageUpload, collectionUpload } = require('../middleware/upload');
const adminController = require('../controllers/adminController');
const auditLog = require('../middleware/auditLog');

// All routes below require admin authentication
router.use(authenticateToken, requireAdmin);

// ORDERS MANAGEMENT
router.get('/orders', adminController.getAllOrders);
router.patch('/orders/:id', auditLog('UPDATE_ORDER_STATUS', 'order'), adminController.updateOrderStatus);

// STATS AND ANALYTICS
router.get('/stats', adminController.getStats);

// USERS MANAGEMENT
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);

// PRODUCTS MANAGEMENT
router.get('/products', adminController.getAllProducts);
router.post('/products', auditLog('CREATE_PRODUCT', 'product', () => null), adminController.createProduct);
router.put('/products/:id', auditLog('UPDATE_PRODUCT', 'product'), adminController.updateProduct);
router.delete('/products/:id', auditLog('DELETE_PRODUCT', 'product'), adminController.deleteProduct);
router.patch('/products/:id/featured', auditLog('SET_FEATURED', 'product'), adminController.setProductFeatured);
router.patch('/products/:id/new', auditLog('SET_NEW', 'product'), adminController.setProductNew);
router.patch('/products/:id/sale', auditLog('SET_SALE', 'product'), adminController.setProductSale);
router.patch('/products/:id/stock', auditLog('UPDATE_STOCK', 'product'), adminController.updateProductStock);

// AUDIT LOG
router.get('/audit-logs', adminController.getAuditLogs);

// COUPONS MANAGEMENT
router.get('/coupons', adminController.getAllCoupons);
router.post('/coupons', auditLog('CREATE_COUPON', 'coupon', () => null), adminController.createCoupon);
router.put('/coupons/:id', auditLog('UPDATE_COUPON', 'coupon'), adminController.updateCoupon);
router.delete('/coupons/:id', auditLog('DELETE_COUPON', 'coupon'), adminController.deleteCoupon);

// RETURNS MANAGEMENT
router.get('/returns', adminController.getAllReturnRequests);
router.patch('/returns/:id', auditLog('UPDATE_RETURN', 'return_request'), adminController.updateReturnStatus);

// BAN/UNBAN USER
router.patch('/users/:id/ban', auditLog('BAN_USER', 'user'), adminController.banUser);
router.patch('/users/:id/unban', auditLog('UNBAN_USER', 'user'), adminController.unbanUser);

// SALE BANNERS MANAGEMENT
router.get('/sale-banners', adminController.getAllSaleBanners);
router.post('/sale-banners', adminController.createSaleBanner);
router.put('/sale-banners/:id', adminController.updateSaleBanner);
router.delete('/sale-banners/:id', adminController.deleteSaleBanner);
router.patch('/sale-banners/:id/active', adminController.setSaleBannerActive);

// HERO IMAGES MANAGEMENT
router.get('/hero-images', adminController.getHeroImages);
router.put('/hero-images', adminController.updateHeroImages);

// GALLERY IMAGES MANAGEMENT
router.get('/gallery-images', adminController.getAdminGalleryImages);
router.post('/gallery-images', adminController.createAdminGalleryImage);
router.put('/gallery-images/:id', adminController.updateAdminGalleryImage);
router.delete('/gallery-images/:id', adminController.deleteAdminGalleryImage);

// IMAGE UPLOAD ROUTES
router.post('/upload/product-image', productUpload, adminController.uploadProductImage);
router.post('/upload/banner-image', bannerUpload, adminController.uploadBannerImage);
router.post('/upload/hero-image', heroUpload, adminController.uploadHeroImage);
router.post('/upload/homepage-image', homepageUpload, adminController.uploadHomepageImage);
router.post('/upload/collection-image', collectionUpload, adminController.uploadCollectionImage);

// COLLECTIONS MANAGEMENT
router.get('/collections', adminController.getCollections);
router.put('/collections', adminController.updateCollections);

module.exports = router; 