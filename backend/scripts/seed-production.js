#!/usr/bin/env node
/**
 * seed-production.js
 *
 * Seeds the production database with collections and products.
 * 
 * Usage:
 *   DATABASE_URL="mysql://user:pass@host:port/db?ssl=true" node scripts/seed-production.js
 * 
 * Or set DATABASE_URL in your environment and run:
 *   node scripts/seed-production.js
 */

const { PrismaClient } = require('@prisma/client');

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is required!');
  console.error('\nUsage:');
  console.error('  DATABASE_URL="mysql://user:pass@host:port/db?ssl=true" node scripts/seed-production.js');
  console.error('\nOr set DATABASE_URL in your .env file and run:');
  console.error('  node scripts/seed-production.js');
  process.exit(1);
}

const prisma = new PrismaClient();

// Import the seed-collections logic
const COLLECTIONS_SETTINGS_KEY = 'collections_data_v1';

// We'll use the same hardcodedCollections from seed-collections.js
// For production, we'll read from the seed-collections.js file to ensure consistency
const path = require('path');
const fs = require('fs');

// Read and execute the seed-collections logic
async function main() {
  console.log('🌱 Starting production database seed...\n');
  console.log(`📊 Database: ${process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@')}\n`);

  try {
    // Import the seed-collections script's logic
    // Since we can't easily import it, we'll require it and use its exports
    // But seed-collections.js doesn't export, so we'll duplicate the logic here
    
    // Actually, let's just run the seed-collections.js script directly
    // But first, let's verify the connection
    await prisma.$connect();
    console.log('✅ Connected to database\n');

    const { execSync } = require('child_process');

    // First, fix any mismatched product names from previous seeds
    const fixPath = path.join(__dirname, 'fix-product-names.js');
    console.log('🔧 Running fix-product-names.js (rename mismatches & add missing)...\n');
    execSync(`node "${fixPath}"`, {
      stdio: 'inherit',
      env: process.env,
    });

    // Then, run the full seed script
    const scriptPath = path.join(__dirname, 'seed-collections.js');
    console.log('\n📦 Running seed-collections.js...\n');
    execSync(`node "${scriptPath}"`, {
      stdio: 'inherit',
      env: process.env,
    });

    console.log('\n✅ Production database seeded successfully!');
  } catch (error) {
    console.error('\n❌ Seed failed:', error.message);
    if (error.stderr) {
      console.error('Error details:', error.stderr.toString());
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
