import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/content/JsonLd';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ToolShell } from '@/components/tool/ToolShell';
import { generateCircle, generateDome, generateEllipse, generateSphere, type BlueprintResult, type LayeredResult } from '@/lib/geometry';
import { presetPages, type PresetConfig } from '@/lib/seo/pages';
import { softwareApplicationSchema } from '@/lib/seo/schema';

export function generateStaticParams() {
  return presetPages.map((page) => ({ slug: page.slug }));
}

function findPreset(slug: string) {
  return presetPages.find((page) => page.slug === slug);
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = findPreset(params.slug);
  if (!page) return {};
  return { title: page.title, description: page.description, alternates: { canonical: page.path } };
}

function presetResult(page: PresetConfig): BlueprintResult {
  const diameter = page.diameter || 31;
  if (page.shape === 'ellipse') {
    return generateEllipse({ width: page.width || 31, height: page.height || 21, fillMode: 'outline', thickness: 1 });
  }
  if (page.shape === 'sphere') {
    return generateSphere({
      inputMode: 'diameter',
      diameter,
      radius: Math.floor(diameter / 2),
      mode: 'hollow',
      shellThickness: 1,
      buildDirection: 'bottom-up'
    });
  }
  if (page.shape === 'dome') {
    return generateDome({
      inputMode: 'diameter',
      diameter,
      radius: Math.floor(diameter / 2),
      mode: 'hollow',
      shellThickness: 1,
      buildDirection: 'bottom-up',
      capHeight: Math.ceil(diameter / 2),
      half: 'top'
    });
  }
  return generateCircle({ inputMode: 'diameter', diameter, radius: Math.floor(diameter / 2), fillMode: 'outline', thickness: 1 });
}

function isLayered(result: BlueprintResult): result is LayeredResult {
  return result.shape === 'sphere' || result.shape === 'dome';
}

function shapeName(shape: PresetConfig['shape']) {
  if (shape === 'ellipse') return 'oval';
  return shape;
}

function inputSummary(page: PresetConfig) {
  if (page.shape === 'ellipse') return `${page.width} × ${page.height} blocks`;
  return `${page.diameter} block diameter`;
}

function relatedPresets(page: PresetConfig) {
  return presetPages.filter((candidate) => candidate.slug !== page.slug && candidate.shape === page.shape).slice(0, 4);
}

export default function Page({ params }: { params: { slug: string } }) {
  const page = findPreset(params.slug);
  if (!page) notFound();
  const result = presetResult(page);
  const layered = isLayered(result);
  const related = relatedPresets(page);

  return (
    <main id="main" className="builder-page">
      <Breadcrumbs items={[{ name: 'Presets', path: '/presets' }, { name: page.heading, path: page.path }]} />
      <JsonLd data={softwareApplicationSchema(page)} />
      <ToolShell
        title={page.heading}
        initialShape={page.shape}
        initialDiameter={page.diameter}
        initialWidth={page.width}
        initialHeight={page.height}
        contentKey="preset"
      />

      <section className="content-card preset-detail-card" aria-labelledby="preset-details-heading">
        <h2 id="preset-details-heading">Preset details for this {shapeName(page.shape)} blueprint</h2>
        <p>
          This page opens the same BlockLayer builder with a preset already loaded. Use it as a starting point, then change the size, build
          mode, layer options, or exports without leaving the page.
        </p>

        <div className="preset-detail-grid">
          <div className="preset-facts">
            <h3>Preset inputs</h3>
            <dl>
              <dt>Shape</dt>
              <dd>{shapeName(page.shape)}</dd>
              <dt>Size</dt>
              <dd>{inputSummary(page)}</dd>
              <dt>Default mode</dt>
              <dd>{layered ? 'Hollow shell, bottom-up layers' : 'Outline, 1-block thickness'}</dd>
              <dt>Exports</dt>
              <dd>Copy rows, PNG, SVG, CSV, print, and share link</dd>
            </dl>
          </div>

          <div className="preset-facts">
            <h3>Example output</h3>
            <dl>
              <dt>Total blocks</dt>
              <dd>{result.totalBlocks.toLocaleString()}</dd>
              <dt>Stacks</dt>
              <dd>
                {result.stacks.fullStacks} stacks{result.stacks.remainder ? ` + ${result.stacks.remainder} blocks` : ''}
              </dd>
              <dt>{layered ? 'Layers' : 'Rows'}</dt>
              <dd>{layered ? `${result.layerCount} layers` : `${result.rows.length} rows`}</dd>
              <dt>Center</dt>
              <dd>{result.centerType === 'single-block' ? 'single center block' : 'between blocks / center line'}</dd>
            </dl>
          </div>

          <div className="preset-mistakes">
            <h3>Common mistakes</h3>
            <ul>
              <li>Mixing up diameter and radius before copying the row list.</li>
              <li>Starting an even footprint from one block instead of marking the center line or 2×2 center area.</li>
              <li>Changing outline, filled, hollow, or solid mode after collecting materials without rechecking block count.</li>
              <li>Forgetting that spheres and domes should be built one layer at a time.</li>
            </ul>
          </div>

          <div className="related-presets">
            <h3>Related presets</h3>
            <ul>
              {related.map((item) => (
                <li key={item.slug}>
                  <Link href={item.path}>{item.heading}</Link>
                </li>
              ))}
              <li>
                <Link
                  href={
                    page.shape === 'ellipse'
                      ? '/minecraft-oval-generator'
                      : page.shape === 'sphere'
                        ? '/minecraft-sphere-generator'
                        : page.shape === 'dome'
                          ? '/minecraft-dome-generator'
                          : '/minecraft-circle-generator'
                  }
                >
                  Open the main {shapeName(page.shape)} generator
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
