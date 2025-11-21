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
          <span className="text-2xl font-bold text-green-600">₹{salePriceNum.toLocaleString()}</span>
          <span className="text-lg text-muted-foreground line-through">₹{basePrice.toLocaleString()}</span>
        </div>
      );
    }
    
    return <span className="text-2xl font-bold text-primary">₹{basePrice.toLocaleString()}</span>;
  };

  const ProductCard = ({ product }) => (
    <Card className="group hover:shadow-luxury transition-all duration-300 border-border/50 bg-card h-full">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          {/* Product Image */}
          <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-32 h-32 bg-primary/20 rounded-lg flex items-center justify-center">
                <div className="w-20 h-20 bg-primary/30 rounded"></div>
              </div>
            )}
          </div>
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.is_featured && (
              <Badge className="bg-blue-500">Featured</Badge>
            )}
            {product.is_new && (
              <Badge className="bg-green-500">New</Badge>
            )}
            {product.on_sale && (
              <Badge className="bg-red-500">Sale</Badge>
            )}
            {product.badge && (
              <Badge variant={product.badgeVariant || 'default'}>
                {product.badge}
              </Badge>
            )}
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button asChild className="shadow-lg">
              <Link href={`/products/${product.id}`}>
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{product.category || ''}</span>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
              <span className="text-sm text-muted-foreground ml-1">({product.reviews || 0})</span>
            </div>
          </div>
          <CardTitle className="font-serif">{product.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {product.description}
          </CardDescription>
          <div className="flex items-center space-x-2">
            {formatPrice(product.price, product.sale_price)}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex flex-col gap-2">
        <Button asChild className="w-full">
          <Link href={`/products/${product.id}`}>
            View Details
          </Link>
        </Button>
        {product.stock > 0 ? (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => handleAddToCart(product)}
          >
            Add to Cart
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full"
            disabled
          >
            Out of Stock
          </Button>
        )}
      </CardFooter>
    </Card>
  );

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Featured <span className="premium-text">Collections</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Featured <span className="premium-text">Collections</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {featuredProducts.length > 0 
              ? "Discover our carefully curated featured products, handpicked for excellence."
              : "Discover our most popular products, each representing quality and craftsmanship."
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
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 z-10"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-800" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 z-10"
                >
                  <ChevronRight className="h-6 w-6 text-gray-800" />
                </button>
                
                {/* Carousel Dots */}
                <div className="flex justify-center mt-6 space-x-2">
                  {Array.from({ length: Math.max(1, displayProducts.length - 2) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentIndex ? 'bg-primary' : 'bg-gray-300'
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

        <div className="text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/products" className="flex items-center">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts; 