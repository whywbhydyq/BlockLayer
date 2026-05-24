import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: 'Circle Generator',
  description: 'Generate a Minecraft-style circle blueprint by diameter or radius.'
};

export default function Page() {
  return <AliasToolPage path="/circle-generator" eyebrow="Tool alias" heading="Circle Generator" description="Generate a Minecraft-style circle blueprint by diameter or radius." shape="circle" initialDiameter={31} />;
}
