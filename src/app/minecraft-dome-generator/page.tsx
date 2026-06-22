import type { Metadata } from 'next';
import { JsonLd } from '@/components/content/JsonLd';
import { ToolShell } from '@/components/tool/ToolShell';
import { softwareApplicationSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Minecraft Dome Generator - Cap Height Blueprint',
  description:
    'Generate Minecraft dome blueprints by diameter and cap height with top/bottom half, hollow or solid layers, block counts, CSV, print, and share links.',
  alternates: { canonical: '/minecraft-dome-generator' }
};

export default function Page() {
  return (
    <main id="main" className="builder-page">
      <JsonLd
        data={softwareApplicationSchema({
          path: '/minecraft-dome-generator',
          shape: 'dome',
          title: 'Minecraft Dome Generator',
          heading: 'Minecraft Dome Generator',
          description: metadata.description as string
        })}
      />
      <ToolShell title="Minecraft Dome Generator" initialShape="dome" initialDiameter={31} contentKey="dome" />
    </main>
  );
}
