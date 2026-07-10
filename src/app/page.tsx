import type { Metadata } from 'next';
import { JsonLd } from '@/components/content/JsonLd';
import { ToolShell } from '@/components/tool/ToolShell';
import { softwareApplicationSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Minecraft Circle Generator & Blueprint Builder',
  description:
    'Generate Minecraft circle blueprints with row-by-row segments, block counts, center guides, PNG/SVG/CSV export, print output, and share links. Switch to oval, sphere, or dome when needed.',
  alternates: { canonical: '/' }
};

export default function HomePage() {
  return (
    <main id="main" className="builder-page">
      <JsonLd
        data={softwareApplicationSchema({
          path: '/',
          shape: 'circle',
          title: 'Minecraft Circle Generator & Blueprint Builder',
          heading: 'Minecraft Circle Generator & Blueprint Builder',
          description: metadata.description as string
        })}
      />
      <ToolShell title="Minecraft Circle Generator & Blueprint Builder" initialShape="circle" contentKey="home" />
    </main>
  );
}
