import type { Metadata } from 'next';
import { JsonLd } from '@/components/content/JsonLd';
import { ToolShell } from '@/components/tool/ToolShell';
import { softwareApplicationSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Minecraft Circle & Oval Blueprint Builder',
  description: 'Build block-by-block Minecraft-style circle and oval blueprints with row segments, center guides, block counts, PNG export, print output, and share links.',
  alternates: { canonical: '/' }
};

export default function HomePage() {
  return (
    <main id="main" className="builder-page">
      <JsonLd data={softwareApplicationSchema({ path: '/', shape: 'circle', title: 'Minecraft Circle & Oval Blueprint Builder', heading: 'Minecraft Circle & Oval Blueprint Builder', description: metadata.description as string })} />
      <ToolShell title="Minecraft Circle & Oval Blueprint Builder" initialShape="circle" />
    </main>
  );
}
