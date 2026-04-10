/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**.railway.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.render.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'andregarciacases.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.andregarciacases.com',
        pathname: '/**',
      },
    ],
  },
  
  trailingSlash: false,
  
  // Optimize for development
  reactStrictMode: true,
  
  // Ignore build errors for TypeScript (handle via CI/linting separately)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Ignore ESLint during builds (handle via CI/linting separately)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Experimental features for better performance
  experimental: {
    // Optimize package imports for faster dev server
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'recharts'],
  },

  // Webpack: resolve canvas for pdfjs-dist (CDN-loaded, not needed server-side)
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            // CSP: allow Razorpay checkout, Google Analytics, and self-hosted assets
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self'",
              "connect-src 'self' https://api.razorpay.com https://www.google-analytics.com https://*.railway.app https://*.onrender.com https://*.render.com https://*.andregarciacases.com",
              "frame-src https://api.razorpay.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
