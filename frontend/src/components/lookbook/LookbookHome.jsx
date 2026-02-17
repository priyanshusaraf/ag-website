'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { resolveImageUrl } from '@/lib/utils';

function Img({ src, ...props }) {
  return <img src={resolveImageUrl(src)} {...props} />;
}

function PageFrame({ children }) {
  return (
    <div className="relative w-full bg-[#0a0a0b] overflow-hidden" style={{ aspectRatio: '1/1.3' }}>
      {children}
    </div>
  );
}

function Spread1({ data }) {
  return (
    <>
      {/* Mobile layout — clean, flowing */}
      <div className="lg:hidden bg-[#0a0a0b] py-16 px-6">
        <div className="max-w-sm mx-auto text-center space-y-8">
          <img
            src={data?.right?.foundersImg || '/imagecompressor/roy-brothers.png'}
            alt="Founders"
            className="w-full aspect-[4/3] object-cover grayscale border border-white/10"
          />
          <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase">
            {data?.right?.foundersLabel || 'ROY BROTHERS'}
          </p>
          <div className="inline-block border border-white/10 px-8 py-6 text-center">
            <p className="text-[9px] tracking-[0.28em] text-white/60 uppercase">
              {data?.right?.foundedLabel || 'FOUNDED IN'}
            </p>
            <p className="text-[56px] font-light leading-none text-white tracking-tight mt-1">
              {data?.right?.year || '2003'}
            </p>
            <p className="text-[9px] tracking-[0.25em] text-white/60 uppercase mt-1">
              {data?.right?.city || 'KOLKATA'}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:grid grid-cols-2">
        <PageFrame>
          <div className="absolute inset-0 bg-[#0a0a0b]" />
          <div className="absolute left-[26%] md:left-[24%] top-[10%] right-[12%] z-10">
            <h1 className="text-[clamp(30px,5.4vw,66px)] md:text-[clamp(36px,5.2vw,72px)] font-light leading-[1.02] tracking-tight text-white whitespace-pre-line">
              {data?.left?.headline ||
                'Started by the\nRoy brothers,\nAbhik and\nAnindya, it is\nhailed as the\nRolls-Royce of\nCigar Cases.'}
            </h1>
          </div>
          <div className="absolute left-[6%] bottom-[8%] top-[22%] w-[14%] z-10">
            <img
              src={data?.left?.cigarImg || data?.left?.bottomImg || '/imagecompressor/bullet-cigar-founder-page.png'}
              alt=""
              className="h-full w-full object-contain object-left"
            />
          </div>
        </PageFrame>
        <PageFrame>
          <div className="absolute inset-0 bg-[#0a0a0b]" />
          <div className="absolute top-[10%] right-[8%] w-[68%] z-10 text-center">
            <img
              src={data?.right?.foundersImg || '/imagecompressor/roy-brothers.png'}
              alt=""
              className="w-full aspect-[4/3] object-cover grayscale border border-white/10"
            />
            <p className="text-[10px] tracking-[0.2em] text-white/40 mt-2 uppercase">
              {data?.right?.foundersLabel || 'ROY BROTHERS'}
            </p>
          </div>
          <div className="absolute right-[8%] bottom-[16%] w-[28%] z-10 bg-[#0a0a0b] border border-white/10 px-4 py-5 text-center">
            <p className="text-[9px] tracking-[0.28em] text-white/60 uppercase">
              {data?.right?.foundedLabel || 'FOUNDED IN'}
            </p>
            <p className="text-[clamp(40px,6vw,64px)] font-light leading-none text-white tracking-tight mt-1">
              {data?.right?.year || '2003'}
            </p>
            <p className="text-[9px] tracking-[0.25em] text-white/60 uppercase mt-1">
              {data?.right?.city || 'KOLKATA'}
            </p>
          </div>
        </PageFrame>
      </div>
    </>
  );
}

function Spread2({ data }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <PageFrame>
        <div className="absolute inset-0 bg-[#0a0a0b]" />
        <div className="absolute top-[6%] left-[6%] right-[8%] lg:right-[50%] z-10">
          <h2 className="text-[clamp(36px,5.5vw,64px)] font-light leading-[1.08] tracking-tight text-white whitespace-pre-line">
            {data?.left?.headline || 'The man\nand his\npassion'}
          </h2>
        </div>
        <div className="absolute top-[30%] left-[6%] right-[8%] z-10">
          <p className="text-[13px] md:text-[14px] leading-[1.7] text-white/80 mb-5">
            {data?.left?.body1 ||
              "Brought up in a family of academicians, it was during Abhik Roy's tenure with a multinational company that a chance meeting with Robert Franzblau in 2000 at the Ambiente Trade Fair in Frankfurt, Germany, turned out to be a decisive moment."}
          </p>
          <p className="text-[13px] md:text-[14px] leading-[1.7] text-white/80 mb-5">
            {data?.left?.body2 ||
              "Franzblau, founder-president of America's oldest mail order cigar company, Thompson Cigar, promised to place the first order for cigar cases once Roy launched his own company."}
          </p>
          <p className="text-[13px] md:text-[14px] leading-[1.7] text-white font-semibold">
            {data?.left?.body3 ||
              "Roy returned with a renewed gusto and quit his salaried job and became a full-fledged entrepreneur. He always believed that if you know the functionality of a product, the design becomes more or less apparent. This turned out to be his raison de succès."}
          </p>
        </div>
      </PageFrame>
      <PageFrame>
        <div className="absolute inset-0">
          <img
            src={data?.right?.image || '/imagecompressor/buffalo-horn-main.png'}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </PageFrame>
    </div>
  );
}

