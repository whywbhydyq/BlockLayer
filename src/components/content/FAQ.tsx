'use client';
import { trackToolEvent } from '@/lib/analytics/events';

const faqItems: Array<[string, string]> = [
  [
    'Does BlockLayer use my Minecraft account?',
    'No. Calculations run in your browser and the site does not ask for Minecraft login credentials.'
  ],
  [
    'Are the blueprints official Minecraft content?',
    'No. BlockLayer is an independent fan-made planning tool and is not affiliated with Mojang or Microsoft.'
  ],
  [
    'Can I export the rows?',
    'Yes. You can copy row segments and download PNG, SVG, CSV, and print-friendly output depending on the active blueprint.'
  ]
];

export function FAQ() {
  return (
    <section className="content-card">
      <h2>FAQ</h2>
      {faqItems.map(([question, answer]) => (
        <details
          key={question}
          onToggle={(event) => {
            if (event.currentTarget.open) trackToolEvent('faq_opened', { question });
          }}
        >
          <summary>{question}</summary>
          <p>{answer}</p>
        </details>
      ))}
    </section>
  );
}
