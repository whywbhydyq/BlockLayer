import type { Metadata } from 'next';
import { JsonLd } from '@/components/content/JsonLd';
import { ToolShell } from '@/components/tool/ToolShell';
import { softwareApplicationSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Minecraft Sphere Generator - Layer Blueprint Calculator',
  description:
    'Use a Minecraft sphere generator and calculator for hollow or solid layer blueprints with row segments, block counts, CSV, print, and share links.',
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
