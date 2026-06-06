import type { Metadata } from 'next';
import { JsonLd } from '@/components/content/JsonLd';
import { MINECRAFT_DISCLAIMER } from '@/lib/compliance/minecraftDisclaimer';
import { disclaimerSchema } from '@/lib/seo/schema';

const description =
  'Read the BlockLayer disclaimer for independent Minecraft-style blueprint planning, geometry estimates, fan-made status, and unofficial use.';

export const metadata: Metadata = {
  title: 'BlockLayer Disclaimer & Fan-Made Notice',
  description,
  alternates: { canonical: '/disclaimer' }
};

export default function Page() {
  return (
    <main id="main" className="page-wrap">
      <JsonLd data={disclaimerSchema()} />
      <section className="hero">
        <h1>Disclaimer</h1>
        <p>{MINECRAFT_DISCLAIMER}</p>
        <p>BlockLayer is a YmirTool planning calculator and does not use official game logos, textures, fonts, or screenshots as site assets.</p>
        <p>
          Blueprints, material counts, exports, and printed guides are estimates generated from simplified grid geometry. They may need
          adjustment for terrain, build palette, lighting, game version, resource pack, server rules, interior space, or player preference.
        </p>
        <p>
          Use the output as a planning aid, not as official game documentation or a guarantee that every block placement will match your final
          build. Always test unusual dimensions or very large builds before committing materials.
        </p>
      </section>
    </main>
  );
}
