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

export const toolPages: ToolPageConfig[] = [
  { path: '/tools/minecraft-circle-generator', shape: 'circle', title: 'Minecraft Circle Generator – Pixel Block Blueprint', heading: 'Minecraft Circle Generator', description: 'Generate Minecraft-style circles by diameter or radius with outline thickness, block counts, 64-stack counts, PNG, SVG, CSV, and print-friendly grids.' },
  { path: '/tools/minecraft-ellipse-generator', shape: 'ellipse', title: 'Minecraft Ellipse Generator – Oval Pixel Blueprint', heading: 'Minecraft Ellipse / Oval Generator', description: 'Create oval and ellipse block blueprints by width and height with outline or filled mode, row segments, block counts, and exports.' },
  { path: '/tools/minecraft-sphere-generator', shape: 'sphere', title: 'Minecraft Sphere Generator – Layer by Layer Blueprint', heading: 'Minecraft Sphere Generator', description: 'Build hollow or solid Minecraft-style spheres from true 3D voxel layers with layer slider, previous-layer ghost, counts, and exports.' },
  { path: '/tools/minecraft-dome-generator', shape: 'dome', title: 'Minecraft Dome Generator – Printable Block Layers', heading: 'Minecraft Dome Generator', description: 'Generate Minecraft-style dome and hemisphere blueprints with cap height, shell thickness, layer-by-layer views, block counts, and exports.' },
  { path: '/tools/minecraft-block-count-calculator', shape: 'sphere', title: 'Minecraft Block Count Calculator – Stacks and Layers', heading: 'Minecraft Block Count Calculator', description: 'Calculate total blocks, 64-stacks, shulker estimates, current layer counts, and CSV summaries for circles, ellipses, spheres, and domes.', diameter: 31 }
];

