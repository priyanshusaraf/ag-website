const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Razorpay = require('razorpay');

let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET &&
    process.env.RAZORPAY_KEY_ID !== 'your-razorpay-key-id') {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

const VALID_REASONS = ['defective', 'wrong_item', 'not_as_described', 'changed_mind', 'other'];

// Customer: submit a return request
const createReturnRequest = async (req, res) => {
  try {
    const { order_id, reason, description } = req.body;

    if (!order_id || !reason) {
      return res.status(400).json({ message: 'order_id and reason are required' });
    }
    if (!VALID_REASONS.includes(reason)) {
      return res.status(400).json({ message: `reason must be one of: ${VALID_REASONS.join(', ')}` });
    }

    // Verify the order belongs to this user and is in a returnable state
    const order = await prisma.orders.findFirst({
      where: { id: Number(order_id), user_id: req.user.id },
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!['confirmed', 'in_transit', 'completed'].includes(order.status)) {
      return res.status(400).json({ message: 'This order is not eligible for a return request' });
    }

    // Check for existing pending/approved request
    const existing = await prisma.return_requests.findFirst({
      where: { order_id: Number(order_id), status: { in: ['pending', 'approved'] } },
    });
    if (existing) {
      return res.status(409).json({ message: 'A return request for this order is already in progress' });
    }

    const request = await prisma.return_requests.create({
      data: {
        order_id: Number(order_id),
        user_id: req.user.id,
        reason,
        description: description || null,
        refund_amount: order.total_amount,
      },
    });

    res.status(201).json({ success: true, request });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Customer: get own return requests
const getUserReturnRequests = async (req, res) => {
  try {
    const requests = await prisma.return_requests.findMany({
      where: { user_id: req.user.id },
      include: {
        orders: {
          select: { id: true, total_amount: true, created_at: true, order_items: { include: { products: { select: { name: true, image_url: true } } } } },
        },
      },
      orderBy: { created_at: 'desc' },
    });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: get all return requests
const getAllReturnRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status && status !== 'all' ? { status } : {};

    const requests = await prisma.return_requests.findMany({
      where,
      include: {
        orders: {
          include: {
            order_items: { include: { products: true } },
          },
        },
        users: { select: { id: true, name: true, email: true } },
      },
      orderBy: { created_at: 'desc' },
    });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: update return request status (approve/reject/refund)
const updateReturnStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes, refund_amount } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await prisma.return_requests.findUnique({
      where: { id: Number(id) },
      include: { orders: true },
    });
    if (!request) return res.status(404).json({ message: 'Return request not found' });

    // If processing a refund, trigger Razorpay refund
    if (status === 'refunded' && request.orders.payment_id && razorpay) {
      const finalRefundAmount = refund_amount ? parseFloat(refund_amount) : parseFloat(request.refund_amount || 0);
      try {
        await razorpay.payments.refund(request.orders.payment_id, {
          amount: Math.round(finalRefundAmount * 100), // paise
          notes: { return_request_id: request.id.toString() },
        });
        // Mark order as refunded
        await prisma.orders.update({
          where: { id: request.order_id },
          data: { payment_status: 'refunded', status: 'rejected' },
        });
      } catch (razorpayErr) {
        console.error('Razorpay refund error:', razorpayErr.message);
        return res.status(502).json({ message: `Razorpay refund failed: ${razorpayErr.error?.description || razorpayErr.message}` });
      }
    }

    const updated = await prisma.return_requests.update({
      where: { id: Number(id) },
      data: {
        status,
        admin_notes: admin_notes || null,
        refund_amount: refund_amount ? parseFloat(refund_amount) : undefined,
      },
    });

    // Create user notification
    const messages = {
      approved: 'Your return request has been approved. We will process your refund shortly.',
      rejected: 'Your return request has been reviewed and unfortunately cannot be approved at this time.',
      refunded: 'Your refund has been processed successfully.',
    };
    if (messages[status]) {
      await prisma.notifications.create({
        data: { user_id: request.user_id, message: messages[status], read: false },
      }).catch(() => {});
    }

    res.json({ success: true, request: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createReturnRequest, getUserReturnRequests, getAllReturnRequests, updateReturnStatus };
