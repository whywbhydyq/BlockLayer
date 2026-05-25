import { MINECRAFT_DISCLAIMER } from '@/lib/compliance/minecraftDisclaimer';
import { DEFAULT_SITE_URL, SITE_NAME, siteUrl, type ToolPageConfig, type GuideConfig, type PresetConfig } from './pages';

type JsonObject = Record<string, unknown>;

function absolute(path: string) {
  return `${siteUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}

export function websiteSchema(): JsonObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: siteUrl(),
    description: 'Printable block-by-block blueprint generator for Minecraft-style circles, ellipses, spheres, domes, and block counts.',
    inLanguage: 'en'
  };
}

export function softwareApplicationSchema(page?: ToolPageConfig | PresetConfig): JsonObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: page?.heading || 'BlockLayer Blueprint Generator',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web browser',
    url: page ? absolute(page.path) : DEFAULT_SITE_URL,
    description: page?.description || 'Generate printable block blueprints with pan, zoom, layer sliders, block counts, PNG, SVG, CSV, and print export.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    isAccessibleForFree: true
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>): JsonObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absolute(item.path)
    }))
  };
}

export function faqSchema(items: Array<[string, string]>): JsonObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer }
    }))
  };
}

export function guideSchema(guide: GuideConfig): JsonObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.heading,
    description: guide.description,
    url: absolute(guide.path),
    step: guide.paragraphs.map((paragraph, index) => ({ '@type': 'HowToStep', position: index + 1, text: paragraph })),
    tool: [{ '@type': 'HowToTool', name: 'BlockLayer' }]
  };
}

export function disclaimerSchema(): JsonObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'BlockLayer Disclaimer',
    url: absolute('/disclaimer'),
    description: MINECRAFT_DISCLAIMER
  };
}
