import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: '7 Block Minecraft Circle Generator',
  description: 'Generate a 7 block Minecraft circle preset for wells, posts, and small tower details.'
};

export default function Page() {
  return <AliasToolPage path="/minecraft-7-circle" eyebrow="Size preset" heading="7 Block Minecraft Circle" description="Generate a 7 block Minecraft circle preset for wells, posts, and small tower details." shape="circle" initialDiameter={7} />;
}
