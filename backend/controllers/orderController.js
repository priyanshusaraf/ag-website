const Order = require('../models/order');
const User = require('../models/user');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.getByUserId(req.user.id);
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.getById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Non-admin users may only access their own orders
    const isAdmin = req.user.is_admin || req.user.is_super_admin;
    if (!isAdmin && order.user_id !== req.user.id) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items required' });
    }

    // Recalculate total server-side — never trust client-supplied price
    let serverTotal = 0;
    for (const item of items) {
      const product = await prisma.products.findUnique({ where: { id: Number(item.product_id) } });
      if (!product) {
        return res.status(400).json({ message: `Product #${item.product_id} not found` });
      }
      const unitPrice = parseFloat(product.sale_price || product.price);
      serverTotal += unitPrice * item.quantity;
      item.price_at_purchase = unitPrice;
    }
    serverTotal = Math.round(serverTotal * 100) / 100;

    const order = await Order.create(req.user.id, items, serverTotal);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateOrderStatus = async (req, res) => {
  console.log('OrderController updateOrderStatus called!', { params: req.params, body: req.body });
  try {
    const { status } = req.body;
    const order = await Order.updateStatus(req.params.id, status);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await User.getNotifications(req.user.id);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getOrdersByUser, getOrderById, createOrder, updateOrderStatus, getNotifications }; 