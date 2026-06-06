import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/content/JsonLd';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { pageMetadata } from '@/lib/seo/metadata';
import { SITE_AUTHOR, SITE_UPDATED_DATE, guidePages } from '@/lib/seo/pages';
import { guideSchema } from '@/lib/seo/schema';

export function generateStaticParams() {
  return guidePages.map((page) => ({ slug: page.slug }));
}

type GuideSupportContent = {
  useCases: string[];
  fieldChecks: string[];
  exportAdvice: string[];
};

const guideSupportContent: Record<string, GuideSupportContent> = {
  'how-to-build-a-circle-in-minecraft': {
    useCases: [
      'Use this guide for tower bases, arenas, fountains, farms, walls, circular floors, and any build where the outside diameter matters more than a decorative screenshot.',
      'It is most useful when you need to hand-copy rows in survival mode, because every Z row can be counted from the marked center instead of estimated from an image.',
      'For very large circles, pair the guide with CSV export so the row ranges remain readable after the preview is zoomed out.'
    ],
    fieldChecks: [
      'Confirm that the value you entered is the full outside diameter, not the radius from center to edge.',
      'Place the center marker and axis lines first; the longest rows should cross the axis symmetrically.',
      'After building one quadrant, mirror it and compare the row lengths before filling corners or adding wall height.'
    ],
    exportAdvice: [
      'Use PNG when you need a quick visual reference and CSV when exact row ranges matter.',
      'Use SVG for scalable print layouts when the circle is too large for a single raster screenshot.',
      'Copy the share link only after finalizing diameter, center type, outline/fill mode, and thickness.'
    ]
  },
  'odd-even-minecraft-circle-centers': {
    useCases: [
      'Use this guide before starting any even diameter circle, mixed-parity oval, or symmetrical base where the midpoint is not a single block.',
      'It helps prevent one-block drift, which usually appears only after several mirrored rows have already been placed.',
      'The guide is also useful when adapting a blueprint to a road, wall, or floor that must line up with an existing even-width structure.'
    ],
    fieldChecks: [
      'Check width and height separately; a mixed odd/even oval has one centered axis and one between-block axis.',
      'For even-even footprints, mark the 2×2 center area before placing the first row segment.',
      'When a row table looks correct but the build feels offset, recheck center parity before changing the diameter.'
    ],
    exportAdvice: [
      'Print the center guide with row labels enabled when multiple builders are placing mirrored sides.',
      'Use a share link to preserve the exact parity case when asking someone else to review the layout.',
      'Export CSV if you need to compare row symmetry across odd and even candidate sizes.'
    ]
  },
  'how-to-build-an-oval-in-minecraft': {
    useCases: [
      'Use this guide for stadiums, racetracks, paths, flattened portals, farms, platforms, and builds where width and height must be controlled independently.',
      'It is better than forcing a circle when the site footprint is rectangular or when one axis must fit between existing structures.',
      'The guide is especially useful for mixed odd/even ovals, where only one axis uses a between-block center line.'
    ],
    fieldChecks: [
      'Write down the intended width and height before rotating the blueprint, because swapping axes changes the build footprint.',
      'Mark the long axis first, then verify that the widest row appears where the preview says it should.',
      'Before filling an oval floor, complete the outline and inspect both ends for symmetry.'
    ],
    exportAdvice: [
      'Use CSV for ovals wider than the visible screen so each row segment remains exact.',
      'Use SVG when the blueprint needs to be scaled for printing without blurring row boundaries.',
      'Copy the row list when building from a second device where downloading files is inconvenient.'
    ]
  },
  'how-to-build-a-sphere-in-minecraft': {
    useCases: [
      'Use this guide for planets, glass shells, domes that later become full spheres, ornaments, floating bases, and any 3D build that must stay symmetrical across layers.',
      'It is most useful when the sphere is too large to build from memory and each Y layer needs its own row table.',
      'Use hollow mode for visible shells and solid mode primarily when estimating material mass or planning filled cores.'
    ],
    fieldChecks: [
      'Confirm build direction before printing so layer 1 in your notes matches the level you start from in game.',
      'After each layer, compare the previous-layer ghost to catch accidental one-block shifts before stacking higher.',
      'Recheck shell thickness before collecting materials because thicker hollow shells can change totals significantly.'
    ],
    exportAdvice: [
      'Use selected-layer CSV to split large spheres into build sessions instead of exporting every layer repeatedly.',
      'Print only the active layer range when working from paper near the build site.',
      'Keep one share link for the final sphere settings so later material checks use the same diameter and mode.'
    ]
  },
  'how-to-build-a-dome-in-minecraft': {
    useCases: [
      'Use this guide for roofs, observatories, glass caps, half-spheres, arena covers, underwater bases, and builds where only part of a sphere is needed.',
      'It is useful when cap height matters, because a shallow dome and a hemisphere can have very different layer counts and material totals.',
      'Use top-half or bottom-half selection consistently so printed layers match the direction you plan to build.'
    ],
    fieldChecks: [
      'Confirm the cap height before exporting; the dome should stop at the intended Y level rather than defaulting to a full hemisphere.',
      'Inspect the first and last layers in the slider to verify that the opening and top ring match the build plan.',
      'When using glass or rare blocks, compare hollow and solid totals before collecting materials.'
    ],
    exportAdvice: [
      'Use selected-range print for the layers you are building in the current session.',
      'Use CSV when a dome is large enough that row lists exceed a single comfortable print sheet.',
      'Use SVG for design review when the dome outline needs to stay sharp at different zoom levels.'
    ]
  },
  'minecraft-blueprint-csv-export': {
    useCases: [
      'Use this guide when the on-screen table is too long, when multiple builders need the same row data, or when a project needs material checks outside the browser.',
      'CSV is the safest export for layered spheres and domes because layer, Y, Z, and X range fields stay explicit.',
      'It is also useful for comparing several candidate sizes before choosing the one with the best block count.'
    ],
    fieldChecks: [
      'Regenerate the CSV after every size, mode, shell thickness, cap height, or layer range change.',
      'Keep the row segment column visible when opening the file in a spreadsheet so placement instructions are not hidden.',
      'For 3D shapes, confirm whether the file covers all layers, the current layer, or a selected layer range.'
    ],
    exportAdvice: [
      'Use CSV for exact build data and PNG/SVG for visual confirmation.',
      'Name saved files with the shape, size, and mode so older exports are not confused with newer settings.',
      'When sharing CSV with another builder, include the page URL or share link so the geometry can be reproduced.'
    ]
  },
  'minecraft-blueprint-printing': {
    useCases: [
      'Use this guide when you want a paper reference, a high-contrast grid, or a selected range of layers beside you while building.',
      'It is most useful for survival sessions where switching apps repeatedly is inconvenient or where multiple people need the same layer instructions.',
      'For very large blueprints, printing should be treated as a session aid; CSV or SVG is often better for complete archival output.'
    ],
    fieldChecks: [
      'Fit the canvas before printing and verify that the visible sheet contains the intended rows or layers.',
      'Turn on high contrast when the default grid lines are too faint for the printer or paper quality.',
      'For 3D shapes, double-check selected layer range before opening the browser print dialog.'
    ],
    exportAdvice: [
      'Print current layer or selected range instead of all layers when the blueprint is large.',
      'Use SVG when scaling a complete layout is more important than printing the live canvas view.',
      'Use CSV as the fallback when a browser print preview clips row tables or page breaks awkwardly.'
    ]
  },
  'minecraft-block-counts-stacks-shulkers': {
    useCases: [
      'Use this guide before collecting materials for large outlines, filled floors, hollow shells, solid spheres, and dome caps with rare or expensive blocks.',
      'It helps translate blueprint totals into the way Minecraft inventory is actually managed: stacks of 64, leftovers, rounded stacks, and shulker-style estimates.',
      'The guide is useful when deciding whether a design should stay hollow, become filled, or be split into layer-based collection sessions.'
    ],
    fieldChecks: [
      'Confirm the selected build mode before trusting a total; outline, filled, hollow, and solid counts are not interchangeable.',
      'Recheck totals after any diameter, width, height, thickness, shell thickness, dome half, or cap height change.',
      'For layered builds, compare total blocks with current-layer counts so the first session does not require all materials at once.'
    ],
    exportAdvice: [
      'Use CSV to group material needs by layer for large spheres and domes.',
      'Copy the summary when only the total stacks and remainder matter.',
      'Keep the share link with your material note so future edits are made from the same blueprint state.'
    ]
  }
};

