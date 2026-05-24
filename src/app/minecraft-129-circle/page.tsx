import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: '129 Block Minecraft Circle Generator',
  description: 'Generate a 129 block Minecraft circle preset for mega builds with pan, zoom, and row tables.'
};

export default function Page() {
  return <AliasToolPage path="/minecraft-129-circle" eyebrow="Size preset" heading="129 Block Minecraft Circle" description="Generate a 129 block Minecraft circle preset for mega builds with pan, zoom, and row tables." shape="circle" initialDiameter={129} />;
}
