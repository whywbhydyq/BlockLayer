import { MINECRAFT_DISCLAIMER } from '@/lib/compliance/minecraftDisclaimer';
import {
  DEFAULT_SITE_URL,
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_PUBLISHED_DATE,
  SITE_UPDATED_DATE,
  siteUrl,
  type GuideConfig,
  type PresetConfig,
  type ToolPageConfig
} from './pages';

type JsonObject = Record<string, unknown>;

function absolute(path: string) {
  return `${siteUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}

function socialImage() {
  return absolute('/opengraph-image');
}

function organizationRef(): JsonObject {
  return {
    '@type': 'Organization',
    '@id': `${siteUrl()}#organization`,
    name: SITE_AUTHOR,
    url: 'https://ymirtool.com/',
    sameAs: ['https://ymirtool.com/']
  };
}

export function organizationSchema(): JsonObject {
  return {
    '@context': 'https://schema.org',
    ...organizationRef(),
    description: 'YmirTool publishes independent browser-based planning utilities, including BlockLayer.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'site feedback and support',
      url: absolute('/contact'),
      email: 'ymirtool@ymirtool.com',
      availableLanguage: 'en'
    }
  };
}

export function websiteSchema(): JsonObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl()}#website`,
    name: SITE_NAME,
    url: siteUrl(),
    description: SITE_DESCRIPTION,
    inLanguage: 'en',
    publisher: organizationRef()
  };
}

export function softwareApplicationSchema(page?: ToolPageConfig | PresetConfig): JsonObject {
  const path = page?.path || '/';
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${absolute(path)}#app`,
    name: page?.heading || 'BlockLayer Blueprint Generator',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Any web browser',
    browserRequirements: 'Requires JavaScript for interactive blueprint controls; core content and metadata are server-rendered.',
    url: page ? absolute(page.path) : DEFAULT_SITE_URL,
    mainEntityOfPage: page ? absolute(page.path) : DEFAULT_SITE_URL,
    isPartOf: { '@id': `${siteUrl()}#website` },
    inLanguage: 'en',
    description:
      page?.description ||
      'Generate printable circle, oval, sphere, and dome block blueprints with pan, zoom, row labels, block counts, PNG/SVG/CSV export, share links, and print output.',
    image: socialImage(),
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    isAccessibleForFree: true,
    author: organizationRef(),
    publisher: organizationRef(),
    featureList: [
      'row-by-row blueprint segments',
      'center guide and odd/even footprint warnings',
      'block count, stack count, and shulker-style material estimates',
      'PNG, SVG, CSV, print, copy, and share output',
      'layer-by-layer sphere and dome blueprints'
    ]
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


export function collectionPageSchema(
  path: string,
  name: string,
  description: string,
  items: Array<{ name: string; path: string }>
): JsonObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${absolute(path)}#collection`,
    name,
    description,
    url: absolute(path),
    inLanguage: 'en',
    isPartOf: { '@id': `${siteUrl()}#website` },
    publisher: organizationRef(),
    image: socialImage(),
    datePublished: SITE_PUBLISHED_DATE,
    dateModified: SITE_UPDATED_DATE,
    mainEntity: {
      '@type': 'ItemList',
      name,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: absolute(item.path)
      }))
    }
  };
}

export function guideSchema(guide: GuideConfig): JsonObject {
  const steps = guide.steps?.length ? guide.steps : guide.paragraphs;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${absolute(guide.path)}#article`,
    headline: guide.heading,
    description: guide.description,
    url: absolute(guide.path),
    mainEntityOfPage: absolute(guide.path),
    image: socialImage(),
    inLanguage: 'en',
    datePublished: guide.publishedAt || SITE_PUBLISHED_DATE,
    dateModified: guide.updatedAt || SITE_UPDATED_DATE,
    author: organizationRef(),
    publisher: organizationRef(),
    articleSection: 'Minecraft blueprint guides',
    about: ['Minecraft blueprints', 'block-building geometry', 'circle generator', 'sphere generator', 'dome generator'],
    hasPart: {
      '@type': 'ItemList',
      name: 'Recommended workflow',
      itemListElement: steps.map((step, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: step
      }))
    }
  };
}


export function webPageSchema(path: string, name: string, description: string): JsonObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${absolute(path)}#webpage`,
    name,
    description,
    url: absolute(path),
    inLanguage: 'en',
    isPartOf: { '@id': `${siteUrl()}#website` },
    publisher: organizationRef(),
    image: socialImage(),
    datePublished: SITE_PUBLISHED_DATE,
    dateModified: SITE_UPDATED_DATE
  };
}

export function contactPageSchema(): JsonObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${absolute('/contact')}#contact`,
    name: 'Contact BlockLayer',
    url: absolute('/contact'),
    description: 'Contact page for BlockLayer blueprint accuracy, accessibility, broken links, and site issue reports.',
    image: socialImage(),
    inLanguage: 'en',
    isPartOf: { '@id': `${siteUrl()}#website` },
    publisher: organizationRef(),
    dateModified: SITE_UPDATED_DATE
  };
}

export function disclaimerSchema(): JsonObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'BlockLayer Disclaimer',
    url: absolute('/disclaimer'),
    description: MINECRAFT_DISCLAIMER,
    inLanguage: 'en',
    isPartOf: { '@id': `${siteUrl()}#website` },
    publisher: organizationRef(),
    image: socialImage(),
    dateModified: SITE_UPDATED_DATE
  };
}
