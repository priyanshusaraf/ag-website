import Head from 'next/head';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andregarciacases.com';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image = '/imagecompressor/brand-logo.jpg',
  url,
  type = 'website',
  schemaData 
}) => {
  const defaultTitle = 'Andre Garcia – Luxury Handcrafted Cigar Cases';
  const defaultDescription = 'Andre Garcia — the Rolls-Royce of Cigar Cases. Handcrafted luxury cigar cases and travel humidors since 2003. Made in Kolkata, India.';
  
  const pageTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageUrl = url ? `${siteUrl}${url}` : siteUrl;
  
  const defaultSchemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Andre Garcia",
    "alternateName": "Andre Garcia Cases",
    "description": "The Rolls-Royce of Cigar Cases. Handcrafted luxury cigar cases and travel humidors since 2003.",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "image": `${siteUrl}/imagecompressor/brand-logo.jpg`,
    "foundingDate": "2003",
    "foundingLocation": {
      "@type": "Place",
      "name": "Kolkata, India"
    },
    "founder": [
      { "@type": "Person", "name": "Abhik Roy" },
      { "@type": "Person", "name": "Anindya Roy" }
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "abhik@andregarciacases.com",
      "contactType": "customer service"
    },
    "knowsAbout": [
      "Luxury Cigar Cases",
      "Travel Humidors",
      "Cedar-Lined Cigar Storage",
      "Premium Leather Goods",
      "Handcrafted Cigar Accessories"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Andre Garcia Cigar Case Collections",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Luxury Cigar Cases",
            "description": "Handcrafted leather cigar cases with Spanish cedar lining",
            "category": "Cigar Cases",
            "brand": { "@type": "Brand", "name": "Andre Garcia" }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Pack & Go Travel Humidor",
            "description": "Patent-pending travel humidor with cedar lining and collapsible dividers",
            "category": "Travel Humidors",
            "brand": { "@type": "Brand", "name": "Andre Garcia" }
          }
        }
      ]
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      }
    ]
  };

  return (
    <Head>
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="Andre Garcia" />
      <meta name="publisher" content="Andre Garcia" />
      <meta name="copyright" content={`© ${new Date().getFullYear()} Andre Garcia Cases. All rights reserved.`} />
      <meta name="classification" content="Luxury Cigar Cases & Accessories" />
      <meta name="category" content="Luxury Goods" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="IN-WB" />
      <meta name="geo.placename" content="Kolkata, India" />
      
      {/* Product Specific */}
      <meta name="product" content="Cigar Cases, Travel Humidors, Leather Goods" />
      <meta name="target" content="Cigar Enthusiasts, Luxury Collectors" />
      
      {/* Additional Keywords */}
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />
      
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
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
    </Head>
  );
};

export default SEO;
