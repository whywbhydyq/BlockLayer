import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/content/JsonLd';
import { webPageSchema } from '@/lib/seo/schema';

const description =
  'Learn how BlockLayer helps Minecraft-style builders plan circles, ovals, spheres, domes, block counts, exports, and printable blueprints.';

export const metadata: Metadata = {
  title: 'About BlockLayer Blueprint Tool',
  description,
  alternates: { canonical: '/about' }
};

export default function Page() {
  return (
    <main id="main" className="page-wrap">
      <JsonLd data={webPageSchema('/about', 'About BlockLayer', description)} />
      <section className="hero">
        <h1>About BlockLayer</h1>
        <p>
          BlockLayer is a free YmirTool client-side blueprint tool for Minecraft-style block builds. It focuses on practical building
          workflows: dimensions, layers, row segments, material counts, exports, and printing.
        </p>
        <p>
          The site is built for players who need repeatable circle, oval, sphere, dome, pixel-circle, and block-count plans before placing
          blocks in game. Pages include formulas, worked examples, common mistakes, downloadable outputs, and related presets so the tool is
          useful even before interaction starts.
        </p>
        <p>BlockLayer is independent and fan-made. It is not an official Minecraft, Mojang, or Microsoft product.</p>
      </section>

      <section className="content-card" aria-labelledby="about-purpose-heading">
        <h2 id="about-purpose-heading">What BlockLayer is designed to do</h2>
        <p>
          The main goal is to turn a block-building idea into instructions that can be followed without guessing from a screenshot. For flat
          footprints, BlockLayer generates X/Z row segments, center parity notes, axis markers, outline or filled counts, and exportable
          references. For 3D builds, it breaks spheres and domes into layers so builders can work one Y level at a time and avoid losing
          orientation halfway through a large shell.
        </p>
        <p>
          The workflow is intentionally local-first. Normal geometry calculations happen in the browser, and share links store the selected
          dimensions and settings in the URL instead of requiring an account. That keeps the tool lightweight for quick planning sessions,
          second-screen build mode, classroom examples, and survival material checks.
        </p>
      </section>

      <section className="content-card" aria-labelledby="about-method-heading">
        <h2 id="about-method-heading">How the calculators are maintained</h2>
        <p>
          BlockLayer favors reproducible blueprint data over decorative assets. The same generated cells drive the preview canvas, row table,
          block totals, PNG export, SVG export, CSV export, print output, and companion-mode row controls. When a page describes a diameter,
          center type, shell thickness, or layer range, it is intended to match the actual calculator state rather than a separate marketing
          claim.
        </p>
        <p>
          The site also keeps SEO pages tied to real utility. Preset pages open the builder with a specific size already loaded. Guide pages
          link back to the relevant calculator, explain the build process, and warn about common mistakes such as mixing up radius and
          diameter, starting even circles from the wrong center, or collecting materials before checking the selected mode.
        </p>
      </section>

      <section className="content-card" aria-labelledby="about-next-heading">
        <h2 id="about-next-heading">Where to start</h2>
        <p>
          Start with the <Link href="/minecraft-circle-generator">circle generator</Link> for floors, towers, arenas, and rings. Use the{' '}
          <Link href="/minecraft-oval-generator">oval generator</Link> when width and height differ. Use the{' '}
          <Link href="/minecraft-sphere-generator">sphere generator</Link> or <Link href="/minecraft-dome-generator">dome generator</Link>{' '}
          when you need layer-by-layer rows, current-layer counts, or selected-range CSV and print output. For common dimensions, open the{' '}
          <Link href="/presets">preset index</Link> and edit the loaded values from there.
        </p>
      </section>
    </main>
  );
}
