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
import { ArrowLeft, CreditCard, Package, MapPin, CheckCircle, Globe, Tag, X, Loader2, Phone } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import api from '@/lib/utils';
import Link from 'next/link';

// ── Complete list of all 195 UN-recognised countries ─────────────────────────
// India is first so it appears at the top of the dropdown
const ALL_COUNTRIES = [
  'India',
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda',
  'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
  'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize',
  'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil',
  'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
  'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad',
  'Chile', 'China', 'Colombia', 'Comoros', 'Congo (Brazzaville)', 'Congo (Kinshasa)',
  'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
  'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia',
  'Eswatini', 'Ethiopia',
  'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala',
  'Guinea', 'Guinea-Bissau', 'Guyana',
  'Haiti', 'Honduras', 'Hungary',
  'Iceland', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast',
  'Jamaica', 'Japan', 'Jordan',
  'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan',
  'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein',
  'Lithuania', 'Luxembourg',
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands',
  'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia',
  'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
  'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger',
  'Nigeria', 'North Korea', 'North Macedonia', 'Norway',
  'Oman',
  'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru',
  'Philippines', 'Poland', 'Portugal',
  'Qatar',
  'Romania', 'Russia', 'Rwanda',
  'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa',
  'San Marino', 'São Tomé and Príncipe', 'Saudi Arabia', 'Senegal', 'Serbia',
  'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands',
  'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka',
  'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga',
  'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
  'UAE', 'Uganda', 'Ukraine', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
  'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
  'Yemen',
  'Zambia', 'Zimbabwe',
];

// ── Pincode / postal-code validation ─────────────────────────────────────────
// Must match the backend rules in paymentController.js
const INDIA_PINCODE_REGEX = /^\d{6}$/;
const INTL_POSTAL_REGEX   = /^[A-Z0-9][A-Z0-9\s\-]{2,14}$/i;

