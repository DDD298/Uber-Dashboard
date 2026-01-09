/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Tắt để loại bỏ hydration warnings
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
