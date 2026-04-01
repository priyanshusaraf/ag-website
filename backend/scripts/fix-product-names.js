#!/usr/bin/env node
/**
 * fix-product-names.js
 *
 * One-time migration script that renames mismatched products in the database
 * so they match the names used by the frontend (which are sent during add-to-cart).
 *
 * Also creates any products that exist in collectionDefaults.js but are missing
 * from the database entirely.
 *
 * Safe to run multiple times — skips rows that already have the correct name.
 *
 * Usage:
 *   node scripts/fix-product-names.js
 *   DATABASE_URL="mysql://..." node scripts/fix-product-names.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const NAME_RENAMES = [
  { category: 'horn', oldName: 'Harris Tweed SLEEVES Sliding Cigar Case', newName: 'Harris Tweed Andre Garcia SLEEVES Sliding Cigar Case' },
  { category: 'manhattan', oldName: '4 Finger Manhattan Croco Black', newName: 'Andre Garcia 4 Finger Manhattan Croco Black' },
  { category: 'manhattan', oldName: '4 Finger Manhattan Smooth Brown', newName: 'Andre Garcia 4 Finger Manhattan Smooth Brown' },
  { category: 'manhattan', oldName: '4 Finger Manhattan Croco Brown', newName: 'Andre Garcia 4 Finger Manhattan Croco Brown' },
  { category: 'pack-and-go', oldName: 'Pack & Go Travel Humidor (3-4-5)', newName: 'Pack & Go Travel Humidor (3-4-5 Count)' },
  { category: 'pack-and-go', oldName: 'Harris Tweed Pack & Go Humidor', newName: 'Harris Tweed Pack & Go Travel Humidor' },
];

const MISSING_PRODUCTS = [
  {
    name: 'Andre Garcia 10 Finger Golf Smooth Brown',
    price: 18275,
    image_url: '/imagecompressor/golf-collection-main.png',
    description: 'From our Golf collection, the case features smooth brown leather for the comfort of your hand. The case is Spanish cedar lined at the inside. Holds up to 10 cigars. Patent pending and featured in Cigar Aficionado.',
    category: 'golf',
    quality: 'Usually ships in 1-2 weeks',
  },
  {
    name: 'Cuero y Tweed Limited Edition Horn Top',
    price: 21250,
    image_url: '/harris-tweed-collection/ht-3-finger-limited-edition-horn-top.jpeg',
    description: 'A 3-finger sliding case featuring a handcrafted buffalo horn top in a glossy finish that makes each piece unique. Wrapped in authentic Harris Tweed with premium leather trim and Spanish cedar lining.',
    category: 'harris-tweed',
    quality: 'Limited Edition - Ships in 4-6 weeks',
  },
  {
    name: 'Cuero y Tweed 3 Finger with Camel Bone',
    price: 23375,
    image_url: '/iloveimg-compressed/_ Harris Tweed fabric in a grey & black herringbone _3fingerwithcamelbone.jpg',
    description: 'A unique 3-finger case topped with a hand-finished camel bone cap. Each piece is one-of-a-kind, wrapped in grey & black herringbone Harris Tweed with premium leather trim and Spanish cedar lining.',
    category: 'harris-tweed',
    quality: 'Limited Edition - Ships in 6-8 weeks',
  },
];

async function main() {
  console.log('=== Fixing product names & adding missing products ===\n');

  let renamed = 0;
  let skipped = 0;

  for (const { category, oldName, newName } of NAME_RENAMES) {
    const existing = await prisma.products.findFirst({
      where: { name: oldName, category },
    });

    if (!existing) {
      const alreadyCorrect = await prisma.products.findFirst({
        where: { name: newName, category },
      });
      if (alreadyCorrect) {
        console.log(`  ✓ "${newName}" already correct (category=${category})`);
      } else {
        console.log(`  — "${oldName}" not found in category=${category} (may not exist yet)`);
      }
      skipped++;
      continue;
    }

    await prisma.products.update({
      where: { id: existing.id },
      data: { name: newName },
    });
    console.log(`  ✏ Renamed id=${existing.id}: "${oldName}" → "${newName}" (category=${category})`);
    renamed++;
  }

  console.log(`\nRenamed ${renamed} products, skipped ${skipped}\n`);

  let created = 0;
  let alreadyExist = 0;

  for (const prod of MISSING_PRODUCTS) {
    const existing = await prisma.products.findFirst({
      where: { name: prod.name, category: prod.category },
    });

    if (existing) {
      console.log(`  ✓ "${prod.name}" already exists (id=${existing.id}, category=${prod.category})`);
      alreadyExist++;
      continue;
    }

    const newProd = await prisma.products.create({
      data: {
        ...prod,
        stock: 99,
        rating: 0,
        reviews: 0,
        is_new: false,
        is_featured: false,
      },
    });
    console.log(`  + Created "${prod.name}" (id=${newProd.id}, category=${prod.category})`);
    created++;
  }

  console.log(`\nCreated ${created} missing products, ${alreadyExist} already existed`);

  const totalProducts = await prisma.products.count({
    where: { NOT: { name: { startsWith: '[DELETED]' } } },
  });
  console.log(`\nTotal active products in database: ${totalProducts}`);
}

main()
  .catch((e) => {
    console.error('Fix failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
