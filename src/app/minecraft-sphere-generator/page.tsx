import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: 'Minecraft Sphere Generator',
  description: 'Generate layer-by-layer Minecraft-style sphere blueprints.'
};

export default function Page() {
  return <AliasToolPage path="/minecraft-sphere-generator" eyebrow="Tool alias" heading="Minecraft Sphere Generator" description="Generate layer-by-layer Minecraft-style sphere blueprints." shape="sphere" initialDiameter={31} />;
}
