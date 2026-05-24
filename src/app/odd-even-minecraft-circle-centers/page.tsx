import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: 'Odd Even Minecraft Circle Centers',
  description: 'Compare odd and even diameter circle centers and avoid one-block alignment mistakes.'
};

export default function Page() {
  return <AliasToolPage path="/odd-even-minecraft-circle-centers" eyebrow="Guide with tool" heading="Odd Even Minecraft Circle Centers" description="Compare odd and even diameter circle centers and avoid one-block alignment mistakes." shape="circle" initialDiameter={32} />;
}
