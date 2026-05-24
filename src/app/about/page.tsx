import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'About BlockLayer', description: 'About BlockLayer, a free independent block blueprint generator.', alternates: { canonical: '/about' } };
export default function Page() { return <main className="page-wrap"><section className="hero"><h1>About BlockLayer</h1><p>BlockLayer is a free client-side blueprint tool for Minecraft-style block builds. It focuses on practical building workflows: dimensions, layers, row segments, material counts, exports, and printing.</p></section></main>; }
