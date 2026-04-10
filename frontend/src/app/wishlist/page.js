'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { resolveImageUrl } from '@/lib/utils';
import api from '@/lib/utils';

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState({});

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin?redirect=/wishlist');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    api.get('/wishlist')
      .then(res => setItems(res.data.wishlist?.wishlist_items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleRemove = async (productId) => {
    setRemoving(r => ({ ...r, [productId]: true }));
    try {
      const res = await api.post('/wishlist/remove', { product_id: productId });
      setItems(res.data.wishlist?.wishlist_items || []);
    } catch {}
    setRemoving(r => ({ ...r, [productId]: false }));
  };

  const handleAddToCart = (product) => {
    addItem(product, 1);
  };

  if (isLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <section className="py-4 border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-foreground">Wishlist</span>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-3xl font-light mb-2 flex items-center gap-2">
            <Heart className="h-7 w-7 text-red-500 fill-red-500" />
            My Wishlist
          </h1>
          <p className="text-muted-foreground mb-8">{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-light mb-3">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">Save items you love and come back to them anytime.</p>
              <Button asChild>
                <Link href="/products">Explore Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map(item => {
                const product = item.products;
                if (!product) return null;
                const displayPrice = product.sale_price || product.price;

                return (
                  <div key={item.id} className="border rounded-xl overflow-hidden bg-card hover:shadow-md transition-shadow group">
                    <Link href={`/products/${product.id}`} className="block">
                      <div className="aspect-square relative bg-muted">
                        {product.image_url ? (
                          <Image
                            src={resolveImageUrl(product.image_url)}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                          </div>
                        )}
                        {product.on_sale && (
                          <Badge className="absolute top-2 left-2 bg-red-500 text-white">Sale</Badge>
                        )}
                      </div>
                    </Link>

                    <div className="p-4 space-y-3">
                      <div>
                        <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
                          <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-primary">{formatPrice(displayPrice)}</span>
                          {product.sale_price && parseFloat(product.sale_price) < parseFloat(product.price) && (
                            <span className="text-sm text-muted-foreground line-through ml-2">{formatPrice(product.price)}</span>
                          )}
                        </div>
                        <span className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.stock || product.stock <= 0}
                        >
                          <ShoppingBag className="h-4 w-4 mr-1" />
                          Add to Cart
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemove(product.id)}
                          disabled={removing[product.id]}
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
