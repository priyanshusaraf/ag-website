const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
const SaleBanner = require('../models/saleBanner');
const AdminSettings = require('../models/adminSettings');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const HOMEPAGE_SETTINGS_KEY = 'homepage_lookbook_v1';
// GALLERY IMAGES (Admin CRUD)
async function getAdminGalleryImages(req, res) {
  try {
    const images = await prisma.gallery_images.findMany({
      orderBy: { sort_order: 'asc' }
    });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function createAdminGalleryImage(req, res) {
  try {
    const { image_url, title, description, is_active = true, sort_order = 0 } = req.body;
    if (!image_url || !title) {
      return res.status(400).json({ message: 'image_url and title are required' });
    }
    const created = await prisma.gallery_images.create({
      data: { image_url, title, description, is_active, sort_order }
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function updateAdminGalleryImage(req, res) {
  const { id } = req.params;
  try {
    const { image_url, title, description, is_active, sort_order } = req.body;
    const updated = await prisma.gallery_images.update({
      where: { id: Number(id) },
      data: { image_url, title, description, is_active, sort_order }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function deleteAdminGalleryImage(req, res) {
  const { id } = req.params;
  try {
    await prisma.gallery_images.delete({ where: { id: Number(id) } });
    res.json({ message: 'Gallery image deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// ORDERS MANAGEMENT
async function getAllOrders(req, res) {
  try {
    const orders = await prisma.orders.findMany({
      include: {
        users: true,
        order_items: { include: { products: true } }
      },
      orderBy: { created_at: 'desc' }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function updateOrderStatus(req, res) {
  const { id } = req.params;
  const { status, trackingNumber, shippingDetails, carrier, estimatedDelivery, notes } = req.body;
  
  const validStatuses = ['pending', 'rejected', 'in_transit', 'completed', 'confirmed'];
  if (!status || !validStatuses.includes(status.trim())) {
    return res.status(400).json({ message: 'Invalid status. Must be: pending, rejected, in_transit, completed, or confirmed' });
  }
  
  if (status === 'in_transit' && (!trackingNumber || trackingNumber.trim() === '')) {
    return res.status(400).json({ message: 'Tracking number is required when status is in_transit' });
  }
  
  try {
    const order = await Order.updateStatus(id, status, trackingNumber);

    if (shippingDetails && shippingDetails.trim()) {
      let shippingBody = shippingDetails.trim();
      if (trackingNumber) shippingBody += `\nTracking Number: ${trackingNumber}`;
      if (carrier) shippingBody += `\nCarrier: ${carrier}`;
      if (estimatedDelivery) shippingBody += `\nEstimated Delivery: ${estimatedDelivery}`;

      await prisma.messages.create({
        data: {
          sender_name: 'Andre Garcia Cases',
          sender_email: 'abhik@andregarciacases.com',
          subject: `Shipping Update - Order #${id}`,
          body: shippingBody,
          type: 'shipping-update',
          is_admin: true,
          user_id: order.users?.id || order.user_id || null,
          order_id: Number(id),
        },
      });
    }

    if (notes && notes.trim()) {
      await prisma.orders.update({
        where: { id: Number(id) },
        data: { notes: notes.trim() },
      });
    }

    const updatedOrder = await prisma.orders.findUnique({
      where: { id: Number(id) },
      include: {
        users: true,
        order_items: { include: { products: true } },
      },
    });

    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// STATS AND ANALYTICS
async function getStats(req, res) {
  try {
    const totalOrders = await prisma.orders.count();
    const totalRevenue = await prisma.orders.aggregate({
      _sum: { total_amount: true }
    });
    
    const totalUsers = await prisma.users.count();
    const totalProducts = await prisma.products.count();
    const activeProducts = await prisma.products.count({
      where: { stock: { gt: 0 } }
    });
    
    // Last 7 days revenue
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentRevenue = await prisma.orders.aggregate({
      where: {
        created_at: { gte: sevenDaysAgo }
      },
      _sum: { total_amount: true }
    });

    // Orders per day for last 7 days
    const ordersPerDay = await prisma.orders.groupBy({
      by: ['created_at'],
      _count: { id: true },
      where: {
        created_at: { gte: sevenDaysAgo }
      },
      orderBy: { created_at: 'asc' }
    });

    // Order status distribution
    const orderStatusStats = await prisma.orders.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    // Monthly revenue for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyRevenue = await prisma.orders.groupBy({
      by: ['created_at'],
      _sum: { total_amount: true },
      _count: { id: true },
      where: {
        created_at: { gte: sixMonthsAgo },
        status: { not: 'rejected' } // Only count non-rejected orders
      },
      orderBy: { created_at: 'asc' }
    });

    // Process monthly revenue data
    const monthlyRevenueData = {};
    monthlyRevenue.forEach(item => {
      const date = new Date(item.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyRevenueData[monthKey]) {
        monthlyRevenueData[monthKey] = { revenue: 0, orders: 0 };
      }
      
      monthlyRevenueData[monthKey].revenue += parseFloat(item._sum.total_amount || 0);
      monthlyRevenueData[monthKey].orders += item._count.id;
    });

    // Order status for fulfillment tracking
    const pendingOrders = await prisma.orders.count({ where: { status: 'pending' } });
    const confirmedOrders = await prisma.orders.count({ where: { status: 'confirmed' } });
    const inTransitOrders = await prisma.orders.count({ where: { status: 'in_transit' } });
    const completedOrders = await prisma.orders.count({ where: { status: 'completed' } });

    res.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.total_amount || 0,
      recentRevenue: recentRevenue._sum.total_amount || 0,
      totalUsers,
      totalProducts,
      activeProducts,
      ordersPerDay,
      orderStatusStats,
      monthlyRevenueData,
      fulfillmentStats: {
        pending: pendingOrders,
        confirmed: confirmedOrders,
        inTransit: inTransitOrders,
        completed: completedOrders
      },
      pendingOrders,
      totalCompletedOrders: completedOrders
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// USERS MANAGEMENT
async function getAllUsers(req, res) {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        is_admin: true,
        created_at: true,
        _count: {
          select: {
            orders: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    await User.remove(id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    if (err.message.includes('has') && err.message.includes('existing orders')) {
      res.status(400).json({ 
        message: 'Cannot delete user', 
        error: err.message,
        code: 'FOREIGN_KEY_CONSTRAINT'
      });
    } else if (err.message.includes('User not found')) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
}

// PRODUCTS MANAGEMENT
async function getAllProducts(req, res) {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function createProduct(req, res) {
  try {
    console.log('Creating product with data:', req.body);
    const productData = req.body;
    const product = await Product.create(productData);
    console.log('Product created successfully:', product);
    res.status(201).json(product);
  } catch (err) {
    console.error('Product creation error:', err);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function updateProduct(req, res) {
  const { id } = req.params;
  try {
    const productData = req.body;
    const product = await Product.update(id, productData);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
    const result = await Product.remove(id);
    
    if (result.soft_deleted) {
      res.json({ 
        message: 'Product archived successfully', 
        details: 'Product had order history and was marked as deleted but preserved for order records.',
        type: 'soft_delete'
      });
    } else {
      res.json({ 
        message: 'Product deleted successfully',
        type: 'hard_delete'
      });
    }
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function setProductFeatured(req, res) {
  const { id } = req.params;
  const { is_featured } = req.body;
  try {
    const product = await Product.setFeatured(id, is_featured);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function setProductNew(req, res) {
  const { id } = req.params;
  const { is_new } = req.body;
  try {
    const product = await Product.setNew(id, is_new);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function setProductSale(req, res) {
  const { id } = req.params;
  const saleData = req.body;
  try {
    const product = await Product.setSale(id, saleData);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// SALE BANNERS MANAGEMENT
async function getAllSaleBanners(req, res) {
  try {
    const banners = await SaleBanner.getAll();
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function createSaleBanner(req, res) {
  try {
    const bannerData = req.body;
    const banner = await SaleBanner.create(bannerData);
    res.status(201).json(banner);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function updateSaleBanner(req, res) {
  const { id } = req.params;
  try {
    const bannerData = req.body;
    const banner = await SaleBanner.update(id, bannerData);
    res.json(banner);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function deleteSaleBanner(req, res) {
  const { id } = req.params;
  try {
    await SaleBanner.remove(id);
    res.json({ message: 'Sale banner deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function setSaleBannerActive(req, res) {
  const { id } = req.params;
  const { is_active } = req.body;
  try {
    const banner = await SaleBanner.setActive(id, is_active);
    res.json(banner);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// Legacy function for compatibility
async function updateProductStock(req, res) {
  const { id } = req.params;
  const { stock } = req.body;
  if (typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ message: 'Invalid stock value' });
  }
  try {
    const product = await Product.update(id, { stock });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// HERO IMAGES MANAGEMENT
async function getHeroImages(req, res) {
  try {
    const heroImages = await AdminSettings.get('hero_images');
    const images = heroImages ? JSON.parse(heroImages) : [];
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function updateHeroImages(req, res) {
  try {
    const { images } = req.body;
    await AdminSettings.set('hero_images', JSON.stringify(images));
    res.json({ message: 'Hero images updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// IMAGE UPLOAD FUNCTIONS
async function uploadProductImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    
    const imageUrl = `/uploads/products/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function uploadBannerImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    
    const imageUrl = `/uploads/banners/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function uploadHeroImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    
    const imageUrl = `/uploads/hero/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function uploadHomepageImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const imageUrl = `/uploads/homepage/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function uploadCollectionImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    
    const imageUrl = `/uploads/collections/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// COLLECTIONS MANAGEMENT
const COLLECTIONS_SETTINGS_KEY = 'collections_data_v1';

async function getCollections(req, res) {
  try {
    const raw = await AdminSettings.get(COLLECTIONS_SETTINGS_KEY);
    if (!raw) return res.json({ collections: [] });
    try {
      return res.json(JSON.parse(raw));
    } catch (e) {
      return res.status(500).json({ message: 'Collections data is invalid JSON', error: e.message });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function updateCollections(req, res) {
  try {
    const { collections } = req.body || {};
    if (!Array.isArray(collections)) {
      return res.status(400).json({ message: 'collections must be an array' });
    }

    const serialized = JSON.stringify({ collections });
    if (serialized.length > 2_000_000) {
      return res.status(413).json({ message: 'Collections data is too large' });
    }

    await AdminSettings.set(COLLECTIONS_SETTINGS_KEY, serialized);

    // ── Sync collection products into the products DB table ──
    try {
      await syncCollectionProducts(collections);
    } catch (syncErr) {
      console.error('Product sync warning (collections saved but product sync had issues):', syncErr.message);
      // Don't fail the whole request if sync has issues
    }

    res.json({ message: 'Collections updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

/**
 * Sync collection products to the products DB table so they appear in
 * the Products tab and on the public /products page.
 *
 * - Uses `category` = collection slug to identify collection products.
 * - Creates missing products, updates existing ones (name, price, image, description).
 * - Removes DB products whose collection/product no longer exists.
 */
async function syncCollectionProducts(collections) {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  try {
    // Collect all collection slugs
    const collectionSlugs = collections.map((c) => c.slug).filter(Boolean);

    // Get existing DB products that belong to collections
    const existingProducts = await prisma.products.findMany({
      where: {
        category: { in: collectionSlugs },
        NOT: { name: { startsWith: '[DELETED]' } },
      },
    });

    // Build a lookup: `${category}::${name}` → DB product
    const existingMap = new Map();
    for (const p of existingProducts) {
      existingMap.set(`${p.category}::${p.name}`, p);
    }

    // Track which DB product IDs we've matched to avoid deleting them
    const matchedIds = new Set();

    for (const col of collections) {
      if (!col.slug || !Array.isArray(col.products)) continue;

      for (const cp of col.products) {
        if (!cp.name) continue;

        const key = `${col.slug}::${cp.name}`;
        const existing = existingMap.get(key);
        const imageUrl = Array.isArray(cp.images) && cp.images.length > 0 ? cp.images[0] : null;

        if (existing) {
          // Update only the fields that come from collection data
          matchedIds.add(existing.id);
          await prisma.products.update({
            where: { id: existing.id },
            data: {
              price: parseFloat(cp.basePrice) || 0,
              image_url: imageUrl,
              description: cp.description || existing.description,
            },
          });
        } else {
          // Create a new product
          const newProd = await prisma.products.create({
            data: {
              name: cp.name,
              price: parseFloat(cp.basePrice) || 0,
              image_url: imageUrl,
              description: cp.description || null,
              category: col.slug,
              quality: cp.availability || null,
              stock: 99, // Default available
              rating: 0,
              reviews: 0,
            },
          });
          matchedIds.add(newProd.id);
        }
      }
    }

    // Remove DB products that belong to these collection slugs but are no longer in the data
    const toRemoveIds = existingProducts
      .filter((p) => !matchedIds.has(p.id))
      .map((p) => p.id);

    if (toRemoveIds.length > 0) {
      // Soft-delete to preserve order history
      for (const id of toRemoveIds) {
        const orderItems = await prisma.order_items.findMany({ where: { product_id: id } });
        if (orderItems.length > 0) {
          const prod = await prisma.products.findUnique({ where: { id } });
          await prisma.products.update({
            where: { id },
            data: { name: `[DELETED] ${prod.name}`, stock: 0 },
          });
        } else {
          // Safe to delete reviews first, then product
          await prisma.reviews.deleteMany({ where: { product_id: id } });
          await prisma.products.delete({ where: { id } });
        }
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

async function getPublicCollections(req, res) {
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
}

async function getHomepageContent(req, res) {
  try {
    const raw = await AdminSettings.get(HOMEPAGE_SETTINGS_KEY);
    if (!raw) return res.json(null);
    try {
      return res.json(JSON.parse(raw));
    } catch (e) {
      // If data is corrupted, don't break the admin UI
      return res.status(500).json({ message: 'Homepage content is invalid JSON. Please reset it.', error: e.message });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function updateHomepageContent(req, res) {
  try {
    const { content } = req.body || {};
    if (!content || typeof content !== 'object') {
      return res.status(400).json({ message: 'content is required and must be an object' });
    }

    // Basic size guard to avoid storing huge blobs by mistake
    const serialized = JSON.stringify(content);
    if (serialized.length > 250_000) {
      return res.status(413).json({ message: 'Homepage content is too large' });
    }

    await AdminSettings.set(HOMEPAGE_SETTINGS_KEY, serialized);
    res.json({ message: 'Homepage content updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function resetHomepageContent(req, res) {
  try {
    await AdminSettings.remove(HOMEPAGE_SETTINGS_KEY);
    res.json({ message: 'Homepage content reset successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = {
  // Orders
  getAllOrders,
  updateOrderStatus,
  
  // Stats
  getStats,
  
  // Users
  getAllUsers,
  deleteUser,
  
  // Products
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  setProductFeatured,
  setProductNew,
  setProductSale,
  updateProductStock, // Legacy
  
  // Sale Banners
  getAllSaleBanners,
  createSaleBanner,
  updateSaleBanner,
  deleteSaleBanner,
  setSaleBannerActive,
  
  // Hero Images
  getHeroImages,
  updateHeroImages,
  
  // Image Uploads
  uploadProductImage,
  uploadBannerImage,
  uploadHeroImage,
  uploadHomepageImage,
  uploadCollectionImage,

  // Gallery Images (Admin)
  getAdminGalleryImages,
  createAdminGalleryImage,
  updateAdminGalleryImage,
  deleteAdminGalleryImage,

  // Collections
  getCollections,
  updateCollections,
  getPublicCollections,

  // Homepage CMS
  getHomepageContent,
  updateHomepageContent,
  resetHomepageContent
}; 