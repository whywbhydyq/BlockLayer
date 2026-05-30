import type { Metadata } from 'next';
import { JsonLd } from '@/components/content/JsonLd';
import { ToolShell } from '@/components/tool/ToolShell';
import { softwareApplicationSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Minecraft Dome Blueprint Generator - Cap Height & Layer Rows',
  description:
    'Generate Minecraft dome blueprints with top or bottom half selection, cap height controls, hollow or solid layers, row segments, block counts, PNG/SVG/CSV export, selected-layer printing, and share links.',
  alternates: { canonical: '/minecraft-dome-blueprint' }
};

export default function Page() {
  const description = metadata.description as string;
  return (
    <main id="main" className="builder-page alias-landing-page">
      <JsonLd
        data={softwareApplicationSchema({
          path: '/minecraft-dome-blueprint',
          shape: 'dome',
          title: 'Minecraft Dome Blueprint Generator',
          heading: 'Minecraft Dome Blueprint Generator',
          description
        })}
      />
      <ToolShell title="Minecraft Dome Blueprint Generator" initialShape="dome" initialDiameter={31} contentKey="dome-blueprint" />
    </main>
  );
}
