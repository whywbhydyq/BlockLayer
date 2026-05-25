import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: 'Minecraft Oval Generator',
  description: 'Generate Minecraft-style oval and ellipse blueprints.'
};

export default function Page() {
  return <AliasToolPage path="/minecraft-oval-generator" eyebrow="Tool alias" heading="Minecraft Oval Generator" description="Generate Minecraft-style oval and ellipse blueprints." shape="ellipse" />;
}
