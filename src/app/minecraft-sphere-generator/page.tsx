import type { Metadata } from 'next';
import { JsonLd } from '@/components/content/JsonLd';
import { ToolShell } from '@/components/tool/ToolShell';
import { softwareApplicationSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Minecraft Sphere Generator - Layer-by-Layer Blueprint',
  description:
    'Generate hollow or solid Minecraft spheres layer by layer with row segments, current-layer preview, block counts, PNG/SVG/CSV export, selected-layer print output, and share links.',
  alternates: { canonical: '/minecraft-sphere-generator' }
};

export default function Page() {
  return (
    <main id="main" className="builder-page">
      <JsonLd
        data={softwareApplicationSchema({
          path: '/minecraft-sphere-generator',
          shape: 'sphere',
          title: 'Minecraft Sphere Generator',
          heading: 'Minecraft Sphere Generator',
          description: metadata.description as string
        })}
      />
      <ToolShell title="Minecraft Sphere Generator" initialShape="sphere" initialDiameter={31} contentKey="sphere" />
    </main>
  );
}
