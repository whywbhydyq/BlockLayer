import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/content/JsonLd';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { presetPages } from '@/lib/seo/pages';
import { itemListSchema, websiteSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Minecraft Blueprint Presets - Circles, Ovals, Spheres & Domes',
  description:
    'Open ready-made Minecraft blueprint presets for common circle diameters, oval sizes, sphere layers, and dome builds with rows, counts, exports, and print output.',
  alternates: { canonical: '/presets' }
};

const groups = [
  { id: 'circle', title: 'Circle presets', description: 'Common diameters for walls, towers, arenas, and circular floors.' },
  { id: 'ellipse', title: 'Oval presets', description: 'Width × height presets for arenas, paths, platforms, and elliptical builds.' },
  { id: 'sphere', title: 'Sphere presets', description: 'Layer-by-layer hollow sphere presets for shells and planet-style builds.' },
  { id: 'dome', title: 'Dome presets', description: 'Cap and hemisphere presets for roofs, glass domes, and observatories.' }
] as const;

export default function Page() {
  return (
    <main id="main" className="page-wrap presets-index-page">
      <Breadcrumbs items={[{ name: 'Presets', path: '/presets' }]} />
      <JsonLd data={websiteSchema()} />
      <JsonLd
        data={itemListSchema(
          'Minecraft Blueprint Presets',
          'Ready-made BlockLayer presets for common Minecraft circle, oval, sphere, and dome blueprints.',
          presetPages.map((page) => ({ name: page.heading, path: page.path }))
        )}
      />
      <section className="hero">
        <span className="eyebrow">Minecraft blueprint presets</span>
        <h1>Minecraft Blueprint Presets</h1>
        <p>
          Start from common circle diameters, oval footprints, sphere layers, and dome sizes. Each preset opens the live BlockLayer
          builder with row segments, block counts, PNG/SVG/CSV exports, print output, and share links.
        </p>
      </section>

      {groups.map((group) => {
        const items = presetPages.filter((page) => page.shape === group.id);
        return (
          <section key={group.id} className="content-card preset-index-section" aria-labelledby={`${group.id}-presets-heading`}>
            <h2 id={`${group.id}-presets-heading`}>{group.title}</h2>
            <p>{group.description}</p>
            <ul className="preset-index-list">
              {items.map((page) => (
                <li key={page.slug}>
                  <Link href={page.path}>{page.heading}</Link>
                  <span>{page.description}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
