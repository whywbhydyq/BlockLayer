import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: 'Minecraft Circle Generator',
  description: 'Generate printable Minecraft-style circle blueprints with row tables and exports.'
};

export default function Page() {
  return <AliasToolPage path="/minecraft-circle-generator" eyebrow="Tool alias" heading="Minecraft Circle Generator" description="Generate printable Minecraft-style circle blueprints with row tables and exports." shape="circle" initialDiameter={31} />;
}
