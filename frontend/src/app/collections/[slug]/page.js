'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { hardcodedCollections } from './collectionDefaults';
import { resolveImageUrl } from '@/lib/utils';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function CollectionPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;
  const { formatPrice } = useCurrency();

  const [collection, setCollection] = useState(null);
  const [allCollections, setAllCollections] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCollection() {
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/collections`);
        if (res.ok) {
          const data = await res.json();
          if (data?.collections && data.collections.length > 0) {
            const colMap = {};
            data.collections.forEach((c) => {
              if (c.slug) colMap[c.slug] = c;
            });
            setAllCollections(colMap);

            if (colMap[slug]) {
              setCollection(colMap[slug]);
              setLoading(false);
              return;
            }
          }
        }
      } catch (e) {
        console.log('API fetch failed, using hardcoded data');
      }

      setAllCollections(hardcodedCollections);
      setCollection(hardcodedCollections[slug] || null);
      setLoading(false);
    }

    fetchCollection();
  }, [slug]);

  useEffect(() => {
    if (collection?.redirect) {
      router.replace(collection.redirect);
    }
  }, [collection, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f3f3f3] mx-auto mb-4"></div>
          <p className="text-white/60">Loading collection...</p>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 text-white">Collection Not Found</h1>
          <p className="text-white/60 mb-6">The collection you&apos;re looking for doesn&apos;t exist.</p>
          <Button asChild>
            <Link href="/collections">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Collections
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (collection.redirect) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c9a227] mx-auto mb-4"></div>
          <p className="text-white/60">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (!collection.products || collection.products.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 text-white">{collection.name}</h1>
          <p className="text-white/60 mb-6">This collection has no products yet. Please check back soon.</p>
          <Button asChild>
            <Link href="/collections">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Collections
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const otherCollections = Object.entries(allCollections)
    .filter(([key]) => key !== slug && !allCollections[key]?.redirect)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      {/* Breadcrumb */}
      <div className="border-b border-white/10 bg-[#0a0a0b]">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-white/50 hover:text-white transition-colors">Home</Link>
            <span className="text-white/30">&gt;</span>
            <Link href="/collections" className="text-white/50 hover:text-white transition-colors">Collections</Link>
            <span className="text-white/30">&gt;</span>
            <span className="text-primary">{collection.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-[#0a0a0b] border-b border-white/10 overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src={resolveImageUrl(collection.heroImage)}
            alt={collection.name}
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b]/60 via-[#0a0a0b]/80 to-[#0a0a0b]" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8 py-16 md:py-24">
          <div className="max-w-4xl">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 uppercase tracking-widest text-[10px]">
              {collection.tagline}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 tracking-tight">
              {collection.name}
            </h1>
            <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-3xl">
              {collection.description}
            </p>
            <p className="mt-6 text-sm text-white/40">
              {collection.products.length} {collection.products.length === 1 ? 'Product' : 'Products'}
            </p>
          </div>
        </div>
      </div>

      {/* Carousel Section */}
      {collection.carouselImages?.length > 0 && (
        <div className="border-b border-white/10 py-6">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
              {collection.carouselImages.map((img, idx) => (
                <div key={img.id || idx} className="flex-shrink-0 w-48 h-32 rounded-lg overflow-hidden border border-white/10">
                  <img src={resolveImageUrl(img.src)} alt={img.alt || img.title || ''} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <h2 className="text-2xl font-light text-white mb-8">
          All Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {collection.products.map((product) => (
            <Link
              key={product.id}
              href={`/collections/${slug}/${product.id}`}
              className="group"
            >
              <div className="bg-[#111112] rounded-lg overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={resolveImageUrl(product.images?.[0] || collection.heroImage)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.availability && product.availability.toLowerCase().includes('limited') && (
                    <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-[10px] uppercase tracking-wider">
                      Limited Edition
                    </Badge>
                  )}
                  {product.availability && product.availability.toLowerCase().includes('out of stock') && (
                    <Badge className="absolute top-3 left-3 bg-red-600/90 text-white text-[10px] uppercase tracking-wider">
                      Out of Stock
                    </Badge>
                  )}
                  {product.availability && product.availability.toLowerCase().includes('new arrival') && (
                    <Badge className="absolute top-3 left-3 bg-emerald-600/90 text-white text-[10px] uppercase tracking-wider">
                      New Arrival
                    </Badge>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-medium bg-primary/90 px-6 py-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                      View Product
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="text-base font-medium text-white group-hover:text-primary transition-colors mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-xs text-white/40 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-primary">
                      {formatPrice(product.basePrice)}
                    </span>
                    <span className="text-[11px] text-white/40">
                      {product.availability}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Section */}
      {collection.features?.length > 0 && (
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-light text-white mb-6">Collection Features</h3>
                <ul className="space-y-3">
                  {collection.features.filter(Boolean).map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-primary text-lg">&#10003;</span>
                      <span className="text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-light text-white mb-6">Craftsmanship</h3>
                <p className="text-white/60 leading-relaxed mb-4">
                  Every Andre Garcia case is handcrafted by skilled artisans using time-honored techniques passed down through generations. Each piece undergoes rigorous quality control to ensure it meets our exacting standards.
                </p>
                <p className="text-white/60 leading-relaxed">
                  Our cases feature genuine cedar wood lining to maintain optimal humidity, premium leather sourced from the finest tanneries, and meticulous attention to every stitch and detail.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Related Collections */}
      {otherCollections.length > 0 && (
        <div className="bg-[#111112] border-t border-white/10 py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <h3 className="text-2xl font-light text-white mb-8">Explore Other Collections</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {otherCollections.map(([key, col]) => (
                <Link
                  key={key}
                  href={`/collections/${key}`}
                  className="group"
                >
                  <div className="aspect-square bg-[#0a0a0b] rounded overflow-hidden mb-3">
                    <img
                      src={resolveImageUrl(col.heroImage)}
                      alt={col.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h4 className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                    {col.name}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
