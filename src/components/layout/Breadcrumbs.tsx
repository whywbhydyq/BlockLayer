import Link from 'next/link';
import { JsonLd } from '@/components/content/JsonLd';
import { breadcrumbSchema } from '@/lib/seo/schema';

type Crumb = { name: string; path: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const normalized = items[0]?.path === '/' ? items : [{ name: 'Home', path: '/' }, ...items];
  return <nav className="breadcrumbs" aria-label="Breadcrumb"><JsonLd data={breadcrumbSchema(normalized)} /><ol>{normalized.map((item, index) => <li key={item.path}>{index < normalized.length - 1 ? <Link href={item.path}>{item.name}</Link> : <span aria-current="page">{item.name}</span>}</li>)}</ol></nav>;
}
