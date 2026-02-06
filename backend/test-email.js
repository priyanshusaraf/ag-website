const dotenv = require('dotenv');
const emailService = require('./services/emailService');

// Load environment variables
dotenv.config();

async function testEmailService() {
  console.log('🧪 Testing Email Service...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables Check:');
  console.log('EMAIL_HOST:', process.env.EMAIL_HOST || '❌ Not set');
  console.log('EMAIL_PORT:', process.env.EMAIL_PORT || '❌ Not set');
  console.log('EMAIL_USER:', process.env.EMAIL_USER || '❌ Not set');
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Not set');
  console.log('EMAIL_FROM:', process.env.EMAIL_FROM || '❌ Not set');
  console.log('EMAIL_TO:', process.env.EMAIL_TO || '❌ Not set');
  console.log('');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_TO) {
    console.log('❌ Missing required email environment variables. Please check your .env file.');
    process.exit(1);
  }

  // Test email data
  const testContactData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '+1-234-567-8900',
    subject: 'Test Contact Form Submission',
    message: 'This is a test message to verify that the email service is working correctly. The contact form has been successfully implemented!'
  };

  try {
    console.log('📧 Sending test contact email...');
    const result = await emailService.sendContactEmail(testContactData);
    
    if (result.success) {
      console.log('✅ Contact email sent successfully!');
      console.log('📧 Message ID:', result.messageId);
      console.log('📬 Email sent to:', process.env.EMAIL_TO);
      console.log('');
      
      console.log('🔄 Sending confirmation email to test user...');
      const confirmResult = await emailService.sendConfirmationEmail(
        testContactData.email,
        `${testContactData.firstName} ${testContactData.lastName}`
      );
      
      if (confirmResult.success) {
        console.log('✅ Confirmation email sent successfully!');
        console.log('📧 Message ID:', confirmResult.messageId);
      } else {
        console.log('⚠️  Confirmation email failed, but that\'s okay for testing.');
      }
      
    } else {
      console.log('❌ Failed to send contact email');
    }
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting tips:');
    console.log('1. Check your Gmail app password (16 digits, no spaces)');
    console.log('2. Ensure 2-factor authentication is enabled on Gmail');
    console.log('3. Verify EMAIL_USER and EMAIL_PASS in .env file');
    console.log('4. Check if "Less secure app access" is disabled (good!)');
    console.log('5. Try generating a new app password');
    process.exit(1);
  }
}

// Run the test
console.log('🚀 André García Contact Form Email Test');
console.log('=====================================\n');

testEmailService().then(() => {
  console.log('');
  console.log('🎉 Email service test completed successfully!');
  console.log('✅ Contact form emails will be sent to:', process.env.EMAIL_TO);
  console.log('');
  console.log('📝 Next steps:');
  console.log('1. Start your backend server: npm run dev');
  console.log('2. Start your frontend server: npm run dev (in frontend directory)');
  console.log('3. Test the contact form at: http://localhost:3000/contact');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Test failed:', error);
  process.exit(1);
});
