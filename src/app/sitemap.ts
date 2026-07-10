import type { MetadataRoute } from 'next';
import { indexableContentPaths, siteUrl } from '@/lib/seo/pages';

const CONTENT_LAST_MODIFIED = new Date('2026-07-10T00:00:00.000Z');

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return indexableContentPaths.map((path) => ({
    url: `${base}${path}`,
    lastModified: CONTENT_LAST_MODIFIED,
    changeFrequency: path === '/' ? 'weekly' : path.startsWith('/guides') ? 'monthly' : 'monthly',
    priority: path === '/' ? 1 : path.startsWith('/minecraft-') ? 0.9 : path.startsWith('/guides') ? 0.75 : 0.6
  }));
}
