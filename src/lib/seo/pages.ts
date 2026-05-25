import type { ShapeKind } from '@/lib/geometry';

export const SITE_NAME = 'BlockLayer';
export const DEFAULT_SITE_URL = 'https://blocklayer.ymirtool.com';

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
}

export type ToolPageConfig = {
  path: string;
  shape: ShapeKind;
  title: string;
  heading: string;
  description: string;
  diameter?: number;
};

export type PresetConfig = ToolPageConfig & {
  slug: string;
  width?: number;
  height?: number;
};

export type GuideConfig = {
  slug: string;
  path: string;
  title: string;
  heading: string;
  description: string;
  paragraphs: string[];
  link: string;
  linkLabel: string;
};

export const presetPages: PresetConfig[] = [];
export const guidePages: GuideConfig[] = [];

export const toolPages: ToolPageConfig[] = [
  {
    path: '/minecraft-circle-generator',
    shape: 'circle',
    title: 'Minecraft Circle Blueprint Builder',
    heading: 'Minecraft Circle Blueprint Builder',
    description: 'Generate Minecraft-style circle blueprints with row segments, center guides, block counts, PNG export, print output, and share links.'
  },
  {
    path: '/minecraft-oval-generator',
    shape: 'ellipse',
    title: 'Minecraft Oval Blueprint Builder',
    heading: 'Minecraft Oval Blueprint Builder',
    description: 'Generate Minecraft-style oval and ellipse blueprints with row segments, center guides, block counts, PNG export, print output, and share links.'
  }
];

export const staticPages = [
  '/',
  '/minecraft-circle-generator',
  '/minecraft-oval-generator',
  '/minecraft-pixel-circle',
  '/odd-even-minecraft-circle-centers',
  '/about',
  '/privacy',
  '/terms',
  '/disclaimer',
  '/contact'
];

export const allContentPaths = staticPages;
