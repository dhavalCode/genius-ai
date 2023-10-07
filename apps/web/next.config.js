/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@genus-ai/prisma",
    "@genus-ai/lib",
    "@genus-ai/ui",
  ],
}

module.exports = nextConfig
