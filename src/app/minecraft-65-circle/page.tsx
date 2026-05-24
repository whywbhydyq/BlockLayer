import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: '65 Block Minecraft Circle Generator',
  description: 'Generate a 65 block Minecraft circle preset for large builds.'
};

export default function Page() {
  return <AliasToolPage path="/minecraft-65-circle" eyebrow="Size preset" heading="65 Block Minecraft Circle" description="Generate a 65 block Minecraft circle preset for large builds." shape="circle" initialDiameter={65} />;
}
