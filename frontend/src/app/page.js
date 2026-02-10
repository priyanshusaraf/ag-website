import LookbookHome from '@/components/lookbook/LookbookHome';
import { defaultLookbookContent } from '@/components/lookbook/defaultLookbookContent';
import HeroLanding from '@/components/sections/HeroLanding';

async function fetchHomepageContent() {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${base}/homepage`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata() {
  const content = (await fetchHomepageContent()) || defaultLookbookContent;
  const title = content?.seo?.title || 'André García | Luxury Cigar Cases';
  const description =
    content?.seo?.description ||
    "Discover André García's handcrafted luxury cigar containers and premium humidors.";
  return { title, description };
}

// Structured data for the homepage
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andregarciacases.com';
const homepageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Andre Garcia – Luxury Handcrafted Cigar Cases | Since 2003",
  "description": "Andre Garcia — the Rolls-Royce of Cigar Cases. Handcrafted luxury cigar cases and travel humidors since 2003. Made in Kolkata, India.",
  "url": siteUrl,
  "mainEntity": {
    "@type": "Organization",
    "name": "Andre Garcia",
    "alternateName": "Andre Garcia Cases",
    "description": "The Rolls-Royce of Cigar Cases. Handcrafted luxury cigar cases and travel humidors since 2003.",
    "foundingDate": "2003",
    "foundingLocation": {
      "@type": "Place",
      "name": "Kolkata, India"
    },
    "founder": [
      {
        "@type": "Person",
        "name": "Abhik Roy"
      },
      {
        "@type": "Person",
        "name": "Anindya Roy"
      }
    ],
    "knowsAbout": [
      "Luxury Cigar Cases",
      "Travel Humidors",
      "Cedar-Lined Cigar Storage",
      "Premium Leather Goods",
      "Handcrafted Cigar Accessories"
    ],
    "award": [
      "Robb Report Front Runner 2009",
      "Cigar Aficionado Good Life Guide 2009"
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Luxury Cigar Cases",
          "description": "Handcrafted leather cigar cases with Spanish cedar lining, from 1 to 40 finger capacity",
          "category": "Cigar Cases",
          "brand": { "@type": "Brand", "name": "Andre Garcia" }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Pack & Go Travel Humidor",
          "description": "Patent-pending travel humidor with cedar lining and collapsible wooden dividers",
          "category": "Travel Humidors",
          "brand": { "@type": "Brand", "name": "Andre Garcia" }
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
        "item": siteUrl
      }
    ]
  }
};

export default function Home() {
  // NOTE: Keep static JSON-LD for now; homepage editorial content is admin-controlled.
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageSchema)
        }}
      />

      {/* Full-screen landing hero with brand logo */}
      <HeroLanding />
      
      <HomeContent />
    </>
  );
}

async function HomeContent() {
  const content = (await fetchHomepageContent()) || defaultLookbookContent;
  return <LookbookHome content={content || defaultLookbookContent} />;
}
