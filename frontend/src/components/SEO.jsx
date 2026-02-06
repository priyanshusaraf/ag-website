import Head from 'next/head';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image = '/og-image.jpg',
  url,
  type = 'website',
  schemaData 
}) => {
  const defaultTitle = 'André García - Luxury Cigar Containers & Premium Humidors';
  const defaultDescription = 'Discover André García\'s handcrafted luxury cigar containers and premium humidors. Award-winning artisan quality since 1985.';
  
  const pageTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageUrl = url ? `https://andregarcia.com${url}` : 'https://andregarcia.com';
  
  const defaultSchemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "André García",
    "description": "Luxury cigar containers and premium humidors handcrafted since 1985",
    "url": "https://andregarcia.com",
    "telephone": "+1-555-CIGAR-AG",
    "email": "info@andregarcia.com",
    "foundingDate": "1985",
    "founder": {
      "@type": "Person",
      "name": "André García"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://instagram.com/andregarcia",
      "https://facebook.com/andregarcia",
      "https://twitter.com/andregarcia"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Cigar Storage Solutions",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Premium Cigar Humidors",
            "description": "Handcrafted luxury humidors for premium cigar storage",
            "category": "Cigar Accessories"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product", 
            "name": "Artisan Cigar Containers",
            "description": "Custom cigar containers with superior craftsmanship",
            "category": "Cigar Storage"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Michael Rodriguez"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Exceptional craftsmanship and attention to detail. My cigars have never been better preserved."
      }
    ]
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "André García",
    "alternateName": "Andre Garcia Cigar Containers",
    "url": "https://andregarcia.com",
    "logo": "https://andregarcia.com/logo.png",
    "description": "Luxury cigar containers and premium humidors handcrafted since 1985",
    "foundingDate": "1985",
    "founder": {
      "@type": "Person",
      "name": "André García"
    },
    "knowsAbout": [
      "Cigar Storage",
      "Humidor Craftsmanship", 
      "Luxury Accessories",
      "Tobacco Preservation",
      "Artisan Woodworking"
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Custom Humidor Design",
          "description": "Bespoke humidor creation for luxury cigar collections"
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://andregarcia.com"
      }
    ]
  };

  return (
    <Head>
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="André García" />
      <meta name="publisher" content="André García" />
      <meta name="copyright" content="© 2025 André García. All rights reserved." />
      <meta name="classification" content="Luxury Cigar Accessories" />
      <meta name="category" content="Luxury Goods" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      
      {/* Product Specific */}
      <meta name="product" content="Cigar Containers, Humidors" />
      <meta name="target" content="Cigar Enthusiasts, Luxury Collectors" />
      
      {/* Additional Keywords */}
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />
      
      {/* Alternate Languages */}
      <link rel="alternate" hrefLang="en" href="https://andregarcia.com/en" />
      <link rel="alternate" hrefLang="es" href="https://andregarcia.com/es" />
      <link rel="alternate" hrefLang="x-default" href="https://andregarcia.com" />
      
      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData || defaultSchemaData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
    </Head>
  );
};

export default SEO;