const Razorpay = require('razorpay');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const emailService = require('../services/emailService');

const prisma = new PrismaClient();

// ──────────────────────────────────────────────────────────────────────────────
// International shipping fee constants
// $75 USD flat fee for all orders shipped outside India
// Rate: 1 USD = 1/0.012 INR (matches CurrencyContext on frontend)
// ──────────────────────────────────────────────────────────────────────────────
const INTERNATIONAL_SHIPPING_USD = 75;
const USD_TO_INR_RATE = 1 / 0.012;
const INTERNATIONAL_SHIPPING_INR = Math.round(INTERNATIONAL_SHIPPING_USD * USD_TO_INR_RATE);

// ──────────────────────────────────────────────────────────────────────────────
// Pincode / postal-code validation patterns
// India: exactly 6 digits (100000–999999)
// International: 3–15 alphanumeric / space / hyphen characters
// ──────────────────────────────────────────────────────────────────────────────
const INDIA_PINCODE_REGEX = /^\d{6}$/;
const INTL_POSTAL_REGEX   = /^[A-Z0-9][A-Z0-9\s\-]{2,14}$/i;

/**
 * Validate and normalise the country value.
 * Returns the trimmed country string or throws a descriptive error.
 */
function normaliseCountry(raw) {
  if (!raw || typeof raw !== 'string' || !raw.trim()) {
    throw new Error('Country is required.');
  }
  return raw.trim();
}

/**
 * Cross-validate country + pincode combination.
 * Returns { isInternational: boolean, warning: string|null }
 */
function validateLocation(country, pincode) {
  const countryLower = country.trim().toLowerCase();
  const isInternational = countryLower !== 'india';

  if (!pincode || !pincode.trim()) {
    throw new Error('Postal / PIN code is required.');
  }

  const pin = pincode.trim();

  if (!isInternational) {
    // Domestic order — pincode MUST be exactly 6 digits
    if (!INDIA_PINCODE_REGEX.test(pin)) {
      throw new Error(
        `Invalid PIN code "${pin}" for India. Indian PIN codes must be exactly 6 digits (e.g. 110001).`
      );
    }
  } else {
    // International order — postal code must be reasonably formatted
    if (!INTL_POSTAL_REGEX.test(pin)) {
      throw new Error(
        `Invalid postal code "${pin}". Please enter a valid postal / ZIP code (3–15 alphanumeric characters).`
      );
    }
    // Cross-check: if postal code looks like an Indian PIN (6 digits) but country is not India
    // This catches users who pick a non-India country but type an Indian PIN to dodge the fee
    if (INDIA_PINCODE_REGEX.test(pin)) {
      console.warn(
        `[ORDER LOCATION WARNING] Postal code "${pin}" matches Indian PIN format but country is "${country}". ` +
        `Treating as international and applying $${INTERNATIONAL_SHIPPING_USD} fee.`
      );
      // We do NOT block the order — we flag it and still charge the international fee
      return { isInternational: true, warning: `Postal code "${pin}" resembles an Indian PIN code but country is listed as "${country}". Flagged for manual review.` };
    }
  }

  return { isInternational, warning: null };
}

// ──────────────────────────────────────────────────────────────────────────────
// Razorpay initialisation
// ──────────────────────────────────────────────────────────────────────────────
let razorpay = null;

const isRazorpayConfigured = () =>
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_SECRET &&
  process.env.RAZORPAY_KEY_ID !== 'your-razorpay-key-id' &&
  process.env.RAZORPAY_KEY_SECRET !== 'your-razorpay-key-secret';

