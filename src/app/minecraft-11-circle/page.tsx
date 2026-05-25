import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: '11 Block Minecraft Circle Generator',
  description: 'Generate an 11 block Minecraft circle preset for compact towers.'
};

export default function Page() {
  return <AliasToolPage path="/minecraft-11-circle" eyebrow="Size preset" heading="11 Block Minecraft Circle" description="Generate an 11 block Minecraft circle preset for compact towers." shape="circle" initialDiameter={11} />;
}
