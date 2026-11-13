import Script from 'next/script';
import Analytics from '@/components/Analytics';
import PopupLoader from '@/components/PopupLoader';
import SiteFx from '@/components/SiteFx';
import { Footer, FloatingContact, Nav, Sprite } from '@/components/chrome';
import { SITE } from '@/lib/site';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const ga = SITE.gaId.replace(/[^\w-]/g, '');
  const px = SITE.metaPixelId.replace(/\D/g, '');
  return (
    <>
      <a className="skip" href="#opportunities">Skip to investment opportunities</a>
      <Sprite />
      <div className="progress-rail" id="rail" aria-hidden="true" />
      <Nav />
      {children}
      <Footer />
      <FloatingContact />
      <PopupLoader />
      <SiteFx />
      <Analytics />

      {/* Google Analytics 4: stub is inline (queues events), gtag.js loads after the page is idle */}
      {ga && (
        <>
          <Script id="ga-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${ga}',{anonymize_ip:true});`}</Script>
          <Script id="ga-lib" src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="lazyOnload" />
        </>
      )}
      {px && (
        <Script id="meta-pixel" strategy="lazyOnload">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${px}');fbq('track','PageView');`}</Script>
      )}
    </>
  );
}
