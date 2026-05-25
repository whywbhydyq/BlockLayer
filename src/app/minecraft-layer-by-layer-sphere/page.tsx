import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: 'Minecraft Layer by Layer Sphere',
  description: 'Use true 3D voxel sphere layers for block-by-block building.'
};

export default function Page() {
  return <AliasToolPage path="/minecraft-layer-by-layer-sphere" eyebrow="Tool alias" heading="Minecraft Layer by Layer Sphere" description="Use true 3D voxel sphere layers for block-by-block building." shape="sphere" initialDiameter={31} />;
}
