import Link from 'next/link';
import { MINECRAFT_DISCLAIMER } from '@/lib/compliance/minecraftDisclaimer';

export function Footer() {
  return <footer className="site-footer"><p>{MINECRAFT_DISCLAIMER}</p><nav aria-label="Footer navigation"><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/disclaimer">Disclaimer</Link><Link href="/contact">Contact</Link></nav></footer>;
}
