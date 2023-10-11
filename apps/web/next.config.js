/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@genus-ai/prisma",
    "@genus-ai/lib",
    "@genus-ai/ui",
    "@genus-ai/tailwindconfig"
  ],
}

module.exports = nextConfig
