import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: 'Ellipse Generator',
  description: 'Generate an oval or ellipse block blueprint with row segments and counts.'
};

export default function Page() {
  return <AliasToolPage path="/ellipse-generator" eyebrow="Tool alias" heading="Ellipse Generator" description="Generate an oval or ellipse block blueprint with row segments and counts." shape="ellipse" />;
}
