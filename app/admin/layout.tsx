import type { Metadata, Viewport } from 'next';
import { Sprite } from '@/components/chrome';
import './admin.css';

export const metadata: Metadata = {
  title: { absolute: 'Admin | Highland Capitals' },
  manifest: '/admin-app.webmanifest',
  appleWebApp: { capable: true, title: 'Highland Admin', statusBarStyle: 'black-translucent' },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};
export const viewport: Viewport = { themeColor: '#14110D', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ad-root">
      <Sprite />
      {children}
    </div>
  );
}
