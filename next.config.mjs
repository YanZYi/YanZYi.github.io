/** @type {import('next').NextConfig} */
const config = {
  // Static-export mode so the site deploys to GitHub Pages (no Node server).
  output: 'export',
  trailingSlash: true,
  // Configure basePath/assetPrefix when deploying under a sub-path
  // (e.g. https://<user>.github.io/<repo>/). Leave empty for user/org pages.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: { unoptimized: true },
  webpack: (config) => config
}

export default config