export const presetPages: PresetConfig[] = [
  { slug: 'minecraft-circle-generator-16', path: '/presets/minecraft-circle-generator-16', shape: 'circle', diameter: 16, title: '16 Block Minecraft Circle Generator', heading: '16 Block Minecraft Circle Blueprint', description: 'Open a 16 block circle preset with even-center guidance, row segments, material counts, and exports.' },
  { slug: 'minecraft-circle-generator-32', path: '/presets/minecraft-circle-generator-32', shape: 'circle', diameter: 32, title: '32 Block Minecraft Circle Generator', heading: '32 Block Minecraft Circle Blueprint', description: 'Generate a 32 block circle for towers, arenas, platforms, and walls.' },
  { slug: 'minecraft-circle-generator-64', path: '/presets/minecraft-circle-generator-64', shape: 'circle', diameter: 64, title: '64 Block Minecraft Circle Generator', heading: '64 Block Minecraft Circle Blueprint', description: 'Generate a large 64 block circle with pan, zoom, fit-to-screen, and printable output.' },
  { slug: 'minecraft-sphere-generator-16', path: '/presets/minecraft-sphere-generator-16', shape: 'sphere', diameter: 16, title: '16 Block Minecraft Sphere Generator', heading: '16 Block Minecraft Sphere Layers', description: 'Open a 16 block sphere preset with layer-by-layer views and block counts.' },
  { slug: 'minecraft-sphere-generator-32', path: '/presets/minecraft-sphere-generator-32', shape: 'sphere', diameter: 32, title: '32 Block Minecraft Sphere Generator', heading: '32 Block Minecraft Sphere Layers', description: 'Generate a 32 block hollow or solid sphere with previous-layer ghost and exports.' },
  { slug: 'minecraft-sphere-generator-64', path: '/presets/minecraft-sphere-generator-64', shape: 'sphere', diameter: 64, title: '64 Block Minecraft Sphere Generator', heading: '64 Block Minecraft Sphere Layers', description: 'Generate a large 64 block sphere with performance-aware canvas and layer summaries.' },
  { slug: 'minecraft-dome-generator-32', path: '/presets/minecraft-dome-generator-32', shape: 'dome', diameter: 32, title: '32 Block Minecraft Dome Generator', heading: '32 Block Minecraft Dome Blueprint', description: 'Generate a 32 block dome for roofs, arenas, temples, and bases.' },
  { slug: 'minecraft-dome-generator-64', path: '/presets/minecraft-dome-generator-64', shape: 'dome', diameter: 64, title: '64 Block Minecraft Dome Generator', heading: '64 Block Minecraft Dome Blueprint', description: 'Generate a large 64 block dome with layer-by-layer plans and material counts.' },
  { slug: 'minecraft-tower-circle-generator', path: '/presets/minecraft-tower-circle-generator', shape: 'circle', diameter: 31, title: 'Minecraft Tower Circle Generator', heading: 'Minecraft Tower Circle Blueprint', description: 'Start from a practical tower circle blueprint and adjust the diameter, thickness, and fill mode.' },
  { slug: 'minecraft-castle-tower-circle', path: '/presets/minecraft-castle-tower-circle', shape: 'circle', diameter: 21, title: 'Minecraft Castle Tower Circle Blueprint', heading: 'Minecraft Castle Tower Circle Blueprint', description: 'Generate a castle tower circle with center alignment, row segments, stack counts, and print export.' },
  { slug: 'minecraft-circle-generator-5', path: '/presets/minecraft-circle-generator-5', shape: 'circle', diameter: 5, title: '5 Block Minecraft Circle Generator', heading: '5 Block Circle Blueprint', description: 'Small 5 block circle preset for compact towers, wells, and decorative posts.' },
  { slug: 'minecraft-circle-generator-9', path: '/presets/minecraft-circle-generator-9', shape: 'circle', diameter: 9, title: '9 Block Minecraft Circle Generator', heading: '9 Block Circle Blueprint', description: 'Small odd-center 9 block circle preset with segment rows and block counts.' },
  { slug: 'minecraft-oval-generator-21x13', path: '/presets/minecraft-oval-generator-21x13', shape: 'ellipse', width: 21, height: 13, title: '21 by 13 Minecraft Oval Generator', heading: '21 × 13 Oval Blueprint', description: 'Oval preset for gardens, roofs, arenas, and organic platforms.' },
  { slug: 'minecraft-ellipse-generator-48x32', path: '/presets/minecraft-ellipse-generator-48x32', shape: 'ellipse', width: 48, height: 32, title: '48 by 32 Minecraft Ellipse Generator', heading: '48 × 32 Ellipse Blueprint', description: 'Large ellipse preset with row segments, material counts, and export controls.' },
  { slug: 'minecraft-dome-generator-16', path: '/presets/minecraft-dome-generator-16', shape: 'dome', diameter: 16, title: '16 Block Minecraft Dome Generator', heading: '16 Block Dome Blueprint', description: 'Compact dome preset for small roofs and glass caps.' },
  { slug: 'minecraft-glass-dome-generator-32', path: '/presets/minecraft-glass-dome-generator-32', shape: 'dome', diameter: 32, title: '32 Block Minecraft Glass Dome Generator', heading: '32 Block Glass Dome Blueprint', description: 'Dome preset designed for glass roof planning with stack counts and printable layers.' },
  { slug: 'minecraft-observatory-dome', path: '/presets/minecraft-observatory-dome', shape: 'dome', diameter: 48, title: 'Minecraft Observatory Dome Blueprint', heading: 'Observatory Dome Blueprint', description: 'Large observatory-style dome preset with cap height control and layer summaries.' },
  { slug: 'minecraft-lighthouse-circle', path: '/presets/minecraft-lighthouse-circle', shape: 'circle', diameter: 17, title: 'Minecraft Lighthouse Circle Blueprint', heading: 'Lighthouse Circle Blueprint', description: 'Circular lighthouse base preset with odd-center guidance.' },
  { slug: 'minecraft-arena-circle-generator', path: '/presets/minecraft-arena-circle-generator', shape: 'circle', diameter: 64, title: 'Minecraft Arena Circle Generator', heading: 'Arena Circle Blueprint', description: 'Large arena circle preset with pan, zoom, row tables, and material counts.' },
  { slug: 'minecraft-layer-by-layer-sphere-48', path: '/presets/minecraft-layer-by-layer-sphere-48', shape: 'sphere', diameter: 48, title: '48 Block Layer by Layer Sphere Generator', heading: '48 Block Sphere Layer Blueprint', description: 'Large sphere preset with true 3D voxel layers, current-layer counts, and printable summaries.' }
];

