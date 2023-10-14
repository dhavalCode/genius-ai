require("dotenv").config({ path: "../../.env" });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@genus-ai/prisma",
    "@genus-ai/lib",
    "@genus-ai/ui",
    "@genus-ai/tailwindconfig",
  ],
  images: {
    domains: ["res.cloudinary.com"],
  },
};

module.exports = nextConfig;
