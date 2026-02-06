# Seeding Production Database

To seed your production database with the Harris Tweed collection and all other collections:

## Option 1: Using Environment Variable (Recommended)

```bash
cd backend

# Set your production DATABASE_URL
export DATABASE_URL="mysql://your-user:your-password@your-host:port/your-database?sslaccept=strict"

# Run the seed script
node scripts/seed-collections.js
```

## Option 2: Temporary .env Modification

1. Backup your current `.env`:
   ```bash
   cp backend/.env backend/.env.local
   ```

2. Edit `backend/.env` and replace `DATABASE_URL` with your production database URL:
   ```
   DATABASE_URL="mysql://your-user:your-password@your-host:port/your-database?sslaccept=strict"
   ```

3. Run the seed script:
   ```bash
   cd backend
   node scripts/seed-collections.js
   ```

4. Restore your local `.env`:
   ```bash
   mv backend/.env.local backend/.env
   ```

## What This Does

- Updates the `admin_settings` table with all collections (including Harris Tweed)
- Creates/updates products in the `products` table for each collection
- Syncs product images and metadata
- **No schema migrations needed** - collections are stored as JSON in existing tables

## Verification

After seeding, verify in your admin panel:
1. Collections tab should show "Harris Tweed Collection"
2. Products tab should show the 2 new Harris Tweed products
3. Frontend should display the collection at `/collections/harris-tweed`
