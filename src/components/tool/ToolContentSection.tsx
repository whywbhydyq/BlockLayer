import type { ToolContentPackage } from '@/lib/content/toolContentTypes';

type ToolContentSectionProps = {
  contentPackage: ToolContentPackage;
};

export function ToolContentSection({ contentPackage }: ToolContentSectionProps) {
  return (
    <div className="below-workspace task-content-package" aria-label="Task-focused help and related links">
      <section className="info-card how-to" id="how-to-use">
        <h3>{contentPackage.howToTitle}</h3>
        <ol>
          {contentPackage.howToSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="info-card output-card">
        <h3>{contentPackage.outputsTitle}</h3>
        <ul>
          {contentPackage.outputs.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="info-card build-tips">
        <h3>{contentPackage.tipsTitle}</h3>
        <ul>
          {contentPackage.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>

      <section className="info-card related-content-card">
        <h3>Related next steps</h3>
        <div className="related-link-list">
          {contentPackage.links.map((link) => (
            <a key={`${link.href}-${link.label}`} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </section>

      {contentPackage.faq.length > 0 && (
        <section className="info-card faq-card">
          <h3>FAQ</h3>
          {contentPackage.faq.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </section>
      )}
    </div>
  );
}