function Spread3({ data }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <PageFrame>
        <Link href="/collections/all-cases" className="absolute inset-0 group cursor-pointer">
          <Img src={data?.left?.img || '/imagecompressor/website-product-img33-min.jpg'} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          <div className="absolute bottom-[8%] left-[6%] z-10">
            <h2 className="text-[clamp(48px,8vw,96px)] font-light leading-[0.95] tracking-tight text-white group-hover:text-primary transition-colors">{data?.left?.title || 'Cigar Cases'}</h2>
          </div>
        </Link>
      </PageFrame>
      <PageFrame>
        <div className="absolute inset-0 bg-[#0a0a0b]" />
        <div className="absolute top-[8%] left-[6%] right-[32%] z-10">
          <p className="text-[14px] md:text-[15px] leading-[1.6] text-white font-semibold text-right">
            {data?.right?.boldText || 'Andre Garcia revolutionised the world of cigar cases with its St James Collection, Pack & Go, Manhattan, the Golf and Buffalo Horn Collection, for which Roy has a patent.'}
          </p>
        </div>
        <div className="absolute top-[38%] left-[6%] right-[32%] z-10">
          <p className="text-[13px] leading-[1.7] text-white/70 mb-4">
            {data?.right?.body1 || "Andre Garcia brand's guiding principle is one size does not fit all. Roy pioneered a spectrum of sizes to accommodate anything from a short trip, for which one might like a solo smoke, to a party, at which one intends to offer cigars to all the guys."}
          </p>
          <p className="text-[13px] leading-[1.7] text-white/70">
            {data?.right?.body2 || 'Striving for multiplicity, Andre Garcia crafted 1–, 2–, 4–, 5–, 6–, 8–, 10–, 16– and 20–finger cases in various designs, leather grains, dimensions, and colors, as well as widths and lengths.'}
          </p>
        </div>
        <div className="absolute right-[6%] top-[8%] bottom-[8%] w-[22%] z-0">
          <Img src={data?.right?.textureImg || '/imagecompressor/cigar-case-fabric.png'} alt="" className="h-full w-full object-cover" />
        </div>
      </PageFrame>
    </div>
  );
}

function Spread4({ data }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <PageFrame>
        <Link href="/collections/st-james" className="absolute inset-0 group cursor-pointer">
          <Img src={data?.left?.img || '/imagecompressor/st-james-collection-cigar-case.png'} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          <div className="absolute bottom-[8%] right-[6%] z-10 text-right">
            <h2 className="text-[clamp(40px,7vw,80px)] font-light leading-[0.95] tracking-tight text-white whitespace-pre-line group-hover:text-primary transition-colors">
              {data?.left?.title || 'St.\nJames\nCollection'}
            </h2>
          </div>
        </Link>
      </PageFrame>
      <PageFrame>
        <div className="absolute inset-0 bg-[#0a0a0b]" />
        <div className="absolute top-[6%] left-[6%] right-[32%] z-10">
          <p className="text-[14px] md:text-[15px] leading-[1.6] text-white font-semibold">
            {data?.right?.boldText || 'The St. James Collection accommodates a cutter, a lighter and a humidification.'}
          </p>
        </div>
        <div className="absolute top-[18%] left-[6%] right-[32%] z-10">
          <p className="text-[12px] leading-[1.7] text-white/70">
            {data?.right?.body || 'Perhaps the most innovative case on the market, here is a case that combined not only space for cigars, but also for accessories! The cigar section is a telescoping case with space for 6-16 cigars, depending on model, with a zip-around section on the top to keep your lighter, cutter and other accessories handy and in one place. You can choose from both smooth leather finishes, a weaved style and a crocodile-style finish, all in multiple colors.'}
          </p>
        </div>
        <div className="absolute left-[6%] top-[44%] w-[60%] z-10">
          <Img src={data?.right?.productImg || '/imagecompressor/st-james-collection.png'} alt="" className="w-full aspect-[4/3] object-cover" />
        </div>
        <div className="absolute right-[6%] top-[8%] bottom-[8%] w-[22%] z-0">
          <Img src={data?.right?.textureImg || '/imagecompressor/st-james-collection-leather.png'} alt="" className="h-full w-full object-cover" />
        </div>
      </PageFrame>
    </div>
  );
}

