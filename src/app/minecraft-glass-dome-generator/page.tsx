import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: 'Minecraft Glass Dome Generator',
  description: 'Plan glass domes with shell thickness, layers, and stack counts.'
};

export default function Page() {
  return <AliasToolPage path="/minecraft-glass-dome-generator" eyebrow="Tool alias" heading="Minecraft Glass Dome Generator" description="Plan glass domes with shell thickness, layers, and stack counts." shape="dome" initialDiameter={32} />;
}
