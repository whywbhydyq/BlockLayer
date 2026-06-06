import type { Metadata } from 'next';
import { SITE_NAME, siteUrl } from './pages';

const SOCIAL_IMAGE = '/opengraph-image';
const TWITTER_IMAGE = '/twitter-image';

export function pageMetadata(title: string, description: string, path: string, openGraphType: 'website' | 'article' = 'website'): Metadata {
  const absoluteUrl = `${siteUrl()}${path}`;
  const socialImageUrl = `${siteUrl()}${SOCIAL_IMAGE}`;
  const twitterImageUrl = `${siteUrl()}${TWITTER_IMAGE}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: absoluteUrl,
      siteName: SITE_NAME,
      type: openGraphType,
      images: [{ url: socialImageUrl, width: 1200, height: 630, alt: `${title} preview` }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: twitterImageUrl, alt: `${title} preview` }]
    },
    robots: { index: true, follow: true }
  };
}
