import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: 'Minecraft Pixel Circle',
  description: 'Create a pixel circle grid for block-based builds.'
};

export default function Page() {
  return <AliasToolPage path="/minecraft-pixel-circle" eyebrow="Tool alias" heading="Minecraft Pixel Circle" description="Create a pixel circle grid for block-based builds." shape="circle" initialDiameter={31} />;
}
