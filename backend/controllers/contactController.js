const emailService = require('../services/emailService');

const sendContactForm = async (req, res) => {
  const { firstName, lastName, email, phone, subject, message } = req.body;

  // Validation
  if (!firstName || !lastName || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please fill in all required fields (firstName, lastName, email, subject, message)'
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  // Phone validation (if provided)
  if (phone && !/^[\+]?[\d\s\-\(\)]{10,}$/.test(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid phone number'
    });
  }

  // Message length validation
  if (message.length < 10) {
    return res.status(400).json({
      success: false,
      message: 'Message must be at least 10 characters long'
    });
  }

  if (message.length > 2000) {
    return res.status(400).json({
      success: false,
      message: 'Message must be less than 2000 characters'
    });
  }

  try {
    // Send contact email to admin
    const emailResult = await emailService.sendContactEmail({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : null,
      subject: subject.trim(),
      message: message.trim()
    });

    // Send confirmation email to user (optional, don't fail if this fails)
    try {
      await emailService.sendConfirmationEmail(
        email.trim().toLowerCase(),
        `${firstName.trim()} ${lastName.trim()}`
      );
    } catch (confirmationError) {
      console.warn('Confirmation email failed, but contact email succeeded:', confirmationError.message);
    }

    console.log('Contact form submission successful:', {
      name: `${firstName} ${lastName}`,
      email: email,
      subject: subject,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you within 24 hours.',
      data: {
        messageId: emailResult.messageId,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Contact form submission failed:', {
      error: error.message,
      name: `${firstName} ${lastName}`,
      email: email,
      timestamp: new Date().toISOString()
    });

    res.status(500).json({
      success: false,
      message: 'Failed to send your message. Please try again later or contact us directly.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  sendContactForm
};
