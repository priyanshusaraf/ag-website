'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Receipt,
  Calendar,
  CreditCard,
  Package,
  MapPin,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  AlertCircle,
  User,
  Mail,
  Tag
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import api from '@/lib/utils';
import Link from 'next/link';

const OrderReceiptPage = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { formatPrice } = useCurrency();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/signin?redirect=/orders');
      return;
    }

    if (isAuthenticated && params.id) {
      fetchOrderDetails();
    }
  }, [isAuthenticated, authLoading, params.id, router]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/payment/orders/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setOrder(response.data.order);
      } else {
        setError('Order not found');
      }
    } catch (error) {
      console.error('Fetch order details error:', error);
      if (error.response?.status === 404) {
        setError('Order not found');
      } else {
        setError(error.response?.data?.message || 'Failed to fetch order details');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
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
          <Receipt className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Order Not Found</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button asChild>
              <Link href="/orders">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/orders">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-light">Order Receipt</h1>
              <p className="text-muted-foreground">Order #{order.id}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Badge variant="outline" className="text-sm px-3 py-1">
              <Receipt className="h-4 w-4 mr-1" />
              Order Receipt
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-semibold flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Status</p>
                  <Badge className={getStatusColor(order.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <Badge className={getPaymentStatusColor(order.payment_status)}>
                    <CreditCard className="h-3 w-3 mr-1" />
                    {order.payment_status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-bold text-lg text-primary">
                    {formatPrice(order.total_amount)}
                  </p>
                </div>
              </div>

              {order.payment_id && (
                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Payment Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Payment ID:</span>
                      <span className="ml-2 font-mono text-xs">{order.payment_id}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Order ID (Razorpay):</span>
                      <span className="ml-2 font-mono text-xs">{order.order_id_razorpay}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-sm mb-3">Billing Information</h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {order.users.name}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {order.users.email}
                    </p>
                  </div>
                </div>

                {order.shipping_address && (
                  <div>
                    <h4 className="font-semibold text-sm mb-3">Shipping Address</h4>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="text-sm">
                        <pre className="whitespace-pre-wrap font-sans">{order.shipping_address}</pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.order_items.map((item, index) => {
                  let customization = null;
                  if (item.customization_details) {
                    try { customization = JSON.parse(item.customization_details); } catch {}
                  }
                  const engravingEntries = customization
                    ? Object.entries(customization).filter(([k, v]) => v && v !== 'N/A')
                    : [];
                  return (
                    <div key={item.id}>
                      {index > 0 && <Separator />}
                      <div className="flex gap-4 py-3">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {item.products.image_url ? (
                            <img
                              src={item.products.image_url}
                              alt={item.products.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-primary/20 rounded"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-base">{item.products.name}</h4>

                          {/* Category */}
                          {item.products.category && (
                            <p className="text-sm text-muted-foreground">{item.products.category}</p>
                          )}

                          {/* Product specifications */}
                          <div className="mt-2 space-y-1">
                            {item.products.quality && (
                              <div className="flex gap-2 text-xs">
                                <span className="font-medium text-foreground/70 w-20">Material:</span>
                                <span>{item.products.quality}</span>
                              </div>
                            )}
                            {item.products.size && (
                              <div className="flex gap-2 text-xs">
                                <span className="font-medium text-foreground/70 w-20">Size:</span>
                                <span>{item.products.size}</span>
                              </div>
                            )}
                            {item.products.capacity && (
                              <div className="flex gap-2 text-xs">
                                <span className="font-medium text-foreground/70 w-20">Capacity:</span>
                                <span>{item.products.capacity}</span>
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          {item.products.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.products.description}</p>
                          )}

                          {/* Customisation / Engravings */}
                          {engravingEntries.length > 0 && (
                            <div className="mt-2 p-2 bg-primary/5 border border-primary/20 rounded-md">
                              <p className="text-xs font-semibold text-primary mb-1 flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                Personalisation &amp; Engravings
                              </p>
                              <div className="space-y-0.5">
                                {engravingEntries.map(([k, v]) => (
                                  <div key={k} className="flex gap-2 text-xs">
                                    <span className="font-medium capitalize text-foreground/70 min-w-[80px]">{k}:</span>
                                    <span className="text-foreground">{v}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-3">
                            <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                            <div className="text-right">
                              <p className="font-semibold">{formatPrice(parseFloat(item.price_at_purchase) * item.quantity)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <Separator />

                {/* Order Total */}
                {(() => {
                  const shippingCharge = parseFloat(order.shipping_charge || 0);
                  const discountAmount = parseFloat(order.discount_amount || 0);
                  const total = parseFloat(order.total_amount);
                  const subtotal = total + discountAmount - shippingCharge;
                  return (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-1 text-green-600">
                            <Tag className="h-3 w-3" />
                            Discount {order.discount_code ? `(${order.discount_code})` : ''}:
                          </span>
                          <span className="text-green-600">-{formatPrice(discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>Shipping:</span>
                        {shippingCharge > 0 ? (
                          <span className="text-amber-600">{formatPrice(shippingCharge)}</span>
                        ) : (
                          <span className="text-green-600">Free</span>
                        )}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax:</span>
                        <span>Included</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Paid:</span>
                        <span className="text-primary">{formatPrice(order.total_amount)}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </CardContent>
          </Card>

          {/* Order Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm">{order.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-2">
                Thank you for your purchase!
              </p>
              <p className="text-xs text-muted-foreground">
                For any queries, please contact us at support@andregarcia.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderReceiptPage; 