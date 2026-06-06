import type { Metadata } from 'next';
import { JsonLd } from '@/components/content/JsonLd';
import { webPageSchema } from '@/lib/seo/schema';

const description =
  'Review how BlockLayer handles browser-based blueprint calculations, share links, analytics, advertising, and sensitive Minecraft project data.';

export const metadata: Metadata = {
  title: 'BlockLayer Privacy Policy & Data Use',
  description,
  alternates: { canonical: '/privacy' }
};

export default function Page() {
  return (
    <main id="main" className="page-wrap">
      <JsonLd data={webPageSchema('/privacy', 'Privacy Policy', description)} />
      <section className="hero">
        <h1>Privacy Policy</h1>
        <p>
          YmirTool designs BlockLayer so normal blueprint calculations run in your browser. The site does not require accounts, uploads,
          server-side project storage, Minecraft account access, world files, server addresses, or login credentials.
        </p>
        <p>
          Share links, if used, may contain visible blueprint settings in the URL. Anyone who receives that URL can read those settings, so
          avoid sharing a link if it contains values you consider private.
        </p>
        <p>
          Basic analytics and advertising may be used to understand aggregate usage and support the site. Those systems should not receive
          blueprint geometry tables, exported files, Minecraft credentials, or private world data from BlockLayer.
        </p>
      </section>
    </main>
  );
}
