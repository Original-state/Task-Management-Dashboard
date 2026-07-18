/** @type {import('next').NextConfig} */
const nextConfig = {
  // API 代理：将 /api 请求转发到 Flask 后端（开发模式）
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5000'}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
