import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: 'Minecraft Dome Blueprint',
  description: 'Generate a printable dome blueprint with layer summaries.'
};

export default function Page() {
  return <AliasToolPage path="/minecraft-dome-blueprint" eyebrow="Tool alias" heading="Minecraft Dome Blueprint" description="Generate a printable dome blueprint with layer summaries." shape="dome" initialDiameter={32} />;
}
