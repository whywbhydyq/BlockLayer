import { guidePages } from '@/lib/seo/pages';
import { TrackedLink } from './TrackedLink';

export function RelatedGuides({ currentPath }: { currentPath?: string }) {
  const links = guidePages.filter((page) => page.path !== currentPath).slice(0, 6);
  return <section className="content-card"><h2>Related guides</h2><div className="link-grid">{links.map((page) => <TrackedLink key={page.path} href={page.path} eventName="related_guide_clicked" label={page.heading}>{page.heading}</TrackedLink>)}</div></section>;
}