function findGuide(slug: string) {
  return guidePages.find((page) => page.slug === slug);
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = findGuide(params.slug);
  if (!page) return {};

  return {
    ...pageMetadata(page.title, page.description, page.path, 'article'),
    authors: [{ name: SITE_AUTHOR }],
    other: { 'article:modified_time': page.updatedAt || SITE_UPDATED_DATE }
  };
}

function relatedGuides(slug: string) {
  return guidePages.filter((page) => page.slug !== slug).slice(0, 4);
}

export default function Page({ params }: { params: { slug: string } }) {
  const page = findGuide(params.slug);
  if (!page) notFound();
  const related = relatedGuides(page.slug);
  const support = guideSupportContent[page.slug];

  return (
    <main id="main" className="page-wrap guide-page">
      <Breadcrumbs
        items={[
          { name: 'Guides', path: '/guides' },
          { name: page.heading, path: page.path }
        ]}
      />
      <JsonLd data={guideSchema(page)} />
      <section className="hero">
        <span className="eyebrow">Minecraft blueprint guide</span>
        <h1>{page.heading}</h1>
        <p>{page.description}</p>
        <p className="small-note">
          Updated <time dateTime={page.updatedAt || SITE_UPDATED_DATE}>{page.updatedAt || SITE_UPDATED_DATE}</time> by {SITE_AUTHOR}.
        </p>
        <div className="guide-actions">
          <Link href={page.link}>{page.linkLabel}</Link>
          <Link href="/minecraft-circle-generator">Circle tool</Link>
          <Link href="/minecraft-sphere-generator">Sphere tool</Link>
          <Link href="/minecraft-dome-generator">Dome tool</Link>
        </div>
      </section>

      <section className="content-card guide-card guide-answer-card" aria-labelledby="guide-answer-heading">
        <h2 id="guide-answer-heading">Quick answer</h2>
        <p>{page.quickAnswer}</p>
        {page.steps?.[0] && <p className="small-note">First step: {page.steps[0]}</p>}
        <nav aria-label="Guide sections" className="guide-section-links">
          <a href="#guide-workflow-heading">Workflow</a>
          {support && <a href="#guide-use-cases-heading">Best fit</a>}
          {support && <a href="#guide-field-checks-heading">Checks</a>}
          {support && <a href="#guide-export-advice-heading">Exports</a>}
          <a href="#guide-mistakes-heading">Mistakes</a>
          <a href="#guide-related-heading">Related guides</a>
        </nav>
      </section>

      <section className="content-card guide-card" aria-labelledby="guide-workflow-heading">
        <h2 id="guide-workflow-heading">Recommended workflow</h2>
        {page.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <ol>
          {(page.steps?.length
            ? page.steps
            : [
                'Open the relevant generator with the button above.',
                'Enter the full diameter or width × height before collecting materials.',
                'Check the center guide first, especially for even or mixed odd/even footprints.',
                'Copy the row list or export PNG, SVG, CSV, or print output for the build session.'
              ]
          ).map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      {support && (
        <>
          <section className="content-card guide-card" aria-labelledby="guide-use-cases-heading">
            <h2 id="guide-use-cases-heading">When this guide is the right fit</h2>
            <ul>
              {support.useCases.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="content-card guide-card" aria-labelledby="guide-field-checks-heading">
            <h2 id="guide-field-checks-heading">Build-session checks</h2>
            <ul>
              {support.fieldChecks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="content-card guide-card" aria-labelledby="guide-export-advice-heading">
            <h2 id="guide-export-advice-heading">Export and verification advice</h2>
            <ul>
              {support.exportAdvice.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </>
      )}

      <section className="content-card guide-card" aria-labelledby="guide-mistakes-heading">
        <h2 id="guide-mistakes-heading">Common mistakes to avoid</h2>
        <ul>
          <li>Using radius when the tool or guide expects full diameter.</li>
          <li>Building from one corner instead of marking the center and X/Z axes first.</li>
          <li>Ignoring the difference between outline, filled, hollow, and solid modes.</li>
          <li>For large blueprints, relying on one screenshot instead of row segments or CSV.</li>
        </ul>
        <p>
          BlockLayer is an independent planning helper. Recheck unusual builds in your own world or server rules before committing rare
          materials.
        </p>
      </section>

      <section className="content-card guide-card" aria-labelledby="guide-related-heading">
        <h2 id="guide-related-heading">Related blueprint guides</h2>
        <div className="guide-actions">
          {related.map((item) => (
            <Link key={item.slug} href={item.path}>
              {item.heading}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
