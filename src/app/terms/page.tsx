import type { Metadata } from 'next';
import { JsonLd } from '@/components/content/JsonLd';
import { webPageSchema } from '@/lib/seo/schema';

const description =
  'Read BlockLayer terms for using browser-based Minecraft-style blueprint calculators, exports, material estimates, and printable references.';

export const metadata: Metadata = {
  title: 'BlockLayer Terms of Use & Tool Rules',
  description,
  alternates: { canonical: '/terms' }
};

export default function Page() {
  return (
    <main id="main" className="page-wrap">
      <JsonLd data={webPageSchema('/terms', 'Terms of Use', description)} />
      <section className="hero">
        <h1>Terms of Use</h1>
        <p>
          Use BlockLayer as an informational YmirTool building aid for planning block shapes, layer counts, row segments, material estimates,
          exports, and printable references. The tool is provided as-is for personal planning and educational use.
        </p>
        <p>
          You are responsible for checking important dimensions before starting a large build, adapting the blueprint to your game version or
          build style, and confirming whether the result fits your server rules, resource pack, modded environment, or construction
          constraints.
        </p>
        <p>
          Do not misuse the site, interfere with its operation, or present generated output as an official Minecraft, Mojang, or Microsoft
          asset. YmirTool may update calculators, pages, exports, and content without preserving every previous behavior.
        </p>
      </section>
    </main>
  );
}
