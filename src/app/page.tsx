import { AdSlot } from '@/components/layout/AdSlot';
import { DisclosureBox } from '@/components/content/DisclosureBox';
import { FAQ } from '@/components/content/FAQ';
import { JsonLd } from '@/components/content/JsonLd';
import { RelatedGuides } from '@/components/content/RelatedGuides';
import { PresetCards } from '@/components/content/PresetCards';
import { ExplanationBlock } from '@/components/content/ExplanationBlock';
import { RelatedTools } from '@/components/content/RelatedTools';
import { ToolShell } from '@/components/tool/ToolShell';
import { SHORT_DISCLAIMER } from '@/lib/compliance/minecraftDisclaimer';
import { softwareApplicationSchema } from '@/lib/seo/schema';

export default function HomePage() {
  return <main id="main" className="page-wrap"><JsonLd data={softwareApplicationSchema()} /><section className="hero"><span className="eyebrow">Free printable blueprint generator</span><h1>Minecraft Circle, Sphere & Dome Generator</h1><p>Generate block-by-block blueprints for circles, ellipses, spheres, domes, and material counts. Use pan, zoom, layer sliders, PNG/SVG/CSV export, and print-friendly layouts while you build.</p><p className="small-note">{SHORT_DISCLAIMER}</p></section><DisclosureBox /><ToolShell title="BlockLayer Blueprint Generator" /><AdSlot /><aside className="desktop-sidebar-ad"><AdSlot label="Advertisement in desktop sidebar" /></aside><ExplanationBlock /><RelatedTools /><section className="content-card"><h2>Popular presets</h2><PresetCards limit={10} /></section><RelatedGuides /><AdSlot label="Advertisement in FAQ area" /><FAQ /></main>;
}
