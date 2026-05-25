import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: 'Sphere Generator',
  description: 'Generate a true layer-by-layer sphere blueprint.'
};

export default function Page() {
  return <AliasToolPage path="/sphere-generator" eyebrow="Tool alias" heading="Sphere Generator" description="Generate a true layer-by-layer sphere blueprint." shape="sphere" initialDiameter={31} />;
}