function Spread5({ data }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <PageFrame>
        <Link href="/collections/horn" className="absolute inset-0 group cursor-pointer">
          <div className="absolute inset-0 bg-[#0a0a0b] group-hover:bg-[#151516] transition-colors duration-300" />
          {/* Title */}
          <div className="absolute top-[28%] left-[6%] z-10">
            <h2 className="text-[clamp(36px,6vw,72px)] font-light leading-[1] tracking-tight text-white whitespace-pre-line group-hover:text-primary transition-colors">
              {data?.left?.title || 'Buffalo\nHorn\nCollection'}
            </h2>
          </div>
          {/* Case image - upper right */}
          <div className="absolute top-[8%] right-[8%] w-[40%] z-10 group-hover:scale-105 transition-transform duration-500">
            <Img src={data?.left?.caseImg || '/imagecompressor/buffalo-horn-main.png'} alt="" className="w-full aspect-[3/4] object-cover" />
          </div>
          {/* Cigar image - bottom */}
          <div className="absolute bottom-[8%] left-[6%] w-[70%] z-10">
            <Img src={data?.left?.cigarImg || '/imagecompressor/buffalo-horn-cigar.png'} alt="" className="w-full object-contain" />
          </div>
        </Link>
      </PageFrame>
      <PageFrame>
        <div className="absolute inset-0 bg-[#0a0a0b]" />
        {/* Top text */}
        <div className="absolute top-[6%] left-[6%] right-[8%] lg:right-[50%] z-10">
          <p className="text-[11px] leading-[1.7] text-white/70">
            {data?.right?.body1 || "Here's a series of hard-leather, two or three-finger cases in a variety of finishes: smooth leather in multiple colors, woven leather, Croco or Ostrich patterns. Each sliding case can accommodate cigars of various lengths in hard-shell protection, including the most densely packed suitcase. And the top of each telescoping case has a hard, Buffalo horn top in a marvelous, glossy finish that makes each one unique."}
          </p>
        </div>
        {/* Product image - right side */}
        <div className="absolute top-[28%] right-[6%] w-[50%] z-10">
          <Img src={data?.right?.productImg || '/imagecompressor/buffalo-horn-collection-main.png'} alt="" className="w-full aspect-[3/4] object-cover" />
        </div>
        {/* Bottom text */}
        <div className="absolute bottom-[12%] left-[6%] right-[56%] z-10 text-center">
          <p className="text-[12px] leading-[1.6] text-white font-semibold">
            {data?.right?.boldText || 'The Buffalo Horn showcase multi-hued, sinewy caps made from the horny appendages of the buffalo.'}
          </p>
        </div>
      </PageFrame>
    </div>
  );
}

function Spread6({ data }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <PageFrame>
        <Link href="/collections/carbon-fibre" className="absolute inset-0 group cursor-pointer">
          <div className="absolute inset-0 bg-[#0a0a0b] group-hover:bg-[#151516] transition-colors duration-300" />
          {/* Title */}
          <div className="absolute top-[6%] left-[6%] z-10">
            <h2 className="text-[clamp(36px,6vw,72px)] font-light leading-[1] tracking-tight text-white whitespace-pre-line group-hover:text-primary transition-colors">
              {data?.left?.title || 'Carbon\nFibre\nCollection'}
            </h2>
          </div>
          {/* Main product image - closer to title */}
          <div className="absolute top-[32%] left-[6%] right-[6%] bottom-[6%] z-10 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
            <Img src={data?.left?.productImg || '/imagecompressor/carbon-fiber-collection-main.png'} alt="" className="w-full h-full object-cover" />
          </div>
        </Link>
      </PageFrame>
      <PageFrame>
        <div className="absolute inset-0 bg-[#0a0a0b]" />
        {/* Top text */}
        <div className="absolute top-[6%] left-[6%] right-[32%] z-10">
          <p className="text-[11px] leading-[1.7] text-white/70">
            {data?.right?.body || "Carry your cigars in style with the Andre Garcia Limited Edition Carbon Fiber cigar case. Each piece is hand made with a crush-resistant aluminum shell, genuine cedar wood inner lining, and an exterior of leather and genuine carbon fiber. This high-tech material consists of extremely thin fibers bonded together in hexagonal aromatic rings, which are incredibly strong for their size. Several thousand carbon fibers are twisted together to form a yarn that's woven into a fabric, combined with epoxy, and molded to form composite reinforced sheets that are tough but very lightweight. The cases are available in two- and three-finger capacity models."}
          </p>
        </div>
        {/* Second product image */}
        <div className="absolute bottom-[6%] left-[6%] right-[32%] z-10">
          <Img src={data?.right?.productImg || '/imagecompressor/carbon-fiber-collection-second.png'} alt="" className="w-full aspect-[16/9] object-cover" />
        </div>
        {/* Bold text - bottom right */}
        <div className="absolute bottom-[20%] right-[8%] w-[20%] z-10 text-right">
          <p className="text-[11px] leading-[1.6] text-white font-semibold">
            {data?.right?.boldText || 'This high-tech material consists of extremely thin fibers bonded together in hexagonal aromatic rings, which are incredibly strong for their size.'}
          </p>
        </div>
        {/* Carbon fibre texture strip */}
        <div className="absolute right-[6%] top-[6%] bottom-[40%] w-[20%] z-0">
          <Img src={data?.right?.textureImg || '/imagecompressor/carbon-fibre-material.png'} alt="" className="h-full w-full object-cover" />
        </div>
      </PageFrame>
    </div>
  );
}

