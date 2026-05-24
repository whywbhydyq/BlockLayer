import type { Metadata } from 'next';
import { ToolPage } from '@/components/content/ToolPage';
import { toolPages } from '@/lib/seo/pages';

const page = toolPages[4];

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: page.path }
};

export default function Page() {
  return <ToolPage page={page} />;
}
