'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, ArrowRight } from 'lucide-react';

export default function RecentlyFeatured() {
  return (
    <section className="relative bg-[#0a0a0b] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        {/* Section label */}
        <div className="text-center mb-14">
          <p className="text-[10px] tracking-[0.35em] text-[#c9a227]/70 uppercase mb-3">
            Press &amp; Recognition
          </p>
          <h2 className="text-[clamp(30px,4.5vw,52px)] font-light tracking-tight text-white">
            Recently Featured
          </h2>
        </div>

        {/* Feature card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-5xl mx-auto overflow-hidden rounded-lg border border-white/10">
          {/* Image side */}
          <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
            <img
              src="/harris-tweed-collection/ht-main-cover.jpeg"
              alt="Cuero y Tweed Harris Tweed Cases featured in Cigar Aficionado"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#0a0a0b]/80" />
            <div className="absolute top-4 left-4">
              <span className="inline-block bg-[#c9a227] text-black text-[9px] tracking-[0.2em] uppercase font-semibold px-3 py-1.5 rounded-sm">
                Featured Article
              </span>
            </div>
          </div>

          {/* Content side */}
          <div className="bg-[#0e0e0f] p-8 md:p-10 lg:p-12 flex flex-col justify-center">
            <div className="space-y-5">
              <div>
                <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase mb-3">
                  Cigar Aficionado — March/April 2026
                </p>
                <h3 className="text-[22px] md:text-[26px] font-light leading-[1.2] tracking-tight text-white">
                  Harris Tweed Cases
                </h3>
              </div>

              <p className="text-[13px] leading-[1.75] text-white/65">
                &ldquo;If you think that whisky is Scotland&rsquo;s only contribution to the cigar world,
                consider these new Cuero y Tweed Harris Tweed cases by accessories manufacturer Andre Garcia.
                Each one is a colorful echo of Scottish tradition that manages to pull off the coveted contradiction
                of being both rustic and urbane.&rdquo;
              </p>

              <p className="text-[11px] text-white/40 italic">
                — Gregory Mottola, Cigar Aficionado
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link
                  href="/collections/harris-tweed"
                  className="group inline-flex items-center justify-center gap-2 bg-[#c9a227] hover:bg-[#d4af37] text-black text-[11px] tracking-[0.15em] uppercase font-semibold px-6 py-3 rounded-sm transition-all duration-300"
                >
                  View the Collection
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <a
                  href="https://www.cigaraficionado.com/article/harris-tweed-cases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white/80 hover:text-white text-[11px] tracking-[0.15em] uppercase font-medium px-6 py-3 rounded-sm transition-all duration-300"
                >
                  Read the Article
                  <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
