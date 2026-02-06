'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Minus, Plus, ShoppingCart, ArrowLeft, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { hardcodedCollections, zodiacSigns, boneCarvingOptions as defaultBoneCarvingOptions } from './collectionDefaults';

export default function CollectionPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;
  const { addItem } = useCart();
  const { toast } = useToast();

  const [collection, setCollection] = useState(null);
  const [allCollections, setAllCollections] = useState({});
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedLeather, setSelectedLeather] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedZodiac, setSelectedZodiac] = useState('');
  const [selectedBoneCarving, setSelectedBoneCarving] = useState('none');
  const [selectedCapacity, setSelectedCapacity] = useState('');
  const [initialsText, setInitialsText] = useState('');

  // Fetch collection from API with fallback to hardcoded data
  useEffect(() => {
    async function fetchCollection() {
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/collections`);
        if (res.ok) {
          const data = await res.json();
          if (data?.collections && data.collections.length > 0) {
            // Build a slug → collection map from API data
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

      // Fallback to hardcoded
      setAllCollections(hardcodedCollections);
      setCollection(hardcodedCollections[slug] || null);
      setLoading(false);
    }

    fetchCollection();
  }, [slug]);

  // Handle redirect collections
  useEffect(() => {
    if (collection?.redirect) {
      router.replace(collection.redirect);
    }
  }, [collection, router]);

  // Reset image when product changes
  useEffect(() => {
    setSelectedImage(0);
  }, [selectedProduct]);

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
          <p className="text-white/60 mb-6">The collection you're looking for doesn't exist.</p>
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

  // Show loading state while redirecting
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

  const currentProduct = collection.products[selectedProduct] || collection.products[0];
  const boneCarvingOpts = defaultBoneCarvingOptions;

  const calculateTotalPrice = () => {
    let total = currentProduct.basePrice * quantity;
    
    // Add leather price
    if (selectedLeather && collection.leatherOptions) {
      const leather = collection.leatherOptions.find(l => l.value === selectedLeather);
      if (leather) total += (leather.price || 0) * quantity;
    }
    
    // Add size price
    if (selectedSize && collection.sizeOptions) {
      const size = collection.sizeOptions.find(s => s.value === selectedSize);
      if (size && size.price) total += size.price * quantity;
    }
    
    // Add bone carving price
    if (selectedBoneCarving && selectedBoneCarving !== 'none') {
      const carving = boneCarvingOpts.find(b => b.value === selectedBoneCarving);
      if (carving) total += carving.price * quantity;
    }
    
    // Add capacity price
    if (selectedCapacity && collection.capacityOptions) {
      const capacity = collection.capacityOptions.find(c => c.value === selectedCapacity);
      if (capacity) total += (capacity.price || 0) * quantity;
    }
    
    // Add initials embossing price
    if (initialsText.trim()) {
      total += 2975 * quantity;
    }
    
    return total;
  };

  const handleAddToCart = () => {
    if (collection.leatherOptions?.length > 0 && !selectedLeather) {
      toast({
        title: 'Selection Required',
        description: `Please select a ${(collection.leatherLabel || 'leather').toLowerCase()} option.`,
        variant: 'destructive',
      });
      return;
    }
    
    if (collection.sizeOptions?.length > 0 && !selectedSize) {
      toast({
        title: 'Selection Required',
        description: 'Please select a size.',
        variant: 'destructive',
      });
      return;
    }

    if (collection.capacityOptions?.length > 0 && !selectedCapacity) {
      toast({
        title: 'Selection Required',
        description: 'Please select a capacity.',
        variant: 'destructive',
      });
      return;
    }

    if (collection.zodiacOptions && !selectedZodiac) {
      toast({
        title: 'Selection Required',
        description: 'Please select a zodiac sign.',
        variant: 'destructive',
      });
      return;
    }

    const leatherLabel = collection.leatherOptions?.find(l => l.value === selectedLeather)?.label || '';
    const sizeLabel = collection.sizeOptions?.find(s => s.value === selectedSize)?.label || '';
    const capacityLabel = collection.capacityOptions?.find(c => c.value === selectedCapacity)?.label || '';
    const zodiacLabel = zodiacSigns.find(z => z.value === selectedZodiac)?.label || '';
    const carvingLabel = boneCarvingOpts.find(c => c.value === selectedBoneCarving)?.label || '';

    const product = {
      id: `${currentProduct.id}-${Date.now()}`,
      name: `${currentProduct.name}${leatherLabel ? ` - ${leatherLabel}` : ''}`,
      price: calculateTotalPrice() / quantity,
      image_url: currentProduct.images?.[0] || collection.heroImage || '',
      quantity: quantity,
      customization: {
        leather: leatherLabel || 'N/A',
        size: sizeLabel || 'N/A',
        ...(capacityLabel && { capacity: capacityLabel }),
        zodiac: zodiacLabel || 'N/A',
        boneCarving: carvingLabel || 'N/A',
        initials: initialsText || 'N/A',
      },
    };

    addItem(product, quantity);
  };

  const nextImage = () => {
    if (currentProduct.images?.length > 1) {
      setSelectedImage((prev) => (prev + 1) % currentProduct.images.length);
    }
  };

  const prevImage = () => {
    if (currentProduct.images?.length > 1) {
      setSelectedImage((prev) => (prev - 1 + currentProduct.images.length) % currentProduct.images.length);
    }
  };

  // Get other collections for the "Explore" section
  const otherCollections = Object.entries(allCollections)
    .filter(([key]) => key !== slug)
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
      <div className="bg-[#0a0a0b] border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-12">
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
                  <img src={img.src} alt={img.alt || img.title || ''} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product Selection */}
      {collection.products.length > 1 && (
        <div className="bg-[#111112] border-b border-white/10">
          <div className="container mx-auto px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Label className="text-white/60 text-sm font-medium whitespace-nowrap">Select Product:</Label>
              <Select 
                value={selectedProduct.toString()} 
                onValueChange={(value) => setSelectedProduct(parseInt(value))}
              >
                <SelectTrigger className="bg-[#0a0a0b] border-white/10 text-white max-w-md">
                  <SelectValue placeholder="Choose a product" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1b] border-white/10 max-h-[300px]">
                  {collection.products.map((product, index) => (
                    <SelectItem 
                      key={product.id} 
                      value={index.toString()}
                      className="text-white hover:bg-white/10 cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span>{product.name}</span>
                        <span className="text-primary font-medium">₹{product.basePrice}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Main Product Section */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-[#111112] rounded-lg overflow-hidden group">
              {currentProduct.images?.length > 0 ? (
                <img
                  src={currentProduct.images[selectedImage] || currentProduct.images[0]}
                  alt={currentProduct.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/30">
                  No image available
                </div>
              )}
              
              {/* Navigation Arrows */}
              {currentProduct.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="h-6 w-6 text-white" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {currentProduct.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {currentProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-[#111112] rounded overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary'
                        : 'border-transparent hover:border-white/20'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${currentProduct.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Customization */}
          <div className="space-y-6">
            {/* Product Title & Price */}
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-white mb-2">
                {currentProduct.name}
              </h2>
              <p className="text-sm text-white/50 mb-4">{currentProduct.availability}</p>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">₹{calculateTotalPrice().toFixed(2)}</span>
                {calculateTotalPrice() !== currentProduct.basePrice * quantity && (
                  <span className="text-sm text-white/40">
                    (Base: ₹{currentProduct.basePrice.toFixed(2)})
                  </span>
                )}
              </div>
            </div>

            {/* Product Description */}
            {currentProduct.description && (
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-sm font-medium text-white/80 mb-2">Product Description</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  {currentProduct.description}
                </p>
              </div>
            )}

            {/* Customization Options */}
            <div className="space-y-5 pt-4 border-t border-white/10">
              {/* Leather/Finish Selection */}
              {collection.leatherOptions?.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-white/80 text-sm font-medium">
                    {collection.leatherLabel || 'Leather'} <span className="text-primary">*</span>
                  </Label>
                  <Select value={selectedLeather} onValueChange={setSelectedLeather}>
                    <SelectTrigger className="bg-[#111112] border-white/10 text-white">
                      <SelectValue placeholder={`Select ${(collection.leatherLabel || 'leather').toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1b] border-white/10">
                      {collection.leatherOptions.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          className="text-white hover:bg-white/10"
                        >
                          {option.label} {option.price > 0 ? `(+₹${option.price})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Zodiac Sign Selection */}
              {collection.zodiacOptions && (
                <div className="space-y-2">
                  <Label className="text-white/80 text-sm font-medium">
                    Zodiac <span className="text-primary">*</span>
                  </Label>
                  <Select value={selectedZodiac} onValueChange={setSelectedZodiac}>
                    <SelectTrigger className="bg-[#111112] border-white/10 text-white">
                      <SelectValue placeholder="Select zodiac sign" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1b] border-white/10">
                      {zodiacSigns.map((sign) => (
                        <SelectItem 
                          key={sign.value} 
                          value={sign.value}
                          className="text-white hover:bg-white/10"
                        >
                          {sign.symbol} {sign.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Bone Carving Selection */}
              {collection.boneCarvingOptions && (
                <div className="space-y-2">
                  <Label className="text-white/80 text-sm font-medium">Bone-Carving</Label>
                  <Select value={selectedBoneCarving} onValueChange={setSelectedBoneCarving}>
                    <SelectTrigger className="bg-[#111112] border-white/10 text-white">
                      <SelectValue placeholder="Select carving option" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1b] border-white/10">
                      {boneCarvingOpts.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          className="text-white hover:bg-white/10"
                        >
                          {option.label} {option.price > 0 ? `(+₹${option.price})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Size Selection */}
              {collection.sizeOptions?.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-white/80 text-sm font-medium">
                    Size <span className="text-primary">*</span>
                  </Label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger className="bg-[#111112] border-white/10 text-white">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1b] border-white/10">
                      {collection.sizeOptions.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          className="text-white hover:bg-white/10"
                        >
                          {option.label} {option.description ? `- ${option.description}` : ''} {option.price > 0 ? `(+₹${option.price})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Capacity Selection */}
              {collection.capacityOptions?.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-white/80 text-sm font-medium">
                    Capacity <span className="text-primary">*</span>
                  </Label>
                  <Select value={selectedCapacity} onValueChange={setSelectedCapacity}>
                    <SelectTrigger className="bg-[#111112] border-white/10 text-white">
                      <SelectValue placeholder="Select capacity" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1b] border-white/10">
                      {collection.capacityOptions.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          className="text-white hover:bg-white/10"
                        >
                          {option.label} {option.price > 0 ? `(+₹${option.price})` : option.price < 0 ? `(-₹${Math.abs(option.price)})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Initials Embossing */}
              <div className="space-y-2">
                <Label className="text-white/80 text-sm font-medium">
                  Initials Embossing <span className="text-white/40">(+₹2,975)</span>
                </Label>
                <div className="flex gap-2">
                  {[0, 1, 2].map((index) => (
                    <Input
                      key={index}
                      maxLength={1}
                      value={initialsText[index] || ''}
                      onChange={(e) => {
                        const newInitials = initialsText.split('');
                        newInitials[index] = e.target.value.toUpperCase();
                        setInitialsText(newInitials.join(''));
                        if (e.target.value && index < 2) {
                          const nextInput = document.querySelector(`input[data-initial-index="${index + 1}"]`);
                          if (nextInput) nextInput.focus();
                        }
                      }}
                      data-initial-index={index}
                      className="w-12 h-12 text-center text-xl uppercase bg-[#111112] border-white/10 text-white"
                      placeholder="_"
                    />
                  ))}
                </div>
                <p className="text-xs text-white/40">
                  Optional: Add up to 3 characters for personalization
                </p>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label className="text-white/80 text-sm font-medium">Quantity</Label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="bg-[#111112] border-white/10 text-white hover:bg-white/10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-semibold text-white w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-[#111112] border-white/10 text-white hover:bg-white/10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              size="lg"
              className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              ADD TO BAG - ₹{calculateTotalPrice().toFixed(2)}
            </Button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div className="text-center">
                <Truck className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-xs text-white/50">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-xs text-white/50">Lifetime Warranty</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-xs text-white/50">30-Day Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        {collection.features?.length > 0 && (
          <div className="mt-16 pt-16 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-light text-white mb-6">Features</h3>
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
        )}
      </div>

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
                      src={col.heroImage}
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
