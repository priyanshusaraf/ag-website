'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Star, ArrowRight, Filter, Grid, List, Search } from 'lucide-react';
import api from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest First" }
];

function filterProducts(products, searchTerm, category, sortBy) {
  let filtered = [...products];
  if (searchTerm) {
    const search = searchTerm.toLowerCase();
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(search) ||
      (product.description && product.description.toLowerCase().includes(search)) ||
      (product.category && product.category.toLowerCase().includes(search)) ||
      (product.quality && product.quality.toLowerCase().includes(search))
    );
  }
  if (category && category !== "All Products") {
    filtered = filtered.filter(product => product.category === category);
  }
  filtered.sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "price-asc":
        const priceA = parseFloat(a.sale_price || a.price);
        const priceB = parseFloat(b.sale_price || b.price);
        return priceA - priceB;
      case "price-desc":
        const priceA2 = parseFloat(a.sale_price || a.price);
        const priceB2 = parseFloat(b.sale_price || b.price);
        return priceB2 - priceA2;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "newest":
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      case "featured":
      default:
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    }
  });
  return filtered;
}

const ProductsContent = () => {
  const { addItem } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');

  // Read URL parameters on mount
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlCategory = searchParams.get('category');
    
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
    
    if (urlCategory) {
      // Convert URL category to display format
      const categoryMap = {
        'humidors': 'Humidors',
        'travel-cases': 'Travel Cases',
        'accessories': 'Accessories'
      };
      setSelectedCategory(categoryMap[urlCategory] || urlCategory);
    }
  }, [searchParams]);

  // Update URL when search or category changes
  const updateURL = (newSearch, newCategory) => {
    const params = new URLSearchParams();
    
    if (newSearch && newSearch.trim()) {
      params.set('search', newSearch.trim());
    }
    
    if (newCategory && newCategory !== 'All Products') {
      // Convert display format to URL format
      const urlCategoryMap = {
        'Humidors': 'humidors',
        'Travel Cases': 'travel-cases', 
        'Accessories': 'accessories'
      };
      const urlCategory = urlCategoryMap[newCategory] || newCategory.toLowerCase().replace(/\s+/g, '-');
      params.set('category', urlCategory);
    }

    const newURL = params.toString() ? `?${params.toString()}` : '/products';
    router.replace(`/products${newURL}`, { scroll: false });
  };

  useEffect(() => {
    setLoading(true);
    api.get('/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  // Derive categories from products
  const categories = useMemo(() => {
    const cats = products.reduce((acc, p) => {
      const category = p.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    return [
      { name: 'All Products', count: products.length },
      ...Object.entries(cats).map(([name, count]) => ({ name, count }))
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return filterProducts(products, searchTerm, selectedCategory, sortBy);
  }, [products, searchTerm, selectedCategory, sortBy]);

  const handleAddToCart = (product) => {
    addItem(product);
  };

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    updateURL(newSearchTerm, selectedCategory);
  };

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    updateURL(searchTerm, newCategory);
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

  if (loading) return <div className="p-8 text-center">Loading products...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 lg:py-16 bg-gradient-to-br from-primary/10 to-secondary/10 leather-texture">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-4 lg:space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold">
              Premium <span className="premium-text">Collection</span>
            </h1>
            <p className="text-base lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Discover our complete range of handcrafted cigar containers, humidors, 
              and accessories. Each piece represents decades of refinement and 
              uncompromising attention to detail.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Categories */}
      <section className="py-6 lg:py-8 bg-background border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="space-y-6">
            {/* Categories - Mobile First */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide lg:hidden">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <Button
                    key={index}
                    variant={selectedCategory === category.name ? "default" : "outline"}
                    size="sm"
                    className="text-xs lg:text-sm flex-shrink-0"
                    onClick={() => handleCategoryChange(category.name)}
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>
            </div>

            {/* Search and Controls */}
            <div className="space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-4">
              {/* Search Input */}
              <div className="relative flex-1 lg:max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              {/* Sort and View Controls */}
              <div className="flex items-center gap-3 lg:gap-4">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 lg:flex-none px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 border rounded-md p-1">
                  <Button 
                    variant={viewMode === 'grid' ? "default" : "ghost"} 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={viewMode === 'list' ? "default" : "ghost"} 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Results Info */}
          <div className="mb-6 text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== "All Products" && ` in ${selectedCategory}`}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters
              </p>
            </div>
          ) : (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-4 lg:gap-8`}>
              {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-luxury transition-all duration-300 border-border/50 bg-card">
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
                        <Badge className="bg-primary text-primary-foreground border-primary/20 shadow-md">Featured</Badge>
                      )}
                      {product.is_new && (
                        <Badge className="bg-accent text-accent-foreground border-accent/20 shadow-md">New</Badge>
                      )}
                      {product.on_sale && (
                        <Badge className="bg-destructive text-destructive-foreground border-destructive/20 shadow-md">Sale</Badge>
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

                <CardContent className="p-4 lg:p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs lg:text-sm text-muted-foreground">{product.category || 'Uncategorized'}</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 lg:h-4 lg:w-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                        <span className="text-xs lg:text-sm text-muted-foreground ml-1">({product.reviews || 0})</span>
                      </div>
                    </div>
                    
                    <CardTitle className="font-serif text-base lg:text-lg leading-tight">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2 text-sm">
                      {product.description}
                    </CardDescription>
                    
                    {/* Specifications - More compact on mobile */}
                    <div className="space-y-1 text-xs lg:text-sm">
                      {product.capacity && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Capacity:</span>
                          <span className="text-right">{product.capacity}</span>
                        </div>
                      )}
                      {product.quality && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Quality:</span>
                          <span className="text-right">{product.quality}</span>
                        </div>
                      )}
                      {product.size && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Size:</span>
                          <span className="text-right">{product.size}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stock:</span>
                        <span className={`text-right ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                        </span>
                      </div>
                    </div>

                    <Separator className="my-3 lg:my-4" />
                    
                    <div className="flex items-center space-x-2">
                      {formatPrice(product.price, product.sale_price)}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 lg:p-6 pt-0 flex flex-col gap-2">
                  <Button asChild className="w-full text-sm" size="sm">
                    <Link href={`/products/${product.id}`}>
                      View Details
                    </Link>
                  </Button>
                  {product.stock > 0 ? (
                    <Button 
                      variant="outline" 
                      className="w-full text-sm"
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full text-sm"
                      size="sm"
                      disabled
                    >
                      Out of Stock
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
          )}

          {/* Pagination or Load More could go here */}
          {filteredProducts.length > 0 && (
            <div className="text-center mt-12">
              <p className="text-sm text-muted-foreground">
                Showing all {filteredProducts.length} results
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30 leather-texture">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="font-serif text-xl font-semibold">Free Shipping</h3>
              <p className="text-muted-foreground text-sm">
                Complimentary shipping on orders over ₹500
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="font-serif text-xl font-semibold">Lifetime Warranty</h3>
              <p className="text-muted-foreground text-sm">
                Every piece comes with our lifetime craftsmanship guarantee
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-serif text-xl font-semibold">Personal Consultation</h3>
              <p className="text-muted-foreground text-sm">
                Expert guidance to find your perfect storage solution
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Products = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
};

export default Products; 