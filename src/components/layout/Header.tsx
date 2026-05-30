import { TrackedLink } from '@/components/content/TrackedLink';

export function Header() {
  return (
    <header className="site-header app-header">
      <TrackedLink className="brand app-brand" href="/" eventName="related_tool_clicked" label="Home">
        <span className="brand-mark" aria-hidden="true">
          ◆
        </span>
        <span>
          <strong>BlockLayer Minecraft Blueprint Builder</strong>
          <em>Circle, oval, sphere, and dome blueprints with row segments, center guides, exports, and block counts.</em>
        </span>
      </TrackedLink>
      <nav aria-label="Primary navigation" className="app-nav">
        <TrackedLink href="/minecraft-circle-generator" label="Circle">
          Circle
        </TrackedLink>
        <TrackedLink href="/minecraft-oval-generator" label="Oval">
          Oval
        </TrackedLink>
        <TrackedLink href="/minecraft-sphere-generator" label="Sphere">
          Sphere
        </TrackedLink>
        <TrackedLink href="/minecraft-dome-generator" label="Dome">
          Dome
        </TrackedLink>
        <TrackedLink href="/minecraft-block-count-calculator" label="Block count">
          Block count
        </TrackedLink>
        <TrackedLink href="/presets" eventName="related_guide_clicked" label="Presets">
          Presets
        </TrackedLink>
        <TrackedLink href="/guides" eventName="related_guide_clicked" label="Guides">
          Guides
        </TrackedLink>
      </nav>
    </header>
  );
}
