import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: 'How to Build a Sphere in Minecraft',
  description: 'Use the sphere generator layer by layer with hollow or solid mode.'
};

export default function Page() {
  return <AliasToolPage path="/how-to-build-a-sphere-in-minecraft" eyebrow="Guide with tool" heading="How to Build a Sphere in Minecraft" description="Use the sphere generator layer by layer with hollow or solid mode." shape="sphere" initialDiameter={31} />;
}
