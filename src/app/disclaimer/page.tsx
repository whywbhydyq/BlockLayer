import type { Metadata } from 'next';
import { MINECRAFT_DISCLAIMER } from '@/lib/compliance/minecraftDisclaimer';
export const metadata: Metadata = { title: 'Disclaimer', description: 'BlockLayer non-official product disclaimer.', alternates: { canonical: '/disclaimer' } };
export default function Page() { return <main id="main" className="page-wrap"><section className="hero"><h1>Disclaimer</h1><p>{MINECRAFT_DISCLAIMER}</p><p>BlockLayer does not use official game logos, official textures, official fonts, or official screenshots as site assets.</p></section></main>; }
