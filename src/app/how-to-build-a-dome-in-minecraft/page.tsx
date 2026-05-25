import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: 'How to Build a Dome in Minecraft',
  description: 'Use the dome generator with cap height, shell thickness, build direction, and printable layers.'
};

export default function Page() {
  return <AliasToolPage path="/how-to-build-a-dome-in-minecraft" eyebrow="Guide with tool" heading="How to Build a Dome in Minecraft" description="Use the dome generator with cap height, shell thickness, build direction, and printable layers." shape="dome" initialDiameter={31} />;
}