function Spread7({ data }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <PageFrame>
        <Link href="/collections/pack-and-go" className="absolute inset-0 group cursor-pointer">
          <div className="absolute inset-0 bg-[#0a0a0b] group-hover:bg-[#151516] transition-colors duration-300" />
          <div className="absolute top-[6%] left-[6%] z-10">
            <h2 className="text-[clamp(40px,7vw,80px)] font-light leading-[1] tracking-tight text-white group-hover:text-primary transition-colors">
              {data?.left?.title || 'Pack & Go'}
            </h2>
          </div>
          <div className="absolute top-[18%] left-[6%] right-[6%] bottom-[6%] z-10 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
            <Img src={data?.left?.mainImg || '/imagecompressor/pack-and-go.png'} alt="" className="w-full h-full object-cover" />
          </div>
        </Link>
      </PageFrame>
      <PageFrame>
        <div className="absolute inset-0 bg-[#0a0a0b]" />
        <div className="absolute top-[6%] left-[6%] right-[52%] lg:right-[42%] z-10">
          <Img src={data?.right?.topImg || '/imagecompressor/pack-and-go-another.png'} alt="" className="w-full aspect-square object-cover" />
        </div>
        <div className="absolute top-[6%] right-[6%] left-[52%] lg:left-[62%] z-10">
          <p className="text-[11px] leading-[1.7] text-white/70">
            {data?.right?.body ||
              "From the first glance, it can't be differentiated from an upscale executive tote with an adjustable handle and removable shoulder strap. But the inside reveals cedar-lining and organized collapsible wooden dividers plus additional compartments for cigar storage. Both the understated plain black leather case and the crocodile-embossed leather case are crafted to last generations of discerning aficionados."}
          </p>
        </div>
        <div className="absolute top-[40%] left-[6%] right-[56%] z-10 text-center">
          <p className="text-[12px] leading-[1.6] text-white font-semibold">
            {data?.right?.boldText ||
              "The most impressive and unique product of Garcia's crafts is the Pack & Go satchel that easily stows astonishing 40 sticks of your favorite smokes."}
          </p>
        </div>
        <div className="absolute top-[58%] left-[10%] w-[20%] z-10">
          <Img src={data?.right?.textureImg || '/imagecompressor/pack-n-go-new.png'} alt="" className="w-full aspect-[2/3] object-cover" />
        </div>
        <div className="absolute bottom-[8%] right-[6%] w-[54%] z-10">
          <Img src={data?.right?.bottomImg || '/imagecompressor/cigar-40-pack-n-go.png'} alt="" className="w-full aspect-[4/3] object-cover" />
        </div>
      </PageFrame>
    </div>
  );
}

function SpreadManhattan({ data }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <PageFrame>
        <Link href="/collections/manhattan" className="absolute inset-0 group cursor-pointer">
          <div className="absolute inset-0 bg-[#0a0a0b] group-hover:bg-[#151516] transition-colors duration-300" />
          {/* Title */}
          <div className="absolute top-[6%] left-[6%] z-10">
            <h2 className="text-[clamp(36px,6vw,72px)] font-light leading-[1] tracking-tight text-white whitespace-pre-line group-hover:text-primary transition-colors">
              {data?.left?.title || 'Manhattan\nCollection'}
            </h2>
          </div>
          {/* Main product image */}
          <div className="absolute top-[28%] left-[6%] right-[6%] bottom-[6%] z-10 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
            <Img src={data?.left?.mainImg || '/imagecompressor/manhattan-collection-1.png'} alt="" className="w-full h-full object-cover" />
          </div>
        </Link>
      </PageFrame>
      <PageFrame>
        <div className="absolute inset-0 bg-[#0a0a0b]" />
        {/* Top text */}
        <div className="absolute top-[6%] left-[6%] right-[32%] z-10">
          <p className="text-[14px] md:text-[15px] leading-[1.6] text-white font-semibold">
            {data?.right?.boldText || 'The Manhattan Collection represents the pinnacle of urban luxury.'}
          </p>
        </div>
        <div className="absolute top-[18%] left-[6%] right-[32%] z-10">
          <p className="text-[12px] leading-[1.7] text-white/70">
            {data?.right?.body || 'Crafted for the discerning aficionado who appreciates both form and function, these cases feature sleek designs with premium materials. Perfect for the modern gentleman who demands excellence. Choose from a variety of leather finishes and sizes to match your personal style.'}
          </p>
        </div>
        {/* Product image */}
        <div className="absolute left-[6%] top-[38%] w-[60%] z-10">
          <Img src={data?.right?.productImg || '/imagecompressor/manhattan-collection02.png'} alt="" className="w-full aspect-[4/3] object-cover" />
        </div>
        {/* Features */}
        <div className="absolute right-[6%] top-[8%] bottom-[8%] w-[22%] z-10 flex flex-col justify-center">
          <div className="space-y-3">
            <div className="text-[10px] tracking-[0.2em] text-white/50 uppercase">Features</div>
            <ul className="space-y-2 text-[11px] text-white/70">
              <li>• Sleek urban design</li>
              <li>• Premium leather finish</li>
              <li>• Cedar wood lining</li>
              <li>• Secure closure</li>
              <li>• Custom personalization</li>
            </ul>
          </div>
        </div>
      </PageFrame>
    </div>
  );
}

