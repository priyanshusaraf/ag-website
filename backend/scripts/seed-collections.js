#!/usr/bin/env node
/**
 * seed-collections.js
 *
 * Seeds the database with:
 * 1. All collection data into admin_settings (so the admin Collections tab shows them)
 * 2. Every product from every collection into the products table (so they appear
 *    in the admin Products tab and on the public /products page)
 *
 * Run:  node scripts/seed-collections.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─── The complete collection defaults (mirrors frontend/collectionDefaults.js) ─

const COLLECTIONS_SETTINGS_KEY = 'collections_data_v1';

const hardcodedCollections = {
  'st-james': {
    name: 'St. James Collection',
    tagline: 'Innovative Design Meets Functionality',
    featured: true,
    description: 'The St. James Collection accommodates a cutter, a lighter and a humidification. Perhaps the most innovative case on the market, here is a case that combined not only space for cigars, but also for accessories! The cigar section is a telescoping case with space for 6-16 cigars, depending on model, with a zip-around section on the top to keep your lighter, cutter and other accessories handy and in one place.',
    heroImage: '/imagecompressor/st-james-collection-cigar-case.png',
    products: [
      { id: 'st-james-6', name: 'St. James 6 Finger Cigar Case', basePrice: 14450, images: ['/imagecompressor/st-james-collection-cigar-case.png', '/imagecompressor/st-james-collection.png', '/imagecompressor/st-james-collection-leather.png'], availability: 'Usually ships in 4-6 weeks' },
      { id: 'st-james-10', name: 'St. James 10 Finger Cigar Case', basePrice: 18700, images: ['/imagecompressor/st-james-collection.png', '/imagecompressor/st-james-collection-cigar-case.png', '/imagecompressor/st-james-collection-leather.png'], availability: 'Usually ships in 4-6 weeks' },
    ],
    features: ['Space for cutter and lighter', 'Telescoping case design', 'Zip-around accessory section', 'Cedar wood lining', 'Humidity control system'],
    leatherOptions: [
      { value: 'st-barnes-cognac', label: 'St. Barnes Cognac', price: 0 },
      { value: 'black-smooth', label: 'Black Smooth', price: 0 },
      { value: 'croco-brown', label: 'Croco Brown', price: 1275 },
      { value: 'croco-black', label: 'Croco Black', price: 1275 },
      { value: 'woven-leather', label: 'Woven Leather', price: 1700 },
      { value: 'ostrich-tan', label: 'Ostrich Tan', price: 2125 },
    ],
    sizeOptions: [
      { value: 'robusto', label: 'Robusto', description: '5" x 50 ring' },
      { value: 'toro', label: 'Toro', description: '6" x 50 ring' },
      { value: 'churchill', label: 'Churchill', description: '7" x 48 ring' },
      { value: 'gordo', label: 'Gordo', description: '6" x 60 ring' },
    ],
    zodiacOptions: true,
    boneCarvingOptions: true,
  },
  'horn': {
    name: 'Horn Collection',
    tagline: 'Nature Meets Craftsmanship',
    featured: true,
    description: "Here's a series of hard-leather, two or three-finger cases in a variety of finishes: smooth leather in multiple colors, woven leather, Croco or Ostrich patterns. Each sliding case can accommodate cigars of various lengths in hard-shell protection. The top of each telescoping case has a hard, Buffalo horn top in a marvelous, glossy finish that makes each one unique.",
    heroImage: '/imagecompressor/buffalo-horn-main.png',
    products: [
      { id: 'harris-tweed-sleeves', name: 'Harris Tweed SLEEVES Sliding Cigar Case', basePrice: 15215, images: ['/imagecompressor/buffalo-horn-main.png', '/imagecompressor/buffalo-horn-collection-main.png'], availability: 'Usually ships in 1-2 weeks', description: 'Harris Tweed Andre Garcia SLEEVES Sliding Cigar Case combines Scottish heritage with premium craftsmanship.' },
      { id: 'buffalo-horn-2', name: 'Buffalo Horn 2 Finger Case', basePrice: 12750, images: ['/imagecompressor/buffalo-horn-main.png', '/imagecompressor/buffalo-horn-collection-main.png', '/imagecompressor/buffalo-horn-cigar.png'], availability: 'Usually ships in 4-6 weeks', description: 'Classic two-finger case with genuine buffalo horn top and premium leather exterior.' },
      { id: 'buffalo-horn-3', name: 'Buffalo Horn 3 Finger Zodiac Case', basePrice: 14450, images: ['/imagecompressor/buffalo-horn-collection-main.png', '/imagecompressor/buffalo-horn-main.png', '/imagecompressor/buffalo-horn-cigar.png'], availability: 'Usually ships in 4-6 weeks', description: 'Three-finger zodiac case featuring laser-etched zodiac sign on the buffalo horn cap.' },
      { id: 'smooth-cocoa-latte-4', name: 'Andre Garcia 4 Finger Smooth Cocoa Latte', basePrice: 14450, images: ['/imagecompressor/finger-four-smooth-cocoa.png', '/imagecompressor/finger-4-smooth-cocoa-2.png'], availability: 'Usually ships in 1-2 weeks', description: 'Features smooth cocoa brown leather at the exterior and Spanish cedar lining on the inside.' },
    ],
    features: ['Genuine buffalo horn top', 'Hard-shell protection', 'Unique glossy finish', 'Telescoping design', 'Multiple leather finishes'],
    leatherOptions: [
      { value: 'smooth-cocoa-latte', label: 'Smooth Cocoa Latte', price: 0 },
      { value: 'black-smooth', label: 'Black Smooth', price: 0 },
      { value: 'brown-leather', label: 'Brown Leather', price: 0 },
      { value: 'harris-tweed', label: 'Harris Tweed', price: 2125 },
      { value: 'croco-pattern', label: 'Croco Pattern', price: 1275 },
      { value: 'ostrich-pattern', label: 'Ostrich Pattern', price: 1275 },
      { value: 'woven-leather', label: 'Woven Leather', price: 850 },
    ],
    sizeOptions: [
      { value: 'robusto', label: 'Robusto', description: 'For Robusto sizes (Grande)' },
      { value: 'churchill', label: 'Churchill', description: 'For Churchill sizes (Venti)', price: 425 },
    ],
    zodiacOptions: true,
    boneCarvingOptions: true,
  },
  'carbon-fibre': {
    name: 'Carbon Fibre Collection',
    tagline: 'High-Tech Luxury',
    featured: true,
    description: 'Carry your cigars in style with the Andre Garcia Limited Edition Carbon Fiber cigar case.',
    heroImage: '/imagecompressor/carbon-fiber-collection-main.png',
    products: [
      { id: 'carbon-fibre-2', name: 'Carbon Fibre 2 Finger Case', basePrice: 17000, images: ['/imagecompressor/carbon-fiber-collection-main.png', '/imagecompressor/carbon-fiber-collection-second.png', '/imagecompressor/carbon-fibre-material.png'], availability: 'Limited Edition - Ships in 2-4 weeks' },
      { id: 'carbon-fibre-3', name: 'Carbon Fibre 3 Finger Case', basePrice: 21250, images: ['/imagecompressor/carbon-fiber-collection-second.png', '/imagecompressor/carbon-fiber-collection-main.png', '/imagecompressor/carbon-fibre-material.png'], availability: 'Limited Edition - Ships in 2-4 weeks' },
    ],
    features: ['Genuine carbon fiber exterior', 'Crush-resistant aluminum shell', 'Cedar wood inner lining', 'Lightweight construction', 'Limited edition'],
    leatherOptions: [
      { value: 'carbon-black', label: 'Carbon Black', price: 0 },
      { value: 'carbon-silver', label: 'Carbon Silver', price: 850 },
    ],
    sizeOptions: [
      { value: 'robusto', label: 'Robusto', description: '5" x 50 ring' },
      { value: 'toro', label: 'Toro', description: '6" x 50 ring' },
    ],
    zodiacOptions: false,
    boneCarvingOptions: false,
  },
  'manhattan': {
    name: 'Manhattan Collection',
    tagline: 'Urban Sophistication',
    featured: true,
    description: 'The Manhattan Collection represents the pinnacle of urban luxury.',
    heroImage: '/imagecompressor/manhattan-collection-1.png',
    products: [
      { id: 'manhattan-3', name: 'Manhattan 3 Finger Case', basePrice: 12325, images: ['/imagecompressor/manhattan-collection-1.png', '/imagecompressor/manhattan-collection02.png'], availability: 'Usually ships in 4-6 weeks' },
      { id: 'manhattan-5', name: 'Manhattan 5 Finger Case', basePrice: 15300, images: ['/imagecompressor/manhattan-collection02.png', '/imagecompressor/manhattan-collection-1.png'], availability: 'Usually ships in 4-6 weeks' },
      { id: 'manhattan-4-croco-black', name: '4 Finger Manhattan Croco Black', basePrice: 12750, images: ['/imagecompressor/manhattan-croco-black.png', '/imagecompressor/manhattan-collection-1.png'], availability: 'Currently out of stock', description: 'Made out of top grain soft premium leather.' },
      { id: 'manhattan-4-smooth-brown', name: '4 Finger Manhattan Smooth Brown', basePrice: 12750, images: ['/imagecompressor/four-finger-smooth-brown.png', '/imagecompressor/manhattan-collection-1.png'], availability: 'Usually ships in 1-2 weeks', description: 'Style that are forever.' },
      { id: 'manhattan-4-croco-brown', name: '4 Finger Manhattan Croco Brown', basePrice: 12750, images: ['/imagecompressor/croco-brown-manhattan.png', '/imagecompressor/manhattan-collection-1.png'], availability: 'Usually ships in 1-2 weeks', description: 'Style that is forever.' },
      { id: 'manhattan-6-smooth-brown', name: '6 Finger Manhattan Smooth Brown', basePrice: 16915, images: ['/imagecompressor/manhattan-smooth-black-6-finger.png', '/imagecompressor/manhattan-collection-1.png'], availability: 'Usually ships in 1-2 weeks', description: 'Features rich smooth brown leather at the exterior and fully cedar-lined.' },
      { id: 'manhattan-6-croco-brown', name: '6 Finger Manhattan Croco Brown', basePrice: 16915, images: ['/imagecompressor/manhattan-6-finger-croco-brown.png', '/imagecompressor/manhattan-collection-1.png'], availability: 'Usually ships in 1-2 weeks', description: 'We make our cases only for you.' },
    ],
    features: ['Sleek urban design', 'Premium leather finish', 'Cedar wood lining', 'Secure closure system', 'Compact and portable', 'Top grain soft premium leather'],
    leatherOptions: [
      { value: 'smooth-brown', label: 'Smooth Brown', price: 0 },
      { value: 'croco-brown', label: 'Croco Brown', price: 0 },
      { value: 'croco-black', label: 'Croco Black', price: 0 },
      { value: 'black-leather', label: 'Black Leather', price: 0 },
      { value: 'brown-leather', label: 'Brown Leather', price: 0 },
      { value: 'tan-leather', label: 'Tan Leather', price: 425 },
      { value: 'burgundy', label: 'Burgundy', price: 850 },
    ],
    sizeOptions: [
      { value: 'robusto', label: 'Robusto', description: '5" x 50 ring' },
      { value: 'toro', label: 'Toro', description: '6" x 50 ring' },
      { value: 'churchill', label: 'Churchill', description: '7" x 48 ring' },
    ],
    zodiacOptions: true,
    boneCarvingOptions: true,
  },
  'pack-and-go': {
    name: 'Pack & Go',
    tagline: 'Travel in Style',
    description: 'Patent Pending. Featured in Robb Report Front Runner 2009 and Cigar Aficionado Good Life Guide 2009.',
    heroImage: '/imagecompressor/pack-and-go.png',
    products: [
      { id: 'pack-go-3-4-5', name: 'Pack & Go Travel Humidor (3-4-5)', basePrice: 24565, images: ['/imagecompressor/pack-and-go.png', '/imagecompressor/website-product-img28-min.jpg'], availability: 'Usually ships in 1-2 weeks', description: 'Compact travel humidor with 3, 4, or 5 finger capacity options.' },
      { id: 'pack-go-golf-series', name: 'Pack & Go - Golf Series', basePrice: 25415, images: ['/imagecompressor/pack-and-go.png', '/imagecompressor/website-product-img28-min.jpg'], availability: 'Usually ships in 1-2 weeks', description: 'The Golf Series combines the legendary Pack & Go design.' },
      { id: 'pack-go-harris-tweed', name: 'Harris Tweed Pack & Go Humidor', basePrice: 28050, images: ['/imagecompressor/harris-pack-and-tweed.png', '/imagecompressor/robusto-harris-tweed-case.jpeg', '/imagecompressor/pack-and-go.png'], availability: 'Usually ships in 1-2 weeks', description: 'Premium Harris Tweed finish travel humidor.' },
      { id: 'pack-go-standard', name: 'Pack & Go Travel Humidor', basePrice: 29750, images: ['/imagecompressor/pack-and-go.png', '/imagecompressor/website-product-img28-min.jpg', '/imagecompressor/website-product-img40-min.jpg', '/imagecompressor/website-product-img35-min.jpg'], availability: 'Usually ships in 6-8 weeks', description: 'The ultimate travel companion that stores up to 40 cigars.' },
      { id: 'pack-go-4-finger-limited', name: '4 Finger Pack & Go Limited Edition', basePrice: 25415, images: ['/imagecompressor/finger04-pack-n-go.png', '/imagecompressor/pack-and-go.png'], availability: 'Usually ships in 1-2 weeks', description: "Andre Garcia's 11th Anniversary Edition." },
      { id: 'pack-go-40-finger-briefcase', name: '40 Finger Cigar Briefcase', basePrice: 72250, images: ['/imagecompressor/cigar-40-pack-n-go.png', '/imagecompressor/pack-and-go.png'], availability: 'Usually ships in 1-2 weeks', description: 'Completely cedar-lined, this patent pending case can help you carry 40 cigars.' },
    ],
    features: ['Patent pending design', 'Cedar-lined interior', 'Collapsible wooden dividers', 'Adjustable handle', 'Removable shoulder strap', 'Multiple compartments', 'Featured in Robb Report & Cigar Aficionado'],
    leatherOptions: [
      { value: 'croco-brown', label: 'Croco Brown', price: 0 },
      { value: 'smooth-black', label: 'Smooth Black', price: 0 },
      { value: 'vintage-brown', label: 'Vintage Brown', price: 0 },
      { value: 'harris-tweed', label: 'Harris Tweed', price: 2550 },
      { value: 'croco-black', label: 'Croco Black', price: 1700 },
      { value: 'ostrich-black', label: 'Ostrich Black', price: 2975 },
    ],
    sizeOptions: [
      { value: 'robusto', label: 'Robusto', description: '5" x 50 ring' },
      { value: 'churchill', label: 'Churchill', description: '7" x 48 ring' },
      { value: 'double-corona', label: 'Double Corona', description: '7.5" x 49 ring' },
    ],
    capacityOptions: [
      { value: '3-finger', label: '3 Finger', price: 0 },
      { value: '4-finger', label: '4 Finger', price: 2125 },
      { value: '5-finger', label: '5 Finger', price: 4250 },
      { value: '8-finger', label: '8 Finger', price: 6375 },
      { value: '10-finger', label: '10 Finger', price: 8500 },
      { value: '12-finger', label: '12 Finger', price: 10625 },
      { value: '40-finger', label: '40 Finger', price: 42500 },
    ],
    leatherLabel: 'Leather',
    zodiacOptions: false,
    boneCarvingOptions: false,
  },
  'golf': {
    name: 'Golf Collection',
    tagline: 'On The Course Excellence',
    description: 'Designed specifically for the cigar-loving golfer.',
    heroImage: '/imagecompressor/website-product-img36-min.jpg',
    products: [
      { id: 'golf-3', name: 'Golf 3 Finger Case', basePrice: 11475, images: ['/imagecompressor/website-product-img36-min.jpg', '/imagecompressor/website-product-img37-min.jpg'], availability: 'Usually ships in 4-6 weeks' },
      { id: 'golf-5', name: 'Golf 5 Finger Case', basePrice: 14025, images: ['/imagecompressor/website-product-img37-min.jpg', '/imagecompressor/website-product-img36-min.jpg'], availability: 'Usually ships in 4-6 weeks' },
    ],
    features: ['Golf bag compatible design', 'Crush-resistant shell', 'Weather resistant', 'Cedar wood lining', 'Easy access closure'],
    leatherOptions: [
      { value: 'black-leather', label: 'Black Leather', price: 0 },
      { value: 'brown-leather', label: 'Brown Leather', price: 0 },
      { value: 'green-leather', label: 'Forest Green', price: 850 },
      { value: 'navy-leather', label: 'Navy Blue', price: 850 },
    ],
    sizeOptions: [
      { value: 'robusto', label: 'Robusto', description: '5" x 50 ring' },
      { value: 'toro', label: 'Toro', description: '6" x 50 ring' },
    ],
    zodiacOptions: false,
    boneCarvingOptions: false,
  },
  'all-cases': {
    name: 'All Cigar Cases',
    tagline: 'Complete Collection',
    description: 'Explore our complete collection of handcrafted cigar cases.',
    heroImage: '/imagecompressor/website-product-img33-min.jpg',
    products: [
      { id: 'classic-1', name: 'Classic 1 Finger Case', basePrice: 7225, images: ['/imagecompressor/cigar-cases-preview-below-founder-page.png', '/imagecompressor/cigar-cases-preview-below-founder-page-2.png'], availability: 'In Stock - Ships in 1-2 weeks' },
      { id: 'classic-2', name: 'Classic 2 Finger Case', basePrice: 8075, images: ['/imagecompressor/website-product-img33-min.jpg', '/imagecompressor/cigar-cases-preview-below-founder-page.png'], availability: 'In Stock - Ships in 1-2 weeks' },
      { id: 'classic-3', name: 'Classic 3 Finger Case', basePrice: 9350, images: ['/imagecompressor/cigar-cases-preview-below-founder-page-2.png', '/imagecompressor/website-product-img33-min.jpg'], availability: 'In Stock - Ships in 1-2 weeks' },
      { id: 'classic-5', name: 'Classic 5 Finger Case', basePrice: 11050, images: ['/imagecompressor/website-product-img33-min.jpg', '/imagecompressor/cigar-cases-preview-below-founder-page.png'], availability: 'Usually ships in 2-3 weeks' },
    ],
    features: ['Wide variety of sizes', 'Multiple leather options', 'Cedar wood lining', 'Custom personalization', 'Premium craftsmanship'],
    leatherOptions: [
      { value: 'black-smooth', label: 'Black Smooth', price: 0 },
      { value: 'brown-leather', label: 'Brown Leather', price: 0 },
      { value: 'tan-leather', label: 'Tan Leather', price: 425 },
      { value: 'croco-pattern', label: 'Croco Pattern', price: 1275 },
      { value: 'woven-leather', label: 'Woven Leather', price: 850 },
    ],
    sizeOptions: [
      { value: 'robusto', label: 'Robusto', description: '5" x 50 ring' },
      { value: 'toro', label: 'Toro', description: '6" x 50 ring' },
      { value: 'churchill', label: 'Churchill', description: '7" x 48 ring' },
      { value: 'gordo', label: 'Gordo', description: '6" x 60 ring' },
    ],
    zodiacOptions: true,
    boneCarvingOptions: true,
  },
  'zippered': {
    name: 'Zippered Collection',
    tagline: 'Secure & Stylish',
    featured: true,
    description: 'The Zippered Collection offers premium cigar cases with secure zip-around closures.',
    heroImage: '/imagecompressor/website-product-img33-min.jpg',
    products: [
      { id: 'zippered-3', name: 'Zippered 3 Finger Case', basePrice: 10625, images: ['/imagecompressor/website-product-img33-min.jpg', '/imagecompressor/website-product-img34-min.jpg'], availability: 'Usually ships in 2-3 weeks', description: 'Three-finger zippered case with smooth leather exterior.' },
      { id: 'zippered-5', name: 'Zippered 5 Finger Case', basePrice: 13175, images: ['/imagecompressor/website-product-img34-min.jpg', '/imagecompressor/website-product-img33-min.jpg'], availability: 'Usually ships in 2-3 weeks', description: 'Five-finger zippered case.' },
    ],
    features: ['Secure zip-around closure', 'Premium YKK zipper', 'Cedar wood lining', 'Crush-resistant design', 'Travel-friendly'],
    leatherOptions: [
      { value: 'black-smooth', label: 'Black Smooth', price: 0 },
      { value: 'brown-leather', label: 'Brown Leather', price: 0 },
      { value: 'tan-leather', label: 'Tan Leather', price: 425 },
      { value: 'croco-pattern', label: 'Croco Pattern', price: 1275 },
    ],
    sizeOptions: [
      { value: 'grande', label: 'Grande', description: 'Standard size' },
      { value: 'venti', label: 'Venti', description: 'Large size' },
    ],
    zodiacOptions: false,
    boneCarvingOptions: false,
  },
  'custom': {
    name: 'Custom Collection',
    tagline: 'Your Vision, Our Craftsmanship',
    description: 'Create your own unique cigar case with our Custom Collection.',
    heroImage: '/imagecompressor/website-product-img39-min.jpg',
    products: [
      { id: 'custom-2', name: 'Custom 2 Finger Case', basePrice: 14025, images: ['/imagecompressor/website-product-img39-min.jpg', '/imagecompressor/website-product-img41-min.jpg'], availability: 'Usually ships in 6-8 weeks', description: 'Fully customizable two-finger case.' },
      { id: 'custom-3', name: 'Custom 3 Finger Case', basePrice: 16575, images: ['/imagecompressor/website-product-img41-min.jpg', '/imagecompressor/website-product-img39-min.jpg'], availability: 'Usually ships in 6-8 weeks', description: 'Fully customizable three-finger case.' },
      { id: 'custom-5', name: 'Custom 5 Finger Case', basePrice: 20825, images: ['/imagecompressor/website-product-img42-min.jpg', '/imagecompressor/website-product-img39-min.jpg'], availability: 'Usually ships in 6-8 weeks', description: 'Larger custom case for the serious collector.' },
    ],
    features: ['Fully customizable', 'Choice of 20+ leathers', 'Custom embossing available', 'Cedar wood lining', 'Gift packaging included'],
    leatherOptions: [
      { value: 'black-smooth', label: 'Black Smooth', price: 0 },
      { value: 'brown-leather', label: 'Brown Leather', price: 0 },
      { value: 'tan-leather', label: 'Tan Leather', price: 425 },
      { value: 'burgundy', label: 'Burgundy', price: 850 },
      { value: 'navy-blue', label: 'Navy Blue', price: 850 },
      { value: 'forest-green', label: 'Forest Green', price: 850 },
      { value: 'croco-pattern', label: 'Croco Pattern', price: 1700 },
      { value: 'ostrich-pattern', label: 'Ostrich Pattern', price: 2125 },
      { value: 'exotic-python', label: 'Python Pattern', price: 2975 },
    ],
    sizeOptions: [
      { value: 'robusto', label: 'Robusto', description: '5" x 50 ring' },
      { value: 'toro', label: 'Toro', description: '6" x 50 ring' },
      { value: 'churchill', label: 'Churchill', description: '7" x 48 ring' },
      { value: 'gordo', label: 'Gordo', description: '6" x 60 ring' },
    ],
    zodiacOptions: true,
    boneCarvingOptions: true,
  },
  'leather-goods': {
    name: 'Leather Goods',
    tagline: 'Premium Accessories',
    description: 'Explore our range of premium leather accessories.',
    heroImage: '/imagecompressor/website-product-img44-min.jpg',
    products: [
      { id: 'leather-cigar-wallet', name: 'Leather Cigar Wallet', basePrice: 7565, images: ['/imagecompressor/website-product-img44-min.jpg', '/imagecompressor/website-product-img45-min.jpg'], availability: 'In Stock - Ships in 1-2 weeks', description: 'Premium leather wallet designed to hold cigars, cutter, and cards.' },
      { id: 'leather-travel-pouch', name: 'Leather Travel Pouch', basePrice: 10115, images: ['/imagecompressor/website-product-img45-min.jpg', '/imagecompressor/website-product-img46-min.jpg'], availability: 'In Stock - Ships in 1-2 weeks', description: 'Compact travel pouch for cigar accessories.' },
      { id: 'leather-cutter-holster', name: 'Leather Cutter Holster', basePrice: 4165, images: ['/imagecompressor/website-product-img46-min.jpg', '/imagecompressor/website-product-img44-min.jpg'], availability: 'In Stock - Ships in 1-2 weeks', description: 'Belt-mounted holster for your favorite cigar cutter.' },
    ],
    features: ['Premium full-grain leather', 'Hand-stitched construction', 'Multiple color options', 'Compact and portable', 'Gift packaging available'],
    leatherOptions: [
      { value: 'black-smooth', label: 'Black Smooth', price: 0 },
      { value: 'brown-leather', label: 'Brown Leather', price: 0 },
      { value: 'tan-leather', label: 'Tan Leather', price: 0 },
      { value: 'burgundy', label: 'Burgundy', price: 425 },
    ],
    sizeOptions: [
      { value: 'standard', label: 'Standard', description: 'One size fits all' },
    ],
    zodiacOptions: false,
    boneCarvingOptions: false,
  },
  'harris-tweed': {
    name: 'Cuero y Tweed',
    tagline: 'Premium Leather Meets Harris Tweed',
    featured: true,
    description: 'The Cuero y Tweed collection brings together the timeless heritage of authentic Harris Tweed from the Outer Hebrides of Scotland with Andre Garcia\'s signature craftsmanship. Each case features genuine Harris Tweed fabric — handwoven by islanders in their homes — paired with premium leather trim and cedar wood lining.',
    heroImage: '/harris-tweed-collection/ht-main-cover.jpeg',
    products: [
      { id: 'ht-sliding-case', name: 'Cuero y Tweed Sliding Case', basePrice: 18333, images: ['/harris-tweed-collection/ht-3-finger-robusto.jpeg', '/harris-tweed-collection/ht-3-finger-robusto-2.jpeg', '/harris-tweed-collection/ht-3-finger-robusto-3.jpeg', '/harris-tweed-collection/ht-3-finger-robusto-4.jpeg', '/harris-tweed-collection/ht-3-finger-limited-edition-horn-top.jpeg', '/harris-tweed-collection/ht-3-finger-limited-edition-horn-top-2.jpeg', '/harris-tweed-collection/ht-3-finger-limited-edition-horn-top-3.jpeg', '/harris-tweed-collection/ht-3-finger-limited-edition-horn-top-4.jpeg'], availability: 'Usually ships in 4-6 weeks', description: 'A 3-finger sliding case in authentic Harris Tweed with premium leather trim and Spanish cedar lining. Available with a standard top or a handcrafted buffalo horn top (Limited Edition).' },
      { id: 'ht-torpedo', name: 'Cuero y Tweed Torpedo', basePrice: 27500, images: ['/harris-tweed-collection/ht-torpedo-1.jpeg', '/harris-tweed-collection/ht-torpedo-2.jpeg', '/harris-tweed-collection/ht-torpedo-3.jpeg', '/harris-tweed-collection/ht-torpedo-4.jpeg'], availability: 'Usually ships in 4-6 weeks', description: 'Designed specifically for torpedo-shaped cigars, this case features a tapered interior and premium leather trim with full cedar lining.' },
      { id: 'ht-pack-and-go', name: 'Cuero y Tweed Pack & Go', basePrice: 37500, images: ['/harris-tweed-collection/ht-pack-and-go-robusto-main.jpeg', '/harris-tweed-collection/ht-pack-and-go-churchill.jpeg', '/harris-tweed-collection/ht-pack-and-go-robusto-size.jpeg', '/harris-tweed-collection/ht-pack-and-go-churchill-size.jpeg', '/harris-tweed-collection/ht-pack-and-go-robusto-size-2.jpeg', '/harris-tweed-collection/ht-pack-and-go-robusto-size-3.jpeg', '/harris-tweed-collection/ht-pack-and-go-robusto-size-4.jpeg', '/harris-tweed-collection/ht-pack-and-go-robusto-size-5.jpeg'], availability: 'Usually ships in 4-6 weeks', description: 'The iconic Pack & Go travel humidor wrapped in genuine Harris Tweed. Available in Robusto and Churchill sizes. Features cedar-lined interior with collapsible wooden dividers and zippered closure.' },
    ],
    features: ['Genuine Harris Tweed fabric', 'Handwoven in the Outer Hebrides', 'Premium leather trim', 'Spanish cedar wood lining', 'Crush-resistant construction', 'Zippered closure on Pack & Go models', 'Buffalo horn top on Limited Edition'],
    leatherOptions: [
      { value: 'blue-pink-green-tartan', label: 'Blue, Pink & Green Tartan', price: 0 },
      { value: 'grey-black-herringbone', label: 'Grey & Black Herringbone', price: 0 },
    ],
    sizeOptions: [
      { value: 'robusto', label: 'Robusto', description: '5" x 50 ring' },
      { value: 'toro', label: 'Toro', description: '6" x 50 ring' },
      { value: 'churchill', label: 'Churchill', description: '7" x 48 ring' },
    ],
    leatherLabel: 'Tweed Pattern',
    zodiacOptions: false,
    boneCarvingOptions: false,
  },
  'whats-new': {
    name: "What's New",
    tagline: 'Latest Arrivals',
    featured: true,
    description: 'Discover our newest additions to the Andre Garcia collection.',
    heroImage: '/imagecompressor/website-product-img47-min.jpg',
    products: [
      { id: 'new-carbon-hybrid', name: 'Carbon Hybrid 3 Finger Case', basePrice: 19125, images: ['/imagecompressor/website-product-img47-min.jpg', '/imagecompressor/website-product-img48-min.jpg'], availability: 'New Arrival - Ships in 2-3 weeks', description: 'Our newest design combining carbon fiber accents with premium leather.' },
      { id: 'new-executive-series', name: 'Executive Series 5 Finger', basePrice: 23375, images: ['/imagecompressor/website-product-img48-min.jpg', '/imagecompressor/website-product-img47-min.jpg'], availability: 'New Arrival - Ships in 2-3 weeks', description: 'The pinnacle of our new Executive Series.' },
    ],
    features: ['Latest designs', 'Innovative materials', 'Limited availability', 'Premium craftsmanship', 'Collector worthy'],
    leatherOptions: [
      { value: 'black-smooth', label: 'Black Smooth', price: 0 },
      { value: 'brown-leather', label: 'Brown Leather', price: 0 },
      { value: 'carbon-accent', label: 'Carbon Accent', price: 2125 },
    ],
    sizeOptions: [
      { value: 'grande', label: 'Grande', description: 'Standard size' },
      { value: 'venti', label: 'Venti', description: 'Large size' },
    ],
    zodiacOptions: false,
    boneCarvingOptions: false,
  },
};

// ─── Convert to admin format ──────────────────────────────────────────────────

let idCounter = 0;
function uid(prefix) {
  idCounter++;
  return `${prefix}-seed-${idCounter}`;
}

function toAdminFormat(defaults) {
  // Sort so harris-tweed appears first
  const entries = Object.entries(defaults).filter(([, col]) => !col.redirect);
  entries.sort((a, b) => {
    if (a[0] === 'harris-tweed') return -1;
    if (b[0] === 'harris-tweed') return 1;
    return 0;
  });
  return entries.map(([slug, col]) => ({
      id: uid('col'),
      slug,
      name: col.name || '',
      tagline: col.tagline || '',
      description: col.description || '',
      heroImage: col.heroImage || '',
      featured: col.featured || false,
      startingPrice: col.startingPrice || (col.products?.[0]?.basePrice) || 0,
      products: (col.products || []).map((p) => ({
        id: p.id || uid('prod'),
        name: p.name || '',
        basePrice: p.basePrice || 0,
        images: p.images || [],
        availability: p.availability || '',
        description: p.description || '',
      })),
      features: col.features || [],
      leatherOptions: (col.leatherOptions || []).map((o) => ({
        id: uid('leather'),
        value: o.value || '',
        label: o.label || '',
        price: o.price || 0,
      })),
      sizeOptions: (col.sizeOptions || []).map((o) => ({
        id: uid('size'),
        value: o.value || '',
        label: o.label || '',
        description: o.description || '',
        price: o.price || 0,
      })),
      capacityOptions: (col.capacityOptions || []).map((o) => ({
        id: uid('cap'),
        value: o.value || '',
        label: o.label || '',
        price: o.price || 0,
      })),
      leatherLabel: col.leatherLabel || 'Leather',
      zodiacOptions: col.zodiacOptions || false,
      boneCarvingOptions: col.boneCarvingOptions || false,
      initialsEmbossing: col.initialsEmbossing !== false,
      carouselImages: [],
    }));
}

// ─── Main seed function ───────────────────────────────────────────────────────

async function main() {
  console.log('=== Seeding collections & products into the database ===\n');

  // 1. Convert to admin format and save to admin_settings
  const collections = toAdminFormat(hardcodedCollections);
  const serialized = JSON.stringify({ collections });

  console.log(`Saving ${collections.length} collections to admin_settings...`);
  await prisma.admin_settings.upsert({
    where: { key: COLLECTIONS_SETTINGS_KEY },
    update: { value: serialized },
    create: { key: COLLECTIONS_SETTINGS_KEY, value: serialized },
  });
  console.log('  ✓ Collections data saved to admin_settings\n');

  // 2. Insert every product into the products table
  let created = 0;
  let skipped = 0;

  for (const col of collections) {
    console.log(`Processing collection: ${col.name} (${col.slug}) — ${col.products.length} products`);

    for (const cp of col.products) {
      if (!cp.name) continue;

      const imageUrl = Array.isArray(cp.images) && cp.images.length > 0 ? cp.images[0] : null;

      // Check if product already exists (by name + category)
      const existing = await prisma.products.findFirst({
        where: { name: cp.name, category: col.slug },
      });

      if (existing) {
        console.log(`  — Skipping "${cp.name}" (already exists, id=${existing.id})`);
        skipped++;
        continue;
      }

      const product = await prisma.products.create({
        data: {
          name: cp.name,
          price: parseFloat(cp.basePrice) || 0,
          image_url: imageUrl,
          description: cp.description || null,
          category: col.slug,
          quality: cp.availability || null,
          stock: 99,
          rating: 0,
          reviews: 0,
          is_new: false,
          is_featured: false,
        },
      });
      console.log(`  + Created "${cp.name}" (id=${product.id}, ₹${cp.basePrice}, category=${col.slug})`);
      created++;
    }
  }

  console.log(`\n=== Done! Created ${created} products, skipped ${skipped} (already existed) ===`);

  // 3. Final count
  const totalProducts = await prisma.products.count({
    where: { NOT: { name: { startsWith: '[DELETED]' } } },
  });
  console.log(`Total products in database: ${totalProducts}`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
