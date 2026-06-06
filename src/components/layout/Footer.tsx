import Link from 'next/link';
import { MINECRAFT_DISCLAIMER } from '@/lib/compliance/minecraftDisclaimer';

const footerGroups = [
  {
    label: 'Blueprint tools',
    links: [
      { href: '/minecraft-circle-generator', label: 'Circle generator' },
      { href: '/minecraft-oval-generator', label: 'Oval generator' },
      { href: '/minecraft-sphere-generator', label: 'Sphere generator' },
      { href: '/minecraft-dome-generator', label: 'Dome generator' },
      { href: '/minecraft-block-count-calculator', label: 'Block count calculator' }
    ]
  },
  {
    label: 'Planning resources',
    links: [
      { href: '/presets', label: 'Blueprint presets' },
      { href: '/guides', label: 'Blueprint guides' },
      { href: '/guides/minecraft-blueprint-printing', label: 'Print blueprints' },
      { href: '/guides/minecraft-blueprint-csv-export', label: 'CSV export guide' }
    ]
  },
  {
    label: 'Site information',
    links: [
      { href: '/about', label: 'About' },
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
      { href: '/disclaimer', label: 'Disclaimer' },
      { href: '/contact', label: 'Contact' }
    ]
  }
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-summary">
        <strong>BlockLayer Minecraft Blueprint Builder</strong>
        <p>{MINECRAFT_DISCLAIMER}</p>
      </div>
      <nav aria-label="Footer navigation" className="footer-link-groups">
        {footerGroups.map((group) => (
          <section key={group.label} aria-labelledby={`footer-${group.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
            <h2 id={`footer-${group.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>{group.label}</h2>
            <ul>
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>
    </footer>
  );
}
