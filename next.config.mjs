/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Proxy configuration for API calls
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://example-be.onrender.com/api/:path*',
      },
    ];
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Empty turbopack config to silence the warning
  turbopack: {},
};

export default nextConfig;
