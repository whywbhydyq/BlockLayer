import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: '41 Block Minecraft Circle Generator',
  description: 'Generate a 41 block Minecraft circle preset for arenas and large bases.'
};

export default function Page() {
  return <AliasToolPage path="/minecraft-41-circle" eyebrow="Size preset" heading="41 Block Minecraft Circle" description="Generate a 41 block Minecraft circle preset for arenas and large bases." shape="circle" initialDiameter={41} />;
}
