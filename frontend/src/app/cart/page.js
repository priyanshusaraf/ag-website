'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ShoppingBag, Plus, Minus, X, ArrowRight, Tag, Truck, ShieldCheck, RotateCcw,
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { resolveImageUrl } from '@/lib/utils';
import api from '@/lib/utils';

export default function CartPage() {
  const router = useRouter();
  const { items, itemCount, totalPrice, removeItem, updateQuantity, clearCart } = useCart();
  const { formatPrice } = useCurrency();

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const discountAmount = appliedCoupon?.discount_amount || 0;
  const finalTotal = Math.max(0, totalPrice - discountAmount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await api.post('/coupons/validate', {
        code: couponCode.trim(),
        order_amount: totalPrice,
      });
      if (res.data.success) {
        setAppliedCoupon(res.data.coupon);
        setCouponError('');
      }
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleCheckout = () => {
    const params = new URLSearchParams();
    if (appliedCoupon) {
      params.set('coupon', appliedCoupon.code);
      params.set('discount', appliedCoupon.discount_amount);
    }
    router.push(`/checkout${params.toString() ? '?' + params.toString() : ''}`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20">
        <ShoppingBag className="h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-light mb-3">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Discover our handcrafted luxury cigar cases and add your favourites to get started.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Button asChild size="lg">
            <Link href="/products">Browse Products</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/collections">Explore Collections</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <section className="py-4 border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-foreground">Shopping Cart</span>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-3xl font-light mb-8">
            Shopping Cart <span className="text-muted-foreground text-xl">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const product = item.products || item;
                const unitPrice = parseFloat(item.price_override || product.sale_price || product.price || 0);
                const lineTotal = unitPrice * item.quantity;

                return (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-xl bg-card hover:shadow-md transition-shadow">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      {product.image_url ? (
                        <Image
                          src={resolveImageUrl(product.image_url)}
                          alt={product.name || 'Product'}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-primary/30" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="font-semibold truncate">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                          {product.on_sale && product.sale_price && (
                            <Badge className="bg-red-500 text-white text-xs mt-1">Sale</Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove item"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {item.customization_details && (() => {
                        try {
                          const cust = JSON.parse(item.customization_details);
                          const entries = Object.entries(cust).filter(([, v]) => v && v !== 'N/A');
                          if (!entries.length) return null;
                          return (
                            <div className="mt-1 text-xs text-muted-foreground space-y-0.5">
                              {entries.map(([k, v]) => (
                                <span key={k} className="block">{k}: {v}</span>
                              ))}
                            </div>
                          );
                        } catch { return null; }
                      })()}

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">{formatPrice(lineTotal)}</div>
                          {item.quantity > 1 && (
                            <div className="text-xs text-muted-foreground">{formatPrice(unitPrice)} each</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Clear Cart */}
              <div className="flex justify-end pt-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={clearCart}>
                  <X className="h-4 w-4 mr-1" /> Clear cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <div className="border rounded-xl p-6 bg-card space-y-4 sticky top-4">
                <h2 className="text-xl font-semibold">Order Summary</h2>
                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>−{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600">Calculated at checkout</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(finalTotal)}</span>
                </div>

                {/* Coupon Code */}
                <div className="space-y-2">
                  {appliedCoupon ? (
                    <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                      <Tag className="h-4 w-4 text-green-600 shrink-0" />
                      <span className="text-sm text-green-700 dark:text-green-300 flex-1">
                        <span className="font-bold">{appliedCoupon.code}</span> applied
                      </span>
                      <button onClick={handleRemoveCoupon} className="text-green-600 hover:text-green-800">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          className="text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleApplyCoupon}
                          disabled={couponLoading || !couponCode.trim()}
                        >
                          {couponLoading ? '...' : 'Apply'}
                        </Button>
                      </div>
                      {couponError && (
                        <Alert variant="destructive" className="py-2">
                          <AlertDescription className="text-xs">{couponError}</AlertDescription>
                        </Alert>
                      )}
                    </>
                  )}
                </div>

                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>

                {/* Trust signals */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                  <div className="text-center">
                    <ShieldCheck className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Secure Payment</p>
                  </div>
                  <div className="text-center">
                    <Truck className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Free Shipping</p>
                  </div>
                  <div className="text-center">
                    <RotateCcw className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Easy Returns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
