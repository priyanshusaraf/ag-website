'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function PageFrame({ children }) {
  return (
    <div className="relative w-full bg-[#0a0a0b] overflow-hidden" style={{ aspectRatio: '1/1.3' }}>
      {children}
    </div>
  );
}

function Spread1({ data }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <PageFrame>
        <div className="absolute inset-0 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <img src={data?.left?.img1 || '/imagecompressor/website-product-img26-min.jpg'} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 overflow-hidden">
            <img src={data?.left?.img2 || '/imagecompressor/website-product-img35-min.jpg'} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 overflow-hidden">
            <img src={data?.left?.img3 || '/imagecompressor/website-product-img34-min.jpg'} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </PageFrame>
      <PageFrame>
        <div className="absolute top-[12%] left-6 right-6 z-10">
          <h1 className="text-[clamp(28px,5vw,56px)] font-light leading-[1.05] tracking-tight text-white">
            {data?.right?.headline || 'Started by the Roy brothers, Abhik and Anindya, it is hailed as the Rolls-Royce of Cigar Cases.'}
          </h1>
        </div>
        <div className="absolute left-6 bottom-[8%] w-[55%] z-20">
          <div className="relative">
            <div className="absolute -left-2 top-0 bottom-0 w-[3px] bg-white/20" />
            <img src={data?.right?.insetImg || '/imagecompressor/website-product-img40-min.jpg'} alt="" className="w-full aspect-[4/3] object-cover" />
          </div>
        </div>
      </PageFrame>
    </div>
  );
}

function Spread2({ data }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <PageFrame>
        <div className="absolute left-0 top-[5%] bottom-[35%] w-[18%] z-10">
          <img src={data?.left?.cigarImg || '/imagecompressor/website-product-img31-min.jpg'} alt="" className="h-full w-full object-contain object-left" />
        </div>
        <div className="absolute top-[8%] left-[22%] right-6 z-10">
          <p className="text-[13px] leading-relaxed text-white font-medium">{data?.left?.quote || '"Andre Garcia is a luxury cigar and cigar case making brand founded in Kolkata in the year 2003. It is currently operating from a workshop in Alipore, South Kolkata. The brand is registered and marketed by US-based Ash & Burn, co-promoted by my brother Anindya and myself."'}</p>
          <p className="text-[10px] tracking-[0.15em] text-white/50 mt-3 uppercase">{data?.left?.quoteAuthor || 'ABHIK ROY, FOUNDER'}</p>
        </div>
        <div className="absolute left-[22%] top-[42%] z-10">
          <p className="text-[10px] tracking-[0.2em] text-white/50 uppercase">Founded in</p>
          <p className="text-[clamp(72px,12vw,120px)] font-light leading-none text-white tracking-tight">{data?.left?.year || '2003'}</p>
          <p className="text-[10px] tracking-[0.2em] text-white/50 uppercase mt-1">{data?.left?.city || 'KOLKATA'}</p>
        </div>
        <div className="absolute right-6 top-[42%] w-[35%] z-10">
          <img src={data?.left?.productImg || '/imagecompressor/website-product-img44-min.jpg'} alt="" className="w-full aspect-[4/3] object-cover" />
        </div>
        <div className="absolute left-6 bottom-[5%] w-[50%] z-10">
          <img src={data?.left?.foundersImg || '/imagecompressor/website-product-img28-min.jpg'} alt="" className="w-full aspect-[4/3] object-cover grayscale" />
          <p className="text-[9px] tracking-[0.1em] text-white/40 mt-1 uppercase">ROY BROTHERS</p>
        </div>
      </PageFrame>
      <PageFrame>
        <div className="absolute top-[8%] right-6 w-[45%] text-right z-10">
          <p className="text-[12px] leading-relaxed text-white font-medium">{data?.right?.topQuote || '"Thompson Cigar promised to place the first order for cigar cases once I launched my own company."'}</p>
          <p className="text-[10px] tracking-[0.15em] text-white/50 mt-2 uppercase">{data?.right?.topQuoteAuthor || 'ABHIK ROY'}</p>
        </div>
        <div className="absolute top-[32%] left-6 right-[25%] z-10">
          <h2 className="text-[clamp(36px,6vw,64px)] font-light leading-[1.05] tracking-tight text-white">{data?.right?.headline || 'The man and his passion'}</h2>
        </div>
        <div className="absolute top-[55%] left-6 right-[30%] z-10">
          <p className="text-[12px] leading-relaxed text-white/70 mb-4">{data?.right?.body1 || "Brought up in a family of academicians, it was during Abhik Roy's tenure with a multinational company that a chance meeting with Robert Franzblau in 2000 at the Ambiente Trade Fair in Frankfurt, Germany, turned out to be a decisive moment."}</p>
          <p className="text-[12px] leading-relaxed text-white/70 mb-4">{data?.right?.body2 || "Franzblau, founder-president of America's oldest mail order cigar company, Thompson Cigar, promised to place the first order for cigar cases once Roy launched his own company."}</p>
          <p className="text-[12px] leading-relaxed text-white font-medium">{data?.right?.body3 || "Roy returned with a renewed gusto and quit his salaried job and became a full-fledged entrepreneur. He always believed that if you know the functionality of a product, the design becomes more or less apparent. This turned out to be his raison de succès."}</p>
        </div>
        <div className="absolute right-0 top-[25%] bottom-[10%] w-[22%] z-10">
          <img src={data?.right?.cigarImg || '/imagecompressor/website-product-img27-min.jpg'} alt="" className="h-full w-full object-contain object-right" />
        </div>
      </PageFrame>
    </div>
  );
}

