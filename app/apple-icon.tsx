import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', background: '#14110d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="120" height="120" viewBox="0 0 40 40"><path d="M6 31 L15 17 L20 24 L26 12 L34 31" fill="none" stroke="#d9b97e" strokeWidth="2.4" strokeLinejoin="round" /></svg>
      </div>
    ),
    size,
  );
}
