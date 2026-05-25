import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: 'Minecraft Block Count Calculator',
  description: 'Calculate block totals, 64-stacks, shulker estimates, and layer counts.'
};

export default function Page() {
  return <AliasToolPage path="/minecraft-block-count-calculator" eyebrow="Tool alias" heading="Minecraft Block Count Calculator" description="Calculate block totals, 64-stacks, shulker estimates, and layer counts." shape="sphere" initialDiameter={31} />;
}
