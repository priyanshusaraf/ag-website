import Hero from '@/components/sections/Hero';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import About from '@/components/sections/About';
import Testimonials from '@/components/sections/Testimonials';
import CTA from '@/components/sections/CTA';
import BrandCarousel from '@/components/sections/BrandCarousel';
// Enhanced metadata for homepage
export const metadata = {
  title: 'Luxury Cigar Containers & Premium Humidors | André García',
  description: 'Discover André García\'s handcrafted luxury cigar containers and premium humidors. Award-winning artisan quality since 1985. Preserve your finest cigars with innovative storage solutions crafted by master artisans.',
  keywords: 'André García, luxury cigar containers, premium humidors, handcrafted humidors, artisan cigar storage, custom cigar boxes, cedar humidors, cigar preservation, luxury tobacco accessories, bespoke cigar storage',
  openGraph: {
    title: 'André García - Master Craftsman of Luxury Cigar Storage Solutions',
    description: 'Experience the pinnacle of cigar preservation with André García\'s handcrafted luxury containers and premium humidors. Award-winning artisan quality since 1985.',
    type: 'website',
    images: [
      {
        url: '/homepage-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'André García luxury cigar containers and premium humidors showcase',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'André García - Luxury Cigar Containers & Premium Humidors',
    description: 'Handcrafted luxury cigar storage solutions by master artisan André García. Since 1985.',
  },
};

// Structured data for the homepage
const homepageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "André García - Luxury Cigar Containers & Premium Humidors",
  "description": "Discover handcrafted luxury cigar containers and premium humidors by André García. Award-winning artisan quality since 1985.",
  "url": "https://andregarcia.com",
  "mainEntity": {
    "@type": "LocalBusiness",
    "name": "André García",
    "description": "Master craftsman specializing in luxury cigar containers and premium humidors",
    "foundingDate": "1985",
    "founder": {
      "@type": "Person",
      "name": "André García",
      "jobTitle": "Master Craftsman",
      "knowsAbout": ["Cigar Storage", "Humidor Craftsmanship", "Luxury Woodworking", "Tobacco Preservation"]
    },
    "specialties": [
      "Luxury Cigar Containers",
      "Premium Humidors", 
      "Custom Cigar Storage Solutions",
      "Artisan Woodworking",
      "Cigar Preservation Systems"
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
      
      <div className="min-h-screen">
        <Hero />
        
        {/* Artisan Craftsmanship Section */}
        <section className="py-16 bg-gradient-to-br from-muted/30 to-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-6 mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold">
                Artisan <span className="premium-text">Craftsmanship</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Witness the meticulous artistry behind every André García creation. From hand-selected premium materials 
                to time-honored techniques passed down through generations of master craftsmen.
              </p>
            </div>
          </div>
        </section>
        
        <BrandCarousel />
        <FeaturedProducts />
        <About />
        <Testimonials />
        <CTA />
      </div>
    </>
  );
}
