const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.init();
  }

  init() {
    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Skip email verification if credentials are placeholder values
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS && 
          process.env.EMAIL_USER !== 'your-email@gmail.com' && 
          process.env.EMAIL_PASS !== 'your-app-password') {
        // Verify connection configuration
        this.transporter.verify((error, success) => {
          if (error) {
            console.error('Email service configuration error:', error);
          } else {
            console.log('Email service is ready to send messages');
          }
        });
      } else {
        console.log('⚠️  Email service: Using placeholder credentials. Please configure real Gmail App Password in .env file');
      }
    } catch (error) {
      console.error('Failed to initialize email service:', error);
    }
  }

  async sendContactEmail(contactData) {
    const { firstName, lastName, email, phone, subject, message } = contactData;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #8B4513; margin: 0;">André García Cigar Containers</h1>
          <p style="color: #666; margin: 5px 0;">New Contact Form Submission</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Contact Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555; width: 30%;">Name:</td>
              <td style="padding: 8px 0; color: #333;">${firstName} ${lastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 8px 0; color: #333;"><a href="mailto:${email}" style="color: #8B4513; text-decoration: none;">${email}</a></td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
              <td style="padding: 8px 0; color: #333;"><a href="tel:${phone}" style="color: #8B4513; text-decoration: none;">${phone}</a></td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Subject:</td>
              <td style="padding: 8px 0; color: #333;">${subject}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0;">Message:</h3>
          <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
          <p style="color: #888; font-size: 12px; margin: 0;">
            This email was sent from the contact form on André García Cigar Containers website.
          </p>
          <p style="color: #888; font-size: 12px; margin: 5px 0 0 0;">
            Received at: ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    `;

    const textContent = `
New Contact Form Submission - André García Cigar Containers

Contact Details:
Name: ${firstName} ${lastName}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
Subject: ${subject}

Message:
${message}

---
This email was sent from the contact form on André García Cigar Containers website.
Received at: ${new Date().toLocaleString()}
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"André García Cigar Containers" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || 'sarafpriyanshu09@gmail.com',
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      text: textContent,
      html: htmlContent
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Contact email sent successfully:', info.messageId);
      return {
        success: true,
        messageId: info.messageId
      };
    } catch (error) {
      console.error('Failed to send contact email:', error);
      throw new Error('Failed to send email. Please try again later.');
    }
  }

  async sendConfirmationEmail(email, name) {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #8B4513; margin: 0;">André García Cigar Containers</h1>
          <p style="color: #666; margin: 5px 0;">Thank you for contacting us!</p>
        </div>
        
        <div style="padding: 20px;">
          <h2 style="color: #333; margin-top: 0;">Hello ${name},</h2>
          <p style="color: #555; line-height: 1.6;">
            Thank you for reaching out to us. We have received your message and our team will get back to you within 24 hours.
          </p>
          <p style="color: #555; line-height: 1.6;">
            We appreciate your interest in André García Cigar Containers and look forward to assisting you with your needs.
          </p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Contact Information:</h3>
          <p style="color: #555; margin: 5px 0;"><strong>Email:</strong> info@andregarcia.com</p>
          <p style="color: #555; margin: 5px 0;"><strong>Phone:</strong> +1 (305) 555-0123</p>
          <p style="color: #555; margin: 5px 0;"><strong>Address:</strong> 123 Artisan Lane, Miami, FL 33101</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
          <p style="color: #888; font-size: 12px; margin: 0;">
            Best regards,<br>
            The André García Team
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"André García Cigar Containers" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank you for contacting André García Cigar Containers',
      html: htmlContent
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Confirmation email sent successfully:', info.messageId);
      return {
        success: true,
        messageId: info.messageId
      };
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      // Don't throw error for confirmation email failure
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new EmailService();
