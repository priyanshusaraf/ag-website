const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.configured = false;
    this._init();
  }

  _init() {
    const host = process.env.EMAIL_HOST;
    const port = process.env.EMAIL_PORT;
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!host || !user || !pass || user === 'your-email@gmail.com') {
      console.log('Email service: Not configured (missing EMAIL_HOST/USER/PASS). Emails will be logged only.');
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host,
        port: parseInt(port) || 587,
        secure: parseInt(port) === 465,
        auth: { user, pass },
      });
      this.configured = true;
      console.log('Email service: Configured and ready.');
    } catch (err) {
      console.error('Email service: Failed to create transporter:', err.message);
    }
  }

  _from() {
    return process.env.EMAIL_FROM || `Andre Garcia Cases <${process.env.EMAIL_USER}>`;
  }

  async _send(mailOptions) {
    if (!this.configured || !this.transporter) {
      console.log('Email service [dry-run]:', { to: mailOptions.to, subject: mailOptions.subject });
      return { success: false, message: 'Email service not configured' };
    }

    try {
      const info = await this.transporter.sendMail({
        from: this._from(),
        ...mailOptions,
      });
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error('Email send error:', err.message);
      return { success: false, message: err.message };
    }
  }

  async sendOrderConfirmation(customerEmail, customerName, order) {
    const shippingCharge = parseFloat(order.shipping_charge || 0);
    const totalAmount = parseFloat(order.total_amount);
    const subtotal = totalAmount - shippingCharge;

    const itemRows = (order.order_items || [])
      .map(
        (item) =>
          `<tr>
            <td style="padding:8px;border-bottom:1px solid #eee;">${item.products?.name || 'Product'}${item.products?.category ? ` <span style="color:#999;font-size:12px;">(${item.products.category})</span>` : ''}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">₹${parseFloat(item.price_at_purchase).toLocaleString('en-IN')}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">₹${(parseFloat(item.price_at_purchase) * item.quantity).toLocaleString('en-IN')}</td>
          </tr>`
      )
      .join('');

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
        <div style="background:#8b4513;padding:24px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-weight:300;">Andre Garcia Cases</h1>
        </div>
        <div style="padding:24px;">
          <h2 style="font-weight:300;">Thank you for your order, ${customerName}!</h2>
          <p>Your payment has been confirmed and your order is being prepared.</p>

          <div style="background:#f9f9f9;padding:16px;border-radius:8px;margin:16px 0;">
            <p style="margin:0 0 4px;"><strong>Order #${order.id}</strong></p>
            <p style="margin:0;color:#666;">Placed on ${new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:#f5f5f5;">
                <th style="padding:8px;text-align:left;">Item</th>
                <th style="padding:8px;text-align:center;">Qty</th>
                <th style="padding:8px;text-align:right;">Unit Price</th>
                <th style="padding:8px;text-align:right;">Total</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding:8px;text-align:right;">Subtotal:</td>
                <td style="padding:8px;text-align:right;">₹${subtotal.toLocaleString('en-IN')}</td>
              </tr>
              ${shippingCharge > 0 ? `<tr>
                <td colspan="3" style="padding:8px;text-align:right;">International Shipping:</td>
                <td style="padding:8px;text-align:right;">₹${shippingCharge.toLocaleString('en-IN')}</td>
              </tr>` : `<tr>
                <td colspan="3" style="padding:8px;text-align:right;">Shipping:</td>
                <td style="padding:8px;text-align:right;color:#16a34a;">Free</td>
              </tr>`}
              <tr>
                <td colspan="3" style="padding:8px;text-align:right;">Tax:</td>
                <td style="padding:8px;text-align:right;">Included</td>
              </tr>
              <tr style="border-top:2px solid #8b4513;">
                <td colspan="3" style="padding:12px 8px;text-align:right;font-weight:bold;">Total Paid:</td>
                <td style="padding:12px 8px;text-align:right;font-weight:bold;color:#8b4513;">₹${totalAmount.toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          </table>

          ${order.shipping_address ? `<div style="margin-top:16px;"><strong>Shipping to:</strong><pre style="font-family:Arial,sans-serif;white-space:pre-wrap;background:#f9f9f9;padding:12px;border-radius:8px;">${order.shipping_address}</pre></div>` : ''}

          <p style="margin-top:24px;">We'll notify you when your order ships. You can track your order anytime at your account dashboard.</p>

          <p style="color:#999;font-size:12px;margin-top:32px;">
            If you have any questions, reply to this email or contact us at abhik@andregarciacases.com
          </p>
        </div>
      </div>`;

    return this._send({
      to: customerEmail,
      subject: `Order Confirmed — #${order.id} | Andre Garcia Cases`,
      html,
    });
  }

  async sendNewOrderAdminAlert(order, customerName, customerEmail) {
    const adminTo = process.env.EMAIL_TO || process.env.EMAIL_USER;
    if (!adminTo) return { success: false, message: 'No admin email configured' };

    const shippingCharge = parseFloat(order.shipping_charge || 0);

    const itemList = (order.order_items || [])
      .map((item) => `• ${item.products?.name || 'Product'} × ${item.quantity} — ₹${parseFloat(item.price_at_purchase).toLocaleString('en-IN')}`)
      .join('\n');

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
        <div style="background:#1a1a2e;padding:24px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-weight:300;">New Order Received</h1>
        </div>
        <div style="padding:24px;">
          <h2 style="font-weight:300;">Order #${order.id}</h2>
          <div style="background:#f0f8ff;padding:16px;border-radius:8px;border-left:4px solid #2196F3;">
            <p style="margin:0;"><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
            <p style="margin:4px 0 0;"><strong>Total:</strong> ₹${parseFloat(order.total_amount).toLocaleString('en-IN')}</p>
            ${shippingCharge > 0 ? `<p style="margin:4px 0 0;"><strong>Shipping:</strong> ₹${shippingCharge.toLocaleString('en-IN')} (International)</p>` : ''}
            <p style="margin:4px 0 0;"><strong>Items:</strong> ${(order.order_items || []).length}</p>
          </div>

          <h3 style="margin-top:20px;font-weight:400;">Order Items</h3>
          <pre style="font-family:Arial,sans-serif;white-space:pre-wrap;background:#f9f9f9;padding:12px;border-radius:8px;">${itemList}</pre>

          ${order.shipping_address ? `<h3 style="font-weight:400;">Shipping Address</h3><pre style="font-family:Arial,sans-serif;white-space:pre-wrap;background:#f9f9f9;padding:12px;border-radius:8px;">${order.shipping_address}</pre>` : ''}

          <p style="margin-top:24px;">Log in to the admin dashboard to manage this order.</p>
        </div>
      </div>`;

    return this._send({
      to: adminTo,
      subject: `[New Order] #${order.id} — ₹${parseFloat(order.total_amount).toLocaleString('en-IN')} from ${customerName}`,
      html,
    });
  }

  async sendShippingUpdate(customerEmail, customerName, orderId, trackingNumber, carrier, estimatedDelivery, details) {
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
        <div style="background:#8b4513;padding:24px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-weight:300;">Andre Garcia Cases</h1>
        </div>
        <div style="padding:24px;">
          <h2 style="font-weight:300;">Your order is on its way, ${customerName}!</h2>
          <p>Great news — Order #${orderId} has been shipped.</p>

          <div style="background:#f0f8ff;padding:16px;border-radius:8px;border-left:4px solid #8b4513;margin:16px 0;">
            ${trackingNumber ? `<p style="margin:0 0 8px;"><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ''}
            ${carrier ? `<p style="margin:0 0 8px;"><strong>Carrier:</strong> ${carrier}</p>` : ''}
            ${estimatedDelivery ? `<p style="margin:0 0 8px;"><strong>Estimated Delivery:</strong> ${estimatedDelivery}</p>` : ''}
            ${details ? `<p style="margin:0;">${details}</p>` : ''}
          </div>

          <p style="color:#999;font-size:12px;margin-top:32px;">
            If you have any questions, reply to this email or contact us at abhik@andregarciacases.com
          </p>
        </div>
      </div>`;

    return this._send({
      to: customerEmail,
      subject: `Your Order #${orderId} Has Shipped! | Andre Garcia Cases`,
      html,
    });
  }

  async sendContactEmail(contactData) {
    const adminTo = process.env.EMAIL_TO || process.env.EMAIL_USER;
    if (!adminTo) return { success: false, message: 'No admin email configured' };

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${contactData.firstName} ${contactData.lastName}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        ${contactData.phone ? `<p><strong>Phone:</strong> ${contactData.phone}</p>` : ''}
        <p><strong>Subject:</strong> ${contactData.subject}</p>
        <h3>Message:</h3>
        <div style="background:#f9f9f9;padding:16px;border-radius:8px;">${contactData.message}</div>
      </div>`;

    return this._send({
      to: adminTo,
      replyTo: contactData.email,
      subject: `[Contact] ${contactData.subject} — from ${contactData.firstName} ${contactData.lastName}`,
      html,
    });
  }

  async sendPasswordResetEmail(customerEmail, customerName, resetUrl) {
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
        <div style="background:#8b4513;padding:24px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-weight:300;">Andre Garcia Cases</h1>
        </div>
        <div style="padding:24px;">
          <h2 style="font-weight:300;">Password Reset Request</h2>
          <p>Hi ${customerName},</p>
          <p>We received a request to reset your password. Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${resetUrl}" style="background:#8b4513;color:#fff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">Reset My Password</a>
          </div>
          <p>If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.</p>
          <p style="color:#999;font-size:12px;margin-top:32px;">
            If the button doesn't work, copy and paste this link: <a href="${resetUrl}">${resetUrl}</a>
          </p>
        </div>
      </div>`;

    return this._send({
      to: customerEmail,
      subject: 'Reset Your Password | Andre Garcia Cases',
      html,
    });
  }

  async sendConfirmationEmail(customerEmail, customerName) {
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
        <div style="background:#8b4513;padding:24px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-weight:300;">Andre Garcia Cases</h1>
        </div>
        <div style="padding:24px;">
          <h2 style="font-weight:300;">Thank you, ${customerName}!</h2>
          <p>We've received your message and will get back to you within 24 hours.</p>
          <p style="color:#999;font-size:12px;margin-top:32px;">
            Andre Garcia Cases — Premium Cigar Containers
          </p>
        </div>
      </div>`;

    return this._send({
      to: customerEmail,
      subject: 'We received your message | Andre Garcia Cases',
      html,
    });
  }
}

module.exports = new EmailService();
