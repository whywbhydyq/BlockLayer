import { TrackedLink } from '@/components/content/TrackedLink';

export function Header() {
  return (
    <header className="site-header app-header">
      <TrackedLink className="brand app-brand" href="/" eventName="related_tool_clicked" label="Home">
        <span className="brand-mark" aria-hidden="true">◆</span>
        <span>
          <strong>Minecraft Circle & Oval Blueprint Builder</strong>
          <em>Build block-by-block blueprints with row segments, center guides, and accurate block counts.</em>
        </span>
      </TrackedLink>
      <nav aria-label="Primary navigation" className="app-nav">
        <TrackedLink href="/minecraft-circle-generator" label="Circle">Circle</TrackedLink>
        <TrackedLink href="/minecraft-oval-generator" label="Oval">Oval</TrackedLink>
        <TrackedLink href="/#how-to-use" eventName="related_guide_clicked" label="How to use">ⓘ How to use</TrackedLink>
      </nav>
    </header>
  );
}
