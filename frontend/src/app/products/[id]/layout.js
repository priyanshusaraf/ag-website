const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://andregarciacases.com';

async function fetchProduct(id) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const product = await fetchProduct(params.id);
  if (!product) {
    return { title: 'Product Not Found | Andre Garcia Cases' };
  }

  const imageUrl = product.image_url
    ? product.image_url.startsWith('http')
      ? product.image_url
      : `${SITE_URL}${product.image_url}`
    : `${SITE_URL}/imagecompressor/brand-logo.jpg`;

  const price = parseFloat(product.sale_price || product.price || 0).toFixed(2);

  return {
    title: `${product.name} | Andre Garcia Cases`,
    description: product.description
      ? product.description.substring(0, 160)
      : `${product.name} — handcrafted luxury cigar case by Andre Garcia. ${product.category ? product.category + '.' : ''} Free shipping on domestic orders.`,
    alternates: {
      canonical: `${SITE_URL}/products/${params.id}`,
    },
    openGraph: {
      title: `${product.name} | Andre Garcia Cases`,
      description: product.description?.substring(0, 200) || '',
      url: `${SITE_URL}/products/${params.id}`,
      images: [{ url: imageUrl, width: 800, height: 800, alt: product.name }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Andre Garcia Cases`,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailLayout({ children, params }) {
  const product = await fetchProduct(params.id);

  const jsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description || '',
        image: product.image_url
          ? product.image_url.startsWith('http')
            ? product.image_url
            : `${SITE_URL}${product.image_url}`
          : `${SITE_URL}/imagecompressor/brand-logo.jpg`,
        sku: `AG-${product.id}`,
        brand: { '@type': 'Brand', name: 'Andre Garcia' },
        offers: {
          '@type': 'Offer',
          url: `${SITE_URL}/products/${product.id}`,
          priceCurrency: 'INR',
          price: parseFloat(product.sale_price || product.price || 0).toFixed(2),
          availability:
            product.stock > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          seller: { '@type': 'Organization', name: 'Andre Garcia' },
        },
        aggregateRating:
          product.rating > 0 && product.reviews > 0
            ? {
                '@type': 'AggregateRating',
                ratingValue: product.rating,
                reviewCount: product.reviews,
              }
            : undefined,
      }
    : null;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/products` },
      ...(product
        ? [{ '@type': 'ListItem', position: 3, name: product.name, item: `${SITE_URL}/products/${product.id}` }]
        : []),
    ],
  };

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
