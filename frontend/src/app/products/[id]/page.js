'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ArrowLeft, Minus, Plus, Shield, Truck, RotateCcw, Heart, MessageSquare, User } from 'lucide-react';
import api from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

const ProductDetail = () => {
  const params = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${params.id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
        // Load reviews after product loads
        fetchReviews(res.data.id);
      })
      .catch(err => {
        setError('Failed to load product');
        setLoading(false);
      });
  }, [params.id]);

  const fetchReviews = async (productId) => {
    setReviewsLoading(true);
    try {
      const response = await api.get(`/reviews/product/${productId}`);
      if (response.data.success) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;
  }
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <section className="py-6 border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary">Products</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center shadow-luxury overflow-hidden">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-64 h-64 bg-primary/20 rounded-lg flex items-center justify-center">
                    <div className="w-40 h-40 bg-primary/30 rounded"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-muted-foreground">{product.category}</span>
                  {product.badge && (
                    <Badge variant={product.badgeVariant}>
                      {product.badge}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-4">
                  {product.is_featured && (
                    <Badge className="bg-blue-500">Featured</Badge>
                  )}
                  {product.is_new && (
                    <Badge className="bg-green-500">New</Badge>
                  )}
                  {product.on_sale && (
                    <Badge className="bg-red-500">Sale</Badge>
                  )}
                </div>
                
                <h1 className="text-3xl font-serif font-bold mb-4">{product.name}</h1>
                
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                </div>

                <div className="flex items-center space-x-3 mb-6">
                  {product.sale_price && parseFloat(product.sale_price) < parseFloat(product.price) ? (
                    <>
                      <span className="text-3xl font-bold text-green-600">₹{parseFloat(product.sale_price).toLocaleString()}</span>
                      <span className="text-xl text-muted-foreground line-through">₹{parseFloat(product.price).toLocaleString()}</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-primary">₹{parseFloat(product.price).toLocaleString()}</span>
                  )}
                </div>
              </div>

              <Card className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Capacity:</span>
                    <span className="ml-2 font-medium">{product.capacity}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Material:</span>
                    <span className="ml-2 font-medium">{product.material}</span>
                  </div>
                  {product.details?.dimensions && (
                    <div>
                      <span className="text-muted-foreground">Dimensions:</span>
                      <span className="ml-2 font-medium">{product.details.dimensions}</span>
                    </div>
                  )}
                  {product.details?.warranty && (
                    <div>
                      <span className="text-muted-foreground">Warranty:</span>
                      <span className="ml-2 font-medium">{product.details.warranty}</span>
                    </div>
                  )}
                </div>
              </Card>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={incrementQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    className="flex-1" 
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={!product.stock || product.stock <= 0}
                  >
                    {product.stock && product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                {/* Stock Status Display */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Stock Status:</span>
                  <span className={`font-medium ${product.stock && product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock && product.stock > 0 
                      ? `${product.stock} available` 
                      : 'Out of stock'
                    }
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Lifetime Warranty</p>
                </div>
                <div className="text-center">
                  <Truck className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Free Shipping</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">30-Day Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Product Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {product.description}
                </p>
                
                {product.details?.features && (
                  <div>
                    <h4 className="font-semibold mb-3">Key Features:</h4>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      {product.details.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Customer Reviews
                  {product.rating > 0 && (
                    <div className="flex items-center gap-2 ml-4">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${product.rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({product.rating}/5) • {product.reviews || 0} reviews
                      </span>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground">Loading reviews...</div>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No reviews yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Be the first to review this product!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{review.user.name}</span>
                          </div>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${review.rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-muted-foreground leading-relaxed">
                            {review.comment}
                          </p>
                        )}
                        <div className="text-xs text-muted-foreground mt-2">
                          {new Date(review.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail; 