function SpreadHarrisTweed({ data }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <PageFrame>
        <Link href="/collections/harris-tweed" className="absolute inset-0 group cursor-pointer">
          <div className="absolute inset-0 bg-[#0a0a0b] group-hover:bg-[#151516] transition-colors duration-300" />
          {/* Title */}
          <div className="absolute top-[6%] left-[6%] z-10">
            <h2 className="text-[clamp(36px,6vw,72px)] font-light leading-[1] tracking-tight text-white whitespace-pre-line group-hover:text-primary transition-colors">
              {data?.left?.title || 'Harris\nTweed\nCollection'}
            </h2>
          </div>
          {/* Main cover image */}
          <div className="absolute top-[28%] left-[6%] right-[6%] bottom-[6%] z-10 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
            <Img src={data?.left?.mainImg || '/harris-tweed-collection/ht-main-cover.jpeg'} alt="Harris Tweed Collection" className="w-full h-full object-cover" />
          </div>
        </Link>
      </PageFrame>
      <PageFrame>
        <div className="absolute inset-0 bg-[#0a0a0b]" />
        {/* Top text */}
        <div className="absolute top-[6%] left-[6%] right-[32%] z-10">
          <p className="text-[14px] md:text-[15px] leading-[1.6] text-white font-semibold">
            {data?.right?.boldText || 'Authentic Harris Tweed from the Outer Hebrides of Scotland, handwoven by islanders in their homes.'}
          </p>
        </div>
        <div className="absolute top-[18%] left-[6%] right-[32%] z-10">
          <p className="text-[12px] leading-[1.7] text-white/70">
            {data?.right?.body || 'The Harris Tweed Collection brings together timeless Scottish heritage with Andre Garcia\'s signature craftsmanship. Featuring 3 Finger Robusto, Limited Edition Horn Top, Torpedo, and Pack & Go models — each wrapped in genuine Harris Tweed fabric paired with premium leather trim and full cedar wood lining.'}
          </p>
        </div>
        {/* Product image */}
        <div className="absolute left-[6%] top-[40%] w-[60%] z-10">
          <Img src={data?.right?.productImg || '/harris-tweed-collection/ht-3-finger-limited-edition-horn-top.jpeg'} alt="Harris Tweed Limited Edition Horn Top" className="w-full aspect-[4/3] object-cover" />
        </div>
        {/* Texture / secondary image */}
        <div className="absolute right-[6%] bottom-[6%] w-[28%] z-10">
          <Img src={data?.right?.textureImg || '/harris-tweed-collection/ht-torpedo-1.jpeg'} alt="Harris Tweed Torpedo" className="w-full aspect-square object-cover" />
        </div>
        {/* Features */}
        <div className="absolute right-[6%] top-[8%] bottom-[38%] w-[22%] z-10 flex flex-col justify-center">
          <div className="space-y-3">
            <div className="text-[10px] tracking-[0.2em] text-white/50 uppercase">Features</div>
            <ul className="space-y-2 text-[11px] text-white/70">
              <li>• Genuine Harris Tweed</li>
              <li>• Handwoven in Scotland</li>
              <li>• Premium leather trim</li>
              <li>• Cedar wood lining</li>
              <li>• Multiple tartan patterns</li>
              <li>• Horn Top limited edition</li>
            </ul>
          </div>
        </div>
      </PageFrame>
    </div>
  );
}

