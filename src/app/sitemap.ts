import type { MetadataRoute } from 'next';
import { allContentPaths, contentLastModified, siteUrl } from '@/lib/seo/pages';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return allContentPaths.map((path) => ({
    url: `${base}${path}`,
    lastModified: contentLastModified(path)
  }));
}
