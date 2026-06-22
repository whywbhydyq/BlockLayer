import type { ShapeKind } from '@/lib/geometry';

export const SITE_NAME = 'BlockLayer';
export const SITE_AUTHOR = 'YmirTool';
export const DEFAULT_SITE_URL = 'https://blocklayer.ymirtool.com';
export const SITE_DESCRIPTION =
  'BlockLayer is a free browser-based Minecraft-style blueprint generator for circles, ovals, spheres, domes, block counts, exports, and print-ready layer plans.';
export const SITE_PUBLISHED_DATE = '2026-05-30';
export const SITE_UPDATED_DATE = '2026-06-22';

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
  quickAnswer: string;
  paragraphs: string[];
  steps?: string[];
  publishedAt?: string;
  updatedAt?: string;
  link: string;
  linkLabel: string;
};

export const toolPages: ToolPageConfig[] = [
  {
    path: '/minecraft-circle-generator',
    shape: 'circle',
    title: 'Minecraft Circle Generator - Row Blueprint Tool',
    heading: 'Minecraft Circle Generator',
    description:
      'Generate a Minecraft circle blueprint from diameter or radius with row segments, center guides, block counts, PNG/SVG/CSV export, print, and share links.'
  },
  {
    path: '/minecraft-oval-generator',
    shape: 'ellipse',
    title: 'Minecraft Oval Generator - Width × Height Blueprint',
    heading: 'Minecraft Oval Generator',
    description:
      'Generate oval and ellipse blueprints by width and height with row segments, center guides, block counts, PNG/SVG/CSV export, print output, and share links.'
  },
  {
    path: '/minecraft-sphere-generator',
    shape: 'sphere',
    title: 'Minecraft Sphere Generator - Layer Blueprint Calculator',
    heading: 'Minecraft Sphere Generator',
    description:
      'Use a Minecraft sphere generator and calculator for hollow or solid layer blueprints with row segments, block counts, CSV, print, and share links.'
  },
  {
    path: '/minecraft-dome-generator',
    shape: 'dome',
    title: 'Minecraft Dome Generator - Cap Height Blueprint',
    heading: 'Minecraft Dome Generator',
    description:
      'Generate Minecraft dome blueprints by diameter and cap height with top/bottom half, hollow or solid layers, block counts, CSV, print, and share links.'
  },
  {
    path: '/minecraft-block-count-calculator',
    shape: 'circle',
    title: 'Minecraft Block Count Calculator - Stacks & Totals',
    heading: 'Minecraft Block Count Calculator',
    description:
      'Calculate Minecraft blueprint totals, 64-stacks, leftovers, current-layer counts, and shulker-style estimates for circles, ovals, spheres, and domes.'
  }
];

const circlePresets = [7, 11, 15, 16, 21, 31, 32, 41, 51, 65, 96, 129];
const ovalPresets = [
  [31, 21],
  [41, 25],
  [51, 31],
  [64, 32]
];
const spherePresets = [21, 31];
const domePresets = [31, 51];

export const presetPages: PresetConfig[] = [
  ...circlePresets.map((diameter) => ({
    slug: `minecraft-${diameter}-circle`,
    path: `/presets/minecraft-${diameter}-circle`,
    shape: 'circle' as const,
    diameter,
    title: `${diameter} Block Minecraft Circle Blueprint`,
    heading: `${diameter} Block Minecraft Circle Blueprint`,
    description: `Open a ${diameter} block Minecraft circle preset with center guides, row segments, block counts, and PNG/SVG/CSV exports.`
  })),
  ...ovalPresets.map(([width, height]) => ({
    slug: `minecraft-${width}x${height}-oval`,
    path: `/presets/minecraft-${width}x${height}-oval`,
    shape: 'ellipse' as const,
    width,
    height,
    title: `${width} × ${height} Minecraft Oval Blueprint`,
    heading: `${width} × ${height} Minecraft Oval Blueprint`,
    description: `Open a ${width} by ${height} Minecraft oval preset with row segments, center guides, block counts, and PNG/SVG/CSV exports.`
  })),
  ...spherePresets.map((diameter) => ({
    slug: `minecraft-${diameter}-sphere`,
    path: `/presets/minecraft-${diameter}-sphere`,
    shape: 'sphere' as const,
    diameter,
    title: `${diameter} Block Minecraft Sphere Blueprint`,
    heading: `${diameter} Block Minecraft Sphere Blueprint`,
    description: `Open a ${diameter} block Minecraft sphere preset with layer-by-layer row segments, block counts, hollow shell defaults, print output, and PNG/SVG/CSV exports.`
  })),
  ...domePresets.map((diameter) => ({
    slug: `minecraft-${diameter}-dome`,
    path: `/presets/minecraft-${diameter}-dome`,
    shape: 'dome' as const,
    diameter,
    title: `${diameter} Block Minecraft Dome Blueprint`,
    heading: `${diameter} Block Minecraft Dome Blueprint`,
    description: `Open a ${diameter} block Minecraft dome preset with layer tables, cap height controls, block counts, hollow defaults, print output, and PNG/SVG/CSV exports.`
  }))
];

