import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: 'Minecraft Circle Sizes',
  description: 'Compare and generate common Minecraft circle sizes.'
};

export default function Page() {
  return <AliasToolPage path="/minecraft-circle-sizes" eyebrow="Tool alias" heading="Minecraft Circle Sizes" description="Compare and generate common Minecraft circle sizes." shape="circle" initialDiameter={32} />;
}
