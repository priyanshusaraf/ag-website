 'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Facebook, Instagram, Twitter, MapPin, Mail } from 'lucide-react';

const Footer = () => {
  const pathname = usePathname();
  // Homepage is a lookbook experience (no standard site footer)
  if (pathname === '/') return null;

  return (
    <footer className="bg-background border-t border-white/10">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-base font-light tracking-wide text-white/60">Andre Garcia</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Handcrafting luxury cigar cases since 2003. 
              The Rolls-Royce of Cigar Cases — each piece is meticulously 
              designed to preserve the essence of your finest cigars.
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
                <Link href="/collections" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/collections/st-james" className="text-muted-foreground hover:text-foreground transition-colors">
                  St. James Collection
                </Link>
              </li>
              <li>
                <Link href="/collections/horn" className="text-muted-foreground hover:text-foreground transition-colors">
                  Horn Collection
                </Link>
              </li>
              <li>
                <Link href="/collections/manhattan" className="text-muted-foreground hover:text-foreground transition-colors">
                  Manhattan Collection
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

          {/* Policies */}
          <div className="space-y-4 lg:col-span-1">
            <h3 className="lookbook-kicker text-white/60">Policies</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Refund &amp; Cancellation
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Shipping &amp; Delivery
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
                  Andre Garcia Cases<br />
                  Kolkata, West Bengal<br />
                  India
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-white/50 flex-shrink-0" />
                <Link href="mailto:abhik@andregarciacases.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  abhik@andregarciacases.com
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Disclaimer */}
        <div className="mb-6">
          <p className="text-xs text-muted-foreground/60 leading-relaxed max-w-3xl">
            <strong className="text-muted-foreground/80">Disclaimer:</strong> Andre Garcia Cases does not sell cigars, tobacco, nicotine, or any smoking products.
            We exclusively sell cigar cases, accessories, and storage products. Any images of cigars on this website
            are used strictly for representational and illustrative purposes only. You must be 18 years or older to use this website.
          </p>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Andre Garcia Cases. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/refund-policy" className="text-muted-foreground hover:text-foreground transition-colors">
              Refund Policy
            </Link>
            <Link href="/shipping-policy" className="text-muted-foreground hover:text-foreground transition-colors">
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 