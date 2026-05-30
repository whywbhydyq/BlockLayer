import type { ShapeKind } from '@/lib/geometry';

import type { ToolContentKey, ToolContentPackage } from './toolContentTypes';
export type { ToolContentKey, ToolContentPackage } from './toolContentTypes';

const sharedLinks = [
  { label: 'Browse presets', href: '/presets' },
  { label: 'Read blueprint guides', href: '/guides' }
];

const packages: Record<ToolContentKey, ToolContentPackage> = {
  home: {
    key: 'home',
    intro:
      'Enter a diameter, radius, width, or height to produce a block-by-block blueprint. The first screen stays focused on inputs, preview, counts, and export actions.',
    howToTitle: 'Fast blueprint workflow',
    howToSteps: [
      'Choose Circle, Oval, Sphere, or Dome.',
      'Enter the full size before collecting materials.',
      'Check the center guide and row or layer table.',
      'Copy rows, download PNG/SVG/CSV, print, or share the current setup.'
    ],
    outputsTitle: 'Outputs you can use immediately',
    outputs: [
      'Canvas preview with pan, zoom, center lines, axes, and optional row labels.',
      'Row segments and block counts generated from the same current blueprint.',
      'PNG, SVG, CSV, print sheet, copy actions, and share URL for the active settings.'
    ],
    tipsTitle: 'Before you build',
    tips: [
      'Odd footprints start from one center block; even footprints start from shared grid lines.',
      'For 3D shapes, finish the current layer before moving to the next layer.',
      'Use CSV or selected-layer print for large spheres and domes.'
    ],
    faq: [
      ['Does the blueprint update automatically?', 'Yes. Preview, counts, row segments, and export payloads update as soon as you edit a value.'],
      ['Why can circles differ between tools?', 'Block generators use different inclusion rules. BlockLayer uses a block-center approximation and labels center parity so the build is reproducible.'],
      ['Can I use this while building?', 'Yes. Companion Mode gives previous/next row controls, row copy, and done marking for a second screen.']
    ],
    links: [
      { label: 'Open the circle generator', href: '/minecraft-circle-generator' },
      { label: 'Open the sphere generator', href: '/minecraft-sphere-generator' },
      ...sharedLinks
    ],
    intentLinks: [
      { label: 'row-by-row Minecraft circle generator', href: '/minecraft-circle-generator', description: 'Use row segments instead of copying a screenshot by eye.' },
      { label: 'Layer-by-layer sphere generator', href: '/minecraft-layer-by-layer-sphere', description: 'Split large 3D builds into buildable Y layers.' },
      { label: 'Minecraft dome blueprint with cap height', href: '/minecraft-dome-blueprint', description: 'Plan roofs and observatory-style domes with selected layer output.' },
      { label: 'Minecraft block count calculator', href: '/minecraft-block-count-calculator', description: 'Estimate blocks, stacks, and shulker-style totals from the active blueprint.' }
    ]
  },
  circle: {
    key: 'circle',
    intro: 'Use the circle page when the task is a flat footprint, wall, floor, arena, tower base, or ring measured by diameter or radius.',
    howToTitle: 'Circle build workflow',
    howToSteps: [
      'Choose Diameter for a full footprint or Radius when you already measured from center to edge.',
      'Pick Outline or Filled before reading the block count.',
      'Mark the center and the X/Z axes, then follow each row segment.',
      'Copy the rows or export PNG/SVG/CSV before starting a survival build.'
    ],
    outputsTitle: 'Circle outputs',
    outputs: [
      'Single-layer grid preview with center guide and optional row labels.',
      'Top-to-bottom Z row segments with X start/end ranges.',
      'Outline count, filled-count reference, stacks of 64, print sheet, and share link.'
    ],
    tipsTitle: 'Circle mistakes to avoid',
    tips: [
      'Do not enter radius when the input mode is Diameter.',
      'For even diameters, mark the 2×2 center area before mirroring rows.',
      'If you change thickness, recheck both outline and filled material counts.'
    ],
    faq: [
      ['What diameter should I enter?', 'Enter the full outside width of the circle in blocks unless you intentionally switch to Radius mode.'],
      ['What does “Blocks if filled” mean?', 'It is a material reference for the same footprint filled solid, even when the visible blueprint is outline mode.'],
      ['Should I use PNG or CSV?', 'Use PNG for a visual reference and CSV when you want exact row ranges in a spreadsheet.']
    ],
    links: [
      { label: '31 block circle preset', href: '/presets/minecraft-31-circle' },
      { label: 'Odd vs even centers', href: '/guides/odd-even-minecraft-circle-centers' },
      ...sharedLinks
    ],
    intentLinks: [
      { label: 'Row-by-row Minecraft circle', href: '/minecraft-circle-generator', description: 'Generate Z rows with X ranges for each line of the footprint.' },
      { label: 'Minecraft circle center guide', href: '/odd-even-minecraft-circle-centers', description: 'Check odd, even, and 2×2 center starts before building.' },
      { label: '31 block circle preset', href: '/presets/minecraft-31-circle', description: 'Open a common tower and arena diameter as an editable preset.' },
      { label: '51 block circle preset', href: '/presets/minecraft-51-circle', description: 'Start from a larger circle and export rows, PNG, SVG, or CSV.' }
    ]
  },
  oval: {
    key: 'oval',
    intro: 'Use the oval page when width and height differ, such as paths, stadiums, portals, flattened bases, or ellipse-shaped farms.',
    howToTitle: 'Oval build workflow',
    howToSteps: [
      'Enter the full width and full height in blocks.',
      'Check whether one axis or both axes are even before marking the center.',
      'Choose Outline or Filled and confirm the material count.',
      'Build each Z row from its X ranges, then mirror from the marked center line.'
    ],
    outputsTitle: 'Oval outputs',
    outputs: [
      'Width × height preview with mixed-parity center descriptions.',
      'Row segments for each Z coordinate and block totals for the selected mode.',
      'Common oval chips plus PNG/SVG/CSV, print, row copy, and share URL.'
    ],
    tipsTitle: 'Oval mistakes to avoid',
    tips: [
      'Do not treat a mixed odd/even oval like a 2×2 center; only the even axis is between blocks.',
      'Keep the same orientation after exporting, because width and height are not interchangeable.',
      'Re-export if you switch outline thickness or filled mode.'
    ],
    faq: [
      ['Is an oval the same as an ellipse here?', 'Yes. The tool uses width and height to generate an ellipse-style block footprint.'],
      ['Why is the center sometimes “between two blocks”?', 'That happens when only one dimension is even, so only one axis sits between the two middle blocks.'],
      ['Can I download an oval as CSV?', 'Yes. CSV exports use the same row ranges currently shown in the table.']
    ],
    links: [
      { label: '31×21 oval preset', href: '/presets/minecraft-31x21-oval' },
      { label: 'How to build an oval', href: '/guides/how-to-build-an-oval-in-minecraft' },
      ...sharedLinks
    ],
    intentLinks: [
      { label: 'Minecraft oval width × height generator', href: '/minecraft-oval-generator', description: 'Use separate width and height instead of forcing a circle diameter.' },
      { label: '31×21 oval preset', href: '/presets/minecraft-31x21-oval', description: 'Open a balanced stadium-style oval and adjust from there.' },
      { label: '64×32 oval preset', href: '/presets/minecraft-64x32-oval', description: 'Start from a wide flattened footprint for paths and arenas.' },
      { label: 'Odd/even oval center guide', href: '/guides/odd-even-minecraft-circle-centers', description: 'Avoid one-axis center-line mistakes on mixed parity ovals.' }
    ]
  },
  sphere: {
    key: 'sphere',
    intro: 'Use the sphere page when you need a full 3D build split into layers, with hollow or solid mode and layer-by-layer row ranges.',
    howToTitle: 'Sphere build workflow',
    howToSteps: [
      'Enter the full sphere diameter or switch to radius input.',
      'Choose Hollow shell or Solid, then confirm shell thickness if needed.',
      'Move through layers with the slider and build the current layer row by row.',
      'Use selected-layer print or CSV for large spheres instead of one screenshot.'
    ],
    outputsTitle: 'Sphere outputs',
    outputs: [
      'Current-layer preview with optional previous-layer ghosting.',
      'Layer summary table, current-layer rows, total block count, stacks, and shulker estimate.',
      'All-layer CSV, current-layer CSV, selected-range CSV, and selected-range print sheet.'
    ],
    tipsTitle: 'Sphere mistakes to avoid',
    tips: [
      'Do not collect materials from hollow mode if you plan to build solid.',
      'Complete one layer before changing Y level.',
      'Use top-down or bottom-up direction consistently when following printed layers.'
    ],
    faq: [
      ['What is previous-layer ghosting?', 'It lightly shows the neighboring layer so you can compare how the shell changes as you build upward or downward.'],
      ['When should I use selected-range CSV?', 'Use it when a large sphere is easier to split into sessions, such as layers 1–10 today and 11–20 later.'],
      ['Does shell thickness affect block count?', 'Yes. Hollow shells with thicker walls include more blocks than a one-block shell.']
    ],
    links: [
      { label: '31 block sphere preset', href: '/presets/minecraft-31-sphere' },
      { label: 'How to build a sphere', href: '/guides/how-to-build-a-sphere-in-minecraft' },
      ...sharedLinks
    ],
    intentLinks: [
      { label: 'Layer-by-layer sphere blueprint', href: '/minecraft-layer-by-layer-sphere', description: 'Use a dedicated landing page for staged sphere builds.' },
      { label: 'Hollow Minecraft sphere generator', href: '/minecraft-sphere-generator', description: 'Switch between hollow shell and solid material estimates.' },
      { label: '31 block sphere preset', href: '/presets/minecraft-31-sphere', description: 'Open a common medium sphere with editable layers.' },
      { label: 'Selected-range CSV export', href: '/guides/minecraft-blueprint-csv-export', description: 'Export only the layers you plan to build in one session.' }
    ]
  },
  dome: {
    key: 'dome',
    intro: 'Use the dome page when you only need the top or bottom part of a sphere, with cap height and selected-layer output.',
    howToTitle: 'Dome build workflow',
    howToSteps: [
      'Enter the full source sphere diameter.',
      'Choose top half or bottom half, then set the cap height.',
      'Choose Hollow shell or Solid and confirm shell thickness.',
      'Print or export the selected layer range for the part of the dome you are building.'
    ],
    outputsTitle: 'Dome outputs',
    outputs: [
      'Layer preview for the selected half/cap with current-layer row segments.',
      'Cap-aware layer count, total blocks, current-layer count, and stack estimate.',
      'PNG/SVG preview plus all/current/selected-range CSV and selected-range print.'
    ],
    tipsTitle: 'Dome mistakes to avoid',
    tips: [
      'Cap height is measured in layers, not horizontal diameter.',
      'Check top versus bottom half before exporting rows.',
      'For large domes, print only the layer range you will build in one session.'
    ],
    faq: [
      ['What does cap height control?', 'It limits how many layers of the selected dome half are included in the blueprint.'],
      ['Can I print only part of a dome?', 'Yes. Choose Selected range, enter the layer numbers, then print the generated sheet.'],
      ['Should I use hollow or solid?', 'Use hollow for shells and roofs; use solid when you need a filled mass or a conservative material estimate.']
    ],
    links: [
      { label: '31 block dome preset', href: '/presets/minecraft-31-dome' },
      { label: 'How to build a dome', href: '/guides/how-to-build-a-dome-in-minecraft' },
      ...sharedLinks
    ],
    intentLinks: [
      { label: 'Minecraft dome blueprint', href: '/minecraft-dome-blueprint', description: 'Use the focused dome page for cap height and print-ready layer rows.' },
      { label: '51 block dome preset', href: '/presets/minecraft-51-dome', description: 'Open a larger dome preset for roofs and observatories.' },
      { label: 'Print selected dome layers', href: '/guides/print-minecraft-blueprints', description: 'Print only the layer range needed for the current build session.' },
      { label: 'Dome block count guide', href: '/guides/minecraft-block-counts-stacks-shulkers', description: 'Convert blueprint totals into stacks and shulker-style planning.' }
    ]
  },
  'block-count': {
    key: 'block-count',
    intro: 'Use the block count page when the first task is material planning: total blocks, stacks of 64, remainder blocks, and shulker estimates.',
    howToTitle: 'Material count workflow',
    howToSteps: [
      'Choose the target shape and final size.',
      'Set outline/filled or hollow/solid before reading totals.',
      'Check total blocks, full stacks, remainder blocks, and current-layer count when available.',
      'Copy the summary before collecting materials or changing modes.'
    ],
    outputsTitle: 'Block-count outputs',
    outputs: [
      'Total blocks generated from the active geometry result.',
      'Full stacks of 64 plus leftover blocks for survival planning.',
      'Layer count and selected-layer totals for sphere and dome builds.'
    ],
    tipsTitle: 'Counting mistakes to avoid',
    tips: [
      'Filled and solid modes can multiply material needs compared with outline or hollow shells.',
      'Do not reuse a block total after changing diameter, thickness, or shell mode.',
      'CSV export is useful when a large project needs materials grouped by layer.'
    ],
    faq: [
      ['Does the count include air or empty center space?', 'No. The count is based on generated block cells for the selected outline/filled or hollow/solid mode.'],
      ['Why do stack counts have a remainder?', 'Minecraft stacks hold 64 blocks, so the tool reports full stacks plus leftover blocks.'],
      ['Can I estimate shulkers?', 'The result summary includes a shulker-style estimate derived from stack counts.']
    ],
    links: [
      { label: 'Block count guide', href: '/guides/minecraft-block-counts-stacks-shulkers' },
      { label: 'Browse material presets', href: '/presets' },
      { label: 'CSV export guide', href: '/guides/minecraft-blueprint-csv-export' }
    ],
    intentLinks: [
      { label: 'Circle block count', href: '/minecraft-circle-generator', description: 'Compare outline and filled counts for a flat circle.' },
      { label: 'Sphere block count by layer', href: '/minecraft-sphere-generator', description: 'Review total blocks and current-layer counts for 3D shells.' },
      { label: 'Stacks and shulker guide', href: '/guides/minecraft-block-counts-stacks-shulkers', description: 'Use stacks of 64 and shulker-style totals for survival planning.' },
      { label: 'CSV material planning', href: '/guides/minecraft-blueprint-csv-export', description: 'Move layered output into a spreadsheet for grouped collection.' }
    ]
  },
  'pixel-circle': {
    key: 'pixel-circle',
    intro: 'Use this page when you are comparing pixel-circle output and need a reproducible block-center circle with explicit row ranges.',
    howToTitle: 'Pixel circle workflow',
    howToSteps: [
      'Enter the intended outside diameter.',
      'Compare the preview and row segments before building.',
      'Check center parity because pixel circles differ most around even sizes and edges.',
      'Export rows or SVG when you need a reusable reference.'
    ],
    outputsTitle: 'Pixel-circle outputs',
    outputs: [
      'Block-center approximation preview with explicit center and axis markers.',
      'Row segments that make the inclusion rule reproducible.',
      'PNG/SVG/CSV outputs based on the same cells shown in the canvas.'
    ],
    tipsTitle: 'Pixel circle notes',
    tips: [
      'Different circle generators can choose edge blocks differently.',
      'Use row ranges instead of eyeballing a screenshot for large sizes.',
      'If the result must match another tool exactly, compare inclusion rules first.'
    ],
    faq: [
      ['Why does this differ from another pixel circle tool?', 'Tools vary on how they include edge blocks. This page keeps the rule visible through rows and counts.'],
      ['Is the SVG generated from the same blueprint?', 'Yes. SVG export uses the current result and layer selection.'],
      ['Can I share the exact setup?', 'Yes. Copy the share link after the preview matches your intended size.']
    ],
    links: [
      { label: 'Circle generator', href: '/minecraft-circle-generator' },
      { label: 'Odd vs even centers', href: '/guides/odd-even-minecraft-circle-centers' },
      ...sharedLinks
    ],
    intentLinks: [
      { label: 'Minecraft pixel circle generator', href: '/minecraft-pixel-circle', description: 'Use a reproducible block-center circle with explicit row ranges.' },
      { label: 'Circle row segment generator', href: '/minecraft-circle-generator', description: 'Copy exact row ranges instead of relying on visual estimation.' },
      { label: 'Even diameter center guide', href: '/odd-even-minecraft-circle-centers', description: 'Check whether the start point is one block, a line, or a 2×2 area.' },
      { label: 'SVG circle export', href: '/minecraft-circle-generator', description: 'Download a scalable vector reference from the same blueprint.' }
    ]
  },
  'center-guide': {
    key: 'center-guide',
    intro: 'Use this page when the main question is where to start: single center block, 2×2 center area, or one-axis center line.',
    howToTitle: 'Center-check workflow',
    howToSteps: [
      'Choose a diameter or oval size.',
      'Read the Center type card before placing blocks.',
      'Mark the center block, center line, or 2×2 center area.',
      'Only then follow the row segments and mirror the footprint.'
    ],
    outputsTitle: 'Center-guide outputs',
    outputs: [
      'Center type, center instruction, axis markers, and row segments.',
      'Warnings for even or mixed odd/even footprints.',
      'Printable or shareable reference for the selected size.'
    ],
    tipsTitle: 'Center mistakes to avoid',
    tips: [
      'Do not start an even circle from one block as if it were odd.',
      'Mixed odd/even ovals need a center line on only one axis.',
      'Mark axes before counting long row segments.'
    ],
    faq: [
      ['What is a single center block?', 'It appears when both footprint dimensions are odd. The build mirrors around one block.'],
      ['What is a 2×2 center area?', 'It appears when both dimensions are even. The true center is between four blocks.'],
      ['What does one-axis center line mean?', 'It appears when only width or height is even, so only that axis is centered between two blocks.']
    ],
    links: [
      { label: 'Center guide article', href: '/guides/odd-even-minecraft-circle-centers' },
      { label: 'Circle generator', href: '/minecraft-circle-generator' },
      { label: 'Oval generator', href: '/minecraft-oval-generator' }
    ],
    intentLinks: [
      { label: 'Odd circle center', href: '/guides/odd-even-minecraft-circle-centers', description: 'Use one center block when both footprint dimensions are odd.' },
      { label: 'Even circle center', href: '/odd-even-minecraft-circle-centers', description: 'Mark the grid-line center or 2×2 center area before mirroring.' },
      { label: 'Mixed odd/even oval center', href: '/minecraft-oval-generator', description: 'Use the oval tool when only one axis is centered between blocks.' },
      { label: '31 block circle preset', href: '/presets/minecraft-31-circle', description: 'Open a common odd-diameter preset and compare center behavior.' }
    ]
  },
  'layered-sphere': {
    key: 'layered-sphere',
    intro: 'This landing page is tuned for users who specifically need a sphere split into buildable layers instead of a flat circle screenshot.',
    howToTitle: 'Layer-by-layer sphere workflow',
    howToSteps: [
      'Set the diameter and choose hollow or solid mode.',
      'Use the layer slider to inspect the starting layer.',
      'Build the current layer from row segments, then advance one layer.',
      'Export selected layer ranges when the full sphere is too large for one session.'
    ],
    outputsTitle: 'Layered sphere outputs',
    outputs: [
      'Current-layer row table and full layer summary.',
      'Previous-layer ghosting for shell comparison.',
      'Selected-range CSV and print sheet for staged builds.'
    ],
    tipsTitle: 'Layered sphere notes',
    tips: [
      'Stay consistent with top-down or bottom-up direction.',
      'Large spheres should be split into layer ranges before printing.',
      'Check current-layer block count when organizing build sessions.'
    ],
    faq: [],
    links: [
      { label: 'Main sphere generator', href: '/minecraft-sphere-generator' },
      { label: 'Sphere guide', href: '/guides/how-to-build-a-sphere-in-minecraft' },
      ...sharedLinks
    ],
    intentLinks: [
      { label: 'Minecraft layer-by-layer sphere generator', href: '/minecraft-layer-by-layer-sphere', description: 'Use the focused sphere page for staged Y-layer builds.' },
      { label: 'Hollow sphere blueprint', href: '/minecraft-sphere-generator', description: 'Plan shell thickness and material totals before exporting.' },
      { label: 'Sphere selected-range print', href: '/guides/print-minecraft-blueprints', description: 'Print only the layer range you need for a large sphere.' },
      { label: '31 block sphere preset', href: '/presets/minecraft-31-sphere', description: 'Open a medium sphere starting point with editable layers.' }
    ]
  },
  'dome-blueprint': {
    key: 'dome-blueprint',
    intro: 'This landing page is tuned for dome blueprint searches: cap height, selected half, row segments, and print-ready layers.',
    howToTitle: 'Dome blueprint workflow',
    howToSteps: [
      'Set the source sphere diameter.',
      'Choose top or bottom half and cap height.',
      'Inspect the current layer, then export or print the layers you need.',
      'Use the share URL after confirming half, cap, and shell settings.'
    ],
    outputsTitle: 'Dome blueprint outputs',
    outputs: [
      'Cap-aware dome layers with current-layer row segments.',
      'Block totals for hollow or solid dome settings.',
      'Selected-range print and CSV output for offline building.'
    ],
    tipsTitle: 'Dome blueprint notes',
    tips: [
      'Cap height changes the included layers, not the horizontal footprint alone.',
      'Top and bottom halves have different build order expectations.',
      'Print only the layers you will build in the current session.'
    ],
    faq: [],
    links: [
      { label: 'Main dome generator', href: '/minecraft-dome-generator' },
      { label: 'Dome guide', href: '/guides/how-to-build-a-dome-in-minecraft' },
      ...sharedLinks
    ],
    intentLinks: [
      { label: 'Minecraft dome blueprint generator', href: '/minecraft-dome-blueprint', description: 'Use the focused dome page for cap height and layer export.' },
      { label: 'Dome cap height guide', href: '/guides/how-to-build-a-dome-in-minecraft', description: 'Check how cap height changes the included layers.' },
      { label: '51 block dome preset', href: '/presets/minecraft-51-dome', description: 'Open a larger dome preset and adjust hollow/solid settings.' },
      { label: 'Print dome layer range', href: '/guides/print-minecraft-blueprints', description: 'Generate print sheets only for the layers you are ready to build.' }
    ]
  },
  preset: {
    key: 'preset',
    intro: 'This preset page loads a specific size into the same builder so the input, preview, result table, exports, and share URL all stay editable.',
    howToTitle: 'Preset workflow',
    howToSteps: [
      'Confirm the preset size in the input panel.',
      'Check the center guide and mode before collecting materials.',
      'Use the preset as-is or adjust size, thickness, shell, or cap settings.',
      'Export the final blueprint only after the preview matches the intended build.'
    ],
    outputsTitle: 'Preset outputs',
    outputs: [
      'Preloaded blueprint plus editable controls.',
      'Example block totals and row or layer counts below the workspace.',
      'Related preset links for nearby sizes.'
    ],
    tipsTitle: 'Preset notes',
    tips: [
      'Presets are starting points, not locked templates.',
      'Changing any setting changes the export payload and share URL.',
      'Use related presets when the first size is too small or too large.'
    ],
    faq: [
      ['Can I edit a preset?', 'Yes. The preset only sets the initial values; all controls remain editable.'],
      ['Does the example output update if I change the tool?', 'The below-page example describes the preset default; the live tool output updates immediately in the workspace.'],
      ['Should I canonicalize a preset to the main tool?', 'No. A preset has its own canonical URL when it serves a specific size task.']
    ],
    links: [
      { label: 'All presets', href: '/presets' },
      { label: 'All guides', href: '/guides' },
      { label: 'Main circle generator', href: '/minecraft-circle-generator' }
    ],
    intentLinks: [
      { label: 'Browse all circle presets', href: '/presets', description: 'Compare nearby diameters before choosing a final build size.' },
      { label: 'Main circle generator', href: '/minecraft-circle-generator', description: 'Switch from a preset to a blank editable circle workspace.' },
      { label: 'Blueprint export guide', href: '/guides/minecraft-blueprint-csv-export', description: 'Decide when to use PNG, SVG, CSV, or print output.' },
      { label: 'Block count planning', href: '/minecraft-block-count-calculator', description: 'Use totals, stacks, and shulker-style estimates before collecting materials.' }
    ]
  }
};

packages['layered-sphere'].faq = packages.sphere.faq;
packages['dome-blueprint'].faq = packages.dome.faq;

export function contentKeyForShape(shape: ShapeKind): ToolContentKey {
  if (shape === 'ellipse') return 'oval';
  return shape;
}

export function getToolContentPackage(key: ToolContentKey | undefined, shape: ShapeKind): ToolContentPackage {
  return packages[key || contentKeyForShape(shape)] || packages.home;
}
