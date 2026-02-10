import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Collections',
  description: 'Explore our complete range of handcrafted cigar cases and accessories. From the innovative St. James Collection to the luxurious Buffalo Horn cases.',
};

// Default hardcoded collections as fallback
const defaultCollections = [
  {
    slug: 'st-james',
    name: 'St. James Collection',
    tagline: 'Innovative Design Meets Functionality',
    description: 'The most innovative case on the market, combining space for cigars and accessories in one elegant solution.',
    heroImage: '/imagecompressor/st-james-collection-cigar-case.png',
    featured: true,
    startingPrice: 14450,
  },
  {
    slug: 'horn',
    name: 'Horn Collection',
    tagline: 'Nature Meets Craftsmanship',
    description: 'Unique cases featuring genuine horn tops with a marvelous, glossy finish.',
    heroImage: '/imagecompressor/buffalo-horn-main.png',
    featured: true,
    startingPrice: 12750,
  },
  {
    slug: 'carbon-fibre',
    name: 'Carbon Fibre Collection',
    tagline: 'High-Tech Luxury',
    description: 'Limited edition cases with genuine carbon fiber exterior and crush-resistant aluminum shell.',
    heroImage: '/imagecompressor/carbon-fiber-collection-main.png',
    featured: true,
    startingPrice: 17000,
  },
  {
    slug: 'manhattan',
    name: 'Manhattan Collection',
    tagline: 'Urban Sophistication',
    description: 'Sleek urban designs perfect for the modern gentleman who demands excellence.',
    heroImage: '/imagecompressor/manhattan-collection-1.png',
    featured: true,
    startingPrice: 12325,
  },
  {
    slug: 'zippered',
    name: 'Zippered Collection',
    tagline: 'Secure & Stylish',
    description: 'Premium zippered cases offering maximum protection with easy access to your cigars.',
    heroImage: '/imagecompressor/website-product-img33-min.jpg',
    featured: true,
    startingPrice: 11050,
  },
  {
    slug: 'whats-new',
    name: "What's New",
    tagline: 'Latest Arrivals',
    description: 'Discover our newest designs and limited edition releases.',
    heroImage: '/imagecompressor/carbon-fiber-another.png',
    featured: true,
    startingPrice: 13175,
  },
  {
    slug: 'harris-tweed',
    name: 'Harris Tweed Collection',
    tagline: 'Scottish Heritage Meets Premium Craft',
    description: 'Authentic Harris Tweed fabric handwoven in the Outer Hebrides, paired with premium leather trim and cedar wood lining.',
    heroImage: '/imagecompressor/harris-tweed-main.png',
    featured: true,
    startingPrice: 14450,
  },
  {
    slug: 'custom',
    name: 'Custom Collection',
    tagline: 'Your Vision, Our Craft',
    description: 'Fully customizable cases tailored to your exact specifications. Choose from 20+ leathers and personalization options.',
    heroImage: '/imagecompressor/cigar-cases-preview-below-founder-page-2.png',
    featured: false,
    startingPrice: 14025,
  },
  {
    slug: 'leather-goods',
    name: 'Leather Goods',
    tagline: 'Premium Accessories',
    description: 'Explore our range of premium leather accessories designed to complement your cigar lifestyle.',
    heroImage: '/imagecompressor/website-product-img44-min.jpg',
    featured: false,
    startingPrice: 4165,
  },
  {
    slug: 'pack-and-go',
    name: 'Pack & Go',
    tagline: 'Travel in Style',
    description: 'The ultimate travel companion that can store up to 40 cigars with premium cedar lining.',
    heroImage: '/imagecompressor/pack-and-go.png',
    featured: false,
    startingPrice: 29750,
  },
  {
    slug: 'golf',
    name: 'Golf Collection',
    tagline: 'On The Course Excellence',
    description: 'Designed specifically for the cigar-loving golfer, perfect for your golf bag.',
    heroImage: '/imagecompressor/golf-collection-main.png',
    featured: false,
    startingPrice: 11475,
  },
  {
    slug: 'all-cases',
    name: 'All Cigar Cases',
    tagline: 'Complete Collection',
    description: 'Browse our complete range of handcrafted cigar cases in various sizes and styles.',
    heroImage: '/imagecompressor/website-product-img33-min.jpg',
    featured: false,
    startingPrice: 7225,
  },
];

