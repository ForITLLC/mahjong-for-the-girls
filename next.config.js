/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output keeps this portable to Azure App Service (ForIT convention)
  // and to any static-friendly host. No server runtime is required by the site.
  output: 'standalone',
  reactStrictMode: true,
};

module.exports = nextConfig;
