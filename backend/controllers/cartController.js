const Cart = require('../models/cart');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getCart = async (req, res) => {
  try {
    const userExists = await prisma.users.findUnique({ where: { id: Number(req.user.id) } });
    if (!userExists) {
      return res.status(401).json({ message: 'Your session has expired. Please sign in again.', code: 'USER_NOT_FOUND' });
    }
    let cart = await Cart.getOrCreateByUserId(req.user.id);
    cart = await Cart.getById(cart.id);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { product_id, quantity, product_name, product_category, customization, price_override } = req.body;
    if (!quantity) return res.status(400).json({ message: 'Quantity is required' });

    // Verify the user actually exists in the database (JWT may outlive the account)
    const userExists = await prisma.users.findUnique({ where: { id: Number(req.user.id) } });
    if (!userExists) {
      return res.status(401).json({
        message: 'Your session has expired. Please sign in again.',
        code: 'USER_NOT_FOUND',
      });
    }

    let resolvedProductId = null;

    if (product_id && !isNaN(Number(product_id))) {
      resolvedProductId = Number(product_id);
    } else if (product_name && product_category) {
      const product = await prisma.products.findFirst({
        where: {
          name: product_name,
          category: product_category,
          NOT: { name: { startsWith: '[DELETED]' } },
        },
      });
      if (product) {
        resolvedProductId = product.id;
      }
    }

    if (!resolvedProductId) {
      return res.status(400).json({
        message: 'Product not found. Please try again or contact support.',
        details: 'Could not resolve the product. The item may not be available yet.',
      });
    }

    // Verify product exists before attempting to add
    const productExists = await prisma.products.findUnique({ where: { id: resolvedProductId } });
    if (!productExists) {
      return res.status(400).json({
        message: 'This product is no longer available.',
      });
    }

    const priceVal = price_override != null ? parseFloat(price_override) : null;
    const custJson = customization ? JSON.stringify(customization) : null;

    let cart = await Cart.getOrCreateByUserId(req.user.id);
    await Cart.addItem(cart.id, resolvedProductId, quantity, priceVal, custJson);
    cart = await Cart.getById(cart.id);
    res.json(cart);
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { item_id, quantity } = req.body;
    if (!item_id || !quantity) return res.status(400).json({ message: 'Item and quantity required' });
    await Cart.updateItem(item_id, quantity);
    let cart = await Cart.getOrCreateByUserId(req.user.id);
    cart = await Cart.getById(cart.id);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const { item_id } = req.body;
    if (!item_id) return res.status(400).json({ message: 'Item required' });
    await Cart.removeItem(item_id);
    let cart = await Cart.getOrCreateByUserId(req.user.id);
    cart = await Cart.getById(cart.id);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const clearCart = async (req, res) => {
  try {
    let cart = await Cart.getOrCreateByUserId(req.user.id);
    await Cart.clearCart(cart.id);
    cart = await Cart.getById(cart.id);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
