// Lookbook-style homepage (editorial spreads)
export const metadata = {
  title: 'Andre Garcia | Luxury Cigar Cases & Cigar Accessories',
  description: 'A luxury cigar and cigar case making brand founded in Kolkata in 2003. Explore the story, the collections, and the craft behind the world of Andre Garcia.',
  keywords: 'Andre Garcia, cigar cases, luxury cigar cases, cigar accessories, St James Collection, Manhattan Collection, Buffalo Horn Collection, Carbon Fibre cigar case, Pack & Go satchel, cigars India import',
  openGraph: {
    title: 'Andre Garcia - Luxury Cigar Cases (Lookbook)',
    description: 'Founded in Kolkata in 2003. Explore the story, the collections, and the craft behind Andre Garcia.',
    type: 'website',
    images: [
      {
        url: '/homepage-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Andre Garcia luxury cigar cases lookbook',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Andre Garcia | Luxury Cigar Cases',
    description: 'Founded in Kolkata in 2003. Explore the lookbook.',
  },
};

// Structured data for the homepage
const homepageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Andre Garcia - Luxury Cigar Cases & Cigar Accessories",
  "description": "A luxury cigar and cigar case making brand founded in Kolkata in 2003.",
  "url": "https://andregarcia.com",
  "mainEntity": {
    "@type": "LocalBusiness",
    "name": "Andre Garcia",
    "description": "Luxury cigar and cigar case making brand",
    "foundingDate": "2003",
    "founder": {
      "@type": "Person",
      "name": "Abhik Roy",
      "jobTitle": "Founder",
      "knowsAbout": ["Cigar Cases", "Luxury Accessories", "Cigar Storage"]
    },
    "specialties": [
      "Luxury Cigar Cases",
      "Cigar Accessories",
      "Custom Cigar Cases"
    ],
    "award": [
      "International Luxury Goods Excellence Award 2023",
      "Master Craftsman Recognition 2022",
      "Premium Cigar Accessories Award 2021"
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Premium Humidors",
          "description": "Handcrafted luxury humidors for optimal cigar preservation",
          "category": "Cigar Storage",
          "brand": {
            "@type": "Brand",
            "name": "André García"
          }
        }
      },
      {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "Product",
          "name": "Artisan Cigar Containers",
          "description": "Custom luxury cigar containers with superior craftsmanship",
          "category": "Luxury Accessories",
          "brand": {
            "@type": "Brand",
            "name": "André García"
          }
        }
      }
    ]
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://andregarcia.com"
      }
    ]
  }
};

export default function Home() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageSchema)
        }}
      />
      
      <div className="min-h-screen bg-background">
        <Lookbook />
      </div>
    </>
  );
}

function Spread({ left, right }) {
  return (
    <section className="py-4 lg:py-6">
      <div className="mx-auto max-w-[1480px] px-4 lg:px-6">
        <div className="relative overflow-hidden">
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0">
            {left}
            {right}
          </div>
        </div>
      </div>
    </section>
  );
}

function PageShell({ children }) {
  return (
    <div className="relative px-8 py-10 lg:px-12 lg:py-12">
      {children}
    </div>
  );
}

function Placeholder({ label, className = '', children }) {
  return (
    <div
      className={[
        'lookbook-frame relative overflow-hidden',
        'bg-gradient-to-br from-white/10 via-white/5 to-transparent',
        className
      ].join(' ')}
    >
      <div className="absolute inset-0 opacity-70 bg-[radial-gradient(700px_480px_at_30%_25%,rgba(255,255,255,0.16),rgba(0,0,0,0)_60%)]" />
      <div className="relative w-full h-full">
        {children ? children : (
          <div className="absolute left-4 bottom-4 lookbook-kicker">
            {label}
          </div>
        )}
      </div>
    </div>
  );
}

