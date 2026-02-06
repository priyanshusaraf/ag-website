// Contact form is now handled client-side via mailto: link.
// This endpoint is kept as a simple acknowledgement for backwards compatibility.

const sendContactForm = async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  console.log('Contact form submission received (mailto handled client-side):', {
    name: `${firstName} ${lastName}`,
    email,
    subject,
    timestamp: new Date().toISOString()
  });

  res.status(200).json({
    success: true,
    message: 'Contact form received. Email is handled via mailto on the client side.',
    data: {
      timestamp: new Date().toISOString()
    }
  });
};

module.exports = {
  sendContactForm
};
