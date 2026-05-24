import type { MetadataRoute } from 'next';
import { allContentPaths, siteUrl } from '@/lib/seo/pages';
export default function sitemap(): MetadataRoute.Sitemap { const now = new Date(); const base = siteUrl(); return allContentPaths.map((path) => ({ url: `${base}${path}`, lastModified: now, changeFrequency: path === '/' ? 'weekly' : 'monthly', priority: path === '/' ? 1 : path.startsWith('/tools') || path.startsWith('/presets') ? 0.9 : 0.6 })); }
