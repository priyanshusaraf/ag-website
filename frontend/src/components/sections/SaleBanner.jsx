'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, X } from 'lucide-react';
import api from '@/lib/utils';

const SaleBanner = () => {
  const pathname = usePathname();
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  // Keep homepage strictly lookbook/editorial (no promo bar)
  // NOTE: Do NOT early-return before hooks; route transitions can otherwise change hook count.
  const hideOnHome = pathname === '/';

  useEffect(() => {
    if (hideOnHome) return;
    const fetchBanners = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products/sale-banners');
        if (res.data && res.data.length > 0) {
          setBanners(res.data);
        }
      } catch (error) {
        console.error('Error fetching sale banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [hideOnHome]);

  // Auto-rotate banners if multiple
  useEffect(() => {
    if (hideOnHome) return;
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length, hideOnHome]);

  if (hideOnHome || loading || !banners.length || !isVisible) {
    return null;
  }

  const banner = banners[currentBanner];

  return (
    <div className="relative bg-background/80 text-foreground border-b border-white/10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {banner.image_url && (
              <img 
                src={banner.image_url} 
                alt={banner.title}
                className="w-12 h-12 object-cover rounded-sm border border-white/15"
              />
            )}
            <div className="flex-1">
              <h3 className="font-light text-sm md:text-base tracking-wide">{banner.title}</h3>
              {banner.description && (
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">{banner.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {banner.link_url && (
              <Button asChild variant="outline" size="sm" className="border-white/20 bg-transparent text-foreground hover:bg-white/10">
                <Link href={banner.link_url} className="flex items-center">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            
            {banners.length > 1 && (
              <div className="flex space-x-1">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBanner(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentBanner ? 'bg-foreground' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            )}
            
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/10 rounded-sm transition-colors"
              aria-label="Close banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleBanner; 