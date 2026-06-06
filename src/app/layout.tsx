import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { AdSenseAutoAds } from '@/components/ads/AdSenseAutoAds';
import { JsonLd } from '@/components/content/JsonLd';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MINECRAFT_DISCLAIMER } from '@/lib/compliance/minecraftDisclaimer';
import { DEFAULT_SITE_URL, SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo/pages';
import { organizationSchema, websiteSchema } from '@/lib/seo/schema';

const ADSENSE_CLIENT = 'ca-pub-1653188471819736';

export const metadata: Metadata = {
  metadataBase: new URL(DEFAULT_SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: 'BlockLayer - Minecraft Blueprint Generator',
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  creator: 'YmirTool',
  publisher: 'YmirTool',
  category: 'Minecraft blueprint generator',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    url: DEFAULT_SITE_URL,
    siteName: SITE_NAME,
    locale: 'en_US',
    title: 'BlockLayer - Minecraft Blueprint Generator',
    description: SITE_DESCRIPTION,
    images: [{ url: `${DEFAULT_SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: 'BlockLayer Minecraft blueprint generator preview' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlockLayer - Minecraft Blueprint Generator',
    description: SITE_DESCRIPTION,
    images: [{ url: `${DEFAULT_SITE_URL}/twitter-image`, alt: 'BlockLayer Minecraft blueprint generator preview' }]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  },
  other: {
    'google-adsense-account': ADSENSE_CLIENT
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <Header />
        <div className="global-disclaimer" role="note">
          {MINECRAFT_DISCLAIMER} This is an unofficial fan-made tool for planning block builds.
        </div>
        {children}
        <Footer />
        <AdSenseAutoAds />
      </body>
    </html>
  );
}
