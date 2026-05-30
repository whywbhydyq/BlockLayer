import type { Metadata } from 'next';
import { JsonLd } from '@/components/content/JsonLd';
import { ToolShell } from '@/components/tool/ToolShell';
import { softwareApplicationSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Minecraft Layer-by-Layer Sphere Blueprint Generator',
  description:
    'Generate Minecraft sphere blueprints one layer at a time with hollow or solid modes, previous-layer ghosting, row segments, block counts, PNG/SVG/CSV export, selected-layer printing, and share links.',
  alternates: { canonical: '/minecraft-layer-by-layer-sphere' }
};

export default function Page() {
  const description = metadata.description as string;
  return (
    <main id="main" className="builder-page alias-landing-page">
      <JsonLd
        data={softwareApplicationSchema({
          path: '/minecraft-layer-by-layer-sphere',
          shape: 'sphere',
          title: 'Minecraft Layer-by-Layer Sphere Blueprint Generator',
          heading: 'Minecraft Layer-by-Layer Sphere Blueprint Generator',
          description
        })}
      />
      <ToolShell title="Minecraft Layer-by-Layer Sphere Blueprint Generator" initialShape="sphere" initialDiameter={31} contentKey="layered-sphere" />
    </main>
  );
}
