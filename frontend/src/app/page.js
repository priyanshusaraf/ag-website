import LookbookHome from '@/components/lookbook/LookbookHome';
import { defaultLookbookContent } from '@/components/lookbook/defaultLookbookContent';

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
      
      <HomeContent />
    </>
  );
}

async function HomeContent() {
  const content = (await fetchHomepageContent()) || defaultLookbookContent;
  return <LookbookHome content={content || defaultLookbookContent} />;
}
