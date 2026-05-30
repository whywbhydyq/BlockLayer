import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Privacy Policy', description: 'BlockLayer privacy policy.', alternates: { canonical: '/privacy' } };
export default function Page() { return <main id="main" className="page-wrap"><section className="hero"><h1>Privacy Policy</h1><p>BlockLayer does not require accounts, uploads, or server-side project storage. Tool calculations run in your browser. Basic analytics and advertising may be used to understand aggregate usage and support the site.</p></section></main>; }
