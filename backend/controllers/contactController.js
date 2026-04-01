const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sendContactForm = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, subject, message } = req.body;

    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Message must be at least 10 characters.' });
    }

    const stored = await prisma.messages.create({
      data: {
        sender_name: `${firstName.trim()} ${lastName.trim()}`,
        sender_email: email.trim(),
        sender_phone: phone?.trim() || null,
        subject: subject.trim(),
        body: message.trim(),
        type: subject === 'custom-order' ? 'custom-order' : 'contact',
        is_read: false,
        is_admin: false,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Your message has been submitted successfully. We will get back to you within 24 hours.',
      id: stored.id,
    });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit your message. Please try again.' });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await prisma.messages.findMany({
      orderBy: { created_at: 'desc' },
    });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

const markMessageRead = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.messages.update({
      where: { id: Number(id) },
      data: { is_read: true },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

const replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyBody, shippingDetails } = req.body;

    const original = await prisma.messages.findUnique({ where: { id: Number(id) } });
    if (!original) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    let body = replyBody || '';
    if (shippingDetails) {
      body += `\n\n--- Shipping Details ---\n${shippingDetails}`;
    }

    const reply = await prisma.messages.create({
      data: {
        sender_name: 'Andre Garcia Cases',
        sender_email: 'abhik@andregarciacases.com',
        subject: `Re: ${original.subject}`,
        body: body.trim(),
        type: 'admin-reply',
        is_admin: true,
        user_id: original.user_id || null,
        order_id: original.order_id || null,
      },
    });

    await prisma.messages.update({
      where: { id: Number(id) },
      data: { is_read: true },
    });

    if (original.user_id) {
      await prisma.notifications.create({
        data: {
          user_id: original.user_id,
          message: `You have a new message from Andre Garcia Cases regarding: ${original.subject}`,
          read: false,
        },
      });
    }

    res.json({ success: true, reply });
  } catch (err) {
    console.error('Reply error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

const getUserMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    const messages = await prisma.messages.findMany({
      where: {
        OR: [
          { user_id: userId },
          { sender_email: userEmail },
          { type: 'admin-reply', user_id: userId },
        ],
      },
      orderBy: { created_at: 'desc' },
    });

    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

const sendShippingUpdate = async (req, res) => {
  try {
    const { orderId, userId, shippingDetails, trackingNumber, carrier, estimatedDelivery } = req.body;

    if (!orderId || !shippingDetails) {
      return res.status(400).json({ success: false, message: 'Order ID and shipping details are required.' });
    }

    let body = shippingDetails;
    if (trackingNumber) body += `\nTracking Number: ${trackingNumber}`;
    if (carrier) body += `\nCarrier: ${carrier}`;
    if (estimatedDelivery) body += `\nEstimated Delivery: ${estimatedDelivery}`;

    const msg = await prisma.messages.create({
      data: {
        sender_name: 'Andre Garcia Cases',
        sender_email: 'abhik@andregarciacases.com',
        subject: `Shipping Update - Order #${orderId}`,
        body: body.trim(),
        type: 'shipping-update',
        is_admin: true,
        user_id: userId || null,
        order_id: orderId,
      },
    });

    if (userId) {
      await prisma.notifications.create({
        data: {
          user_id: userId,
          message: `Shipping update for Order #${orderId}: ${shippingDetails.substring(0, 100)}`,
          read: false,
        },
      });
    }

    res.json({ success: true, message: msg });
  } catch (err) {
    console.error('Shipping update error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

module.exports = {
  sendContactForm,
  getMessages,
  markMessageRead,
  replyToMessage,
  getUserMessages,
  sendShippingUpdate,
};
