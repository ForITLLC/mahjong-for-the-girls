/** @type {import('next').NextConfig} */

// Static export for Azure Static Web Apps — the ForIT client-site convention
// (mirrors for-site-template and cay-Website / cayres.ca). SWA serves the
// exported ./out at the site root, so there is no basePath.
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
};

module.exports = nextConfig;
