import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  // ZABAL moves to zabal.thezao.com (domains move, 2026-11-05). Keep every path on the old host.
  // Host-matched redirect, permanent (301), path preserved. Pattern: Next.js redirects `has` host
  // (docs not fetched in this run - UNVERIFIED against live docs).
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'zabal.art' }],
        destination: 'https://zabal.thezao.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default config;
