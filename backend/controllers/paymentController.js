const Razorpay = require('razorpay');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const emailService = require('../services/emailService');

const prisma = new PrismaClient();

// International shipping: flat $75 USD converted to INR using the same rate as frontend
const INTERNATIONAL_SHIPPING_USD = 75;
const USD_TO_INR_RATE = 1 / 0.012; // inverse of frontend CurrencyContext rate
const INTERNATIONAL_SHIPPING_INR = Math.round(INTERNATIONAL_SHIPPING_USD * USD_TO_INR_RATE);

// Initialize Razorpay (you'll need to add these to your .env file)
let razorpay = null;

// Check if Razorpay credentials are properly configured
const isRazorpayConfigured = () => {
  return process.env.RAZORPAY_KEY_ID && 
         process.env.RAZORPAY_KEY_SECRET && 
         process.env.RAZORPAY_KEY_ID !== 'your-razorpay-key-id' && 
         process.env.RAZORPAY_KEY_SECRET !== 'your-razorpay-key-secret';
};

// Initialize Razorpay only if credentials are configured
if (isRazorpayConfigured()) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log('✅ Razorpay payment gateway initialized successfully');
} else {
  console.log('⚠️  Razorpay payment gateway: Using placeholder credentials. Please configure real Razorpay credentials in .env file');
}

