import type { Metadata } from 'next';
import { JsonLd } from '@/components/content/JsonLd';
import { ToolShell } from '@/components/tool/ToolShell';
import { faqSchema, softwareApplicationSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Odd vs Even Minecraft Circle Centers',
  description: 'Compare odd and even Minecraft circle centers, including single-block centers, between-block centers, row segments, and bounds.',
  alternates: { canonical: '/odd-even-minecraft-circle-centers' }
};

export default function Page() {
  return (
    <main id="main" className="builder-page">
      <JsonLd data={softwareApplicationSchema({ path: '/odd-even-minecraft-circle-centers', shape: 'circle', title: 'Odd vs Even Minecraft Circle Centers', heading: 'Odd vs Even Minecraft Circle Centers', description: metadata.description as string })} />
      <JsonLd data={faqSchema([
        ['What is an odd circle center?', 'An odd diameter has one center block, which makes mirroring easier.'],
        ['What is an even circle center?', 'An even diameter is centered between four blocks. Mark a 2 by 2 center area before building.']
      ])} />
      <ToolShell title="Odd vs Even Minecraft Circle Centers" initialShape="circle" />
    </main>
  );
}
