import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      ...(process.env.S3_BUCKET && process.env.S3_REGION
        ? [
            {
              protocol: 'https',
              hostname: `${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com`,
            },
            {
              protocol: 'https',
              hostname: `s3.${process.env.S3_REGION}.amazonaws.com`,
              pathname: `/${process.env.S3_BUCKET}/**`,
            },
          ]
        : []),
      // Hardcoded fallback for production builds where env variables might not be present at build time
      {
        protocol: 'https',
        hostname: 'wear-wine-media.s3.eu-north-1.amazonaws.com',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