// Create Razorpay order
const createOrder = async (req, res) => {
  try {
    const { currency = 'INR', items, shipping_address, country } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Items are required' });
    }

    // Server-side price recalculation and stock check
    let verifiedTotal = 0;
    const verifiedItems = [];
    for (const item of items) {
      const product = await prisma.products.findUnique({ where: { id: item.product_id } });
      if (!product) {
        return res.status(400).json({
          message: `Product #${item.product_id} not found. Please refresh your cart and try again.`,
        });
      }
      if (product.stock !== null && product.stock < item.quantity) {
        return res.status(400).json({
          message: `"${product.name}" is out of stock or has insufficient quantity (available: ${product.stock}).`,
        });
      }
      const unitPrice = parseFloat(product.sale_price || product.price);
      verifiedTotal += unitPrice * item.quantity;
      verifiedItems.push({ ...item, verifiedPrice: unitPrice });
    }
    verifiedTotal = Math.round(verifiedTotal * 100) / 100;

    // Determine international shipping
    const isInternational = country && country.trim().toLowerCase() !== 'india';
    const shippingChargeINR = isInternational ? INTERNATIONAL_SHIPPING_INR : 0;
    const grandTotalINR = Math.round((verifiedTotal + shippingChargeINR) * 100) / 100;

    if (!razorpay) {
      return res.status(503).json({ 
        message: 'Payment gateway not configured. Please contact administrator.',
        error: 'Razorpay credentials not set up'
      });
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { name: true, email: true, phone: true },
    });

    const options = {
      amount: Math.round(grandTotalINR * 100), // Razorpay expects amount in paise (integer)
      currency,
      receipt: `order_${Date.now()}_${userId}`,
      notes: {
        user_id: userId.toString(),
        customer_name: user?.name || '',
        customer_email: user?.email || '',
        customer_phone: user?.phone || '',
        item_count: items.length.toString(),
        shipping_address: (shipping_address || '').substring(0, 256),
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create order in database
    const order = await prisma.orders.create({
      data: {
        user_id: userId,
        total_amount: grandTotalINR,
        shipping_charge: shippingChargeINR,
        status: 'pending',
        payment_status: 'pending',
        order_id_razorpay: razorpayOrder.id,
        shipping_address: shipping_address || null,
        order_items: {
          create: verifiedItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_purchase: item.verifiedPrice,
            customization_details: item.customization ? JSON.stringify(item.customization) : null,
          })),
        },
      },
      include: {
        order_items: {
          include: {
            products: true,
          },
        },
      },
    });

    res.json({
      success: true,
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      order: order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

// Verify payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Check if Razorpay is configured
    if (!razorpay) {
      return res.status(503).json({ 
        message: 'Payment gateway not configured. Please contact administrator.',
        error: 'Razorpay credentials not set up'
      });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // First find the order by razorpay order ID
    const existingOrder = await prisma.orders.findFirst({
      where: { order_id_razorpay: razorpay_order_id },
    });

    if (!existingOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order in database using the found order's ID
    const order = await prisma.orders.update({
      where: { id: existingOrder.id },
      data: {
        payment_id: razorpay_payment_id,
        payment_status: 'completed',
        status: 'confirmed',
        updated_at: new Date(),
      },
      include: {
        order_items: {
          include: {
            products: true,
          },
        },
        users: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Update product stock
    for (const item of order.order_items) {
      await prisma.products.update({
        where: { id: item.product_id },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Clear user's cart
    await prisma.cart_items.deleteMany({
      where: {
        carts: {
          user_id: order.user_id,
        },
      },
    });

    // Create in-app notification for the customer
    try {
      await prisma.notifications.create({
        data: {
          user_id: order.user_id,
          message: `Your payment for Order #${order.id} has been confirmed! We're preparing your order.`,
          read: false,
        },
      });
    } catch (notifErr) {
      console.error('Failed to create payment notification:', notifErr);
    }

    // Send emails (non-blocking — don't fail the response if email fails)
    const customerName = order.users?.name || 'Customer';
    const customerEmail = order.users?.email;
    if (customerEmail) {
      emailService.sendOrderConfirmation(customerEmail, customerName, order).catch((e) =>
        console.error('Order confirmation email failed:', e.message)
      );
      emailService.sendNewOrderAdminAlert(order, customerName, customerEmail).catch((e) =>
        console.error('Admin new-order alert email failed:', e.message)
      );
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      order: order,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const orders = await prisma.orders.findMany({
      where: { user_id: userId },
      include: {
        order_items: {
          include: {
            products: {
              select: {
                id: true,
                name: true,
                image_url: true,
                category: true,
                description: true,
                size: true,
                quality: true,
                capacity: true,
                stock: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
      skip: offset,
      take: limit,
    });

    const totalOrders = await prisma.orders.count({
      where: { user_id: userId },
    });

    res.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total: totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
      },
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

// Get single order details
const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await prisma.orders.findFirst({
      where: {
        id: parseInt(orderId),
        user_id: userId,
      },
      include: {
        order_items: {
          include: {
            products: true,
          },
        },
        users: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({ message: 'Failed to fetch order details', error: error.message });
  }
};

// Admin: Get all orders
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status;

    const where = status ? { status } : {};

    const orders = await prisma.orders.findMany({
      where,
      include: {
        order_items: {
          include: {
            products: {
              select: {
                id: true,
                name: true,
                image_url: true,
                category: true,
                description: true,
                size: true,
                quality: true,
                capacity: true,
              },
            },
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
      skip: offset,
      take: limit,
    });

    const totalOrders = await prisma.orders.count({ where });

    // Get revenue statistics
    const revenueStats = await prisma.orders.aggregate({
      where: { payment_status: 'completed' },
      _sum: {
        total_amount: true,
      },
      _count: true,
    });

    res.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total: totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
      },
      stats: {
        totalRevenue: revenueStats._sum.total_amount || 0,
        totalCompletedOrders: revenueStats._count,
      },
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};



// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Total revenue
    const totalRevenue = await prisma.orders.aggregate({
      where: { payment_status: 'completed' },
      _sum: { total_amount: true },
    });

    // Monthly revenue
    const monthlyRevenue = await prisma.orders.aggregate({
      where: {
        payment_status: 'completed',
        created_at: { gte: startOfMonth },
      },
      _sum: { total_amount: true },
    });

    // Daily revenue
    const dailyRevenue = await prisma.orders.aggregate({
      where: {
        payment_status: 'completed',
        created_at: { gte: startOfDay },
      },
      _sum: { total_amount: true },
    });

    // Order counts by status
    const orderStats = await prisma.orders.groupBy({
      by: ['status'],
      _count: true,
    });

    // Pending orders count
    const pendingOrders = await prisma.orders.count({
      where: { status: 'pending' },
    });

    res.json({
      success: true,
      stats: {
        totalRevenue: totalRevenue._sum.total_amount || 0,
        monthlyRevenue: monthlyRevenue._sum.total_amount || 0,
        dailyRevenue: dailyRevenue._sum.total_amount || 0,
        pendingOrders,
        orderStats: orderStats.reduce((acc, stat) => {
          acc[stat.status] = stat._count;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
  }
};

// Razorpay Webhook handler (payment.captured, payment.failed, etc.)
const handleWebhook = async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Webhook received but RAZORPAY_WEBHOOK_SECRET is not configured');
    return res.status(500).json({ message: 'Webhook secret not configured' });
  }

  const signature = req.headers['x-razorpay-signature'];
  if (!signature) {
    return res.status(400).json({ message: 'Missing webhook signature' });
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (expectedSignature !== signature) {
    console.error('Webhook signature verification failed');
    return res.status(400).json({ message: 'Invalid webhook signature' });
  }

  const event = req.body.event;
  const payment = req.body.payload?.payment?.entity;

  if (!payment) {
    return res.status(200).json({ status: 'ok', message: 'No payment entity in payload' });
  }

  try {
    const razorpayOrderId = payment.order_id;

    if (event === 'payment.captured') {
      const existingOrder = await prisma.orders.findFirst({
        where: { order_id_razorpay: razorpayOrderId },
      });

      if (existingOrder && existingOrder.payment_status !== 'completed') {
        await prisma.orders.update({
          where: { id: existingOrder.id },
          data: {
            payment_id: payment.id,
            payment_status: 'completed',
            status: 'confirmed',
            updated_at: new Date(),
          },
        });

        const order = await prisma.orders.findUnique({
          where: { id: existingOrder.id },
          include: { order_items: true },
        });

        if (order) {
          for (const item of order.order_items) {
            await prisma.products.update({
              where: { id: item.product_id },
              data: { stock: { decrement: item.quantity } },
            });
          }
        }

        console.log(`Webhook: payment.captured — order ${existingOrder.id} confirmed via webhook`);
      }
    } else if (event === 'payment.failed') {
      const existingOrder = await prisma.orders.findFirst({
        where: { order_id_razorpay: razorpayOrderId },
      });

      if (existingOrder && existingOrder.payment_status === 'pending') {
        await prisma.orders.update({
          where: { id: existingOrder.id },
          data: {
            payment_status: 'failed',
            status: 'cancelled',
            notes: `Payment failed: ${payment.error_description || 'Unknown error'}`,
            updated_at: new Date(),
          },
        });
        console.log(`Webhook: payment.failed — order ${existingOrder.id} marked as failed`);
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ message: 'Webhook processing error' });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getUserOrders,
  getOrderDetails,
  getAllOrders,
  getDashboardStats,
  handleWebhook,
}; 