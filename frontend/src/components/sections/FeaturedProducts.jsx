'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';

const FeaturedProducts = () => {
  const { addItem } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [fallbackProducts, setFallbackProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Try to fetch featured products first
        const featuredRes = await api.get('/products/featured');
        if (featuredRes.data && featuredRes.data.length > 0) {
          setFeaturedProducts(featuredRes.data);
        } else {
          // Fallback to all products if no featured products
          const allRes = await api.get('/products');
          setFallbackProducts(allRes.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        // Even fallback failed, try all products
        try {
          const allRes = await api.get('/products');
          setFallbackProducts(allRes.data.slice(0, 3));
        } catch (err) {
          console.error('Error fetching fallback products:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const displayProducts = featuredProducts.length > 0 ? featuredProducts : fallbackProducts;
  const isFeaturedView = featuredProducts.length > 0;
  
  // Carousel navigation functions
  const nextSlide = () => {
    if (displayProducts.length > 3) {
      setCurrentIndex((prev) => (prev + 1) % (displayProducts.length - 2));
    }
  };
  
  const prevSlide = () => {
    if (displayProducts.length > 3) {
      setCurrentIndex((prev) => (prev - 1 + (displayProducts.length - 2)) % (displayProducts.length - 2));
    }
  };
  
  // Auto-rotate carousel for featured products
  useEffect(() => {
    if (isFeaturedView && displayProducts.length > 3) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [isFeaturedView, displayProducts.length, currentIndex]);

  const handleAddToCart = (product) => {
    addItem(product);
  };

  const formatPrice = (price, salePrice = null) => {
    const basePrice = parseFloat(price);
    const salePriceNum = salePrice ? parseFloat(salePrice) : null;
    
    if (salePriceNum && salePriceNum < basePrice) {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-lg font-medium text-foreground">₹{salePriceNum.toLocaleString()}</span>
          <span className="text-sm text-muted-foreground line-through">₹{basePrice.toLocaleString()}</span>
        </div>
      );
    }
    
    return <span className="text-lg font-medium text-foreground">₹{basePrice.toLocaleString()}</span>;
  };

  const ProductCard = ({ product }) => (
    <div className="group h-full">
      <Link href={`/products/${product.id}`} className="block">
        <div className="lookbook-frame p-3">
          <div className="aspect-[4/5] w-full bg-white/5 flex items-end">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="lookbook-kicker">Image placeholder</div>
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className="pt-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="lookbook-kicker">
            {product.category || 'Collection'}
          </div>
          <div className="text-xs text-white/40">
            {product.is_new ? 'NEW' : product.on_sale ? 'SALE' : product.is_featured ? 'FEATURED' : ''}
          </div>
        </div>

        <div className="text-lg font-light tracking-tight">{product.name}</div>
        <div className="text-sm text-muted-foreground line-clamp-2">{product.description}</div>

        <div className="pt-1">{formatPrice(product.price, product.sale_price)}</div>

        <div className="pt-2 flex gap-2">
          <Button asChild variant="outline" className="border-white/20 bg-transparent text-foreground hover:bg-white/10">
            <Link href={`/products/${product.id}`} className="flex items-center">
              View
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          {product.stock > 0 ? (
            <Button
              variant="ghost"
              className="hover:bg-white/10"
              onClick={() => handleAddToCart(product)}
            >
              Add
            </Button>
          ) : (
            <Button variant="ghost" disabled>
              Out
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12">
            <div className="lookbook-kicker mb-3">Featured</div>
            <h2 className="lookbook-h1 text-[clamp(2.4rem,5vw,4rem)]">Collections</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="lookbook-frame p-3">
                  <div className="aspect-[4/5] bg-white/5"></div>
                </div>
                <div className="pt-4">
                  <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-10">
          <div className="lookbook-kicker mb-3">Featured</div>
          <h2 className="lookbook-h1 text-[clamp(2.4rem,5vw,4rem)]">Collections</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            {featuredProducts.length > 0
              ? "A curated selection, chosen for design and detail."
              : "A selection of our most popular pieces."
            }
          </p>
        </div>

        {/* Carousel for Featured Products or Grid for fallback */}
        {isFeaturedView && displayProducts.length > 3 ? (
          <div className="relative mb-12">
            {/* Carousel Container */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
              >
                {displayProducts.map((product) => (
                  <div key={product.id} className="w-1/3 flex-shrink-0 px-4">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Carousel Controls */}
            {displayProducts.length > 3 && (
              <>
                <button 
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all duration-200 z-10 border border-white/15"
                >
                  <ChevronLeft className="h-6 w-6 text-foreground" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all duration-200 z-10 border border-white/15"
                >
                  <ChevronRight className="h-6 w-6 text-foreground" />
                </button>
                
                {/* Carousel Dots */}
                <div className="flex justify-center mt-6 space-x-2">
                  {Array.from({ length: Math.max(1, displayProducts.length - 2) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentIndex ? 'bg-foreground' : 'bg-white/25'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayProducts.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {displayProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No featured products available at the moment.</p>
          </div>
        )}

        <div className="pt-10">
          <Button asChild size="lg" variant="outline" className="border-white/20 bg-transparent text-foreground hover:bg-white/10">
            <Link href="/products" className="flex items-center">
              View all products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts; 