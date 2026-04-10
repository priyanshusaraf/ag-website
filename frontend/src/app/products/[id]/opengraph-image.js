import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Andre Garcia Cigar Case Product';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default async function Image({ params }) {
  let product = null;
  try {
    const res = await fetch(`${API_URL}/products/${params.id}`, { next: { revalidate: 3600 } });
    if (res.ok) product = await res.json();
  } catch {}

  const name = product?.name || 'Andre Garcia Cases';
  const category = product?.category || 'Luxury Cigar Cases';
  const price = product?.sale_price || product?.price;
  const priceStr = price ? `₹${parseFloat(price).toLocaleString('en-IN')}` : '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #1a0a00 0%, #3d1a00 50%, #1a0a00 100%)',
          padding: '60px',
          fontFamily: 'serif',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '48px' }}>
          <div
            style={{
              width: '6px',
              height: '40px',
              background: '#c87941',
              borderRadius: '3px',
              marginRight: '16px',
            }}
          />
          <span style={{ color: '#c87941', fontSize: '18px', letterSpacing: '4px', textTransform: 'uppercase' }}>
            Andre Garcia
          </span>
        </div>

        {/* Product name */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div
            style={{
              color: '#f5e6d0',
              fontSize: name.length > 40 ? '48px' : '64px',
              fontWeight: '300',
              lineHeight: 1.1,
              marginBottom: '20px',
              maxWidth: '800px',
            }}
          >
            {name}
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span
              style={{
                color: '#c87941',
                fontSize: '20px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              {category}
            </span>
            {priceStr && (
              <>
                <span style={{ color: '#6b4c2a', fontSize: '20px' }}>·</span>
                <span style={{ color: '#f5e6d0', fontSize: '24px', fontWeight: 'bold' }}>{priceStr}</span>
              </>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '48px' }}>
          <span style={{ color: '#6b4c2a', fontSize: '16px' }}>andregarciacases.com</span>
          <span style={{ color: '#c87941', fontSize: '14px', letterSpacing: '2px' }}>HANDCRAFTED SINCE 2003</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
