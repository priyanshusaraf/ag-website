'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-[calc(100vh-72px)] overflow-hidden">
      {/* Lookbook surface */}
      <div className="absolute inset-0 leather-texture" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* Top micro header like lookbook pages */}
        <div className="pt-10 md:pt-14 flex items-start justify-between">
          <div className="text-white/35 font-light tracking-wide">01</div>
          <div className="text-white/35 font-light tracking-wide">ANDRE GARCIA</div>
        </div>

        <div className="relative py-12 md:py-16 lg:py-20">
          {/* Framed hero image placeholder (matches lookbook “photo block”) */}
          <div className="absolute left-0 bottom-0 hidden md:block">
            <div className="lookbook-frame w-[320px] lg:w-[380px] aspect-[3/4]">
              <div className="w-full h-full flex items-end justify-start p-4">
                <div className="lookbook-kicker">Image placeholder</div>
              </div>
            </div>
          </div>

          {/* Giant editorial headline */}
          <div className="max-w-5xl ml-auto">
            <h1 className="lookbook-h1 text-[clamp(3.2rem,7.5vw,7rem)] text-foreground">
              Artisan cigar
              <br />
              containers and
              <br />
              premium humidors.
            </h1>

            <div className="mt-8 max-w-2xl text-muted-foreground text-base md:text-lg leading-relaxed">
              Preserve the essence of your finest cigars with handcrafted storage solutions—built with obsessive attention to detail.
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Button asChild variant="outline" className="border-white/20 bg-transparent text-foreground hover:bg-white/10">
                <Link href="/products" className="flex items-center">
                  Discover the collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" className="hover:bg-white/10">
                <Link href="/about">Read the story</Link>
              </Button>
            </div>

            {/* Mobile-only placeholder */}
            <div className="mt-10 md:hidden">
              <div className="lookbook-frame w-full aspect-[16/10]">
                <div className="w-full h-full flex items-end justify-start p-4">
                  <div className="lookbook-kicker">Image placeholder</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;