function Spread8({ data }) {
  return (
    <>
      {/* ───── Mobile layout ───── */}
      <div className="lg:hidden bg-[#0a0a0b] px-6 py-16">
        <div className="max-w-lg mx-auto space-y-12">
          {/* Title */}
          <h2 className="text-[42px] font-light tracking-tight text-white text-center">
            {data?.left?.title || 'Cigars'}
          </h2>

          {/* Intro */}
          <p className="text-[13px] font-semibold leading-[1.7] text-white/85 text-center">
            {data?.left?.intro ||
              'In 2007, Andre Garcia began importing cigars specifically for the Indian market and became the first company in a century to do so. Its range of cigars is quite extensive, starting from small cigarillos to Churchill size. It has more than 15 select blends and its best-selling ones are the Pigtail, Torpedo, Shortie and Churchill. These now find a pride of place at cigar lounges of the Taj and Marriott Group of hotels.'}
          </p>

          {/* Churchill + Short Churchill */}
          <div className="flex gap-5 items-start">
            <div className="w-[28%] flex-shrink-0 self-stretch">
              <img
                src={data?.left?.churchillImg || '/imagecompressor/churchill-and-short-churchill-cigar.png'}
                alt="Churchill cigars"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 space-y-6">
              <div>
                <p className="text-[13px] leading-[1.6] text-white font-semibold mb-1">
                  {data?.left?.churchillTitle || 'CHURCHILL'}
                </p>
                <p className="text-[11px] leading-[1.6] text-white/70">
                  {data?.left?.churchillBody ||
                    "Does a cigar speak? This Andre Garcia Churchill does. It greets you with a multitude of finely blended flavours of rich coffee, cocoa with roasted coffee bean. The back palate continues to be nice with hint of pepper and a woody taste."}
                </p>
              </div>
              <div>
                <p className="text-[13px] leading-[1.6] text-white font-semibold mb-1">
                  {data?.left?.shortTitle || 'SHORT CHURCHILL'}
                </p>
                <p className="text-[11px] leading-[1.6] text-white/70">
                  {data?.left?.shortBody ||
                    'This is an exceptional Cigar in flavour draw and smokiness. It is a full-bodied cigar with hints of spice, cocoa and cedar. Perfect pair with a Cognac.'}
                </p>
              </div>
            </div>
          </div>

          {/* Shortie + Torpedo */}
          <div className="flex gap-5 items-start">
            <div className="flex-1 space-y-6">
              <div>
                <p className="text-[13px] leading-[1.6] text-white font-semibold mb-1">
                  {data?.right?.shortieTitle || 'SHORTIE'}
                </p>
                <p className="text-[11px] leading-[1.6] text-white/70">
                  {data?.right?.shortieBody ||
                    '"A flavoursome yet mild and flavorful experience. Smooth draw and even burning the cigar was indeed full of pleasant flavours and good smoke for 45 mins."'}
                </p>
              </div>
              <div>
                <p className="text-[13px] leading-[1.6] text-white font-semibold mb-1">
                  {data?.right?.torpedoTitle || 'TORPEDO'}
                </p>
                <p className="text-[11px] leading-[1.6] text-white/70">
                  {data?.right?.torpedoBody ||
                    'Torpedo is a super smoke. Starts with coffee and cedar and develops into a complex yet consistent smoke. Its a perfect burn right to the end.'}
                </p>
              </div>
            </div>
            <div className="w-[28%] flex-shrink-0 self-stretch">
              <img
                src={data?.right?.torpedoImg || '/imagecompressor/torpedo-cigar.png'}
                alt="Torpedo cigar"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Quote */}
          <div className="border-l-2 border-white/20 pl-5 py-2">
            <p className="text-[13px] leading-[1.6] text-white font-semibold">
              {data?.right?.quote ||
                '"If you are the kind of person who treasures his cigars more than anything else, you must try an expensive cigar container. Cigars can be fussy products to store and they need the right humidity and air to remain fresh and aromatic."'}
            </p>
            <p className="text-[9px] tracking-[0.2em] text-white/60 mt-3 uppercase">
              {data?.right?.quoteAuthor || 'ABHIK ROY'}
            </p>
          </div>

          {/* Pigtail */}
          <div className="flex gap-5 items-start">
            <div className="flex-1">
              <p className="text-[13px] leading-[1.6] text-white font-semibold mb-1">
                {data?.right?.pigtailTitle || 'PIGTAIL'}
              </p>
              <p className="text-[11px] leading-[1.6] text-white/70">
                {data?.right?.pigtailBody ||
                  'The Andre Garcia Pigtail is cigar is rolled into a thicker robust size, boasting an impressive 68 ring gauge. The flavor profile is about as complex as I have ever had the pleasure of smoking. It starts off rich and spicy with hint of coffee before transitioning to notes of sweet spice, vanilla, and cedar and coffee towards the middle. The construction is impeccable, with an open draw, an even burn, and a tremendous amount of meaty smoke.'}
              </p>
            </div>
            <div className="w-[22%] flex-shrink-0 self-stretch">
              <img
                src={data?.right?.pigtailImg || '/imagecompressor/pigtail-cigar.png'}
                alt="Pigtail cigar"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ───── Desktop layout ───── */}
      <div className="hidden lg:grid grid-cols-2">
        <PageFrame>
          <div className="absolute inset-0 bg-[#0a0a0b]" />
          {/* Left cigars */}
          <div className="absolute top-[8%] left-[6%] bottom-[8%] w-[26%] z-10">
            <img
              src={data?.left?.churchillImg || '/imagecompressor/churchill-and-short-churchill-cigar.png'}
              alt=""
              className="h-full w-full object-contain"
            />
          </div>
          {/* Title + intro */}
          <div className="absolute top-[8%] left-[34%] right-[10%] z-10 text-center">
            <h2 className="text-[clamp(36px,6vw,72px)] font-light leading-[1] tracking-tight text-white">
              {data?.left?.title || 'Cigars'}
            </h2>
          </div>
          <div className="absolute top-[22%] left-[34%] right-[10%] z-10 text-center">
            <p className="text-[11px] font-semibold leading-[1.7] text-white/85">
              {data?.left?.intro ||
                'In 2007, Andre Garcia began importing cigars specifically for the Indian market and became the first company in a century to do so. Its range of cigars is quite extensive, starting from small cigarillos to Churchill size. It has more than 15 select blends and its best-selling ones are the Pigtail, Torpedo, Shortie and Churchill. These now find a pride of place at cigar lounges of the Taj and Marriott Group of hotels.'}
            </p>
          </div>
          {/* Bottom descriptions */}
          <div className="absolute bottom-[26%] left-[34%] right-[10%] z-10 text-left">
            <p className="text-[12px] leading-[1.6] text-white font-semibold">
              {data?.left?.churchillTitle || 'CHURCHILL'}
            </p>
            <p className="text-[10px] leading-[1.6] text-white/70">
              {data?.left?.churchillBody ||
                "Does a cigar speak? This Andre Garcia Churchill does. It greets you with a multitude of finely blended flavours of rich coffee, cocoa with roasted coffee bean. The back palate continues to be nice with hint of pepper and a woody taste."}
            </p>
          </div>
          <div className="absolute bottom-[10%] left-[34%] right-[10%] z-10 text-left">
            <p className="text-[12px] leading-[1.6] text-white font-semibold">
              {data?.left?.shortTitle || 'SHORT CHURCHILL'}
            </p>
            <p className="text-[10px] leading-[1.6] text-white/70">
              {data?.left?.shortBody ||
                'This is an exceptional Cigar in flavour draw and smokiness. It is a full-bodied cigar with hints of spice, cocoa and cedar. Perfect pair with a Cognac.'}
            </p>
          </div>
        </PageFrame>
        <PageFrame>
          <div className="absolute inset-0 bg-[#0a0a0b]" />
          {/* Shortie + Torpedo cigars (single asset) */}
          <div className="absolute top-[8%] left-[10%] w-[44%] z-10">
            <img
              src={data?.right?.torpedoImg || '/imagecompressor/torpedo-cigar.png'}
              alt=""
              className="w-full object-contain"
            />
          </div>
          {/* Top right descriptions */}
          <div className="absolute top-[8%] right-[8%] left-[62%] z-10 text-left">
            <p className="text-[12px] leading-[1.6] text-white font-semibold">
              {data?.right?.shortieTitle || 'SHORTIE'}
            </p>
            <p className="text-[10px] leading-[1.6] text-white/70 mb-4">
              {data?.right?.shortieBody ||
                '"A flavoursome yet mild and flavorful experience. Smooth draw and even burning the cigar was indeed full of pleasant flavours and good smoke for 45 mins."'}
            </p>
            <p className="text-[12px] leading-[1.6] text-white font-semibold">
              {data?.right?.torpedoTitle || 'TORPEDO'}
            </p>
            <p className="text-[10px] leading-[1.6] text-white/70">
              {data?.right?.torpedoBody ||
                'Torpedo is a super smoke. Starts with coffee and cedar and develops into a complex yet consistent smoke. Its a perfect burn right to the end.'}
            </p>
          </div>
          {/* Quote */}
          <div className="absolute top-[46%] right-[8%] left-[56%] z-10 text-left">
            <p className="text-[11px] leading-[1.6] text-white font-semibold">
              {data?.right?.quote ||
                '"If you are the kind of person who treasures his cigars more than anything else, you must try an expensive cigar container. Cigars can be fussy products to store and they need the right humidity and air to remain fresh and aromatic."'}
            </p>
            <p className="text-[9px] tracking-[0.2em] text-white/60 mt-2 uppercase">
              {data?.right?.quoteAuthor || 'ABHIK ROY'}
            </p>
          </div>
          {/* Pigtail block */}
          <div className="absolute bottom-[10%] left-[10%] right-[34%] z-10 text-left">
            <p className="text-[12px] leading-[1.6] text-white font-semibold">
              {data?.right?.pigtailTitle || 'PIGTAIL'}
            </p>
            <p className="text-[10px] leading-[1.6] text-white/70">
              {data?.right?.pigtailBody ||
                'The Andre Garcia Pigtail is cigar is rolled into a thicker robust size, boasting an impressive 68 ring gauge. The flavor profile is about as complex as I have ever had the pleasure of smoking. It starts off rich and spicy with hint of coffee before transitioning to notes of sweet spice, vanilla, and cedar and coffee towards the middle. The construction is impeccable, with an open draw, an even burn, and a tremendous amount of meaty smoke.'}
            </p>
          </div>
          {/* Pigtail cigar */}
          <div className="absolute bottom-[8%] right-[8%] w-[20%] top-[54%] z-10 flex items-end">
            <img
              src={data?.right?.pigtailImg || '/imagecompressor/pigtail-cigar.png'}
              alt=""
              className="h-full w-full object-contain"
            />
          </div>
        </PageFrame>
      </div>
    </>
  );
}

