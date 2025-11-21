'use client';

import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Plus, Minus, X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CartSheet = () => {
  const { items, itemCount, totalPrice, addItem, removeItem, updateQuantity, clearCart } = useCart();
  const [isShaking, setIsShaking] = useState(false);
  const [prevItemCount, setPrevItemCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Trigger shake animation when items are added
  useEffect(() => {
    if (itemCount > prevItemCount && prevItemCount > 0) {
      setIsShaking(true);
      // Remove shake class after animation completes
      const timer = setTimeout(() => {
        setIsShaking(false);
      }, 600);
      return () => clearTimeout(timer);
    }
    setPrevItemCount(itemCount);
  }, [itemCount, prevItemCount]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    setIsOpen(false);
    router.push('/checkout');
  };

  const handleClearCart = () => {
    clearCart();
    setIsOpen(false);
    router.push('/products');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={`relative ${isShaking ? 'cart-shake' : ''}`}>
          <ShoppingBag className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart ({itemCount} items)
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full mt-6 px-1">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground text-sm">
                  Add some premium cigar containers to get started
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/products">
                    Browse Products
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/orders">
                    View Orders
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto space-y-4">
                {items.map((item) => {
                  // Support both backend (item.products) and fallback (item) structure
                  const product = item.products || item;
                  return (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-md" />
                        ) : (
                          <div className="w-8 h-8 bg-primary/20 rounded"></div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 space-y-2">
                        <h4 className="font-semibold text-sm">{product.name}</h4>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary">{product.price}</span>
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>

              <Separator className="my-4" />

              {/* Cart Summary */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total ({itemCount} items):</span>
                  <span className="font-bold text-xl text-primary">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleClearCart}
                  >
                    Clear Cart
                  </Button>
                </div>

                {/* Free Shipping Notice */}
                {totalPrice < 5000 && (
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Add {formatPrice(5000 - totalPrice)} more for free shipping!
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet; 