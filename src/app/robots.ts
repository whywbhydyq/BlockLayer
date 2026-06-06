import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo/pages';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ['Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot', 'Baiduspider', 'YandexBot'],
        allow: '/'
      },
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot'],
        allow: '/'
      },
      {
        userAgent: ['CCBot', 'Bytespider', 'anthropic-ai', 'cohere-ai'],
        disallow: '/'
      },
      {
        userAgent: '*',
        allow: '/'
      }
    ],
    sitemap: `${siteUrl()}/sitemap.xml`
  };
}