function PdfThumbnail({ src }) {
  const canvasRef = React.useRef(null);
  const [loaded, setLoaded] = React.useState(false);
  const [err, setErr] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        // Dynamically load pdfjs from CDN — no npm install required
        if (!window.pdfjsLib) {
          await new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
          });
        }
        const pdfjsLib = window.pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const pdf = await pdfjsLib.getDocument(src).promise;
        if (cancelled) return;
        const page = await pdf.getPage(1);
        if (cancelled) return;

        const scale = 2;
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
        if (!cancelled) setLoaded(true);
      } catch {
        if (!cancelled) setErr(true);
      }
    }

    render();
    return () => { cancelled = true; };
  }, [src]);

  if (err) {
    return (
      <div className="w-full aspect-[3/4] bg-white/[0.03] flex items-center justify-center border border-white/5">
        <span className="text-white/30 text-xs tracking-wider uppercase">Preview unavailable</span>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[3/4] overflow-hidden border border-white/5">
      {!loaded && (
        <div className="absolute inset-0 bg-white/[0.03] animate-pulse flex items-center justify-center">
          <span className="text-white/20 text-[10px] tracking-wider uppercase">Loading preview…</span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ display: loaded ? 'block' : 'none' }}
      />
    </div>
  );
}

function SpreadPublications() {
  const publications = [
    {
      title: 'Publication I',
      subtitle: 'Featured Article',
      href: '/pub-one.pdf',
    },
    {
      title: 'Publication II',
      subtitle: 'Press Coverage',
      href: '/pub-two.pdf',
    },
  ];

  return (
    <section className="bg-[#0a0a0b] py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-4">Press &amp; Media</p>
          <h2 className="text-[clamp(36px,5vw,56px)] font-light tracking-tight text-white">
            Publications
          </h2>
        </div>

        {/* Publication cards with PDF preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-start">
          {publications.map((pub, i) => (
            <a
              key={i}
              href={pub.href}
              download
              className="group relative bg-[#0a0a0b] transition-all duration-500"
            >
              {/* PDF first-page preview */}
              <div className="relative overflow-hidden mb-6 shadow-luxury group-hover:shadow-[0_28px_70px_rgba(0,0,0,0.8)] transition-shadow duration-500">
                <PdfThumbnail src={pub.href} />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border border-white/40 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </div>
                    <span className="text-[11px] tracking-[0.15em] text-white/90 uppercase">
                      Download PDF
                    </span>
                  </div>
                </div>
              </div>

              {/* Title + subtitle */}
              <div className="text-center">
                <h3 className="text-lg md:text-xl font-light tracking-wide text-white mb-1 group-hover:text-white/90 transition-colors">
                  {pub.title}
                </h3>
                <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase">
                  {pub.subtitle}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0a0a0b] border-t border-white/10">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-light tracking-tight text-white mb-4">Andre Garcia</h3>
            <p className="text-sm text-white/60 max-w-md">
              Handcrafted luxury cigar cases since 2003. The Rolls-Royce of cigar storage, made in Kolkata, India.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="text-[10px] tracking-[0.2em] text-white/50 uppercase mb-4">Navigate</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-white/70 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/products" className="text-sm text-white/70 hover:text-white transition-colors">Products</Link></li>
              <li><Link href="/about" className="text-sm text-white/70 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-sm text-white/70 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-[10px] tracking-[0.2em] text-white/50 uppercase mb-4">Policies</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-white/70 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-white/70 hover:text-white transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link href="/refund-policy" className="text-sm text-white/70 hover:text-white transition-colors">Refund &amp; Cancellation</Link></li>
              <li><Link href="/shipping-policy" className="text-sm text-white/70 hover:text-white transition-colors">Shipping &amp; Delivery</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-[10px] tracking-[0.2em] text-white/50 uppercase mb-4">Contact</h4>
            <ul className="space-y-2">
              <li><a href="mailto:abhik@andregarciacases.com" className="text-sm text-white/70 hover:text-white transition-colors">abhik@andregarciacases.com</a></li>
              <li className="text-sm text-white/70">Kolkata, India</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-[10px] text-white/30 leading-relaxed max-w-3xl">
            <strong className="text-white/40">Disclaimer:</strong> Andre Garcia Cases does not sell cigars, tobacco, nicotine, or any smoking products.
            We exclusively sell cigar cases, accessories, and storage products. Any images of cigars on this website
            are used strictly for representational and illustrative purposes only. You must be 18 years or older to use this website.
          </p>
        </div>
        
        {/* Bottom */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">© {new Date().getFullYear()} Andre Garcia Cases. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="text-xs text-white/40 hover:text-white/70 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-white/40 hover:text-white/70 transition-colors">Terms</Link>
            <Link href="/refund-policy" className="text-xs text-white/40 hover:text-white/70 transition-colors">Refunds</Link>
            <Link href="/shipping-policy" className="text-xs text-white/40 hover:text-white/70 transition-colors">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
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
      {spreads[6] && <Spread7 data={spreads[6]} />}
      <SpreadManhattan data={{}} />
      <SpreadHarrisTweed data={{}} />
      {spreads[7] && <Spread8 data={spreads[7]} />}
      {spreads.length === 0 && (
        <>
          <Spread1 data={{}} />
          <Spread2 data={{}} />
          <Spread3 data={{}} />
          <Spread4 data={{}} />
          <Spread5 data={{}} />
          <Spread6 data={{}} />
          <Spread7 data={{}} />
          <SpreadManhattan data={{}} />
          <SpreadHarrisTweed data={{}} />
          <Spread8 data={{}} />
        </>
      )}
      <SpreadPublications />
      <Footer />
    </div>
  );
}
