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
  Download, 
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
  Phone
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/utils';
import Link from 'next/link';

const OrderReceiptPage = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
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

  const handlePrint = () => {
    window.print();
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
              <h1 className="text-3xl font-serif font-bold">Order Receipt</h1>
              <p className="text-muted-foreground">Order #{order.id}</p>
            </div>
          </div>
          
          <Button onClick={handlePrint} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Print Receipt
          </Button>
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
                    ₹{parseFloat(order.total_amount).toLocaleString()}
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
                {order.order_items.map((item, index) => (
                  <div key={item.id}>
                    {index > 0 && <Separator />}
                    <div className="flex gap-4 py-2">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
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
                        <h4 className="font-semibold">{item.products.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.products.category}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm">Quantity: {item.quantity}</span>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Unit Price: ₹{parseFloat(item.price_at_purchase).toLocaleString()}</p>
                            <p className="font-semibold">Total: ₹{(parseFloat(item.price_at_purchase) * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Separator />

                {/* Order Total */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>₹{parseFloat(order.total_amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>Included</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Paid:</span>
                    <span className="text-primary">₹{parseFloat(order.total_amount).toLocaleString()}</span>
                  </div>
                </div>
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