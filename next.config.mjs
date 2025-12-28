/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://example-be.onrender.com/api/:path*',
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  turbopack: {},
};

export default nextConfig;
