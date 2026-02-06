'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

export default function HeroLanding() {
  const [loaded, setLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    // Trigger entrance animation after mount
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContent = () => {
    if (heroRef.current) {
      const nextSection = heroRef.current.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* Background image - the brand logo covering the entire viewport */}
      <div
        className={`absolute inset-0 transition-all duration-[2000ms] ease-out ${
          loaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
        }`}
      >
        <Image
          src="/imagecompressor/brand-logo.jpg"
          alt="André García - Luxury Cigar Cases"
          fill
          priority
          className="object-cover object-center"
          quality={95}
        />
      </div>

      {/* Dark overlay to make text prominent */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Vignette on top of dark overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.6)_100%)]" />

      {/* Bottom gradient for scroll indicator visibility */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

      {/* Top ambient gold glow */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 transition-all duration-[3000ms] delay-1000 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(218,165,32,0.4), rgba(139,69,19,0.3), rgba(218,165,32,0.4), transparent)',
        }}
      />

      {/* Tagline - centered, bold, prominent */}
      <div
        className={`absolute left-0 right-0 bottom-[25%] flex justify-center transition-all duration-1000 delay-[1500ms] ${
          loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <p
          className="text-[18px] md:text-[26px] lg:text-[34px] tracking-[0.4em] text-white font-bold uppercase text-center px-6"
          style={{
            textShadow: '0 2px 12px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)',
          }}
        >
          The Rolls-Royce of Cigar Cases
        </p>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToContent}
        aria-label="Scroll to explore"
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-1000 delay-[2000ms] cursor-pointer group ${
          loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } ${scrolled ? 'opacity-0 pointer-events-none' : ''}`}
      >
        <span className="text-[10px] tracking-[0.3em] text-white/50 uppercase font-medium">Explore</span>
        <ChevronDown className="w-5 h-5 text-white/50 animate-bounce" />
      </button>

      {/* Subtle corner accents */}
      <div
        className={`absolute top-6 left-6 w-12 h-12 border-l border-t transition-all duration-[2000ms] delay-[1000ms] ${
          loaded ? 'opacity-30 scale-100' : 'opacity-0 scale-50'
        }`}
        style={{ borderColor: 'rgba(218,165,32,0.3)' }}
      />
      <div
        className={`absolute top-6 right-6 w-12 h-12 border-r border-t transition-all duration-[2000ms] delay-[1000ms] ${
          loaded ? 'opacity-30 scale-100' : 'opacity-0 scale-50'
        }`}
        style={{ borderColor: 'rgba(218,165,32,0.3)' }}
      />
      <div
        className={`absolute bottom-6 left-6 w-12 h-12 border-l border-b transition-all duration-[2000ms] delay-[1000ms] ${
          loaded ? 'opacity-30 scale-100' : 'opacity-0 scale-50'
        }`}
        style={{ borderColor: 'rgba(218,165,32,0.3)' }}
      />
      <div
        className={`absolute bottom-6 right-6 w-12 h-12 border-r border-b transition-all duration-[2000ms] delay-[1000ms] ${
          loaded ? 'opacity-30 scale-100' : 'opacity-0 scale-50'
        }`}
        style={{ borderColor: 'rgba(218,165,32,0.3)' }}
      />
    </section>
  );
}
