// Email service is disabled - contact form now uses mailto: on the client side.
// No SMTP connections are attempted. This prevents deployment failures from SMTP timeouts.

class EmailService {
  constructor() {
    this.transporter = null;
    console.log('Email service: Disabled. Contact form uses mailto: on client side.');
  }

  async sendContactEmail() {
    console.log('sendContactEmail called but email service is disabled.');
    return { success: false, message: 'Email service disabled. Using mailto: instead.' };
  }

  async sendConfirmationEmail() {
    console.log('sendConfirmationEmail called but email service is disabled.');
    return { success: false, message: 'Email service disabled. Using mailto: instead.' };
  }
}

module.exports = new EmailService();