export const guidePages: GuideConfig[] = [
  {
    slug: 'how-to-build-a-circle-in-minecraft',
    path: '/guides/how-to-build-a-circle-in-minecraft',
    title: 'How to Build a Circle in Minecraft',
    heading: 'How to Build a Circle in Minecraft',
    description: 'Learn how to build Minecraft circles from a center point with axis marks, row segments, block counts, outline or filled modes, and printable blueprint outputs.',
    quickAnswer: 'Start a Minecraft circle by choosing the full outside diameter, marking the correct odd or even center, then building each listed row segment symmetrically from the axis marks.',
    paragraphs: [
      'Start by choosing an odd or even diameter. Odd diameters have one center block; even diameters need a shared center line or 2×2 center area.',
      'Mark the X and Z axes first, then build each row from the segment table. The table keeps long rows accurate without counting every block from memory.'
    ],
    steps: [
      'Open the circle generator and choose Diameter or Radius input.',
      'Enter the full circle size before collecting materials.',
      'Check whether the center is a single block or a 2×2 center area.',
      'Follow each Z row segment and mirror the shape from the marked axis.',
      'Export or print the row list before building in survival mode.'
    ],
    link: '/minecraft-circle-generator',
    linkLabel: 'Open the circle generator'
  },
  {
    slug: 'odd-even-minecraft-circle-centers',
    path: '/guides/odd-even-minecraft-circle-centers',
    title: 'Odd vs Even Minecraft Circle Centers',
    heading: 'Odd vs Even Minecraft Circle Centers',
    description: 'Understand odd and even Minecraft circle centers, including single-block centers, center lines, 2×2 center areas, row symmetry, and blueprint bounds.',
    quickAnswer: 'Odd footprints use one center block, even footprints use a center line or 2×2 center area, and mixed ovals need separate center handling for each axis before rows are mirrored.',
    paragraphs: [
      'Odd footprints mirror around one block. Even footprints mirror around grid lines between blocks, so the center marker is different.',
      'For mixed odd/even ovals, only one axis sits between two blocks. The builder labels this case separately to avoid treating it like a 2×2 center.'
    ],
    steps: [
      'Identify whether the footprint width and height are odd or even.',
      'For odd footprints, place the single center block first.',
      'For even-even footprints, mark the 2×2 center area before mirroring.',
      'For mixed odd/even ovals, mark the center line only on the even axis.',
      'Use the row table after the center marker is correct.'
    ],
    link: '/odd-even-minecraft-circle-centers',
    linkLabel: 'Compare center types'
  },
  {
    slug: 'how-to-build-an-oval-in-minecraft',
    path: '/guides/how-to-build-an-oval-in-minecraft',
    title: 'How to Build an Oval in Minecraft',
    heading: 'How to Build an Oval in Minecraft',
    description: 'Use width and height inputs to build Minecraft oval and ellipse footprints with mixed center parity, row-by-row ranges, block counts, and exports.',
    quickAnswer: 'Build a Minecraft oval by setting the full width and height first, marking the long and short axes, then following each row range instead of stretching a circle by eye.',
    paragraphs: [
      'Choose the full width and height first, then check whether either dimension is even. Mixed parity changes the center-line setup.',
      'Use the row table from top to bottom or bottom to top; each row lists continuous X ranges for the selected Z coordinate.'
    ],
    steps: [
      'Open the oval generator and enter the full width and height.',
      'Check the center type, especially when one dimension is even.',
      'Choose outline or filled mode before reading the block count.',
      'Build each Z row from its listed X ranges.',
      'Copy rows or export PNG/SVG/CSV when the preview matches the intended footprint.'
    ],
    link: '/minecraft-oval-generator',
    linkLabel: 'Open the oval generator'
  },
  {
    slug: 'how-to-build-a-sphere-in-minecraft',
    path: '/guides/how-to-build-a-sphere-in-minecraft',
    title: 'How to Build a Sphere in Minecraft',
    heading: 'How to Build a Sphere in Minecraft',
    description: 'Build Minecraft spheres layer by layer with hollow or solid settings, shell thickness, previous-layer ghosting, row segments, block counts, and CSV output.',
    quickAnswer: 'A Minecraft sphere is built as stacked circular layers; choose hollow or solid mode, confirm shell thickness, then complete each row in one layer before moving to the next.',
    paragraphs: [
      'A sphere blueprint is a stack of circular layers. Build one layer completely, then move to the next layer in the selected direction.',
      'Hollow mode keeps the shell. Solid mode fills every included voxel, which is useful for estimating mass and material needs.'
    ],
    steps: [
      'Open the sphere generator and set the diameter or radius.',
      'Choose hollow or solid mode and confirm the shell thickness.',
      'Use the layer slider to inspect the first layer before placing blocks.',
      'Complete each row segment in the current layer before moving upward or downward.',
      'Use selected-layer print or CSV export for large spheres.'
    ],
    link: '/minecraft-sphere-generator',
    linkLabel: 'Open the sphere generator'
  },
  {
    slug: 'how-to-build-a-dome-in-minecraft',
    path: '/guides/how-to-build-a-dome-in-minecraft',
    title: 'How to Build a Dome in Minecraft',
    heading: 'How to Build a Dome in Minecraft',
    description: 'Plan Minecraft domes with cap height, top or bottom half selection, hollow or solid layer tables, block counts, print output, and CSV export.',
    quickAnswer: 'A Minecraft dome is a sphere cap, so set the diameter, select the top or bottom half, choose cap height, then build the generated layer rings in order.',
    paragraphs: [
      'A dome is a selected half or cap of a sphere. Set the diameter, choose the top or bottom half, and clamp the cap height to the build you want.',
      'Use the layer slider to inspect each ring before building. The CSV export is useful for larger domes.'
    ],
    steps: [
      'Open the dome generator and set the diameter.',
      'Choose top or bottom half, then set the cap height.',
      'Choose hollow or solid mode before reading the block count.',
      'Inspect each layer and build from the selected direction.',
      'Print the selected layer range or export CSV for long dome builds.'
    ],
    link: '/minecraft-dome-generator',
    linkLabel: 'Open the dome generator'
  },
  {
    slug: 'minecraft-blueprint-csv-export',
    path: '/guides/minecraft-blueprint-csv-export',
    title: 'Minecraft Blueprint CSV Export',
    heading: 'Minecraft Blueprint CSV Export',
    description: 'Use Minecraft blueprint CSV exports to save exact row segments, layer summaries, block counts, selected ranges, and offline build references.',
    quickAnswer: 'Use CSV export when exact row ranges, layer numbers, block counts, or selected layer ranges matter more than a single visual screenshot.',
    paragraphs: [
      'CSV files preserve exact row ranges and block counts. For spheres and domes, export all layers, the current layer, or the same selected layer range you plan to print.',
      'Use CSV when the on-screen row table becomes too long to read comfortably or when you need a selected layer range for a large sphere or dome.'
    ],
    steps: [
      'Generate the blueprint with the final dimensions and build mode.',
      'For 3D shapes, choose whether the CSV should include all layers or only the current layer.',
      'Download the CSV and keep the row_segments column visible.',
      'Use layer, Y, Z, and X range fields to place blocks without recounting.',
      'Regenerate the CSV after any size or mode change.'
    ],
    link: '/minecraft-circle-generator',
    linkLabel: 'Generate a CSV blueprint'
  },
  {
    slug: 'minecraft-blueprint-printing',
    path: '/guides/minecraft-blueprint-printing',
    title: 'Print Minecraft Blueprints - Layer & Row Guide',
    heading: 'Print Minecraft Blueprints',
    description: 'Print Minecraft blueprints from BlockLayer with fit-to-screen views, high contrast grid output, selected layer ranges, row segments, and export fallbacks.',
    quickAnswer: 'Use print output for a build-session reference, but switch to SVG or CSV when the blueprint is too large for one readable browser print sheet.',
    paragraphs: [
      'Fit the blueprint before printing so the current canvas is centered. For very large builds, export SVG or CSV instead of relying on a single page.',
      'Use high contrast mode when printing on low-quality paper or when the grid needs stronger separation.'
    ],
    steps: [
      'Generate the blueprint and fit the canvas to screen.',
      'Use high contrast if the grid needs stronger print separation.',
      'For sphere or dome builds, choose current layer, all layers, or a selected layer range.',
      'Open browser print and confirm the printable sheet shows the intended rows.',
      'Use SVG or CSV instead when the print sheet is too large.'
    ],
    link: '/minecraft-circle-generator',
    linkLabel: 'Open printable blueprint tool'
  },
  {
    slug: 'minecraft-block-counts-stacks-shulkers',
    path: '/guides/minecraft-block-counts-stacks-shulkers',
    title: 'Minecraft Block Counts, Stacks, and Shulkers',
    heading: 'Minecraft Block Counts, Stacks, and Shulkers',
    description: 'Convert Minecraft blueprint block totals into 64-stacks, leftover blocks, rounded stacks, shulker-style estimates, layer counts, and material checks.',
    quickAnswer: 'Calculate block totals after choosing outline, filled, hollow, or solid mode, then convert the final total into full stacks, leftovers, and shulker-style estimates.',
    paragraphs: [
      'Every generated blueprint reports total blocks, full stacks, leftover blocks, rounded stacks, and shulker estimates.',
      'Filled shapes and solid 3D builds require many more blocks than outlines and hollow shells, so check the mode before collecting materials.'
    ],
    steps: [
      'Open the block count calculator and choose the target shape.',
      'Enter the final size and choose outline/filled or hollow/solid mode.',
      'Read total blocks, full stacks, remainder blocks, and shulker estimate.',
      'Change mode only after rechecking the block total.',
      'Copy the summary before collecting materials.'
    ],
    link: '/minecraft-block-count-calculator',
    linkLabel: 'Open the block count calculator'
  }
];

