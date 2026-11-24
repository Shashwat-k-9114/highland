import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Highland | Jebel Ali Commercial Investment, Dubai';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const NAVY = '#000c25'; // exact background colour of the logo artwork
const GOLD = '#e2c79a';
const MINT = '#7df0c8';

const STATS = [
  ['Jebel Ali', 'Established industrial and trade district'],
  ['EV-ready', 'Infrastructure for evolving logistics'],
];

export default async function OG() {
  const logo = `data:image/png;base64,${(await readFile(join(process.cwd(), 'public', 'logo.png'))).toString('base64')}`;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: `linear-gradient(120deg, ${NAVY} 0%, #04122e 55%, #06201f 100%)`, color: '#fbf7ef', fontFamily: 'sans-serif' }}>
        <div style={{ width: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', background: NAVY, borderRight: '1px solid rgba(226,199,154,.3)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={340} height={164} alt="" />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px 56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 21, letterSpacing: 5, color: MINT, textTransform: 'uppercase' }}>
            <div style={{ width: 12, height: 12, borderRadius: 12, background: MINT, display: 'flex' }} />
            Dubai · Jebel Ali
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: 48, fontWeight: 700, lineHeight: 1.05 }}>
            <span>Commercial Real Estate in Jebel Ali.</span>
            <span style={{ color: GOLD }}>Built for the Next Phase of Industry.</span>
          </div>
          <div style={{ display: 'flex', gap: 36 }}>
            {STATS.map(([n, l]) => (
              <div key={n} style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 44, fontWeight: 700, color: GOLD }}>{n}</span>
                <span style={{ fontSize: 17, color: 'rgba(251,247,239,.72)', marginTop: 4, maxWidth: 190 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
