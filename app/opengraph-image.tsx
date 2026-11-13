import { ImageResponse } from 'next/og';

export const alt = 'Highland Capitals: Commercial Real Estate Investment Advisory, Dubai';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px', background: 'linear-gradient(135deg,#17130e 0%,#0d0a07 60%,#241a0e 100%)', color: '#fbf7ef', fontFamily: 'Georgia, serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width="64" height="64" viewBox="0 0 40 40"><rect x="1" y="1" width="38" height="38" rx="2" fill="none" stroke="#d9b97e" strokeWidth="1" /><path d="M6 31 L15 17 L20 24 L26 12 L34 31" fill="none" stroke="#d9b97e" strokeWidth="1.6" strokeLinejoin="round" /></svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 40, letterSpacing: 8 }}>HIGHLAND</div>
            <div style={{ fontSize: 18, letterSpacing: 6, color: '#e2c79a', marginTop: 6 }}>CAPITALS · DUBAI</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 22, letterSpacing: 6, color: '#e2c79a', textTransform: 'uppercase' }}>Dubai 2033. Invest in what&apos;s next.</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', fontSize: 84, lineHeight: 1.02, marginTop: 22 }}>
            <span>A New-Age Commercial&nbsp;</span><span style={{ color: '#e2c79a' }}>Investment Opportunity.</span>
          </div>
        </div>
        <div style={{ fontSize: 24, color: 'rgba(251,247,239,.7)' }}>Commercial real estate advisory · Offices · Retail · Logistics · Industrial</div>
      </div>
    ),
    size,
  );
}
