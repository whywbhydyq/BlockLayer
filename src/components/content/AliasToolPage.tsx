import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { DisclosureBox } from '@/components/content/DisclosureBox';
import { JsonLd } from '@/components/content/JsonLd';
import { RelatedGuides } from '@/components/content/RelatedGuides';
import { RelatedTools } from '@/components/content/RelatedTools';
import { ToolShell } from '@/components/tool/ToolShell';
import type { ShapeKind } from '@/lib/geometry';
import { SHORT_DISCLAIMER } from '@/lib/compliance/minecraftDisclaimer';
import { softwareApplicationSchema } from '@/lib/seo/schema';
import { AdSlot } from '@/components/layout/AdSlot';

type AliasToolPageProps = {
  eyebrow: string;
  heading: string;
  description: string;
  shape: ShapeKind;
  diameter?: number;
  initialDiameter?: number;
  initialWidth?: number;
  initialHeight?: number;
  path?: string;
};

export function AliasToolPage({ eyebrow, heading, description, shape, diameter, initialDiameter, initialWidth, initialHeight, path }: AliasToolPageProps) {
  const resolvedDiameter = diameter ?? initialDiameter;
  const canonicalPath = path || `/${heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
  return <main id="main" className="page-wrap with-sidebar"><JsonLd data={softwareApplicationSchema({ path: canonicalPath, shape, title: heading, heading, description, diameter: resolvedDiameter })} /><Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: heading, path: canonicalPath }]} /><section className="hero"><span className="eyebrow">{eyebrow}</span><h1>{heading}</h1><p>{description}</p><p className="small-note">{SHORT_DISCLAIMER}</p></section><DisclosureBox /><ToolShell initialShape={shape} initialDiameter={resolvedDiameter} initialWidth={initialWidth} initialHeight={initialHeight} title={heading} /><aside className="desktop-sidebar-ad"><AdSlot label="Advertisement in desktop sidebar" /></aside><RelatedTools /><RelatedGuides /></main>;
}
