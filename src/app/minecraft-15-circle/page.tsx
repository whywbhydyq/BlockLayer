import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: '15 Block Minecraft Circle Generator',
  description: 'Generate a 15 block Minecraft circle preset for small arenas and platforms.'
};

export default function Page() {
  return <AliasToolPage path="/minecraft-15-circle" eyebrow="Size preset" heading="15 Block Minecraft Circle" description="Generate a 15 block Minecraft circle preset for small arenas and platforms." shape="circle" initialDiameter={15} />;
}
