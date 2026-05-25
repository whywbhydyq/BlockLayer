/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  outputFileTracing: false,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  async redirects() {
    return [
      { source: '/circle-generator', destination: '/minecraft-circle-generator', permanent: true },
      { source: '/ellipse-generator', destination: '/minecraft-oval-generator', permanent: true },
      { source: '/tools/minecraft-circle-generator', destination: '/minecraft-circle-generator', permanent: true },
      { source: '/tools/minecraft-ellipse-generator', destination: '/minecraft-oval-generator', permanent: true },
      { source: '/minecraft-7-circle', destination: '/minecraft-circle-generator?d=7', permanent: true },
      { source: '/minecraft-11-circle', destination: '/minecraft-circle-generator?d=11', permanent: true },
      { source: '/minecraft-15-circle', destination: '/minecraft-circle-generator?d=15', permanent: true },
      { source: '/minecraft-21-circle', destination: '/minecraft-circle-generator?d=21', permanent: true },
      { source: '/minecraft-31-circle', destination: '/minecraft-circle-generator?d=31', permanent: true },
      { source: '/minecraft-41-circle', destination: '/minecraft-circle-generator?d=41', permanent: true },
      { source: '/minecraft-65-circle', destination: '/minecraft-circle-generator?d=65', permanent: true },
      { source: '/minecraft-129-circle', destination: '/minecraft-circle-generator?d=129', permanent: true },
      { source: '/minecraft-circle-sizes', destination: '/minecraft-circle-generator', permanent: true },
      { source: '/how-to-build-a-circle-in-minecraft', destination: '/minecraft-circle-generator', permanent: true },
      { source: '/minecraft-block-count-calculator', destination: '/minecraft-circle-generator', permanent: true },
      { source: '/sphere-generator', destination: '/', permanent: false },
      { source: '/dome-generator', destination: '/', permanent: false },
      { source: '/minecraft-sphere-generator', destination: '/', permanent: false },
      { source: '/minecraft-dome-generator', destination: '/', permanent: false },
      { source: '/minecraft-layer-by-layer-sphere', destination: '/', permanent: false },
      { source: '/minecraft-dome-blueprint', destination: '/', permanent: false },
      { source: '/minecraft-glass-dome-generator', destination: '/', permanent: false },
      { source: '/how-to-build-a-sphere-in-minecraft', destination: '/', permanent: false },
      { source: '/how-to-build-a-dome-in-minecraft', destination: '/', permanent: false },
      { source: '/tools/minecraft-sphere-generator', destination: '/', permanent: false },
      { source: '/tools/minecraft-dome-generator', destination: '/', permanent: false },
      { source: '/tools/minecraft-block-count-calculator', destination: '/minecraft-circle-generator', permanent: true },
      { source: '/presets/:path*', destination: '/minecraft-circle-generator', permanent: true },
      { source: '/guides/:path*', destination: '/odd-even-minecraft-circle-centers', permanent: true }
    ];
  }
};

export default nextConfig;