export const staticPages = [
  '/',
  '/minecraft-circle-generator',
  '/minecraft-oval-generator',
  '/minecraft-sphere-generator',
  '/minecraft-dome-generator',
  '/minecraft-block-count-calculator',
  '/minecraft-pixel-circle',
  '/odd-even-minecraft-circle-centers',
  '/minecraft-layer-by-layer-sphere',
  '/minecraft-dome-blueprint',
  '/presets',
  '/guides',
  '/about',
  '/privacy',
  '/terms',
  '/disclaimer',
  '/contact'
];

export function contentLastModified(path: string): Date {
  if (path === '/') return new Date(`${SITE_UPDATED_DATE}T00:00:00.000Z`);
  if (path.startsWith('/guides/')) return new Date('2026-06-05T00:00:00.000Z');
  if (path.startsWith('/presets/')) return new Date('2026-06-04T00:00:00.000Z');
  if (path === '/privacy' || path === '/terms' || path === '/disclaimer' || path === '/contact' || path === '/about') {
    return new Date('2026-05-31T00:00:00.000Z');
  }
  return new Date(`${SITE_UPDATED_DATE}T00:00:00.000Z`);
}

export const allContentPaths = [...staticPages, ...presetPages.map((page) => page.path), ...guidePages.map((page) => page.path)];
