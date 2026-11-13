import type { Metadata, Viewport } from 'next';
import { Archivo, Gloock } from 'next/font/google';
import { SITE } from '@/lib/site';
import './globals.css';

const archivo = Archivo({ subsets: ['latin'], weight: ['300', '400', '500', '600'], display: 'swap', variable: '--font-archivo' });
const gloock = Gloock({ subsets: ['latin'], weight: '400', display: 'swap', variable: '--font-gloock', fallback: ['Iowan Old Style', 'Georgia', 'serif'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FBF9F5',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: 'Real Estate',
  alternates: { canonical: '/' },
  formatDetection: { telephone: false, email: false, address: false },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: SITE.locale,
    url: '/',
    title: `${SITE.name}: A New-Age Commercial Investment Opportunity in Dubai`,
    description: SITE.shortDescription,
  },
  twitter: { card: 'summary_large_image', title: `${SITE.name}: Commercial Real Estate Investment, Dubai`, description: SITE.shortDescription },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${gloock.variable}`}>
      <body>{children}</body>
    </html>
  );
}
