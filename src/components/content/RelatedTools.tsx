import { toolPages } from '@/lib/seo/pages';
import { TrackedLink } from './TrackedLink';

export function RelatedTools({ currentPath }: { currentPath?: string }) {
  const links = toolPages.filter((page) => page.path !== currentPath);
  return <section className="content-card"><h2>Related tools</h2><div className="link-grid">{links.map((page) => <TrackedLink key={page.path} href={page.path} label={page.heading}>{page.heading}</TrackedLink>)}</div></section>;
}
