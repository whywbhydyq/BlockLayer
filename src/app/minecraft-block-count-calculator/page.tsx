import type { Metadata } from 'next';
import { JsonLd } from '@/components/content/JsonLd';
import { ToolShell } from '@/components/tool/ToolShell';
import { softwareApplicationSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Minecraft Block Count Calculator - Stacks, Shulkers & Blueprint Totals',
  description: 'Calculate Minecraft blueprint totals, 64-stacks, leftover blocks, current-layer counts, and shulker-style estimates for circles, ovals, spheres, and domes.',
  alternates: { canonical: '/minecraft-block-count-calculator' }
};

export default function Page() {
  return (
    <main id="main" className="builder-page">
      <JsonLd
        data={softwareApplicationSchema({
          path: '/minecraft-block-count-calculator',
          shape: 'circle',
          title: 'Minecraft Block Count Calculator',
          heading: 'Minecraft Block Count Calculator',
          description: metadata.description as string
        })}
      />
      <ToolShell title="Minecraft Block Count Calculator" initialShape="circle" contentKey="block-count" />
    </main>
  );
}
