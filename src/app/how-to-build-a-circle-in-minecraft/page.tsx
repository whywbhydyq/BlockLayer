import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: 'How to Build a Circle in Minecraft',
  description: 'Use the circle generator with row segments, center notes, and print export.'
};

export default function Page() {
  return <AliasToolPage path="/how-to-build-a-circle-in-minecraft" eyebrow="Guide with tool" heading="How to Build a Circle in Minecraft" description="Use the circle generator with row segments, center notes, and print export." shape="circle" initialDiameter={31} />;
}
