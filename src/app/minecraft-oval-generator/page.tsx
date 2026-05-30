import type { Metadata } from 'next';
import { JsonLd } from '@/components/content/JsonLd';
import { ToolShell } from '@/components/tool/ToolShell';
import { softwareApplicationSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Minecraft Oval Generator - Width × Height Blueprint',
  description:
    'Generate oval and ellipse blueprints by width and height with row segments, center guides, block counts, PNG/SVG/CSV export, print output, and share links.',
  alternates: { canonical: '/minecraft-oval-generator' }
};

export default function Page() {
  return (
    <main id="main" className="builder-page">
      <JsonLd
        data={softwareApplicationSchema({
          path: '/minecraft-oval-generator',
          shape: 'ellipse',
          title: 'Minecraft Oval Generator',
          heading: 'Minecraft Oval Generator',
          description: metadata.description as string
        })}
      />
      <ToolShell title="Minecraft Oval Generator" initialShape="ellipse" initialWidth={31} initialHeight={21} contentKey="oval" />
    </main>
  );
}
