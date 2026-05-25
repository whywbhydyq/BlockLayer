import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: '21 Block Minecraft Circle Generator',
  description: 'Generate a 21 block Minecraft circle preset for towers, rooms, and foundations.'
};

export default function Page() {
  return <AliasToolPage path="/minecraft-21-circle" eyebrow="Size preset" heading="21 Block Minecraft Circle" description="Generate a 21 block Minecraft circle preset for towers, rooms, and foundations." shape="circle" initialDiameter={21} />;
}
