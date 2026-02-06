#!/bin/bash

echo "🚀 André García Website - Environment Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "ENVIRONMENT_SETUP.md" ]; then
    echo -e "${RED}❌ Please run this script from the project root directory${NC}"
    exit 1
fi

echo -e "${BLUE}📁 Setting up environment files...${NC}"
echo ""

# Backend .env setup
echo -e "${YELLOW}🔧 Setting up backend environment file...${NC}"
if [ -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  backend/.env already exists. Creating backup...${NC}"
    cp backend/.env backend/.env.backup
    echo -e "${GREEN}✅ Backup created: backend/.env.backup${NC}"
fi

cat > backend/.env << 'EOF'
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/andre_garcia_website"
DB_HOST=localhost
DB_USER=username
DB_PASSWORD=password
DB_NAME=andre_garcia_website
DB_PORT=3306

# Security Keys (CHANGE THESE IN PRODUCTION!)
JWT_SECRET=your-super-secure-jwt-secret-at-least-32-chars-long
NEXTAUTH_SECRET=your-nextauth-secret-at-least-32-chars-long

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@123!
ADMIN_EMAIL=admin@andregarcia.com
ADMIN_SEED_PASSWORD=admin123

# Server Configuration
SERVER_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
PORT=5000

# Razorpay Configuration (Get from https://dashboard.razorpay.com/)
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_here

# Email Configuration (Gmail Setup)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password
EMAIL_FROM=Andre Garcia Cigar Containers <your-email@gmail.com>
EMAIL_TO=sarafpriyanshu09@gmail.com

# Environment
NODE_ENV=development
EOF

echo -e "${GREEN}✅ Backend .env file created${NC}"

# Frontend .env.local setup
echo -e "${YELLOW}🔧 Setting up frontend environment file...${NC}"
if [ -f "frontend/.env.local" ]; then
    echo -e "${YELLOW}⚠️  frontend/.env.local already exists. Creating backup...${NC}"
    cp frontend/.env.local frontend/.env.local.backup
    echo -e "${GREEN}✅ Backup created: frontend/.env.local.backup${NC}"
fi

cat > frontend/.env.local << 'EOF'
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-at-least-32-chars-long

# App Configuration
NEXT_PUBLIC_APP_NAME=André García Cigar Containers
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

echo -e "${GREEN}✅ Frontend .env.local file created${NC}"
echo ""

echo -e "${BLUE}🔐 Security Key Generation${NC}"
echo "Generating secure random keys for you..."
JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
NEXTAUTH_SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)

# Update backend .env with generated secrets
sed -i.bak "s/JWT_SECRET=your-super-secure-jwt-secret-at-least-32-chars-long/JWT_SECRET=$JWT_SECRET/" backend/.env
sed -i.bak "s/NEXTAUTH_SECRET=your-nextauth-secret-at-least-32-chars-long/NEXTAUTH_SECRET=$NEXTAUTH_SECRET/" backend/.env

# Update frontend .env.local with generated secrets
sed -i.bak "s/NEXTAUTH_SECRET=your-nextauth-secret-at-least-32-chars-long/NEXTAUTH_SECRET=$NEXTAUTH_SECRET/" frontend/.env.local

# Clean up backup files
rm backend/.env.bak frontend/.env.local.bak

echo -e "${GREEN}✅ Secure random keys generated and applied${NC}"
echo ""

echo -e "${YELLOW}📝 Next Steps:${NC}"
echo ""
echo -e "${BLUE}1. Database Setup:${NC}"
echo "   - Set up your MySQL database"
echo "   - Update DATABASE_URL in backend/.env"
echo ""
echo -e "${BLUE}2. Email Configuration:${NC}"
echo "   - Enable 2-factor authentication on your Gmail account"
echo "   - Generate an App Password for Gmail"
echo "   - Update EMAIL_USER and EMAIL_PASS in backend/.env"
echo "   - Update EMAIL_TO to your desired recipient email"
echo ""
echo -e "${BLUE}3. Payment Setup:${NC}"
echo "   - Create a Razorpay account at https://dashboard.razorpay.com/"
echo "   - Get your API keys and update RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET"
echo ""
echo -e "${BLUE}4. Install Dependencies:${NC}"
echo "   cd backend && npm install"
echo "   cd frontend && npm install"
echo ""
echo -e "${BLUE}5. Setup Database:${NC}"
echo "   cd backend"
echo "   npx prisma generate"
echo "   npx prisma db push"
echo "   npm run db:seed"
echo ""
echo -e "${BLUE}6. Test Email Service:${NC}"
echo "   cd backend"
echo "   npm run test-email"
echo ""
echo -e "${BLUE}7. Start Development Servers:${NC}"
echo "   Terminal 1: cd backend && npm run dev"
echo "   Terminal 2: cd frontend && npm run dev"
echo ""
echo -e "${GREEN}🎉 Environment setup complete!${NC}"
echo -e "${BLUE}📖 For detailed instructions, see: ENVIRONMENT_SETUP.md${NC}"
echo ""
echo -e "${RED}⚠️  IMPORTANT: Remember to update all placeholder values in the .env files!${NC}"
