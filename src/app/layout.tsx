import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MINECRAFT_DISCLAIMER } from '@/lib/compliance/minecraftDisclaimer';
import { DEFAULT_SITE_URL, SITE_NAME } from '@/lib/seo/pages';

const ADSENSE_CLIENT = 'ca-pub-1653188471819736';

export const metadata: Metadata = {
  metadataBase: new URL(DEFAULT_SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: 'BlockLayer - Minecraft Blueprint Generator',
    template: `%s | ${SITE_NAME}`
  },
  description:
    'Generate Minecraft-style circle, oval, sphere, and dome blueprints with row segments, layer data, exports, print output, and share links.',
  other: {
    'google-adsense-account': ADSENSE_CLIENT
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to main content</a>
        <Header />
        <div className="global-disclaimer" role="note">
          {MINECRAFT_DISCLAIMER} This is an unofficial fan-made tool for planning block builds.
        </div>
        {children}
        <Footer />
        <Script
          id="adsense-auto-ads"
          async
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
