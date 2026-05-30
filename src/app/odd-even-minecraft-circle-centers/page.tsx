import type { Metadata } from 'next';
import { JsonLd } from '@/components/content/JsonLd';
import { ToolShell } from '@/components/tool/ToolShell';
import { softwareApplicationSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Odd vs Even Minecraft Circle Center Guide',
  description:
    'Compare odd and even Minecraft circle centers, including single-block centers, between-two-block center lines, 2×2 center areas, row segments, and bounds.',
  alternates: { canonical: '/odd-even-minecraft-circle-centers' }
};

export default function Page() {
  return (
    <main id="main" className="builder-page">
      <JsonLd
        data={softwareApplicationSchema({
          path: '/odd-even-minecraft-circle-centers',
          shape: 'circle',
          title: 'Odd vs Even Minecraft Circle Center Guide',
          heading: 'Odd vs Even Minecraft Circle Center Guide',
          description: metadata.description as string
        })}
      />
      <ToolShell title="Odd vs Even Minecraft Circle Center Guide" initialShape="circle" contentKey="center-guide" />
    </main>
  );
}