export const guidePages: GuideConfig[] = [
  { slug: 'diameter-vs-radius-in-minecraft-circles', path: '/guides/diameter-vs-radius-in-minecraft-circles', title: 'Diameter vs Radius in Minecraft Circles', heading: 'Diameter vs Radius in Minecraft Circles', description: 'Understand which value to enter and how BlockLayer converts radius into a block blueprint.', paragraphs: ['Diameter is the full outside width of the blueprint. Radius is the distance from the center to the outside edge.', 'For block builds, odd diameters have one center block. Even diameters are centered between blocks.'], link: '/tools/minecraft-circle-generator', linkLabel: 'Open the circle generator' },
  { slug: 'why-your-minecraft-circle-is-one-block-off', path: '/guides/why-your-minecraft-circle-is-one-block-off', title: 'Why Your Minecraft Circle Is One Block Off', heading: 'Why Your Minecraft Circle Is One Block Off', description: 'Fix odd/even center mistakes and row mirroring errors in block circle builds.', paragraphs: ['Most one-block errors come from mixing odd and even centers or starting from the wrong row.', 'Use the center note and row segments instead of guessing from a screenshot.'], link: '/tools/minecraft-circle-generator', linkLabel: 'Generate a corrected circle' },
  { slug: 'how-to-build-a-sphere-layer-by-layer', path: '/guides/how-to-build-a-sphere-layer-by-layer', title: 'How to Build a Sphere Layer by Layer', heading: 'How to Build a Sphere Layer by Layer', description: 'Use true sphere layers, current layer counts, and previous-layer ghosts to build rounded structures.', paragraphs: ['Build one layer at a time and verify each layer against the previous-layer ghost.', 'A sphere layer is a 3D voxel cross-section, not just a reused 2D circle.'], link: '/tools/minecraft-sphere-generator', linkLabel: 'Open the sphere generator' },
  { slug: 'how-to-build-a-minecraft-dome', path: '/guides/how-to-build-a-minecraft-dome', title: 'How to Build a Minecraft Dome', heading: 'How to Build a Minecraft Dome', description: 'Choose cap height, shell thickness, and build direction for dome blueprints.', paragraphs: ['A dome is not just a full sphere with ignored layers. Use the independent dome mode to control cap height.', 'For glass roofs or temples, start with the widest base layer and move upward.'], link: '/tools/minecraft-dome-generator', linkLabel: 'Open the dome generator' },
  { slug: 'odd-vs-even-minecraft-circle-centers', path: '/guides/odd-vs-even-minecraft-circle-centers', title: 'Odd vs Even Minecraft Circle Centers', heading: 'Odd vs Even Minecraft Circle Centers', description: 'Learn how odd and even diameters affect centers for circles, ellipses, spheres, and domes.', paragraphs: ['Odd dimensions produce a single center block. Even dimensions place the center between blocks.', 'This affects mirroring, axis labels, and where the first row should be placed.'], link: '/tools/minecraft-circle-generator', linkLabel: 'Try both center types' },
  { slug: 'how-to-print-a-minecraft-blueprint', path: '/guides/how-to-print-a-minecraft-blueprint', title: 'How to Print a Minecraft Blueprint', heading: 'How to Print a Minecraft Blueprint', description: 'Use current-view printing, all-layer summaries, selected layer ranges, and CSV export.', paragraphs: ['Use current blueprint printing for the canvas view you are building now.', 'For spheres and domes, use all-layer or selected-range print controls to plan the build sequence.'], link: '/tools/minecraft-sphere-generator', linkLabel: 'Open a printable blueprint' },
  { slug: 'how-to-count-blocks-for-a-minecraft-dome', path: '/guides/how-to-count-blocks-for-a-minecraft-dome', title: 'How to Count Blocks for a Minecraft Dome', heading: 'How to Count Blocks for a Minecraft Dome', description: 'Use dome totals, current layer counts, 64-stacks, and shulker estimates.', paragraphs: ['Dome totals depend on diameter, cap height, shell thickness, and solid or hollow mode.', 'Use current-layer counts to prepare one layer at a time and the total stack count for material gathering.'], link: '/tools/minecraft-dome-generator', linkLabel: 'Open the dome generator' },
  { slug: 'minecraft-dome-vs-sphere-blueprint', path: '/guides/minecraft-dome-vs-sphere-blueprint', title: 'Minecraft Dome vs Sphere Blueprint', heading: 'Minecraft Dome vs Sphere Blueprint', description: 'Choose the right blueprint mode for roofs, caps, globes, and closed rounded builds.', paragraphs: ['Use a sphere when the object needs to be closed on all sides.', 'Use a dome when the build sits on a base ring, roof, floor, or wall.'], link: '/tools/minecraft-dome-generator', linkLabel: 'Compare dome settings' }
];

export const staticPages = ['/', '/about', '/privacy', '/terms', '/disclaimer', '/contact'];

export const aliasPages = [
  '/circle-generator',
  '/ellipse-generator',
  '/sphere-generator',
  '/dome-generator',
  '/minecraft-circle-generator',
  '/minecraft-sphere-generator',
  '/minecraft-dome-generator',
  '/minecraft-oval-generator',
  '/minecraft-pixel-circle',
  '/minecraft-layer-by-layer-sphere',
  '/minecraft-block-count-calculator',
  '/minecraft-circle-sizes',
  '/minecraft-dome-blueprint',
  '/minecraft-glass-dome-generator',
  '/minecraft-7-circle',
  '/minecraft-11-circle',
  '/minecraft-15-circle',
  '/minecraft-21-circle',
  '/minecraft-31-circle',
  '/minecraft-41-circle',
  '/minecraft-65-circle',
  '/minecraft-129-circle',
  '/how-to-build-a-circle-in-minecraft',
  '/how-to-build-a-sphere-in-minecraft',
  '/how-to-build-a-dome-in-minecraft',
  '/odd-even-minecraft-circle-centers'
];
export const allContentPaths = [...staticPages, ...toolPages.map((page) => page.path), ...aliasPages, ...presetPages.map((page) => page.path), ...guidePages.map((page) => page.path)];
