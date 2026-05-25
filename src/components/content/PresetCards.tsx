import Link from 'next/link';
import { presetPages } from '@/lib/seo/pages';

export function PresetCards({ limit = 10 }: { limit?: number }) {
  return <div className="link-grid preset-cards">{presetPages.slice(0, limit).map((page) => <Link key={page.path} href={page.path}>{page.heading}</Link>)}</div>;
}