async function getCollections() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/collections`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.collections && data.collections.length > 0) {
        // Map API collections to the list view format
        return data.collections.map((c) => ({
          slug: c.slug,
          name: c.name,
          tagline: c.tagline || '',
          description: c.description || '',
          heroImage: c.heroImage || '',
          image: c.heroImage || '',
          featured: c.featured || false,
          startingPrice: c.startingPrice || 0,
        }));
      }
    }
  } catch (e) {
    console.log('Could not fetch collections from API, using defaults');
  }
  return defaultCollections;
}

export default async function CollectionsPage() {
  const collections = await getCollections();
  const featuredCollections = collections.filter(c => c.featured);
  const otherCollections = collections.filter(c => !c.featured);

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      {/* Hero Section */}
      <section className="relative py-20 border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 uppercase tracking-widest text-[10px]">
              Handcrafted Excellence
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 tracking-tight">
              Our Collections
            </h1>
            <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
              Discover our range of handcrafted luxury cigar cases, each designed with meticulous
              attention to detail and premium materials. From innovative designs to timeless classics,
              find the perfect case for your collection.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      {featuredCollections.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
                Featured <span className="text-primary">Collections</span>
              </h2>
              <p className="text-white/50 max-w-2xl">
                Our signature collections represent the pinnacle of cigar case craftsmanship.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {featuredCollections.map((collection, index) => (
                <Link
                  key={collection.slug}
                  href={`/collections/${collection.slug}`}
                  className="group"
                >
                  <div className={`relative overflow-hidden bg-[#111112] rounded-lg ${index === 0 ? 'md:col-span-2' : ''}`}>
                    <div className={`${index === 0 ? 'aspect-[2/1]' : 'aspect-[4/3]'} overflow-hidden`}>
                      <img
                        src={collection.heroImage || collection.image}
                        alt={collection.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <Badge className="mb-3 bg-primary/20 text-primary border-primary/20 text-[10px] uppercase tracking-widest">
                        {collection.tagline}
                      </Badge>
                      <h3 className="text-2xl md:text-3xl font-light text-white mb-2 group-hover:text-primary transition-colors">
                        {collection.name}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed mb-4 max-w-lg">
                        {collection.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-white/40 text-sm">From ₹{collection.startingPrice}</span>
                        <span className="text-primary font-medium text-sm flex items-center group-hover:gap-2 transition-all">
                          Shop Now
                          <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other Collections */}
      {otherCollections.length > 0 && (
        <section className={featuredCollections.length === 0 ? 'py-20' : ''}>
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
                More <span className="text-primary">Collections</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherCollections.map((collection) => (
                <Link
                  key={collection.slug}
                  href={`/collections/${collection.slug}`}
                  className="group"
                >
                  <div className="bg-[#111112] rounded-lg overflow-hidden">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={collection.heroImage || collection.image}
                        alt={collection.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 text-[10px] uppercase tracking-widest">
                        {collection.tagline}
                      </Badge>
                      <h3 className="text-xl font-light text-white mb-2 group-hover:text-primary transition-colors">
                        {collection.name}
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed mb-4">
                        {collection.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-white/40 text-sm">From ₹{collection.startingPrice}</span>
                        <span className="text-primary font-medium text-sm flex items-center">
                          Explore
                          <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-[#111112] py-20 border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-light text-white">
              Can't Decide? <span className="text-primary">We're Here to Help</span>
            </h2>
            <p className="text-lg text-white/50">
              Our team of experts is ready to guide you in selecting the perfect cigar case
              for your needs. Get personalized recommendations based on your preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-white/20 text-white hover:bg-white/10">
                <Link href="/about">Learn Our Story</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
