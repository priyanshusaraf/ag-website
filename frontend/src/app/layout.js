import { Inter, Playfair_Display, Cinzel } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SaleBanner from '@/components/sections/SaleBanner';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import Link from 'next/link';
import AdminNavLink from '@/components/layout/AdminNavLink';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const cinzel = Cinzel({ 
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'André García - Luxury Cigar Containers & Premium Humidors | Since 1985',
    template: '%s | André García - Premium Cigar Containers'
  },
  description: 'Discover André García\'s handcrafted luxury cigar containers and premium humidors. Award-winning artisan quality since 1985. Preserve your finest cigars with our innovative storage solutions.',
  keywords: [
    'André García cigar containers',
    'luxury cigar humidor',
    'premium cigar storage',
    'handcrafted humidors',
    'artisan cigar containers',
    'cigar preservation',
    'luxury cigar accessories',
    'custom humidors',
    'cigar storage solutions',
    'premium tobacco storage',
    'handmade cigar boxes',
    'cedar humidors',
    'cigar container craftsmanship',
    'luxury tobacco accessories',
    'bespoke cigar storage'
  ].join(', '),
  authors: [{ name: 'André García', url: 'https://andregarcia.com' }],
  creator: 'André García',
  publisher: 'André García',
  category: 'Luxury Goods',
  classification: 'Cigar Accessories',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://andregarcia.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'es-ES': '/es-ES',
    },
  },
  openGraph: {
    title: 'André García - Luxury Cigar Containers & Premium Humidors',
    description: 'Award-winning artisan quality since 1985. Discover handcrafted luxury cigar containers and premium humidors that preserve the essence of your finest cigars.',
    url: 'https://andregarcia.com',
    siteName: 'André García',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'André García Premium Cigar Containers and Luxury Humidors',
        type: 'image/jpeg',
      },
      {
        url: '/og-image-square.jpg',
        width: 800,
        height: 800,
        alt: 'André García Artisan Cigar Storage Solutions',
        type: 'image/jpeg',
      },
    ],
    locale: 'en_US',
    type: 'website',
    countryName: 'United States',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'André García - Luxury Cigar Containers & Premium Humidors',
    description: 'Award-winning artisan quality since 1985. Handcrafted luxury cigar storage solutions.',
    images: ['/twitter-image.jpg'],
    creator: '@andregarcia',
    site: '@andregarcia',
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  other: {
    'msapplication-TileColor': '#8b4513',
    'theme-color': '#8b4513',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${cinzel.variable}`}>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <CartProvider>
            <SaleBanner />
            <Navbar />
            <main className="flex-grow">
              <AdminNavLink />
              {children}
            </main>
            <Footer />
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
