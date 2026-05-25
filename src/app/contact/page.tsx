import type { Metadata } from 'next';
import Link from 'next/link';
import { MINECRAFT_DISCLAIMER } from '@/lib/compliance/minecraftDisclaimer';

export const metadata: Metadata = {
  title: 'Contact BlockLayer',
  description: 'Contact information for BlockLayer, an independent browser-based block blueprint generator.',
  alternates: { canonical: '/contact' }
};

export default function Page() {
  return (
    <main className="page-wrap" id="main">
      <section className="hero">
        <h1>Contact BlockLayer</h1>
        <p>For feedback about blueprint accuracy, accessibility, broken links, or site issues, contact the site owner through the YmirTool project channels.</p>
        <p>When reporting a blueprint issue, include the shape, diameter or width/height, mode, layer number, and the page URL so the result can be reproduced.</p>
        <p>This tool runs in your browser. Do not send Minecraft account credentials, world files, server addresses, or private personal information.</p>
        <p><Link href="/minecraft-circle-generator">Return to the circle generator</Link></p>
        <p className="small-note">{MINECRAFT_DISCLAIMER}</p>
      </section>
    </main>
  );
}
