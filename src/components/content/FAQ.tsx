'use client';
import { trackToolEvent } from '@/lib/analytics/events';
import { JsonLd } from './JsonLd';
import { faqSchema } from '@/lib/seo/schema';

export const faqItems: Array<[string, string]> = [
  ['Is BlockLayer an official Minecraft tool?', 'No. BlockLayer is an independent Minecraft-style block blueprint tool and is not associated with Mojang or Microsoft.'],
  ['Does the sphere generator reuse a circle generator?', 'No. Sphere and dome layers are generated from 3D voxel inclusion tests, then shown as layer-by-layer 2D blueprints.'],
  ['Can I export Litematica, NBT, or structure files?', 'No. MVP exports PNG, SVG, CSV, print output, row lists, layer summaries, and share links only.'],
  ['Why do even diameters look centered between blocks?', 'Even dimensions do not have one center block. The center falls between blocks, so the blueprint warns about even-center alignment.']
];

export function FAQ() {
  return <section className="content-card"><JsonLd data={faqSchema(faqItems)} /><h2>FAQ</h2>{faqItems.map(([question, answer]) => <details key={question} onToggle={(event) => { if (event.currentTarget.open) trackToolEvent('faq_opened', { question }); }}><summary>{question}</summary><p>{answer}</p></details>)}</section>;
}
