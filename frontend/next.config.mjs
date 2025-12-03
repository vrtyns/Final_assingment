/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // ✅ ต้องเพิ่มบรรทัดนี้ เพื่อให้ Docker ใช้งานได้
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  eslint: {
    // เพิ่มบรรทัดนี้ เพื่อให้ build ผ่านแม้มี warning
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;