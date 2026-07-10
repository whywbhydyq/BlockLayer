import type { Metadata } from 'next';
import { siteUrl } from './pages';

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: `${siteUrl()}${path}`, type: 'website' },
    robots: { index: true, follow: true }
  };
}
