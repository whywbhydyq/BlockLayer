import type { Metadata } from 'next';
import { JsonLd } from '@/components/content/JsonLd';
import { ToolShell } from '@/components/tool/ToolShell';
import { softwareApplicationSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Minecraft Oval Blueprint Builder',
  description: 'Build Minecraft-style oval and ellipse blueprints with row segments, center guides, block counts, PNG export, print output, and share links.',
  alternates: { canonical: '/minecraft-oval-generator' }
};

export default function Page() {
  return (
    <main id="main" className="builder-page">
      <JsonLd data={softwareApplicationSchema({ path: '/minecraft-oval-generator', shape: 'ellipse', title: 'Minecraft Oval Blueprint Builder', heading: 'Minecraft Oval Blueprint Builder', description: metadata.description as string })} />
      <ToolShell title="Minecraft Oval Blueprint Builder" initialShape="ellipse" initialWidth={31} initialHeight={21} />
    </main>
  );
}
