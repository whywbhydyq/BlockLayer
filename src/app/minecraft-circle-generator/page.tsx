import type { Metadata } from 'next';
import { JsonLd } from '@/components/content/JsonLd';
import { ToolShell } from '@/components/tool/ToolShell';
import { softwareApplicationSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Minecraft Circle Blueprint Builder',
  description: 'Build Minecraft-style circle blueprints with center guides, row segments, block counts, PNG export, print output, and share links.',
  alternates: { canonical: '/minecraft-circle-generator' }
};

export default function Page() {
  return (
    <main id="main" className="builder-page">
      <JsonLd data={softwareApplicationSchema({ path: '/minecraft-circle-generator', shape: 'circle', title: 'Minecraft Circle Blueprint Builder', heading: 'Minecraft Circle Blueprint Builder', description: metadata.description as string })} />
      <ToolShell title="Minecraft Circle Blueprint Builder" initialShape="circle" />
    </main>
  );
}
