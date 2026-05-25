import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { DisclosureBox } from '@/components/content/DisclosureBox';
import { JsonLd } from '@/components/content/JsonLd';
import { RelatedGuides } from '@/components/content/RelatedGuides';
import { RelatedTools } from '@/components/content/RelatedTools';
import { ToolShell } from '@/components/tool/ToolShell';
import { presetPages } from '@/lib/seo/pages';
import { softwareApplicationSchema } from '@/lib/seo/schema';

export function generateStaticParams() {
  return presetPages.map((preset) => ({ slug: preset.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const preset = presetPages.find((item) => item.slug === params.slug);
  if (!preset) return {};
  return { title: preset.title, description: preset.description, alternates: { canonical: preset.path } };
}

export default function Page({ params }: { params: { slug: string } }) {
  const preset = presetPages.find((item) => item.slug === params.slug);
  if (!preset) notFound();
  return <main id="main" className="page-wrap"><JsonLd data={softwareApplicationSchema(preset)} /><Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Presets', path: '/presets/minecraft-circle-generator-32' }, { name: preset.heading, path: preset.path }]} /><section className="hero"><span className="eyebrow">Preset blueprint</span><h1>{preset.heading}</h1><p>{preset.description}</p></section><DisclosureBox /><ToolShell initialShape={preset.shape} initialDiameter={preset.diameter} initialWidth={preset.width} initialHeight={preset.height} title={preset.heading} /><section className="content-card"><h2>Preset notes</h2><p>This page opens the generator with preset dimensions, but every value remains editable. Export the current view as PNG, SVG, CSV, print, or copy a share link.</p></section><RelatedTools /><RelatedGuides /></main>;
}
