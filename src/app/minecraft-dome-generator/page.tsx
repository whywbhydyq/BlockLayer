import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: 'Minecraft Dome Generator',
  description: 'Generate Minecraft-style dome blueprints with cap height and material counts.'
};

export default function Page() {
  return <AliasToolPage path="/minecraft-dome-generator" eyebrow="Tool alias" heading="Minecraft Dome Generator" description="Generate Minecraft-style dome blueprints with cap height and material counts." shape="dome" initialDiameter={31} />;
}
