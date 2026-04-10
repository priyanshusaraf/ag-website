const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Validate a coupon code and return the discount amount
const validateCoupon = async (req, res) => {
  try {
    const { code, order_amount } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code is required' });

    const coupon = await prisma.discount_codes.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!coupon || !coupon.is_active) {
      return res.status(404).json({ message: 'Invalid or expired coupon code' });
    }

    if (coupon.expires_at && coupon.expires_at < new Date()) {
      return res.status(400).json({ message: 'This coupon has expired' });
    }

    if (coupon.max_uses !== null && coupon.uses_count >= coupon.max_uses) {
      return res.status(400).json({ message: 'This coupon has reached its usage limit' });
    }

    if (coupon.min_order_amount && parseFloat(order_amount) < parseFloat(coupon.min_order_amount)) {
      return res.status(400).json({
        message: `Minimum order amount of ₹${parseFloat(coupon.min_order_amount).toLocaleString('en-IN')} required`,
      });
    }

    // Check if user has already used this coupon
    const existingUsage = await prisma.coupon_usages.findUnique({
      where: { discount_code_id_user_id: { discount_code_id: coupon.id, user_id: req.user.id } },
    });
    if (existingUsage) {
      return res.status(400).json({ message: 'You have already used this coupon' });
    }

    let discountAmount = 0;
    if (coupon.discount_type === 'percent') {
      discountAmount = Math.round((parseFloat(order_amount) * parseFloat(coupon.discount_value)) / 100 * 100) / 100;
    } else {
      discountAmount = Math.min(parseFloat(coupon.discount_value), parseFloat(order_amount));
    }

    res.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discount_type: coupon.discount_type,
        discount_value: parseFloat(coupon.discount_value),
        discount_amount: discountAmount,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: get all coupons
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await prisma.discount_codes.findMany({
      include: { _count: { select: { coupon_usages: true } } },
      orderBy: { created_at: 'desc' },
    });
    res.json({ success: true, coupons });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: create coupon
const createCoupon = async (req, res) => {
  try {
    const { code, description, discount_type, discount_value, min_order_amount, max_uses, expires_at } = req.body;

    if (!code || !discount_type || !discount_value) {
      return res.status(400).json({ message: 'code, discount_type, and discount_value are required' });
    }
    if (!['percent', 'fixed'].includes(discount_type)) {
      return res.status(400).json({ message: 'discount_type must be "percent" or "fixed"' });
    }

    const coupon = await prisma.discount_codes.create({
      data: {
        code: code.trim().toUpperCase(),
        description: description || null,
        discount_type,
        discount_value: parseFloat(discount_value),
        min_order_amount: min_order_amount ? parseFloat(min_order_amount) : null,
        max_uses: max_uses ? parseInt(max_uses) : null,
        expires_at: expires_at ? new Date(expires_at) : null,
      },
    });

    res.status(201).json({ success: true, coupon });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'A coupon with this code already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: update coupon
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, discount_type, discount_value, min_order_amount, max_uses, is_active, expires_at } = req.body;

    const coupon = await prisma.discount_codes.update({
      where: { id: Number(id) },
      data: {
        description,
        discount_type,
        discount_value: discount_value ? parseFloat(discount_value) : undefined,
        min_order_amount: min_order_amount !== undefined ? (min_order_amount ? parseFloat(min_order_amount) : null) : undefined,
        max_uses: max_uses !== undefined ? (max_uses ? parseInt(max_uses) : null) : undefined,
        is_active: is_active !== undefined ? Boolean(is_active) : undefined,
        expires_at: expires_at !== undefined ? (expires_at ? new Date(expires_at) : null) : undefined,
      },
    });

    res.json({ success: true, coupon });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: delete coupon
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.discount_codes.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { validateCoupon, getAllCoupons, createCoupon, updateCoupon, deleteCoupon };