if (isRazorpayConfigured()) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log('✅ Razorpay payment gateway initialized successfully');
} else {
  console.log(
    '⚠️  Razorpay: placeholder credentials detected — configure real keys in .env'
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/payment/create-order
// ──────────────────────────────────────────────────────────────────────────────
const createOrder = async (req, res) => {
  try {
    const { currency = 'INR', items, shipping_details, coupon_code } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Items are required.' });
    }

    // ── 1. Validate shipping_details ─────────────────────────────────────────
    if (!shipping_details || typeof shipping_details !== 'object') {
      return res.status(400).json({ message: 'shipping_details object is required.' });
    }

    const { fullName, email, phone, address, city, state, pincode, country: rawCountry } = shipping_details;

    const missingFields = [];
    if (!fullName?.trim())  missingFields.push('fullName');
    if (!email?.trim())     missingFields.push('email');
    if (!phone?.trim())     missingFields.push('phone');
    if (!address?.trim())   missingFields.push('address');
    if (!city?.trim())      missingFields.push('city');
    if (!state?.trim())     missingFields.push('state');
    if (!pincode?.trim())   missingFields.push('pincode');
    if (!rawCountry?.trim()) missingFields.push('country');

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required shipping fields: ${missingFields.join(', ')}.`,
      });
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ message: 'Invalid email address in shipping details.' });
    }

    // Phone length check
    const phoneDigits = phone.replace(/\D/g, '');
    const countryLowerCheck = rawCountry.trim().toLowerCase();
    if (countryLowerCheck === 'india') {
      if (!/^\d{10}$/.test(phoneDigits)) {
        return res.status(400).json({ message: 'Indian phone number must be exactly 10 digits.' });
      }
    } else {
      if (phoneDigits.length < 7 || phoneDigits.length > 15) {
        return res.status(400).json({ message: 'International phone number must be between 7 and 15 digits.' });
      }
    }

    // ── 2. Country normalisation + pincode cross-validation ───────────────────
    let country;
    try {
      country = normaliseCountry(rawCountry);
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }

    let isInternational, locationWarning;
    try {
      ({ isInternational, warning: locationWarning } = validateLocation(country, pincode));
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }

    // ── 3. Build the shipping address text blob server-side (not trusted from client) ──
    const shippingAddressText =
      `${fullName.trim()}\n` +
      `${address.trim()}\n` +
      `${city.trim()}, ${state.trim()} - ${pincode.trim()}\n` +
      `${country}\n` +
      `Phone: ${phone.trim()}`;

    // ── 4. Server-side price recalculation and stock check ────────────────────
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

    // ── 5. International shipping fee ─────────────────────────────────────────
    const shippingChargeINR = isInternational ? INTERNATIONAL_SHIPPING_INR : 0;

    if (isInternational) {
      console.log(
        `[INTERNATIONAL ORDER] user_id=${userId} country="${country}" pincode="${pincode.trim()}" ` +
        `shipping_fee=₹${shippingChargeINR} ($${INTERNATIONAL_SHIPPING_USD} USD) ` +
        `subtotal=₹${verifiedTotal}` +
        (locationWarning ? ` WARNING: ${locationWarning}` : '')
      );
    }

    // ── 6. Coupon validation (server-side) ────────────────────────────────────
    let discountAmount = 0;
    let appliedCouponCode = null;
    let appliedCouponId = null;

    if (coupon_code) {
      const coupon = await prisma.discount_codes.findUnique({
        where: { code: coupon_code.trim().toUpperCase() },
      });

      if (coupon && coupon.is_active) {
        const now = new Date();
        const notExpired  = !coupon.expires_at || coupon.expires_at > now;
        const usageOk     = coupon.max_uses === null || coupon.uses_count < coupon.max_uses;
        const minAmountOk = !coupon.min_order_amount || verifiedTotal >= parseFloat(coupon.min_order_amount);
        const alreadyUsed = await prisma.coupon_usages.findUnique({
          where: { discount_code_id_user_id: { discount_code_id: coupon.id, user_id: userId } },
        });

        if (notExpired && usageOk && minAmountOk && !alreadyUsed) {
          if (coupon.discount_type === 'percent') {
            discountAmount = Math.round((verifiedTotal * parseFloat(coupon.discount_value)) / 100 * 100) / 100;
          } else {
            discountAmount = Math.min(parseFloat(coupon.discount_value), verifiedTotal);
          }
          appliedCouponCode = coupon.code;
          appliedCouponId   = coupon.id;
        }
      }
    }

    const grandTotalINR = Math.round((verifiedTotal - discountAmount + shippingChargeINR) * 100) / 100;

    if (!razorpay) {
      return res.status(503).json({
        message: 'Payment gateway not configured. Please contact administrator.',
        error: 'Razorpay credentials not set up',
      });
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { name: true, email: true, phone: true },
    });

    // ── 7. Create Razorpay order ───────────────────────────────────────────────
    const razorpayOptions = {
      amount: Math.round(grandTotalINR * 100), // paise
      currency,
      receipt: `order_${Date.now()}_${userId}`,
      notes: {
        user_id:          userId.toString(),
        customer_name:    user?.name || '',
        customer_email:   user?.email || '',
        customer_phone:   phone.trim(),
        country:          country,
        is_international: isInternational ? 'yes' : 'no',
        item_count:       items.length.toString(),
        shipping_address: shippingAddressText.substring(0, 256),
      },
    };

    const razorpayOrder = await razorpay.orders.create(razorpayOptions);

    // ── 8. Persist order in DB ────────────────────────────────────────────────
    const notes = locationWarning
      ? `Location flag: ${locationWarning}`
      : null;

    const order = await prisma.orders.create({
      data: {
        user_id:          userId,
        total_amount:     grandTotalINR,
        shipping_charge:  shippingChargeINR,
        discount_code:    appliedCouponCode,
        discount_amount:  discountAmount,
        status:           'pending',
        payment_status:   'pending',
        order_id_razorpay: razorpayOrder.id,
        shipping_address: shippingAddressText,
        country:          country,
        phone:            phone.trim(),
        is_international: isInternational,
        notes:            notes,
        order_items: {
          create: verifiedItems.map(item => ({
            product_id:            item.product_id,
            quantity:              item.quantity,
            price_at_purchase:     item.verifiedPrice,
            customization_details: item.customization ? JSON.stringify(item.customization) : null,
          })),
        },
      },
      include: {
        order_items: {
          include: { products: true },
        },
      },
    });

    console.log(
      `[ORDER CREATED] order_id=${order.id} user_id=${userId} ` +
      `country="${country}" is_international=${isInternational} ` +
      `shipping_fee=₹${shippingChargeINR} grand_total=₹${grandTotalINR}`
    );

    res.json({
      success: true,
      order_id:        razorpayOrder.id,
      amount:          razorpayOrder.amount,
      currency:        razorpayOrder.currency,
      key_id:          process.env.RAZORPAY_KEY_ID,
      order,
      is_international: isInternational,
      shipping_charge:  shippingChargeINR,
      discount_applied: discountAmount > 0 ? { code: appliedCouponCode, amount: discountAmount } : null,
      coupon_id:        appliedCouponId,
    });
  } catch (error) {
    console.error('[CREATE ORDER ERROR]', error);
    res.status(500).json({ message: error.message || 'Failed to create order.' });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/payment/verify-payment
// ──────────────────────────────────────────────────────────────────────────────
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay) {
      return res.status(503).json({
        message: 'Payment gateway not configured. Please contact administrator.',
        error: 'Razorpay credentials not set up',
      });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.warn(`[PAYMENT VERIFY FAILED] razorpay_order_id=${razorpay_order_id} signature mismatch`);
      return res.status(400).json({ message: 'Payment verification failed — invalid signature.' });
    }

    const existingOrder = await prisma.orders.findFirst({
      where: { order_id_razorpay: razorpay_order_id },
    });

    if (!existingOrder) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const order = await prisma.orders.update({
      where: { id: existingOrder.id },
      data: {
        payment_id:     razorpay_payment_id,
        payment_status: 'completed',
        status:         'confirmed',
        updated_at:     new Date(),
      },
      include: {
        order_items: {
          include: { products: true },
        },
        users: {
          select: { name: true, email: true },
        },
      },
    });

    // Decrement stock only once (guard against webhook double-decrement)
    if (existingOrder.payment_status !== 'completed') {
      for (const item of order.order_items) {
        await prisma.products.updateMany({
          where: { id: item.product_id, stock: { gte: item.quantity } },
          data:  { stock: { decrement: item.quantity } },
        });
      }

      // Record coupon usage
      if (order.discount_code) {
        try {
          const coupon = await prisma.discount_codes.findUnique({ where: { code: order.discount_code } });
          if (coupon) {
            await prisma.coupon_usages.upsert({
              where:  { discount_code_id_user_id: { discount_code_id: coupon.id, user_id: order.user_id } },
              create: { discount_code_id: coupon.id, user_id: order.user_id, order_id: order.id },
              update: { order_id: order.id, used_at: new Date() },
            });
            await prisma.discount_codes.update({
              where: { id: coupon.id },
              data:  { uses_count: { increment: 1 } },
            });
          }
        } catch (couponErr) {
          console.error('[COUPON USAGE ERROR]', couponErr);
        }
      }
    }

    // Clear cart
    await prisma.cart_items.deleteMany({
      where: { carts: { user_id: order.user_id } },
    });

    // In-app notification
    try {
      await prisma.notifications.create({
        data: {
          user_id: order.user_id,
          message: `Your payment for Order #${order.id} has been confirmed! We're preparing your order.`,
          read:    false,
        },
      });
    } catch (notifErr) {
      console.error('[NOTIFICATION ERROR]', notifErr);
    }

    console.log(
      `[PAYMENT VERIFIED] order_id=${order.id} payment_id=${razorpay_payment_id} ` +
      `country="${existingOrder.country}" is_international=${existingOrder.is_international} ` +
      `total=₹${order.total_amount} shipping=₹${order.shipping_charge}`
    );

    const customerName  = order.users?.name  || 'Customer';
    const customerEmail = order.users?.email;
    if (customerEmail) {
      emailService.sendOrderConfirmation(customerEmail, customerName, order).catch((e) =>
        console.error('[EMAIL ORDER CONFIRMATION ERROR]', e.message)
      );
      emailService.sendNewOrderAdminAlert(order, customerName, customerEmail).catch((e) =>
        console.error('[EMAIL ADMIN ALERT ERROR]', e.message)
      );
    }

    res.json({ success: true, message: 'Payment verified successfully', order });
  } catch (error) {
    console.error('[PAYMENT VERIFY ERROR]', error);
    res.status(500).json({ message: 'Payment verification failed.', error: error.message });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/payment/orders  (user)
// ──────────────────────────────────────────────────────────────────────────────
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const orders = await prisma.orders.findMany({
      where: { user_id: userId },
      include: {
        order_items: {
          include: {
            products: {
              select: {
                id: true, name: true, image_url: true, category: true,
                description: true, size: true, quality: true, capacity: true, stock: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
      skip:  offset,
      take:  limit,
    });

    const totalOrders = await prisma.orders.count({ where: { user_id: userId } });

    res.json({
      success: true,
      orders,
      pagination: {
        page, limit, total: totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
      },
    });
  } catch (error) {
    console.error('[GET USER ORDERS ERROR]', error);
    res.status(500).json({ message: 'Failed to fetch orders.', error: error.message });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/payment/orders/:orderId  (user)
// ──────────────────────────────────────────────────────────────────────────────
const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await prisma.orders.findFirst({
      where: { id: parseInt(orderId), user_id: userId },
      include: {
        order_items: {
          include: { products: true },
        },
        users: {
          select: { name: true, email: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('[GET ORDER DETAILS ERROR]', error);
    res.status(500).json({ message: 'Failed to fetch order details.', error: error.message });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/payment/admin/orders  (admin)
// ──────────────────────────────────────────────────────────────────────────────
const getAllOrders = async (req, res) => {
  try {
    const page   = parseInt(req.query.page)   || 1;
    const limit  = parseInt(req.query.limit)  || 20;
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
                id: true, name: true, image_url: true, category: true,
                description: true, size: true, quality: true, capacity: true,
              },
            },
          },
        },
        users: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { created_at: 'desc' },
      skip: offset,
      take: limit,
    });

    const totalOrders = await prisma.orders.count({ where });

    const revenueStats = await prisma.orders.aggregate({
      where: { payment_status: 'completed' },
      _sum:   { total_amount: true },
      _count: true,
    });

    res.json({
      success: true,
      orders,
      pagination: {
        page, limit, total: totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
      },
      stats: {
        totalRevenue:         revenueStats._sum.total_amount || 0,
        totalCompletedOrders: revenueStats._count,
      },
    });
  } catch (error) {
    console.error('[GET ALL ORDERS ERROR]', error);
    res.status(500).json({ message: 'Failed to fetch orders.', error: error.message });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/payment/admin/dashboard-stats  (admin)
// ──────────────────────────────────────────────────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    const today        = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfDay   = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const [totalRevenue, monthlyRevenue, dailyRevenue, orderStats, pendingOrders] = await Promise.all([
      prisma.orders.aggregate({ where: { payment_status: 'completed' },                                   _sum: { total_amount: true } }),
      prisma.orders.aggregate({ where: { payment_status: 'completed', created_at: { gte: startOfMonth } }, _sum: { total_amount: true } }),
      prisma.orders.aggregate({ where: { payment_status: 'completed', created_at: { gte: startOfDay } },   _sum: { total_amount: true } }),
      prisma.orders.groupBy({ by: ['status'], _count: true }),
      prisma.orders.count({ where: { status: 'pending' } }),
    ]);

    res.json({
      success: true,
      stats: {
        totalRevenue:    totalRevenue._sum.total_amount    || 0,
        monthlyRevenue:  monthlyRevenue._sum.total_amount  || 0,
        dailyRevenue:    dailyRevenue._sum.total_amount    || 0,
        pendingOrders,
        orderStats: orderStats.reduce((acc, stat) => {
          acc[stat.status] = stat._count;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    console.error('[DASHBOARD STATS ERROR]', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats.', error: error.message });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/payment/webhook  (Razorpay webhook)
// ──────────────────────────────────────────────────────────────────────────────
const handleWebhook = async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('[WEBHOOK] RAZORPAY_WEBHOOK_SECRET is not configured');
    return res.status(500).json({ message: 'Webhook secret not configured.' });
  }

  const signature = req.headers['x-razorpay-signature'];
  if (!signature) {
    return res.status(400).json({ message: 'Missing webhook signature.' });
  }

  const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body));
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  if (expectedSignature !== signature) {
    console.error('[WEBHOOK] Signature verification failed');
    return res.status(400).json({ message: 'Invalid webhook signature.' });
  }

  let payload;
  try {
    payload = Buffer.isBuffer(req.body) ? JSON.parse(req.body.toString()) : req.body;
  } catch {
    return res.status(400).json({ message: 'Invalid JSON payload.' });
  }

  const event   = payload.event;
  const payment = payload.payload?.payment?.entity;

  if (!payment) {
    return res.status(200).json({ status: 'ok', message: 'No payment entity in payload.' });
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
            payment_id:     payment.id,
            payment_status: 'completed',
            status:         'confirmed',
            updated_at:     new Date(),
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
              data:  { stock: { decrement: item.quantity } },
            });
          }
        }

        console.log(
          `[WEBHOOK] payment.captured — order ${existingOrder.id} confirmed ` +
          `country="${existingOrder.country}" is_international=${existingOrder.is_international}`
        );
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
            status:         'cancelled',
            notes:          `Payment failed: ${payment.error_description || 'Unknown error'}`,
            updated_at:     new Date(),
          },
        });
        console.log(`[WEBHOOK] payment.failed — order ${existingOrder.id} marked as failed`);
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('[WEBHOOK PROCESSING ERROR]', error);
    res.status(500).json({ message: 'Webhook processing error.' });
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
