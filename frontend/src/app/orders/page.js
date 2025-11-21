'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  CreditCard, 
  Eye, 
  ChevronDown, 
  ChevronUp,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Star,
  MessageSquare,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import api from '@/lib/utils';
import Link from 'next/link';

const OrdersPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { addItem } = useCart();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [reviewModal, setReviewModal] = useState({ open: false, product: null, order: null });
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/signin?redirect=/orders');
      return;
    }

    if (isAuthenticated) {
      fetchOrders();
      fetchFeaturedProducts();
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token || token === 'null' || token === 'undefined') {
        router.push('/auth/signin?redirect=/orders');
        return;
      }
      
      const response = await api.get('/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
      setError(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      setFeaturedLoading(true);
      const response = await api.get('/products?featured=true&limit=4');
      if (response.data.success) {
        setFeaturedProducts(response.data.products);
      }
    } catch (error) {
      console.error('Fetch featured products error:', error);
    } finally {
      setFeaturedLoading(false);
    }
  };

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const openReviewModal = (product, order) => {
    setReviewModal({ open: true, product, order });
    setReviewData({ rating: 5, comment: '' });
  };

  const closeReviewModal = () => {
    setReviewModal({ open: false, product: null, order: null });
    setReviewData({ rating: 5, comment: '' });
  };

  const submitReview = async () => {
    if (!reviewModal.product || !reviewModal.order) return;

    setSubmittingReview(true);
    try {
      const response = await api.post('/reviews', {
        product_id: reviewModal.product.id,
        order_id: reviewModal.order.id,
        rating: reviewData.rating,
        comment: reviewData.comment
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        alert('Review submitted successfully!');
        closeReviewModal();
        // Optionally refresh orders to show updated review status
        fetchOrders();
      } else {
        alert(response.data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Submit review error:', error);
      alert(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'in_transit':
        return <Truck className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (authLoading || !isAuthenticated) {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-serif font-bold">My Orders</h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {orders.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Button asChild>
                <Link href="/products">
                  Start Shopping
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <CardTitle className="text-lg">
                          Order #{order.id}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(order.created_at)}
                        </p>
                        {order.tracking_number && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            Tracking: {order.tracking_number}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-lg">₹{parseFloat(order.total_amount).toLocaleString()}</p>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(order.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </Badge>
                          <Badge className={getPaymentStatusColor(order.payment_status)}>
                            <CreditCard className="h-3 w-3 mr-1" />
                            {order.payment_status}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleOrderExpansion(order.id)}
                      >
                        {expandedOrders.has(order.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {expandedOrders.has(order.id) && (
                  <CardContent className="pt-0">
                    <Separator className="mb-4" />
                    
                    {/* Order Items */}
                    <div className="space-y-3 mb-4">
                      <h4 className="font-semibold text-sm">Order Items</h4>
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex gap-4 p-3 border rounded-lg">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {item.products.image_url ? (
                              <img 
                                src={item.products.image_url} 
                                alt={item.products.name} 
                                className="w-full h-full object-cover rounded-md" 
                              />
                            ) : (
                              <div className="w-6 h-6 bg-primary/20 rounded"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">{item.products.name}</h5>
                            <p className="text-xs text-muted-foreground">{item.products.category}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs">Qty: {item.quantity}</span>
                              <span className="text-sm font-medium">
                                ₹{parseFloat(item.price_at_purchase).toLocaleString()}
                              </span>
                            </div>
                            {order.status === 'completed' && (
                              <div className="mt-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => openReviewModal(item.products, order)}
                                  className="w-full"
                                >
                                  <Star className="h-3 w-3 mr-1" />
                                  Write Review
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Payment Information */}
                    {order.payment_id && (
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-semibold text-sm mb-2">Payment Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Payment ID:</span>
                            <span className="ml-2 font-mono">{order.payment_id}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Payment Status:</span>
                            <span className="ml-2 capitalize">{order.payment_status}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Shipping Information */}
                    {order.shipping_address && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-sm mb-2">Shipping Address</h4>
                        <div className="bg-muted/30 p-4 rounded-lg">
                          <pre className="text-sm whitespace-pre-wrap font-sans">{order.shipping_address}</pre>
                        </div>
                      </div>
                    )}

                    {/* Order Notes */}
                    {order.notes && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-sm mb-2">Order Notes</h4>
                        <div className="bg-muted/30 p-4 rounded-lg">
                          <p className="text-sm">{order.notes}</p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/orders/${order.id}`}>
                          <Eye className="h-3 w-3 mr-1" />
                          View Receipt
                        </Link>
                      </Button>
                      {order.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          Reorder
                        </Button>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Review Modal */}
        <Dialog open={reviewModal.open} onOpenChange={closeReviewModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
              <DialogDescription>
                Share your experience with {reviewModal.product?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="rating">Rating</Label>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                      className={`text-2xl ${reviewData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="comment">Comment (Optional)</Label>
                <Textarea
                  id="comment"
                  value={reviewData.comment}
                  onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your thoughts about this product..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={submitReview} 
                  disabled={submittingReview}
                  className="flex-1"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button variant="outline" onClick={closeReviewModal}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold">Featured Products</h2>
              <Button variant="outline" asChild>
                <Link href="/products">
                  View All Products
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      ) : (
                        <div className="w-16 h-16 bg-primary/20 rounded"></div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary">
                          ₹{parseFloat(product.sale_price || product.price).toLocaleString()}
                        </span>
                        {product.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs">{product.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => addItem(product, 1)}
                      >
                        <ShoppingBag className="h-3 w-3 mr-1" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage; 