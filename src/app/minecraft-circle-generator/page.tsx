import type { Metadata } from 'next';
import { JsonLd } from '@/components/content/JsonLd';
import { ToolShell } from '@/components/tool/ToolShell';
import { softwareApplicationSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Minecraft Circle Generator - Row Blueprint Tool',
  description:
    'Generate a Minecraft circle blueprint from diameter or radius with row segments, center guides, block counts, PNG/SVG/CSV export, print, and share links.',
  alternates: { canonical: '/minecraft-circle-generator' }
};

export default function Page() {
  return (
    <main id="main" className="builder-page">
      <JsonLd
        data={softwareApplicationSchema({
          path: '/minecraft-circle-generator',
          shape: 'circle',
          title: 'Minecraft Circle Generator',
          heading: 'Minecraft Circle Generator',
          description: metadata.description as string
        })}
      />
      <ToolShell title="Minecraft Circle Generator" initialShape="circle" contentKey="circle" />
    </main>
  );
}
