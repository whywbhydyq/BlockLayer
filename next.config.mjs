/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  outputFileTracing: false,
  async redirects() {
    return [
      { source: '/circle-generator', destination: '/minecraft-circle-generator', permanent: true },
      { source: '/ellipse-generator', destination: '/minecraft-oval-generator', permanent: true },
      { source: '/sphere-generator', destination: '/minecraft-sphere-generator', permanent: true },
      { source: '/dome-generator', destination: '/minecraft-dome-generator', permanent: true },
      { source: '/minecraft-glass-dome-generator', destination: '/minecraft-dome-generator', permanent: true },

      { source: '/tools/minecraft-circle-generator', destination: '/minecraft-circle-generator', permanent: true },
      { source: '/tools/minecraft-ellipse-generator', destination: '/minecraft-oval-generator', permanent: true },
      { source: '/tools/minecraft-sphere-generator', destination: '/minecraft-sphere-generator', permanent: true },
      { source: '/tools/minecraft-dome-generator', destination: '/minecraft-dome-generator', permanent: true },
      { source: '/tools/minecraft-block-count-calculator', destination: '/minecraft-block-count-calculator', permanent: true },

      { source: '/minecraft-circle-sizes', destination: '/presets', permanent: true },
      { source: '/minecraft-7-circle', destination: '/presets/minecraft-7-circle', permanent: true },
      { source: '/minecraft-11-circle', destination: '/presets/minecraft-11-circle', permanent: true },
      { source: '/minecraft-15-circle', destination: '/presets/minecraft-15-circle', permanent: true },
      { source: '/minecraft-21-circle', destination: '/presets/minecraft-21-circle', permanent: true },
      { source: '/minecraft-31-circle', destination: '/presets/minecraft-31-circle', permanent: true },
      { source: '/minecraft-41-circle', destination: '/presets/minecraft-41-circle', permanent: true },
      { source: '/minecraft-65-circle', destination: '/presets/minecraft-65-circle', permanent: true },
      { source: '/minecraft-129-circle', destination: '/presets/minecraft-129-circle', permanent: true },
      { source: '/minecraft-31x21-oval', destination: '/presets/minecraft-31x21-oval', permanent: true },
      { source: '/minecraft-41x25-oval', destination: '/presets/minecraft-41x25-oval', permanent: true },
      { source: '/minecraft-51x31-oval', destination: '/presets/minecraft-51x31-oval', permanent: true },
      { source: '/minecraft-64x32-oval', destination: '/presets/minecraft-64x32-oval', permanent: true },
      { source: '/minecraft-21-sphere', destination: '/presets/minecraft-21-sphere', permanent: true },
      { source: '/minecraft-31-sphere', destination: '/presets/minecraft-31-sphere', permanent: true },
      { source: '/minecraft-31-dome', destination: '/presets/minecraft-31-dome', permanent: true },
      { source: '/minecraft-51-dome', destination: '/presets/minecraft-51-dome', permanent: true },

      { source: '/how-to-build-a-circle-in-minecraft', destination: '/guides/how-to-build-a-circle-in-minecraft', permanent: true },
      { source: '/how-to-build-an-oval-in-minecraft', destination: '/guides/how-to-build-an-oval-in-minecraft', permanent: true },
      { source: '/how-to-build-a-sphere-in-minecraft', destination: '/guides/how-to-build-a-sphere-in-minecraft', permanent: true },
      { source: '/how-to-build-a-dome-in-minecraft', destination: '/guides/how-to-build-a-dome-in-minecraft', permanent: true },
      { source: '/minecraft-blueprint-csv-export', destination: '/guides/minecraft-blueprint-csv-export', permanent: true },
      { source: '/minecraft-blueprint-printing', destination: '/guides/minecraft-blueprint-printing', permanent: true },
      { source: '/minecraft-block-counts-stacks-shulkers', destination: '/guides/minecraft-block-counts-stacks-shulkers', permanent: true }
    ];
  }
};

export default nextConfig;