function Spread3({ data }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <PageFrame>
        <img src={data?.left?.img || '/imagecompressor/website-product-img29-min.jpg'} alt="" className="absolute inset-0 w-full h-full object-cover" />
      </PageFrame>
      <PageFrame>
        <img src={data?.right?.img || '/imagecompressor/website-product-img33-min.jpg'} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute bottom-[8%] right-6 z-10 text-right">
          <h2 className="text-[clamp(48px,8vw,96px)] font-light leading-[0.95] tracking-tight text-white">{data?.right?.title || 'Cigar Cases'}</h2>
        </div>
      </PageFrame>
    </div>
  );
}

function Spread4({ data }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <PageFrame>
        <div className="absolute top-[8%] left-6 right-[45%] z-10">
          <p className="text-[13px] leading-relaxed text-white font-semibold">{data?.left?.boldText || 'Andre Garcia revolutionised the world of cigar cases with its St James Collection, Pack & Go, Manhattan, the Golf and Buffalo Horn Collection, for which Roy has a patent.'}</p>
        </div>
        <div className="absolute bottom-[8%] left-6 right-[50%] z-10">
          <p className="text-[11px] leading-relaxed text-white/60 mb-3">{data?.left?.body1 || "Andre Garcia brand's guiding principle is one size does not fit all. Roy pioneered a spectrum of sizes to accommodate anything from a short trip, for which one might like a solo smoke, to a party, at which one intends to offer cigars to all the guys."}</p>
          <p className="text-[11px] leading-relaxed text-white/60">{data?.left?.body2 || 'Striving for multiplicity, Andre Garcia crafted 1–, 2–, 4–, 5–, 6–, 8–, 10–, 16– and 20–finger cases in various designs, leather grains, dimensions, and colors, as well as widths and lengths.'}</p>
        </div>
        <div className="absolute right-[8%] top-[15%] bottom-[15%] w-[32%] z-0">
          <img src={data?.left?.textureImg || '/imagecompressor/website-product-img26-min.jpg'} alt="" className="h-full w-full object-cover" />
        </div>
      </PageFrame>
      <PageFrame>
        <img src={data?.right?.img || '/imagecompressor/website-product-img44-min.jpg'} alt="" className="absolute inset-0 w-full h-full object-cover" />
      </PageFrame>
    </div>
  );
}

