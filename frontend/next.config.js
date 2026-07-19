/** @type {import('next').NextConfig} */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const nextConfig = {
  // 仅本地开发时代理 /api 到 Flask 后端；生产由前端直接请求后端绝对 URL
  async rewrites() {
    if (!API_BASE) {
      return [
        {
          source: '/api/:path*',
          destination: 'http://127.0.0.1:5000/api/:path*',
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;
