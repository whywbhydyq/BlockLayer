import { TrackedLink } from '@/components/content/TrackedLink';

export function Header() {
  return <header className="site-header"><TrackedLink className="brand" href="/" eventName="related_tool_clicked" label="Home">BlockLayer</TrackedLink><nav aria-label="Primary navigation"><TrackedLink href="/tools/minecraft-circle-generator" label="Circle">Circle</TrackedLink><TrackedLink href="/tools/minecraft-ellipse-generator" label="Ellipse">Ellipse</TrackedLink><TrackedLink href="/tools/minecraft-sphere-generator" label="Sphere">Sphere</TrackedLink><TrackedLink href="/tools/minecraft-dome-generator" label="Dome">Dome</TrackedLink><TrackedLink href="/presets/minecraft-circle-generator-32" label="Presets">Presets</TrackedLink><TrackedLink href="/guides/how-to-build-a-sphere-layer-by-layer" eventName="related_guide_clicked" label="Guides">Guides</TrackedLink></nav></header>;
}