function Spread5({ data }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <PageFrame>
        <img src={data?.left?.img || '/imagecompressor/website-product-img30-min.jpg'} alt="" className="absolute inset-0 w-full h-full object-cover" />
      </PageFrame>
      <PageFrame>
        <img src={data?.right?.img || '/imagecompressor/website-product-img36-min.jpg'} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute bottom-[10%] right-6 z-10 text-right">
          <h2 className="text-[clamp(40px,7vw,80px)] font-light leading-[0.95] tracking-tight text-white whitespace-pre-line">{data?.right?.title || 'St.\nJames\nCollection'}</h2>
        </div>
      </PageFrame>
    </div>
  );
}

function Spread6({ data }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <PageFrame>
        <div className="absolute top-[8%] left-6 right-[45%] z-10">
          <p className="text-[12px] leading-relaxed text-white font-semibold">{data?.left?.boldText || 'The St. James Collection accommodates a cutter, a lighter and a humidification.'}</p>
        </div>
        <div className="absolute top-[18%] left-6 right-[45%] z-10">
          <p className="text-[10px] leading-relaxed text-white/60">{data?.left?.body || 'Perhaps the most innovative case on the market, here is a case that combined not only space for cigars, but also for accessories! The cigar section is a telescoping case with space for 6-16 cigars, depending on model, with a zip-around section on the top to keep your lighter, cutter and other accessories handy and in one place. You can choose from both smooth leather finishes, a weaved style and a crocodile-style finish, all in multiple colors.'}</p>
        </div>
        <div className="absolute left-6 bottom-[8%] w-[45%] z-10">
          <img src={data?.left?.productImg || '/imagecompressor/website-product-img30-min.jpg'} alt="" className="w-full aspect-square object-cover" />
        </div>
        <div className="absolute right-[5%] top-[8%] bottom-[8%] w-[38%] z-0">
          <img src={data?.left?.textureImg || '/imagecompressor/website-product-img35-min.jpg'} alt="" className="h-full w-full object-cover" />
        </div>
      </PageFrame>
      <PageFrame>
        <img src={data?.right?.img || '/imagecompressor/website-product-img36-min.jpg'} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute top-[8%] left-6 z-10">
          <h2 className="text-[clamp(40px,7vw,80px)] font-light leading-[0.95] tracking-tight text-white whitespace-pre-line">{data?.right?.title || 'Manhattan\nCollection'}</h2>
        </div>
      </PageFrame>
    </div>
  );
}

export default function LookbookHome({ content }) {
  const spreads = content?.spreads || [];
  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      {spreads[0] && <Spread1 data={spreads[0]} />}
      {spreads[1] && <Spread2 data={spreads[1]} />}
      {spreads[2] && <Spread3 data={spreads[2]} />}
      {spreads[3] && <Spread4 data={spreads[3]} />}
      {spreads[4] && <Spread5 data={spreads[4]} />}
      {spreads[5] && <Spread6 data={spreads[5]} />}
      {spreads.length === 0 && (
        <>
          <Spread1 data={{}} />
          <Spread2 data={{}} />
          <Spread3 data={{}} />
          <Spread4 data={{}} />
          <Spread5 data={{}} />
          <Spread6 data={{}} />
        </>
      )}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="bg-white/5 p-6 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-[10px] tracking-[0.2em] text-white/50 uppercase mb-2">Explore</p>
                <p className="text-2xl md:text-3xl font-light tracking-tight text-white/90">For further details, visit www.andregarcia.com</p>
              </div>
              <div className="flex gap-3">
                <Button asChild className="bg-white text-black hover:bg-white/90">
                  <Link href={content?.cta?.primaryHref || '/products'}>{content?.cta?.primaryLabel || 'Shop'}</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
                  <Link href={content?.cta?.secondaryHref || '/about'}>{content?.cta?.secondaryLabel || 'About'}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