function Lookbook() {
  return (
    <div className="relative pb-16 bg-[#070708] overflow-hidden">
      {/* Continuous background/texture across the *entire* homepage (prevents “blank bands” between spreads) */}
      <div className="pointer-events-none absolute inset-0 leather-texture opacity-60" />
      {/* Spread: 2–3 */}
      <Spread
        left={
          <PageShell>
            <div className="mt-10 lg:mt-14">
              <h1 className="lookbook-h1 text-[clamp(2.9rem,5.5vw,5.8rem)] max-w-[18ch]">
                Started by the
                <br />
                Roy brothers,
                <br />
                Abhik and
                <br />
                Anindya, it is
                <br />
                hailed as the
                <br />
                Rolls-Royce of
                <br />
                Cigar Cases.
              </h1>
            </div>

            <div className="mt-10 w-[240px] sm:w-[280px] lg:w-[320px]">
              <Placeholder label="Cigar case product (placeholder)" className="aspect-[4/3]" />
            </div>
          </PageShell>
        }
        right={
          <PageShell>
            <div className="mt-6 lg:mt-8">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-5">
                  <Placeholder label="Cigar (placeholder)" className="aspect-[5/11]" />
                </div>
                <div className="col-span-7">
                  <div className="text-sm md:text-[15px] leading-relaxed text-white/85 font-light">
                    <div className="font-semibold text-white/95 mb-2">“Andre Garcia is a luxury cigar and cigar case making brand founded in Kolkata in the year 2003. It is currently operating from a workshop in Alipore, South Kolkata. The brand is registered and marketed by US-based Ash &amp; Burn, co-promoted by my brother Anindya and myself.”</div>
                    <div className="mt-3 text-white/60 text-xs tracking-wide uppercase">ABHIK ROY, FOUNDER</div>
                  </div>
                </div>
              </div>

              <div className="mt-10 lg:mt-14 flex items-end justify-between gap-6">
                <div>
                  <div className="lookbook-kicker mb-2">FOUNDED IN</div>
                  <div className="lookbook-h1 text-[clamp(3.2rem,6.4vw,5.6rem)] leading-none">
                    2003
                  </div>
                  <div className="mt-2 text-white/60 tracking-[0.32em] uppercase text-xs">KOLKATA</div>
                </div>
                <div className="hidden sm:block w-[220px]">
                  <Placeholder label="Accessories (placeholder)" className="aspect-[4/3]" />
                </div>
              </div>

              <div className="mt-8 grid grid-cols-12 gap-6">
                <div className="col-span-8">
                  <Placeholder label="Founders photo (placeholder)" className="aspect-[4/3]" />
                </div>
                <div className="col-span-4">
                  <Placeholder label="Leather texture (placeholder)" className="aspect-[3/5]" />
                </div>
              </div>
            </div>
          </PageShell>
        }
      />

      {/* Spread: 4–5 */}
      <Spread
        left={
          <PageShell>
            <div className="mt-8 lg:mt-10 max-w-[44ch] ml-auto">
              <div className="text-white/90 text-sm leading-snug font-semibold">
                “Thompson Cigar prom-
                <br />
                ised to place the first
                <br />
                order for cigar cases
                <br />
                once I launched my own
                <br />
                company. “
              </div>
            </div>

            <div className="mt-10 lg:mt-14">
              <h2 className="lookbook-h1 text-[clamp(2.8rem,5vw,4.8rem)] leading-[0.95]">
                The man
                <br />
                and his
                <br />
                passion
              </h2>
            </div>

            <div className="mt-10 text-sm md:text-[15px] text-white/75 leading-relaxed max-w-[62ch]">
              <p>
                Brought up in a family of academicians, it was during Abhik Roy’s tenure with a multinational company that a chance meeting with Robert Franzblau in 2000 at the Ambiente Trade Fair in Frankfurt, Germany, turned out to be a decisive moment.
              </p>
              <p className="mt-4">
                Franzblau, founder-president of America’s oldest mail order cigar company, Thompson Cigar, promised to place the first order for cigar cases once Roy launched his own company.
              </p>
              <p className="mt-4">
                Roy returned with a renewed gusto and quit his salaried job and became a full-fledged entrepreneur. He always believed that if you know the functionality of a product, the design becomes more or less apparent. This turned out to be his raison de succès.
              </p>
              <div className="mt-6 text-white/60 text-xs tracking-wide uppercase">ABHIK ROY</div>
            </div>

            <div className="mt-10 w-[90px] lg:w-[110px] ml-auto">
              <Placeholder label="Cigar (placeholder)" className="aspect-[3/12] rounded-none border-white/20" />
            </div>
          </PageShell>
        }
        right={
          <PageShell>
            <div className="mt-8 lg:mt-10">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-7">
                  <Placeholder label="Hero product (placeholder)" className="aspect-[3/4]" />
                </div>
                <div className="col-span-5 space-y-6">
                  <Placeholder label="Product (placeholder)" className="aspect-[1/1]" />
                  <Placeholder label="Product (placeholder)" className="aspect-[4/5]" />
                </div>
              </div>

              <div className="mt-6">
                <Placeholder label="Detail / name plate (placeholder)" className="aspect-[16/4]" />
              </div>
            </div>
          </PageShell>
        }
      />

      {/* Spread: 6–7 */}
      <Spread
        left={
          <PageShell>
            <div className="mt-6 lg:mt-8">
              <div className="relative">
                <Placeholder label="Cigar case photo (placeholder)" className="aspect-[4/5]" />
                <div className="absolute left-4 lg:left-6 bottom-4 lg:bottom-6">
                  <div className="lookbook-h1 text-[clamp(2.8rem,6vw,5.8rem)]">
                    Cigar Cases
                  </div>
                </div>
              </div>
            </div>
          </PageShell>
        }
        right={
          <PageShell>
            <div className="mt-10 lg:mt-12">
              <div className="text-white/90 font-semibold text-sm leading-snug max-w-[34ch] mx-auto text-center">
                Andre Garcia revolution-
                <br />
                ised the world of cigar
                <br />
                cases with its St James
                <br />
                Collection, Pack &amp; Go,
                <br />
                Manhattan, the Golf and
                <br />
                Buffalo Horn Collection,
                <br />
                for which Roy has a
                <br />
                patent.
              </div>
            </div>

            <div className="mt-10 grid grid-cols-12 gap-6 items-start">
              <div className="col-span-6 text-xs md:text-sm text-white/70 leading-relaxed">
                <p>
                  Andre Garcia brand’s guiding principle is one size does not fit all. Roy pioneered a spectrum of sizes to accommodate anything from a short trip, for which one might like a solo smoke, to a party, at which one intends to offer cigars to all the guys.
                </p>
                <p className="mt-4">
                  Striving for multiplicity, Andre Garcia crafted 1—, 2—, 4—, 5—, 6—, 8—, 10—, 16— and 20—finger cases in various designs, leather grains, dimensions, and colors, as well as widths and lengths.
                </p>
              </div>
              <div className="col-span-6">
                <Placeholder label="Leather weave (placeholder)" className="aspect-[3/4]" />
              </div>
            </div>
          </PageShell>
        }
      />

      {/* Spread: 8–9 (visual spread) */}
      <Spread
        left={
          <PageShell>
            <div className="mt-10 lg:mt-12">
              <div className="grid grid-cols-12 gap-6 items-end">
                <div className="col-span-5">
                  <Placeholder label="Case (placeholder)" className="aspect-[3/8]" />
                </div>
                <div className="col-span-7 space-y-6">
                  <Placeholder label="Case (placeholder)" className="aspect-[4/5]" />
                  <Placeholder label="Accessory (placeholder)" className="aspect-[16/8]" />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-12 gap-6">
                <div className="col-span-8">
                  <Placeholder label="Cigars + cases (placeholder)" className="aspect-[16/10]" />
                </div>
                <div className="col-span-4">
                  <Placeholder label="Cigar (placeholder)" className="aspect-[3/12]" />
                </div>
              </div>
            </div>
          </PageShell>
        }
        right={
          <PageShell>
            <div className="mt-10 lg:mt-12">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12">
                  <Placeholder label="Tall cases (placeholder)" className="aspect-[16/10]" />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-12 gap-6">
                <div className="col-span-7">
                  <Placeholder label="Case detail (placeholder)" className="aspect-[4/3]" />
                </div>
                <div className="col-span-5">
                  <Placeholder label="Case (placeholder)" className="aspect-[3/4]" />
                </div>
              </div>
            </div>
          </PageShell>
        }
      />

      {/* Spread: 10–11 (St. James) */}
      <Spread
        left={
          <PageShell>
            <div className="mt-6 lg:mt-8">
              <div className="relative">
                <Placeholder label="St. James hero photo (placeholder)" className="aspect-[4/5]" />
                <div className="absolute right-4 lg:right-6 bottom-4 lg:bottom-6 text-right">
                  <div className="lookbook-h1 text-[clamp(2.2rem,5.5vw,5.2rem)] leading-[0.95]">
                    St.
                    <br />
                    James
                    <br />
                    Collection
                  </div>
                </div>
              </div>
            </div>
          </PageShell>
        }
        right={
          <PageShell>
            <div className="mt-10 lg:mt-12">
              <div className="text-white/90 font-semibold text-sm leading-snug text-center">
                The St. James Collection
                <br />
                accommodates a cutter, a
                <br />
                lighter and a humidification.
              </div>

              <div className="mt-6 text-xs md:text-sm text-white/70 leading-relaxed max-w-[72ch] mx-auto">
                <p>
                  Perhaps the most innovative case on the market, here is a case that combined not only space for cigars, but also for accessories! The cigar section is a telescoping case with space for 6-16 cigars, depending on model, with a zip-around section on the top to keep your lighter, cutter and other accessories handy and in one place.
                </p>
                <p className="mt-4">
                  You can choose from both smooth leather finishes, a weaved style and a crocodile-style finish, all in multiple colors.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-12 gap-6 items-start">
                <div className="col-span-7">
                  <Placeholder label="Collection photo (placeholder)" className="aspect-[4/3]" />
                </div>
                <div className="col-span-5">
                  <Placeholder label="Leather texture (placeholder)" className="aspect-[3/4]" />
                </div>
              </div>
            </div>
          </PageShell>
        }
      />

      {/* Spread: 12–13 (Manhattan) */}
      <Spread
        left={
          <PageShell>
            <div className="mt-10 lg:mt-12 text-center">
              <h2 className="lookbook-h1 text-[clamp(2.6rem,5.2vw,5.4rem)]">
                Manhattan
                <br />
                Collection
              </h2>
            </div>
            <div className="mt-10 lg:mt-12 max-w-[520px] mx-auto">
              <Placeholder label="Manhattan hero photo (placeholder)" className="aspect-[4/3]" />
            </div>
          </PageShell>
        }
        right={
          <PageShell>
            <div className="mt-10 lg:mt-12">
              <div className="text-white/90 font-semibold text-sm leading-snug max-w-[32ch] ml-auto">
                The Manhattan Collec-
                <br />
                tion features a unique
                <br />
                zipper enclosed top as
                <br />
                an alternative to the
                <br />
                typical leather from
                <br />
                which the top simply
                <br />
                slides off.
              </div>

              <div className="mt-6 text-xs md:text-sm text-white/70 leading-relaxed max-w-[76ch]">
                <p>
                  This line of cases offers a choice of sizes, for four, six or ten cigars in various leathers with a zip-around top to keep your cigars easy to access. There are smooth and crocodile-style finishes, plus a combination case called the Latte Mistro Collection.
                </p>
                <p className="mt-4">
                  It’s a specially styled case that takes the zip-around format and adds a top of Buffalo horn for an extra touch of class.
                </p>
              </div>

              <div className="mt-10">
                <Placeholder label="Manhattan collection photo (placeholder)" className="aspect-[16/10]" />
              </div>
            </div>
          </PageShell>
        }
      />

      {/* Spread: 14–15 (Buffalo Horn) */}
      <Spread
        left={
          <PageShell>
            <div className="mt-10 lg:mt-12">
              <h2 className="lookbook-h1 text-[clamp(2.6rem,5.2vw,5.2rem)] leading-[0.95]">
                Buffalo
                <br />
                Horn
                <br />
                Collection
              </h2>
            </div>

            <div className="mt-10 lg:mt-12">
              <Placeholder label="Buffalo Horn hero photo (placeholder)" className="aspect-[16/9]" />
            </div>

            <div className="mt-10">
              <Placeholder label="Cigar (placeholder)" className="aspect-[16/2]" />
            </div>
          </PageShell>
        }
        right={
          <PageShell>
            <div className="mt-10 lg:mt-12">
              <div className="text-white/90 font-semibold text-sm leading-snug max-w-[26ch]">
                The Buffalo Horn
                <br />
                showcase multi-
                <br />
                hued, sinewy caps
                <br />
                made from the horny
                <br />
                appendages of the
                <br />
                buffalo.
              </div>

              <div className="mt-6 text-xs md:text-sm text-white/70 leading-relaxed">
                <p>
                  Here’s a series of hard-leather, two or three-finger cases in a variety of finishes: smooth leather in multiple colors, woven leather, Croco or Ostrich patterns. Each sliding case can accommodate cigars of various lengths in hard-shell protection, including the most densely packed suitcase.
                </p>
                <p className="mt-4">
                  And the top of each telescoping case has a hard, Buffalo horn top in a marvelous, glossy finish that makes each one unique.
                </p>
              </div>

              <div className="mt-10 max-w-[520px] ml-auto">
                <Placeholder label="Buffalo Horn product photo (placeholder)" className="aspect-[4/3]" />
              </div>
            </div>
          </PageShell>
        }
      />

      {/* Spread: 17 (Custom Cases) */}
      <Spread
        left={
          <PageShell>
            <div className="mt-10 lg:mt-12 grid grid-cols-12 gap-6">
              <div className="col-span-5">
                <Placeholder label="Carbon texture (placeholder)" className="aspect-[1/1]" />
              </div>
              <div className="col-span-7">
                <Placeholder label="Accessories photo (placeholder)" className="aspect-[4/3]" />
              </div>
              <div className="col-span-5">
                <Placeholder label="Cigar (placeholder)" className="aspect-[5/11]" />
              </div>
              <div className="col-span-7">
                <Placeholder label="Small cases photo (placeholder)" className="aspect-[4/2]" />
              </div>
            </div>
          </PageShell>
        }
        right={
          <PageShell>
            <div className="mt-10 lg:mt-12">
              <Placeholder label="Custom case hero photo (placeholder)" className="aspect-[16/9]" />
              <div className="mt-6 flex items-end justify-between gap-6">
                <div className="lookbook-h1 text-[clamp(2.4rem,5.2vw,5.2rem)] leading-[0.95]">
                  Custom Cases
                </div>
              </div>
              <div className="mt-6 text-xs md:text-sm text-white/70 leading-relaxed max-w-[56ch]">
                The Buffalo Horn collection has a Custom section which provides discerning cigar smokers the option of customising their cigar cases, a one-of-its-kind service in the world.
              </div>
            </div>
          </PageShell>
        }
      />

      {/* Spread: 18–19 (Carbon Fibre) */}
      <Spread
        left={
          <PageShell>
            <div className="mt-10 lg:mt-12">
              <h2 className="lookbook-h1 text-[clamp(2.6rem,5.2vw,5.4rem)] leading-[0.95]">
                Carbon
                <br />
                Fibre
                <br />
                Collection
              </h2>
            </div>
            <div className="mt-10 lg:mt-12">
              <Placeholder label="Carbon Fibre collection photo (placeholder)" className="aspect-[16/10]" />
            </div>
          </PageShell>
        }
        right={
          <PageShell>
            <div className="mt-10 lg:mt-12">
              <div className="text-white/90 font-semibold text-sm leading-snug max-w-[26ch] ml-auto">
                This high-tech material
                <br />
                consists of extremely
                <br />
                thin fibers bonded
                <br />
                together in hexagonal
                <br />
                aromatic rings, which
                <br />
                are incredibly strong for
                <br />
                their size.
              </div>

              <div className="mt-6 text-xs md:text-sm text-white/70 leading-relaxed">
                <p>
                  Carry your cigars in style with the Andre Garcia Limited Edition Carbon Fiber cigar case. Each piece is hand made with a crush-resistant aluminum shell, genuine cedar wood inner lining, and an exterior of leather and genuine carbon fiber.
                </p>
                <p className="mt-4">
                  This high-tech material consists of extremely thin fibers bonded together in hexagonal aromatic rings, which are incredibly strong for their size. Several thousand carbon fibers are twisted together to form a yarn that’s woven into a fabric, combined with epoxy, and molded to form composite reinforced sheets that are tough but very lightweight.
                </p>
                <p className="mt-4">
                  The cases are available in two- and three-finger capacity models.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-12 gap-6">
                <div className="col-span-8">
                  <Placeholder label="Carbon Fibre photo (placeholder)" className="aspect-[16/10]" />
                </div>
                <div className="col-span-4">
                  <Placeholder label="Carbon weave (placeholder)" className="aspect-[3/5]" />
                </div>
              </div>
            </div>
          </PageShell>
        }
      />

      {/* Spread: 20–21 (Pack & Go) */}
      <Spread
        left={
          <PageShell>
            <div className="mt-10 lg:mt-12">
              <h2 className="lookbook-h1 text-[clamp(2.8rem,6vw,5.8rem)]">Pack &amp; Go</h2>
            </div>
            <div className="mt-10 lg:mt-12">
              <Placeholder label="Pack & Go hero photo (placeholder)" className="aspect-[16/10]" />
            </div>
          </PageShell>
        }
        right={
          <PageShell>
            <div className="mt-10 lg:mt-12">
              <div className="text-white/90 font-semibold text-sm leading-snug max-w-[26ch]">
                The most impressing
                <br />
                and unique product
                <br />
                of Garcia’s crafts
                <br />
                is the Pack &amp; Go
                <br />
                satchel that easily
                <br />
                stows astonishing 40
                <br />
                sticks of your favor-
                <br />
                ite smokes.
              </div>

              <div className="mt-6 text-xs md:text-sm text-white/70 leading-relaxed">
                <p>
                  From the first glance, it can’t be differentiated from an upscale executive tote with an adjustable handle and removable shoulder straps. But the inside reveals finest space with breathing Spanish cedar-lining and organized collapsible wooden dividers plus additional compartments offering space for the essentials a good smoking ritual requires.
                </p>
                <p className="mt-4">
                  Both the understated plain black leather case, and the confidence-requiring crocodile print enhanced case is crafted to last generations of discerning aficionados.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-12 gap-6 items-start">
                <div className="col-span-6">
                  <Placeholder label="Satchel detail (placeholder)" className="aspect-[4/3]" />
                </div>
                <div className="col-span-6">
                  <Placeholder label="Satchel + cases (placeholder)" className="aspect-[4/3]" />
                </div>
              </div>
            </div>
          </PageShell>
        }
      />

      {/* Spread: 22–23 (Cigars) */}
      <Spread
        left={
          <PageShell>
            <div className="mt-10 lg:mt-12">
              <h2 className="lookbook-h1 text-[clamp(2.6rem,5.8vw,5.6rem)]">Cigars</h2>
            </div>

            <div className="mt-8 grid grid-cols-12 gap-6 items-end">
              <div className="col-span-4">
                <Placeholder label="Cigar (placeholder)" className="aspect-[3/12]" />
              </div>
              <div className="col-span-8 text-xs md:text-sm text-white/70 leading-relaxed">
                <p className="font-semibold text-white/90">
                  In 2007, Andre Garcia began importing cigars specifically for the Indian market and became the first company in a century to do so. Its range of cigars is quite extensive, starting from small cigarillos to Churchill size. It has more than 15 select blends and its best-selling ones are the Pigtail, Torpedo, Shortie and Churchill. These now find a pride of place at cigar lounges of the Taj and Marriott Group of hotels.
                </p>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-12 gap-6">
              <div className="col-span-6">
                <div className="text-white/90 font-semibold text-xs tracking-wide uppercase mb-2">CHURCHILL</div>
                <div className="text-xs md:text-sm text-white/70 leading-relaxed">
                  Does a Cigar speak! This Andre Garcia Churchill does. It greets you with a multitude of finely blended flavours of rich coffee, cocoa with roasted coffee bean. The back palate continues to be nice with hint of pepper and a woody taste.
                </div>
              </div>
              <div className="col-span-6">
                <div className="text-white/90 font-semibold text-xs tracking-wide uppercase mb-2">SHORT CHURCHILL</div>
                <div className="text-xs md:text-sm text-white/70 leading-relaxed">
                  This is an exceptional Cigar in flavour draw and smoothness. It’s a full bodied cigar with hints of spice, cocoa and cedar. Perfect pair with a Cognac.
                </div>
              </div>
            </div>

            <div className="mt-10">
              <Placeholder label="Wrapper texture (placeholder)" className="aspect-[16/3]" />
            </div>
          </PageShell>
        }
        right={
          <PageShell>
            <div className="mt-10 lg:mt-12 grid grid-cols-12 gap-6 items-start">
              <div className="col-span-5 space-y-6">
                <div>
                  <div className="text-white/90 font-semibold text-xs tracking-wide uppercase">TORPEDO</div>
                  <div className="mt-2 text-xs md:text-sm text-white/70 leading-relaxed">
                    Torpedo is a super smoke. Starts with coffee and cedar and develops into a complex yet consistent smoke. It’s a perfect burn right to the finish.
                  </div>
                </div>
                <div>
                  <div className="text-white/90 font-semibold text-xs tracking-wide uppercase">PIGTAIL</div>
                  <div className="mt-2 text-xs md:text-sm text-white/70 leading-relaxed">
                    The Andre Garcia Pigtail is cigar is rolled into a thicker robusto size, boasting an impressive 56 ring gauge. The flavor profile is about as complex as I’ve ever had the pleasure of smoking. It starts off rich and spicy with hint of coffee before transitioning to notes of sweet spice, vanilla, and cedar and coffee towards the middle. The construction is impeccable, with an open draw, an even burn, and a tremendous amount of meaty smoke.
                  </div>
                </div>
              </div>

              <div className="col-span-7">
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-5">
                    <Placeholder label="Cigar (placeholder)" className="aspect-[3/12]" />
                  </div>
                  <div className="col-span-7">
                    <Placeholder label="Cigar (placeholder)" className="aspect-[5/11]" />
                  </div>
                </div>

                <div className="mt-8 border border-white/10 bg-white/5 p-5">
                  <div className="text-white/90 font-semibold text-sm leading-snug">
                    “If you are the kind of person who treasures his cigars more than anything else, you must try an expensive cigar container. Cigars can be fussy products to store and they need the right humidity and air to remain fresh and aromatic.”
                  </div>
                  <div className="mt-3 text-white/60 text-xs tracking-wide uppercase">ABHIK ROY</div>
                </div>

                <div className="mt-6 text-xs md:text-sm text-white/70 leading-relaxed">
                  <div className="text-white/90 font-semibold text-xs tracking-wide uppercase mb-2">SHORTIE</div>
                  “A flavoursome yet mild and favourful experience. Smooth draw and even burning the cigar was indeed full of pleasant flavours and good smoke for 45 mins.”
                </div>
              </div>
            </div>
          </PageShell>
        }
      />

      {/* Spread: 24–25 (Global Imprint / Press) */}
      <Spread
        left={
          <PageShell>
            <div className="mt-10 lg:mt-12">
              <h2 className="lookbook-h1 text-[clamp(2.8rem,6vw,5.8rem)] leading-[0.95]">
                A GLOBAL
                <br />
                IMPRINT
              </h2>
              <div className="mt-8 text-xs md:text-sm text-white/70 leading-relaxed max-w-[68ch]">
                <p>
                  Its products began to be sold to reputable tobacconists like JJ Fox, Harrods and Selfridges in London, Nat Sherman in New York, À La Civette in Paris, and Hajenius in Amsterdam, among others.
                </p>
                <p className="mt-4">
                  It now has nearly 150 cigar case designs to its credit and each of these has been exceptionally well-received.
                </p>
              </div>

              <div className="mt-10 text-white/90 font-semibold text-sm leading-snug max-w-[60ch]">
                ANDRE GARCIA’S PREMIUM LEATHER CIGAR CASES BECAME AN INSTANT HIT. IN ITS FIRST YEAR, ANDRE GARCIA MANAGED TO SELL 1.6 LAKH CIGAR CASES!
              </div>
            </div>
          </PageShell>
        }
        right={
          <PageShell>
            <div className="mt-10 lg:mt-12">
              <div className="text-white/70 text-xs mb-4">
                Cigar Aficioando 2014 Holiday Gift Guide
                <br />
                Robb Report India, January 2012
              </div>

              <div className="text-white/90 font-semibold text-sm leading-snug max-w-[60ch]">
                Andre Garcia has earned rave reviews and made it to Robb Report’s Best of the Best Issue, and even got featured in premium world-class magazines like Cigar Aficionado, Vintage Luxe and The Sopranos.
              </div>

              <div className="mt-8 space-y-6">
                <div className="border border-white/10 bg-white/5 p-5">
                  <div className="text-white/90 font-semibold text-sm">“A Fine Case in Point</div>
                  <div className="text-white/70 text-xs mt-1">A small company in Kolkata is creating cigar cases that have caught the world’s attention”</div>
                  <div className="text-white/60 text-xs mt-2">- Robb Report India, Jan 2012</div>
                </div>
                <div className="border border-white/10 bg-white/5 p-5">
                  <div className="text-white/90 font-semibold text-sm">“Evenings of Elegance</div>
                  <div className="text-white/70 text-xs mt-1">Tying up your black tie and lighting up your best smokes”</div>
                  <div className="text-white/60 text-xs mt-2">- Cigar Aficionado 2014</div>
                </div>
                <div className="border border-white/10 bg-white/5 p-5">
                  <div className="text-white/70 text-xs leading-relaxed">
                    “And the variety of styles is geared not to fashion – although they’re all elegant and striking but to function, allowing you to keep your cigars protected and ready as well or better than any models on the market.”
                  </div>
                  <div className="text-white/60 text-xs mt-2">- Cigar Gallery, www.cigarencyclopedia.com</div>
                </div>
              </div>
            </div>
          </PageShell>
        }
      />

      <section className="pt-4">
        <div className="mx-auto max-w-[1480px] px-4 lg:px-6">
          <div className="bg-[#070708] shadow-luxury-plain overflow-hidden">
            <div className="relative leather-texture px-8 py-10 lg:px-12 lg:py-12">
              <div className="text-white/70 text-sm">
                For further details, visit{' '}
                <a className="text-white/90 underline underline-offset-4" href="https://www.andregarcia.com" target="_blank" rel="noreferrer">
                  www.andregarcia.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
