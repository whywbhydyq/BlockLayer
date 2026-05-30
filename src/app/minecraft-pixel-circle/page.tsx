import type { Metadata } from 'next';
import { JsonLd } from '@/components/content/JsonLd';
import { ToolShell } from '@/components/tool/ToolShell';
import { faqSchema, softwareApplicationSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Minecraft Pixel Circle Blueprint',
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
          title: 'Minecraft Pixel Circle Blueprint',
          heading: 'Minecraft Pixel Circle Blueprint',
          description: metadata.description as string
        })}
      />
      <JsonLd
        data={faqSchema([
          [
            'Why do pixel circle tools differ?',
            'Different generators include edge blocks differently. This tool uses block-center approximation and explains the center and row segments.'
          ],
          ['What is the easiest way to build it?', 'Mark the center first, draw the X/Z axis, then follow each row segment outward.']
        ])}
      />
      <ToolShell title="Minecraft Pixel Circle Blueprint" initialShape="circle" contentKey="pixel-circle" />
    </main>
  );
}