const CheckoutPage = () => {
  const router = useRouter();
  const { items, totalPrice, clearCart, loading: cartLoading } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { formatPrice } = useCurrency();

  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState(false);
  const [orderId, setOrderId]       = useState('');
  const paymentSuccessRef           = useRef(false);

  // Coupon state
  const [couponInput, setCouponInput]     = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError]     = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  // Country search filter
  const [countrySearch, setCountrySearch] = useState('');

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name  || '',
    email:    user?.email || '',
    phone:    '',
    address:  '',
    city:     '',
    state:    '',
    pincode:  '',
    country:  'India',
  });

  const isInternational        = shippingAddress.country.trim().toLowerCase() !== 'india';
  const INTERNATIONAL_SHIPPING_INR = 6250; // $75 USD at 1/0.012 — must match paymentController constant
  const shippingChargeINR      = isInternational ? INTERNATIONAL_SHIPPING_INR : 0;
  const discountAmount         = appliedCoupon ? appliedCoupon.discount_amount : 0;
  const grandTotal             = totalPrice - discountAmount + shippingChargeINR;

  // Filtered country list for the searchable dropdown
  const filteredCountries = countrySearch.trim()
    ? ALL_COUNTRIES.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()))
    : ALL_COUNTRIES;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/signin?redirect=/checkout');
      return;
    }
    if (!cartLoading && items.length === 0 && !success && !paymentSuccessRef.current) {
      router.push('/cart');
      return;
    }

    const script = document.createElement('script');
    script.src   = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, [isAuthenticated, items.length, cartLoading, router, success]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
    // Reset country search when country changes via direct select
    if (name === 'country') setCountrySearch('');
  };

  // ── Client-side form validation ─────────────────────────────────────────────
  const validateForm = () => {
    const required = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode', 'country'];
    for (const field of required) {
      if (!shippingAddress[field]?.trim()) {
        setError(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
        return false;
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    const digits = shippingAddress.phone.replace(/\D/g, '');
    if (isInternational) {
      if (digits.length < 7 || digits.length > 15) {
        setError('Please enter a valid international phone number (7–15 digits, including country code).');
        return false;
      }
    } else {
      if (!/^\d{10}$/.test(digits)) {
        setError('Please enter a valid 10-digit Indian mobile number.');
        return false;
      }
    }

    // Pincode format validation — mirrors backend logic
    const pin = shippingAddress.pincode.trim();
    if (!isInternational) {
      if (!INDIA_PINCODE_REGEX.test(pin)) {
        setError('Indian PIN code must be exactly 6 digits (e.g. 110001).');
        return false;
      }
    } else {
      if (!INTL_POSTAL_REGEX.test(pin)) {
        setError('Please enter a valid postal / ZIP code (3–15 alphanumeric characters).');
        return false;
      }
      // Warn if user picked a non-India country but typed an Indian-looking PIN
      if (INDIA_PINCODE_REGEX.test(pin)) {
        setError(
          `Your postal code "${pin}" looks like an Indian PIN code, but you selected "${shippingAddress.country}" as your country. ` +
          `Please verify your country and postal code — international orders include a $75 shipping fee.`
        );
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
        code:         couponInput.trim().toUpperCase(),
        order_amount: totalPrice,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
      const orderItems = items.map(item => {
        const product   = item.products || item;
        const override  = item.price_override != null ? parseFloat(item.price_override) : null;
        const unitPrice = override || parseFloat(product.sale_price || product.price);
        const orderItem = { product_id: product.id, quantity: item.quantity, price: unitPrice };
        if (item.customization_details) {
          try { orderItem.customization = JSON.parse(item.customization_details); } catch {}
        }
        return orderItem;
      });

      // Send structured shipping_details — the backend builds the text blob and validates
      const response = await api.post('/payment/create-order', {
        amount:  grandTotal,
        items:   orderItems,
        shipping_details: {
          fullName: shippingAddress.fullName,
          email:    shippingAddress.email,
          phone:    shippingAddress.phone,
          address:  shippingAddress.address,
          city:     shippingAddress.city,
          state:    shippingAddress.state,
          pincode:  shippingAddress.pincode,
          country:  shippingAddress.country,
        },
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const { order_id, amount, currency, key_id } = response.data;

      const options = {
        key:         key_id,
        amount,
        currency,
        name:        'André García',
        description: 'Premium Cigar Containers',
        order_id,
        handler: async function (rzpResponse) {
          try {
            const verifyResponse = await api.post('/payment/verify-payment', {
              razorpay_order_id:   rzpResponse.razorpay_order_id,
              razorpay_payment_id: rzpResponse.razorpay_payment_id,
              razorpay_signature:  rzpResponse.razorpay_signature,
            }, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            if (verifyResponse.data.success) {
              setOrderId(verifyResponse.data.order.id);
              setSuccess(true);
              paymentSuccessRef.current = true;
              clearCart();
            } else {
              setError('Payment verification failed. Please contact support.');
            }
          } catch (verifyErr) {
            console.error('Payment verification error:', verifyErr);
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name:    shippingAddress.fullName,
          email:   shippingAddress.email,
          contact: shippingAddress.phone,
        },
        theme: { color: '#8b4513' },
        modal: { ondismiss: () => setIsLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (rzpResponse) => {
        console.error('Payment failed:', rzpResponse.error);
        setError(
          rzpResponse.error?.description ||
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
              <CardDescription>Your payment has been confirmed</CardDescription>
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
                <Link href="/orders">View My Orders</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (cartLoading ? false : items.length === 0)) return null;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-3xl font-light">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Shipping Information ───────────────────────────────────────── */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName" name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email" name="email" type="email"
                      value={shippingAddress.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone" name="phone"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    placeholder={isInternational ? '+1 212 555 0100 (include country code)' : '10-digit mobile number'}
                  />
                  {isInternational && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Include your country dialling code (e.g. +1, +44, +971).
                    </p>
                  )}
                </div>

                {/* Street address */}
                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address" name="address"
                    value={shippingAddress.address}
                    onChange={handleInputChange}
                    placeholder="House / flat number, street, area"
                  />
                </div>

                {/* Country — searchable full list */}
                <div>
                  <Label htmlFor="countrySearch" className="flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5" />
                    Country *
                  </Label>
                  <Input
                    id="countrySearch"
                    value={countrySearch || shippingAddress.country}
                    onChange={(e) => {
                      setCountrySearch(e.target.value);
                    }}
                    placeholder="Type to search countries..."
                    className="mb-1"
                    autoComplete="off"
                  />
                  <select
                    id="country" name="country"
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                    size={countrySearch ? Math.min(filteredCountries.length + 1, 6) : 1}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {filteredCountries.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Currently selected: <strong>{shippingAddress.country}</strong>
                  </p>
                </div>

                {/* International shipping notice */}
                {isInternational && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 flex-shrink-0" />
                    International delivery — flat $75 USD shipping fee applies
                  </p>
                )}

                {/* City, State, Pincode */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city" name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State / Province *</Label>
                    <Input
                      id="state" name="state"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      placeholder="State / Province"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">
                      {isInternational ? 'ZIP / Postal Code *' : 'PIN Code *'}
                    </Label>
                    <Input
                      id="pincode" name="pincode"
                      value={shippingAddress.pincode}
                      onChange={handleInputChange}
                      placeholder={isInternational ? 'e.g. 10001 or SW1A 1AA' : '6-digit PIN code'}
                      maxLength={isInternational ? 15 : 6}
                    />
                    {!isInternational && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Must be exactly 6 digits (e.g. 110001).
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Order Summary ──────────────────────────────────────────────── */}
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
                  const product  = item.products || item;
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
                          <div className="w-8 h-8 bg-primary/20 rounded" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{product.name}</h4>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                        {customization && (
                          <div className="text-[11px] text-muted-foreground mt-1 space-y-0.5">
                            {Object.entries(customization)
                              .filter(([, v]) => v && v !== 'N/A')
                              .map(([k, v]) => (
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

                {/* Coupon */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    Discount Coupon
                  </Label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                      <div>
                        <p className="text-sm font-semibold text-green-700 dark:text-green-400 tracking-wide">
                          {appliedCoupon.code}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-500">
                          {appliedCoupon.discount_type === 'percent'
                            ? `${appliedCoupon.discount_value}% off`
                            : `₹${parseFloat(appliedCoupon.discount_value).toLocaleString('en-IN')} off`}
                          {' · '}Saving {formatPrice(appliedCoupon.discount_amount)}
                        </p>
                      </div>
                      <Button
                        variant="ghost" size="sm"
                        onClick={removeCoupon}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                        placeholder="Enter coupon code"
                        className="uppercase text-sm tracking-wide"
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
                  {couponError && <p className="text-xs text-red-500">{couponError}</p>}
                </div>

                <Separator />

                {/* Totals */}
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
                      <span className="text-amber-600">{formatPrice(shippingChargeINR)} <span className="text-xs text-muted-foreground">(intl)</span></span>
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
                  className="w-full" size="lg"
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
