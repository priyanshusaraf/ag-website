export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/private/',
        '/_next/',
        '/generated/',
      ],
    },
    sitemap: 'https://andregarcia.com/sitemap.xml',
    host: 'https://andregarcia.com',
  };
}