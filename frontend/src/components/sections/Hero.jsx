'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Award, Clock } from 'lucide-react';

// Static hero with permanent brown gradient background and grid pattern
const Hero = () => {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
      {/* Static themed gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_30%,#a5632a_0%,#7a3f17_40%,#4a2a12_100%)]" />
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-40 bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,0.08)_25%,rgba(255,255,255,0.08)_26%,transparent_27%,transparent_74%,rgba(255,255,255,0.08)_75%,rgba(255,255,255,0.08)_76%,transparent_77%),linear-gradient(90deg,transparent_24%,rgba(255,255,255,0.08)_25%,rgba(255,255,255,0.08)_26%,transparent_27%,transparent_74%,rgba(255,255,255,0.08)_75%,rgba(255,255,255,0.08)_76%,transparent_77%)] bg-[length:40px_40px]" />

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="font-display font-bold text-white drop-shadow-2xl leading-tight text-5xl md:text-6xl lg:text-7xl">
            <span className="block">Artisan Cigar</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Containers</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Preserve the essence of your finest cigars with our handcrafted premium humidors and storage solutions. Each piece is a masterwork of tradition and innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="shadow-luxury">
              <Link href="/products" className="flex items-center">
                Discover Our Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/about">Our Heritage</Link>
            </Button>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
            <div className="flex items-center justify-center space-x-3">
              <Shield className="h-6 w-6 text-amber-300" />
              <div>
                <h3 className="font-semibold text-white">Lifetime Warranty</h3>
                <p className="text-sm text-white/80">Quality guaranteed</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Award className="h-6 w-6 text-amber-300" />
              <div>
                <h3 className="font-semibold text-white">Award Winning</h3>
                <p className="text-sm text-white/80">Recognized excellence</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Clock className="h-6 w-6 text-amber-300" />
              <div>
                <h3 className="font-semibold text-white">Since 1985</h3>
                <p className="text-sm text-white/80">Trusted craftsmanship</p>
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
};

export default Hero;