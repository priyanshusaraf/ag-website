'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, Package, MapPin, CheckCircle, Globe, Tag, X, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import api from '@/lib/utils';
import Link from 'next/link';

const CheckoutPage = () => {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { formatPrice } = useCurrency();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const paymentSuccessRef = useRef(false);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discount_amount, discount_type, discount_value }
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const isInternational = shippingAddress.country.trim().toLowerCase() !== 'india';
  const INTERNATIONAL_SHIPPING_INR = 6250; // $75 USD at 1/0.012
  const shippingChargeINR = isInternational ? INTERNATIONAL_SHIPPING_INR : 0;
  const discountAmount = appliedCoupon ? appliedCoupon.discount_amount : 0;
  const grandTotal = totalPrice - discountAmount + shippingChargeINR;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/signin?redirect=/checkout');
      return;
    }

    // Don't redirect if payment was successful
    if (items.length === 0 && !success && !paymentSuccessRef.current) {
      router.push('/cart');
      return;
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [isAuthenticated, items.length, router, success]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const required = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode', 'country'];
    for (let field of required) {
      if (!shippingAddress[field]?.trim()) {
        setError(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingAddress.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Phone validation: 10 digits for India, at least 7 digits for international
    const digits = shippingAddress.phone.replace(/\D/g, '');
    if (isInternational) {
      if (digits.length < 7 || digits.length > 15) {
        setError('Please enter a valid phone number');
        return false;
      }
    } else {
      if (!/^\d{10}$/.test(digits)) {
        setError('Please enter a valid 10-digit phone number');
        return false;
      }
    }

    return true;
  };

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const response = await api.post('/coupons/validate', {
        code: couponInput.trim().toUpperCase(),
        order_amount: totalPrice,
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
        setAppliedCoupon(response.data.coupon);
        setCouponError('');
      }
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      // Prepare order items for backend
      const orderItems = items.map(item => {
        const product = item.products || item;
        const override = item.price_override != null ? parseFloat(item.price_override) : null;
        const unitPrice = override || parseFloat(product.sale_price || product.price);
        const orderItem = {
          product_id: product.id,
          quantity: item.quantity,
          price: unitPrice,
        };
        if (item.customization_details) {
          try { orderItem.customization = JSON.parse(item.customization_details); } catch {}
        }
        return orderItem;
      });

      // Create order in backend
      const response = await api.post('/payment/create-order', {
        amount: grandTotal,
        items: orderItems,
        shipping_address: `${shippingAddress.fullName}\n${shippingAddress.address}\n${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}\n${shippingAddress.country}\nPhone: ${shippingAddress.phone}`,
        country: shippingAddress.country,
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const { order_id, amount, currency, key_id } = response.data;

      // Configure Razorpay
      const options = {
        key: key_id,
        amount: amount,
        currency: currency,
        name: 'André García',
        description: 'Premium Cigar Containers',
        order_id: order_id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await api.post('/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });

            if (verifyResponse.data.success) {
              setOrderId(verifyResponse.data.order.id);
              setSuccess(true);
              paymentSuccessRef.current = true;
              clearCart();
            } else {
              setError('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          email: shippingAddress.email,
          contact: shippingAddress.phone,
        },
        theme: {
          color: '#8b4513',
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        setError(
          response.error?.description ||
          'Payment failed. Please try again or use a different payment method.'
        );
        setIsLoading(false);
      });
      rzp.open();

    } catch (error) {
      console.error('Checkout error:', error);
      setError(error.response?.data?.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/30 to-background p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-luxury text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-light">Order Placed Successfully!</CardTitle>
              <CardDescription>
                Your payment has been confirmed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">
                Order ID: <span className="font-mono text-foreground">#{orderId}</span>
              </p>
              <p className="text-muted-foreground mb-6">
                You will receive a confirmation email shortly with your order details.
              </p>
            </CardContent>
            <div className="p-6 pt-0 flex flex-col space-y-3">
              <Button asChild className="w-full">
                <Link href="/orders">
                  View My Orders
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/">
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || items.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-light">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={shippingAddress.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete address"
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country *</Label>
                  <select
                    id="country"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="UAE">UAE</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Japan">Japan</option>
                    <option value="Other">Other (International)</option>
                  </select>
                </div>

                {isInternational && (
                  <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800">
                    <Globe className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800 dark:text-amber-200">
                      <strong>International Shipping:</strong> A flat fee of <strong>$75 USD</strong> ({formatPrice(INTERNATIONAL_SHIPPING_INR)}) applies for all deliveries outside India.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State / Province *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      placeholder="State / Province"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode / ZIP *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={shippingAddress.pincode}
                      onChange={handleInputChange}
                      placeholder="Pincode / ZIP"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => {
                  const product = item.products || item;
                  const override = item.price_override != null ? parseFloat(item.price_override) : null;
                  const unitPrice = override || parseFloat(product.sale_price || product.price);
                  let customization = null;
                  if (item.customization_details) {
                    try { customization = JSON.parse(item.customization_details); } catch {}
                  }
                  return (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-md" />
                        ) : (
                          <div className="w-8 h-8 bg-primary/20 rounded"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{product.name}</h4>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                        {customization && (
                          <div className="text-[11px] text-muted-foreground mt-1 space-y-0.5">
                            {Object.entries(customization).filter(([, v]) => v && v !== 'N/A').map(([k, v]) => (
                              <span key={k} className="block capitalize">{k}: {v}</span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm">Qty: {item.quantity}</span>
                          <span className="font-bold text-primary">
                            {formatPrice(unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <Separator />

                {/* Coupon Code */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    Discount Coupon
                  </Label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                      <div>
                        <p className="text-sm font-semibold text-green-700 dark:text-green-400 font-mono">{appliedCoupon.code}</p>
                        <p className="text-xs text-green-600 dark:text-green-500">
                          {appliedCoupon.discount_type === 'percent'
                            ? `${appliedCoupon.discount_value}% off`
                            : `₹${parseFloat(appliedCoupon.discount_value).toLocaleString('en-IN')} off`}
                          {' · '}Saving {formatPrice(appliedCoupon.discount_amount)}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={removeCoupon} className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                        placeholder="Enter coupon code"
                        className="font-mono uppercase text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                      />
                      <Button
                        variant="outline"
                        onClick={applyCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                        className="flex-shrink-0"
                      >
                        {couponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                      </Button>
                    </div>
                  )}
                  {couponError && (
                    <p className="text-xs text-red-500">{couponError}</p>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        Discount ({appliedCoupon?.code}):
                      </span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    {isInternational ? (
                      <span className="text-amber-600 font-medium">{formatPrice(shippingChargeINR)}</span>
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
                    <span>Total:</span>
                    <span className="text-primary">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handlePayment}
                  disabled={isLoading}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  {isLoading ? 'Processing...' : `Pay ${formatPrice(grandTotal)}`}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Your payment is secured by Razorpay. Your card details are safe and encrypted.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 