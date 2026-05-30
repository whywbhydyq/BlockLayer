import type { Metadata } from 'next';
import { JsonLd } from '@/components/content/JsonLd';
import { ToolShell } from '@/components/tool/ToolShell';
import { softwareApplicationSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Minecraft Pixel Circle Generator - Row Blueprint & Exports',
  description:
    'Generate a pixel-style Minecraft circle with block-center approximation, row segments, center type, block counts, PNG/SVG/CSV export, and printable blueprint output.',
  alternates: { canonical: '/minecraft-pixel-circle' }
};

export default function Page() {
  return (
    <main id="main" className="builder-page">
      <JsonLd
        data={softwareApplicationSchema({
          path: '/minecraft-pixel-circle',
          shape: 'circle',
          title: 'Minecraft Pixel Circle Generator - Row Blueprint & Exports',
          heading: 'Minecraft Pixel Circle Generator - Row Blueprint & Exports',
          description: metadata.description as string
        })}
      />
      <ToolShell title="Minecraft Pixel Circle Generator - Row Blueprint & Exports" initialShape="circle" contentKey="pixel-circle" />
    </main>
  );
}
