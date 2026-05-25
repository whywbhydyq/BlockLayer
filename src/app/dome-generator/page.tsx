import { AliasToolPage } from '@/components/content/AliasToolPage';

export const metadata = {
  title: 'Dome Generator',
  description: 'Generate a dome or cap blueprint with layer controls.'
};

export default function Page() {
  return <AliasToolPage path="/dome-generator" eyebrow="Tool alias" heading="Dome Generator" description="Generate a dome or cap blueprint with layer controls." shape="dome" initialDiameter={31} />;
}
