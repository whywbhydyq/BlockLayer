import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Header } from '@/components/layout/Header';
import { JsonLd } from '@/components/content/JsonLd';
import { Footer } from '@/components/layout/Footer';
import { MINECRAFT_DISCLAIMER } from '@/lib/compliance/minecraftDisclaimer';
import { SITE_NAME, siteUrl } from '@/lib/seo/pages';
import { websiteSchema } from '@/lib/seo/schema';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: 'BlockLayer – Minecraft Circle, Sphere & Dome Generator', template: `%s | ${SITE_NAME}` },
  description: 'Generate printable Minecraft-style block blueprints for circles, ellipses, spheres, domes, and block counts with layers, exports, and stack counts.',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  other: { 'google-adsense-account': 'ca-pub-1653188471819736' },
  openGraph: { title: 'BlockLayer', description: 'Printable block-by-block blueprints for circles, ellipses, spheres, and domes.', type: 'website', url: siteUrl() }
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, colorScheme: 'light dark' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script
          id="adsense-auto-ads"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1653188471819736"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <a className="skip-link" href="#main">Skip to tool</a>
        <JsonLd data={websiteSchema()} />
        <Header />
        <noscript>
          <div className="noscript-warning">JavaScript is required for the interactive blueprint canvas, export buttons, layer slider, pan, zoom, and live block calculations. Static guide text and legal pages remain readable.</div>
        </noscript>
        <div className="global-disclaimer">{MINECRAFT_DISCLAIMER}</div>
        {children}
        <Footer />
      </body>
    </html>
  );
}
