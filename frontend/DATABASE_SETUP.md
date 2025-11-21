# Database Setup Instructions

## Prerequisites

1. **MySQL Server**: Install MySQL locally or use a cloud service
2. **Environment Variables**: Configure your `.env` file

## Quick Setup Options

### Option 1: Local MySQL (Free)

1. **Install MySQL**:
   ```bash
   # macOS (using Homebrew)
   brew install mysql
   brew services start mysql
   
   # Windows: Download from https://dev.mysql.com/downloads/installer/
   # Ubuntu/Debian
   sudo apt update
   sudo apt install mysql-server
   ```

2. **Create Database**:
   ```sql
   CREATE DATABASE andre_garcia_website;
   CREATE USER 'andre_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON andre_garcia_website.* TO 'andre_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Update .env file**:
   ```env
   DATABASE_URL="mysql://andre_user:your_password@localhost:3306/andre_garcia_website"
   ```

### Option 2: PlanetScale (Free Tier)

1. **Sign up**: https://planetscale.com (Free tier: 5GB storage, 1 billion reads/month)
2. **Create database**: `andre-garcia-website`
3. **Get connection string** from dashboard
4. **Update .env file**:
   ```env
   DATABASE_URL="mysql://username:password@host:port/database?sslaccept=strict"
   ```

### Option 3: Railway (Affordable)

1. **Sign up**: https://railway.app
2. **Add MySQL service** (~$5/month)
3. **Get connection string** from dashboard
4. **Update .env file**

## Database Migration

1. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

2. **Push Database Schema**:
   ```bash
   npx prisma db push
   ```

3. **Seed Database** (optional):
   ```bash
   npm run db:seed
   ```

## Environment Variables Setup

Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/andre_garcia_website"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# Email Configuration (optional for verification emails)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="Andre Garcia Cigar Containers <noreply@andregarcia.com>"

# App Configuration
APP_NAME="André García Cigar Containers"
APP_URL="http://localhost:3000"
JWT_SECRET="your-jwt-secret-here-change-in-production"
```

## Verification

1. **Test Database Connection**:
   ```bash
   npx prisma db pull
   ```

2. **View Database**:
   ```bash
   npx prisma studio
   ```

3. **Test Authentication**:
   - Visit: http://localhost:3000/auth/signup
   - Create a test account
   - Check database for user creation

## Production Deployment

### Environment Variables for Production

1. **Generate secure secrets**:
   ```bash
   openssl rand -base64 32  # For NEXTAUTH_SECRET
   openssl rand -base64 32  # For JWT_SECRET
   ```

2. **Update URLs**:
   ```env
   NEXTAUTH_URL="https://yourdomain.com"
   APP_URL="https://yourdomain.com"
   ```

### Database Migration in Production

```bash
# Run migrations
npx prisma migrate deploy

# Generate client
npx prisma generate
```

## Troubleshooting

### Common Issues

1. **Connection Refused**:
   - Check MySQL is running
   - Verify credentials and host
   - Check firewall settings

2. **SSL Certificate Error**:
   ```env
   DATABASE_URL="mysql://user:pass@host:port/db?sslaccept=strict"
   ```

3. **Prisma Client Not Generated**:
   ```bash
   npx prisma generate
   ```

4. **Schema Sync Issues**:
   ```bash
   npx prisma db push --force-reset  # ⚠️ Resets database
   ```

## Cost Estimates

- **Local MySQL**: Free
- **PlanetScale Free Tier**: Free (5GB limit)
- **Railway MySQL**: ~$5/month
- **AWS RDS**: ~$15-30/month
- **Google Cloud SQL**: ~$10-25/month

Choose based on your needs and budget. For development and small-scale production, PlanetScale free tier or Railway are excellent options. 