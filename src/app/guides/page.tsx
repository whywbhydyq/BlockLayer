import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/content/JsonLd';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { guidePages } from '@/lib/seo/pages';
import { itemListSchema, websiteSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Minecraft Blueprint Guides - Circles, Ovals, Spheres & Domes',
  description:
    'Read practical BlockLayer guides for building Minecraft circles, ovals, spheres, domes, CSV exports, print output, and block counts.',
  alternates: { canonical: '/guides' }
};

export default function Page() {
  return (
    <main id="main" className="page-wrap guides-index-page">
      <Breadcrumbs items={[{ name: 'Guides', path: '/guides' }]} />
      <JsonLd data={websiteSchema()} />
      <JsonLd
        data={itemListSchema(
          'Minecraft Blueprint Guides',
          'BlockLayer guides for using Minecraft blueprint generators, exports, print output, centers, and block counts.',
          guidePages.map((guide) => ({ name: guide.heading, path: guide.path }))
        )}
      />
      <section className="hero">
        <span className="eyebrow">Minecraft blueprint guides</span>
        <h1>Minecraft Blueprint Guides</h1>
        <p>
          Use these guides after opening the builder: set the correct center, read row segments, build layers, export CSV, print selected
          ranges, and collect the right amount of blocks.
        </p>
      </section>

      <section className="content-card guide-index-section" aria-labelledby="guide-index-heading">
        <h2 id="guide-index-heading">All guides</h2>
        <ul className="guide-index-list">
          {guidePages.map((guide) => (
            <li key={guide.slug}>
              <Link href={guide.path}>{guide.heading}</Link>
              <p>{guide.description}</p>
              <Link href={guide.link}>{guide.linkLabel}</Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
