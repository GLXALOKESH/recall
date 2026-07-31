import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    proxyTimeout: 30000,
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  allowedDevOrigins: ['192.168.31.73', 'localhost', '127.0.0.1','*.proveniq.co.in'],
};

export default nextConfig;
