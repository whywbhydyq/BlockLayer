import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'BlockLayer Minecraft blueprint generator preview';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: 'linear-gradient(135deg, #111827 0%, #1f2937 45%, #0f766e 100%)',
          color: '#f9fafb',
          display: 'flex',
          fontFamily: 'Arial, Helvetica, sans-serif',
          height: '100%',
          justifyContent: 'center',
          padding: 72,
          width: '100%'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 960 }}>
          <div style={{ color: '#99f6e4', fontSize: 34, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase' }}>BlockLayer</div>
          <div style={{ fontSize: 78, fontWeight: 800, lineHeight: 1.04 }}>Minecraft Blueprint Generator</div>
          <div style={{ color: '#d1d5db', fontSize: 36, lineHeight: 1.25 }}>
            Circles, ovals, spheres, domes, block counts, exports, print plans, and share links.
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
            {['Rows', 'Layers', 'CSV', 'SVG', 'Print'].map((item) => (
              <span
                key={item}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '2px solid rgba(255,255,255,0.28)',
                  borderRadius: 999,
                  fontSize: 26,
                  fontWeight: 700,
                  padding: '12px 24px'
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
