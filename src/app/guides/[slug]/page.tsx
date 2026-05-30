import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/content/JsonLd';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { guidePages } from '@/lib/seo/pages';
import { guideSchema } from '@/lib/seo/schema';

export function generateStaticParams() {
  return guidePages.map((page) => ({ slug: page.slug }));
}

function findGuide(slug: string) {
  return guidePages.find((page) => page.slug === slug);
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = findGuide(params.slug);
  if (!page) return {};
  return { title: page.title, description: page.description, alternates: { canonical: page.path } };
}

function relatedGuides(slug: string) {
  return guidePages.filter((page) => page.slug !== slug).slice(0, 4);
}

export default function Page({ params }: { params: { slug: string } }) {
  const page = findGuide(params.slug);
  if (!page) notFound();
  const related = relatedGuides(page.slug);

  return (
    <main id="main" className="page-wrap guide-page">
      <Breadcrumbs items={[{ name: 'Guides', path: '/guides' }, { name: page.heading, path: page.path }]} />
      <JsonLd data={guideSchema(page)} />
      <section className="hero">
        <span className="eyebrow">Minecraft blueprint guide</span>
        <h1>{page.heading}</h1>
        <p>{page.description}</p>
        <div className="guide-actions">
          <Link href={page.link}>{page.linkLabel}</Link>
          <Link href="/minecraft-circle-generator">Circle tool</Link>
          <Link href="/minecraft-sphere-generator">Sphere tool</Link>
          <Link href="/minecraft-dome-generator">Dome tool</Link>
        </div>
      </section>

      <section className="content-card guide-card" aria-labelledby="guide-workflow-heading">
        <h2 id="guide-workflow-heading">Recommended workflow</h2>
        {page.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <ol>
          {(page.steps?.length ? page.steps : [
            'Open the relevant generator with the button above.',
            'Enter the full diameter or width × height before collecting materials.',
            'Check the center guide first, especially for even or mixed odd/even footprints.',
            'Copy the row list or export PNG, SVG, CSV, or print output for the build session.'
          ]).map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

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
