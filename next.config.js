/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      root: __dirname,
    },
  },
  transpilePackages: ['@radix-ui/react-slot'],
};

module.exports = nextConfig;
