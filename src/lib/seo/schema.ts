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
    description:
      'Printable block-by-block blueprint builder for Minecraft-style circles, ovals, spheres, and domes with row segments, center guides, block counts, and exports.',
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
    description:
      page?.description ||
      'Generate printable circle, oval, sphere, and dome block blueprints with pan, zoom, row labels, block counts, PNG/SVG/CSV export, share links, and print output.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    isAccessibleForFree: true
  };
}


export function itemListSchema(name: string, description: string, items: Array<{ name: string; path: string }>): JsonObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: absolute(item.path)
    }))
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
    step: (guide.steps?.length ? guide.steps : guide.paragraphs).map((step, index) => ({ '@type': 'HowToStep', position: index + 1, text: step })),
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
