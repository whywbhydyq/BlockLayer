import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { DisclosureBox } from '@/components/content/DisclosureBox';
import { JsonLd } from '@/components/content/JsonLd';
import { RelatedGuides } from '@/components/content/RelatedGuides';
import { RelatedTools } from '@/components/content/RelatedTools';
import { guidePages } from '@/lib/seo/pages';
import { guideSchema } from '@/lib/seo/schema';

export function generateStaticParams() {
  return guidePages.map((guide) => ({ slug: guide.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const guide = guidePages.find((item) => item.slug === params.slug);
  if (!guide) return {};
  return { title: guide.title, description: guide.description, alternates: { canonical: guide.path } };
}

export default function Page({ params }: { params: { slug: string } }) {
  const guide = guidePages.find((item) => item.slug === params.slug);
  if (!guide) notFound();
  return <main id="main" className="page-wrap"><JsonLd data={guideSchema(guide)} /><Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Guides', path: '/guides/diameter-vs-radius-in-minecraft-circles' }, { name: guide.heading, path: guide.path }]} /><section className="hero"><span className="eyebrow">Building guide</span><h1>{guide.heading}</h1><p>{guide.description}</p></section><DisclosureBox /><section className="content-card"><h2>Practical notes</h2>{guide.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<p><Link href={guide.link}>{guide.linkLabel}</Link></p></section><RelatedTools /><RelatedGuides currentPath={guide.path} /></main>;
}
