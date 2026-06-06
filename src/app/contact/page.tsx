import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/content/JsonLd';
import { MINECRAFT_DISCLAIMER } from '@/lib/compliance/minecraftDisclaimer';
import { contactPageSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Contact BlockLayer Blueprint Support',
  description: 'Contact BlockLayer for blueprint accuracy reports, accessibility issues, broken links, site feedback, and reproducible calculator problems.',
  alternates: { canonical: '/contact' }
};

export default function Page() {
  return (
    <main className="page-wrap" id="main">
      <JsonLd data={contactPageSchema()} />
      <section className="hero">
        <h1>Contact BlockLayer</h1>
        <p>
          For feedback about blueprint accuracy, accessibility, broken links, or site issues, contact the site owner through the YmirTool
          project channels.
        </p>
        <p>
          Email: <a href="mailto:ymirtool@ymirtool.com">ymirtool@ymirtool.com</a>
        </p>
        <p>
          When reporting a blueprint issue, include the shape, diameter or width/height, mode, layer number, and the page URL so the result
          can be reproduced.
        </p>
        <p>
          This tool runs in your browser. Do not send Minecraft account credentials, world files, server addresses, or private personal
          information.
        </p>
        <p>
          <Link href="/minecraft-circle-generator">Return to the circle generator</Link>
        </p>
        <p className="small-note">{MINECRAFT_DISCLAIMER}</p>
      </section>
    </main>
  );
}
