 'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  const pathname = usePathname();
  // Homepage is a lookbook experience (no standard site footer)
  if (pathname === '/') return null;

  return (
    <footer className="bg-background border-t border-white/10">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-base font-light tracking-wide text-white/60">Andre Garcia</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Crafting premium cigar containers and humidors since 1985. 
              Each piece is meticulously designed to preserve the essence and 
              quality of your finest cigars.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-white/40 hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white/40 hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white/40 hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="lookbook-kicker text-white/60">Products</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products?category=Desktop Humidors" className="text-muted-foreground hover:text-foreground transition-colors">
                  Desktop Humidors
                </Link>
              </li>
              <li>
                <Link href="/products?category=Travel Cases" className="text-muted-foreground hover:text-foreground transition-colors">
                  Travel Cases
                </Link>
              </li>
              <li>
                <Link href="/products?category=Cabinet Humidors" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cabinet Humidors
                </Link>
              </li>
              <li>
                <Link href="/products?category=Accessories" className="text-muted-foreground hover:text-foreground transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                  View All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="lookbook-kicker text-white/60">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-muted-foreground hover:text-foreground transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-muted-foreground hover:text-foreground transition-colors">
                  Order History
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="lookbook-kicker text-white/60">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-white/50 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  123 Artisan Lane<br />
                  Miami, FL 33101<br />
                  United States
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-white/50 flex-shrink-0" />
                <Link href="tel:+1-305-555-0123" className="text-muted-foreground hover:text-foreground transition-colors">
                  +1 (305) 555-0123
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-white/50 flex-shrink-0" />
                <Link href="mailto:info@andregarcia.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  info@andregarcia.com
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 André García. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Support
            </Link>
            <Link href="/checkout" className="text-muted-foreground hover:text-foreground transition-colors">
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 