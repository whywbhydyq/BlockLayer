import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: '31 Block Minecraft Circle Generator',
  description: 'Generate a 31 block Minecraft circle preset with a single center block.'
};

export default function Page() {
  return <AliasToolPage path="/minecraft-31-circle" eyebrow="Size preset" heading="31 Block Minecraft Circle" description="Generate a 31 block Minecraft circle preset with a single center block." shape="circle" initialDiameter={31} />;
}
