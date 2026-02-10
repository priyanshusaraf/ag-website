import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export const metadata = {
  title: 'About Us – The Roy Brothers & The Story of Andre Garcia',
  description:
    'Founded in 2003 by Abhik and Anindya Roy in Kolkata, India, Andre Garcia is hailed as the Rolls-Royce of Cigar Cases. Featured in Robb Report and Cigar Aficionado. Discover the story behind our handcrafted luxury cigar cases.',
  openGraph: {
    title: 'About Andre Garcia – The Rolls-Royce of Cigar Cases',
    description:
      'Founded in 2003 by the Roy Brothers in Kolkata, India. Handcrafted luxury cigar cases featuring patent-pending designs, premium leather, and Spanish cedar lining.',
    images: ['/imagecompressor/roy-brothers.png'],
  },
};

const About = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 border-b border-white/10 overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b] via-[#0f0f10] to-[#0a0a0b]" />
        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="bg-primary/20 text-primary border-primary/30 uppercase tracking-widest text-[10px]">
              Est. 2003 &middot; Kolkata
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight">
              The Story Behind{' '}
              <span className="text-primary">Andre Garcia</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
              Hailed as the Rolls-Royce of Cigar Cases, Andre Garcia has been
              revolutionising the world of luxury cigar storage since 2003.
            </p>
          </div>
        </div>
      </section>

      {/* The Roy Brothers — Founders Section */}
      <section className="py-20 md:py-28 border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-lg overflow-hidden border border-white/10">
                <img
                  src="/imagecompressor/roy-brothers.png"
                  alt="Abhik and Anindya Roy — Founders of Andre Garcia"
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#0a0a0b] border border-white/10 px-6 py-4 text-center">
                <p className="text-[9px] tracking-[0.28em] text-white/60 uppercase">Founded in</p>
                <p className="text-[48px] font-light leading-none text-white tracking-tight mt-1">2003</p>
                <p className="text-[9px] tracking-[0.25em] text-white/60 uppercase mt-1">Kolkata</p>
              </div>
            </div>

            {/* Text */}
            <div className="space-y-6">
              <div>
                <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-4">The Founders</p>
                <h2 className="text-3xl md:text-4xl font-light text-white mb-2">
                  The Roy <span className="text-primary">Brothers</span>
                </h2>
              </div>
              <div className="space-y-5 text-[15px] leading-[1.8] text-white/70">
                <p>
                  Started by the Roy brothers, <strong className="text-white font-semibold">Abhik</strong> and{' '}
                  <strong className="text-white font-semibold">Anindya</strong>, Andre Garcia is hailed as the
                  Rolls-Royce of Cigar Cases — a brand born from passion, precision, and an
                  unwavering commitment to excellence.
                </p>
                <p>
                  Brought up in a family of academicians, it was during Abhik Roy's tenure
                  with a multinational company that a chance meeting with{' '}
                  <strong className="text-white font-semibold">Robert Franzblau</strong> in 2000 at the{' '}
                  <em>Ambiente Trade Fair</em> in Frankfurt, Germany, turned out to be a
                  decisive moment.
                </p>
                <p>
                  Franzblau, founder-president of America's oldest mail order cigar company,{' '}
                  <strong className="text-white font-semibold">Thompson Cigar</strong>, promised to place the
                  first order for cigar cases once Roy launched his own company.
                </p>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-lg font-light text-primary">AG</span>
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Abhik &amp; Anindya Roy</div>
                  <div className="text-[12px] text-white/40">Founders, Andre Garcia</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Man and His Passion */}
      <section className="py-20 md:py-28 border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text — left on desktop */}
            <div className="space-y-6 lg:order-1">
              <div>
                <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-4">The Visionary</p>
                <h2 className="text-3xl md:text-4xl font-light text-white mb-2">
                  The Man &amp; His <span className="text-primary">Passion</span>
                </h2>
              </div>
              <div className="space-y-5 text-[15px] leading-[1.8] text-white/70">
                <p className="text-white font-semibold leading-[1.7]">
                  Roy returned with a renewed gusto and quit his salaried job and became a
                  full-fledged entrepreneur. He always believed that if you know the
                  functionality of a product, the design becomes more or less apparent.
                  This turned out to be his <em>raison de succès</em>.
                </p>
                <p>
                  Andre Garcia revolutionised the world of cigar cases with its St James
                  Collection, Pack &amp; Go, Manhattan, the Golf and Buffalo Horn Collection,
                  for which Roy has a patent.
                </p>
                <p>
                  Andre Garcia brand's guiding principle is{' '}
                  <strong className="text-white font-semibold">one size does not fit all</strong>.
                  Roy pioneered a spectrum of sizes to accommodate anything from a short trip,
                  for which one might like a solo smoke, to a party, at which one intends to
                  offer cigars to all the guys.
                </p>
                <p>
                  Striving for multiplicity, Andre Garcia crafted 1–, 2–, 4–, 5–, 6–, 8–,
                  10–, 16– and 20–finger cases in various designs, leather grains, dimensions,
                  and colors, as well as widths and lengths.
                </p>
              </div>
            </div>

            {/* Image — right on desktop */}
            <div className="relative lg:order-2">
              <div className="aspect-[4/5] rounded-lg overflow-hidden border border-white/10">
                <img
                  src="/imagecompressor/abhik-cigar-passion.jpeg"
                  alt="Abhik Roy — the man and his passion"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote / Philosophy Banner */}
      <section className="py-16 md:py-24 border-b border-white/10 bg-[#0f0f10]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="text-primary text-5xl font-serif leading-none">&ldquo;</div>
            <blockquote className="text-xl md:text-2xl font-light text-white leading-relaxed">
              If you are the kind of person who treasures his cigars more than anything else,
              you must try an expensive cigar container. Cigars can be fussy products to store
              and they need the right humidity and air to remain fresh and aromatic.
            </blockquote>
            <div>
              <p className="text-[10px] tracking-[0.25em] text-white/50 uppercase">Abhik Roy</p>
              <p className="text-[10px] tracking-[0.15em] text-white/30 uppercase mt-1">Founder, Andre Garcia</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Brothers Together / Craftsmanship */}
      <section className="py-20 md:py-28 border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-white/10">
                <img
                  src="/imagecompressor/roy-brothers-pt2.jpeg"
                  alt="The Roy Brothers — Craftsmanship"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Text */}
            <div className="space-y-6">
              <div>
                <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-4">Craftsmanship</p>
                <h2 className="text-3xl md:text-4xl font-light text-white mb-2">
                  A Legacy of <span className="text-primary">Excellence</span>
                </h2>
              </div>
              <div className="space-y-5 text-[15px] leading-[1.8] text-white/70">
                <p>
                  Every Andre Garcia case is handcrafted by skilled artisans using
                  time-honored techniques. Each piece undergoes rigorous quality control to
                  ensure it meets the exacting standards that have made the brand legendary.
                </p>
                <p>
                  Our cases feature genuine <strong className="text-white font-semibold">Spanish cedar wood lining</strong>{' '}
                  to maintain optimal humidity, premium leather sourced from the finest
                  tanneries, and meticulous attention to every stitch and detail.
                </p>
                <p>
                  From the innovative Pack &amp; Go — a patent-pending design featured in{' '}
                  <em>Robb Report</em> and <em>Cigar Aficionado</em> — to the exquisite
                  Buffalo Horn Collection with its unique hand-polished horn caps, every
                  collection tells a story of relentless pursuit of perfection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey / Timeline */}
      <section className="py-20 md:py-28 border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-4">Milestones</p>
            <h2 className="text-3xl md:text-4xl font-light text-white">
              Our <span className="text-primary">Journey</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-0">
              {[
                {
                  year: '2000',
                  title: 'The Decisive Meeting',
                  description:
                    'Abhik Roy meets Robert Franzblau at the Ambiente Trade Fair in Frankfurt, Germany — the spark that ignites the Andre Garcia vision.',
                },
                {
                  year: '2003',
                  title: 'Andre Garcia is Born',
                  description:
                    'The Roy brothers launch Andre Garcia from Kolkata, India, beginning a journey to create the finest cigar cases in the world.',
                },
                {
                  year: '2005',
                  title: 'Pioneering Collections',
                  description:
                    'Introduction of the St. James Collection and Buffalo Horn Collection — revolutionary designs that redefine cigar case craftsmanship.',
                },
                {
                  year: '2007',
                  title: 'Cigars for India',
                  description:
                    'Andre Garcia begins importing cigars for the Indian market, becoming the first company in a century to do so. Blends now featured at Taj and Marriott lounges.',
                },
                {
                  year: '2009',
                  title: 'International Recognition',
                  description:
                    'The patent-pending Pack & Go is named Robb Report Front Runner 2009 and featured in Cigar Aficionado\'s Good Life Guide 2009.',
                },
                {
                  year: '2015',
                  title: 'Carbon Fibre Innovation',
                  description:
                    'Launch of the limited edition Carbon Fibre Collection — genuine carbon fiber with crush-resistant aluminum shell and cedar lining.',
                },
                {
                  year: '2020',
                  title: 'Harris Tweed Partnership',
                  description:
                    'The Harris Tweed Collection debuts, bringing authentic Scottish heritage — handwoven in the Outer Hebrides — to the world of cigar cases.',
                },
                {
                  year: '2024',
                  title: 'The Legacy Continues',
                  description:
                    'Over two decades of excellence. Andre Garcia continues to expand its collections, serving discerning collectors across the globe.',
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-6 md:gap-10">
                  {/* Year column */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-primary font-light text-sm">{item.year}</span>
                    </div>
                    {index < 7 && (
                      <div className="w-px flex-1 bg-white/10 my-2" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-10">
                    <h3 className="text-lg font-medium text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-white/60 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-20 border-b border-white/10 bg-[#0f0f10]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-light text-primary">20+</div>
              <div className="text-[11px] tracking-[0.15em] text-white/50 uppercase">Years of Excellence</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-light text-primary">15+</div>
              <div className="text-[11px] tracking-[0.15em] text-white/50 uppercase">Cigar Blends</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-light text-primary">9</div>
              <div className="text-[11px] tracking-[0.15em] text-white/50 uppercase">Case Sizes (1–20)</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-light text-primary">100%</div>
              <div className="text-[11px] tracking-[0.15em] text-white/50 uppercase">Handcrafted</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-light text-white">
              Experience the <span className="text-primary">Difference</span>
            </h2>
            <p className="text-lg text-white/50 leading-relaxed">
              Join the discerning collectors who trust Andre Garcia to preserve
              their most precious cigars. Every case is a masterpiece.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href="/collections">Explore Collections</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-white/20 text-white hover:bg-white/10">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
