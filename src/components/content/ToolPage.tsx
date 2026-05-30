import { AdSlot } from '@/components/layout/AdSlot';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { DisclosureBox } from '@/components/content/DisclosureBox';
import { FAQ } from '@/components/content/FAQ';
import { JsonLd } from '@/components/content/JsonLd';
import { RelatedGuides } from '@/components/content/RelatedGuides';
import { ExplanationBlock } from '@/components/content/ExplanationBlock';
import { RelatedTools } from '@/components/content/RelatedTools';
import { ToolShell } from '@/components/tool/ToolShell';
import type { ToolPageConfig } from '@/lib/seo/pages';
import { softwareApplicationSchema } from '@/lib/seo/schema';

export function ToolPage({ page }: { page: ToolPageConfig }) {
  return <main id="main" className="page-wrap"><JsonLd data={softwareApplicationSchema(page)} /><Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: page.heading, path: page.path }]} /><section className="hero"><span className="eyebrow">Tool</span><h1>{page.heading}</h1><p>{page.description}</p></section><DisclosureBox /><ToolShell initialShape={page.shape} initialDiameter={page.diameter} title={page.heading} /><AdSlot /><aside className="desktop-sidebar-ad"><AdSlot label="Advertisement in desktop sidebar" /></aside><ExplanationBlock /><section className="content-card"><h2>How this tool helps</h2><p>Use the grid while building, copy the row or layer data, and export a PNG, SVG, CSV, or print view for offline reference. The blueprint and tables are generated from the same geometry result, so counts and row segments stay synchronized.</p></section><RelatedTools currentPath={page.path} /><RelatedGuides /><AdSlot label="Advertisement in FAQ area" /><FAQ /></main>;
}
