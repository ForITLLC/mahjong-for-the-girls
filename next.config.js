/** @type {import('next').NextConfig} */

// Two deploy shapes from one config:
//  - default            → output:'standalone' (Azure App Service / any Node host, ForIT convention)
//  - DEPLOY_TARGET=pages → static export to ./out for GitHub Pages (project subpath)
const isPages = process.env.DEPLOY_TARGET === 'pages';
const repo = 'mahjong-for-the-girls';

const nextConfig = isPages
  ? {
      output: 'export',
      images: { unoptimized: true },
      basePath: `/${repo}`,
      assetPrefix: `/${repo}/`,
      trailingSlash: true,
      reactStrictMode: true,
    }
  : {
      output: 'standalone',
      reactStrictMode: true,
    };

module.exports = nextConfig;
