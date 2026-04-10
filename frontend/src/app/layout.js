import './globals.css';
import Script from 'next/script';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SaleBanner from '@/components/sections/SaleBanner';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import Link from 'next/link';
import AdminNavLink from '@/components/layout/AdminNavLink';
import { Toaster } from '@/components/ui/toaster';
import BackendWarmup from '@/components/layout/BackendWarmup';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andregarciacases.com';

export const metadata = {
  title: {
    default: 'Andre Garcia – Luxury Handcrafted Cigar Cases | Since 2003',
    template: '%s | Andre Garcia Cigar Cases',
  },
  description:
    'Andre Garcia — the Rolls-Royce of Cigar Cases. Handcrafted luxury cigar cases and travel humidors since 2003. Featuring the patent-pending Pack & Go, St. James, Buffalo Horn, Carbon Fibre, Manhattan, Harris Tweed and Golf collections. Spanish cedar lined, premium leather, made in Kolkata, India.',
  keywords: [
    'Andre Garcia',
    'Andre Garcia cigar cases',
    'luxury cigar cases',
    'handcrafted cigar cases',
    'premium cigar case',
    'travel humidor',
    'Pack and Go cigar case',
    'St James cigar case',
    'Buffalo Horn cigar case',
    'Carbon Fibre cigar case',
    'Manhattan cigar case',
    'Harris Tweed cigar case',
    'Golf cigar case',
    'cedar lined cigar case',
    'leather cigar case',
    'cigar travel case',
    'cigar storage',
    'luxury cigar accessories',
    'custom cigar case',
    'cigar case India',
    'patent pending cigar case',
    'Robb Report cigar case',
    'Cigar Aficionado',
    'premium humidor',
    'cigar briefcase',
  ].join(', '),
  authors: [{ name: 'Andre Garcia', url: siteUrl }],
  creator: 'Andre Garcia',
  publisher: 'Andre Garcia',
  category: 'Luxury Goods',
  classification: 'Cigar Cases & Accessories',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.jpg', type: 'image/jpeg' },
    ],
    apple: [
      { url: '/favicon.jpg', type: 'image/jpeg' },
    ],
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Andre Garcia – Luxury Handcrafted Cigar Cases | Since 2003',
    description:
      'The Rolls-Royce of Cigar Cases. Handcrafted luxury cigar cases and travel humidors featuring Spanish cedar lining, premium leather, and patent-pending designs. Made in Kolkata, India since 2003.',
    url: siteUrl,
    siteName: 'Andre Garcia',
    images: [
      {
        url: '/imagecompressor/brand-logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Andre Garcia – Luxury Handcrafted Cigar Cases',
        type: 'image/jpeg',
      },
      {
        url: '/logo.png',
        width: 800,
        height: 800,
        alt: 'Andre Garcia AG Logo',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
    type: 'website',
    countryName: 'India',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Andre Garcia – Luxury Handcrafted Cigar Cases',
    description:
      'The Rolls-Royce of Cigar Cases. Handcrafted luxury cigar cases and travel humidors since 2003. Made in Kolkata, India.',
    images: ['/imagecompressor/brand-logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'msapplication-TileColor': '#0a0a0b',
    'theme-color': '#0a0a0b',
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Andre Garcia',
    alternateName: 'Andre Garcia Cases',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/imagecompressor/brand-logo.jpg`,
    description:
      'Andre Garcia — the Rolls-Royce of Cigar Cases. Handcrafted luxury cigar cases and travel humidors since 2003, made in Kolkata, India.',
    foundingDate: '2003',
    foundingLocation: {
      '@type': 'Place',
      name: 'Kolkata, India',
    },
    founder: [
      {
        '@type': 'Person',
        name: 'Abhik Roy',
      },
      {
        '@type': 'Person',
        name: 'Anindya Roy',
      },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'abhik@andregarciacases.com',
      contactType: 'customer service',
    },
    sameAs: [],
    knowsAbout: [
      'Luxury cigar cases',
      'Travel humidors',
      'Cedar-lined cigar storage',
      'Premium leather goods',
      'Handcrafted cigar accessories',
    ],
  };

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Andre Garcia',
    image: `${siteUrl}/imagecompressor/brand-logo.jpg`,
    url: siteUrl,
    description:
      'Luxury handcrafted cigar cases and travel humidors. Featuring the patent-pending Pack & Go, St. James, Buffalo Horn, Carbon Fibre, Manhattan, Harris Tweed and Golf collections.',
    brand: {
      '@type': 'Brand',
      name: 'Andre Garcia',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Andre Garcia Cigar Case Collections',
      itemListElement: [
        { '@type': 'OfferCatalog', name: 'St. James Collection' },
        { '@type': 'OfferCatalog', name: 'Horn Collection' },
        { '@type': 'OfferCatalog', name: 'Carbon Fibre Collection' },
        { '@type': 'OfferCatalog', name: 'Manhattan Collection' },
        { '@type': 'OfferCatalog', name: 'Pack & Go Collection' },
        { '@type': 'OfferCatalog', name: 'Golf Collection' },
        { '@type': 'OfferCatalog', name: 'Harris Tweed Collection' },
      ],
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
        {/* Google Analytics 4 */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <CurrencyProvider>
            <CartProvider>
              <BackendWarmup />
              <SaleBanner />
              <Navbar />
              <main className="flex-grow">
                <AdminNavLink />
                {children}
              </main>
              <Footer />
              <Toaster />
            </CartProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
