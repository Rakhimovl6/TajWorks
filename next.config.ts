// next.config.js
import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'http', hostname: '37.27.255.16' }, // разрешаем твой IP
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*', // локальный путь
        destination: 'http://37.27.255.16:8007/auth/:path*', // настоящий сервер
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
