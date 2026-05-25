import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo/pages';
export default function robots(): MetadataRoute.Robots { return { rules: [{ userAgent: '*', allow: '/' }], sitemap: `${siteUrl()}/sitemap.xml` }; }
