import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'

import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { Pages } from './collections/Pages'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/products'
import { Categories } from './collections/categories'
import { Tags } from './collections/tags'
import { Colors } from './collections/colors'
import { Sizes } from './collections/sizes'
import { Policies } from './collections/Policies'
import { Carts } from './collections/Carts'
import { Wishlists } from './collections/Wishlists'
import { Orders } from './collections/Orders'
import { RateLimitBuckets } from './collections/RateLimitBuckets'
import { PaymentAttempts } from './collections/PaymentAttempts'
import { PaymentWebhookEvents } from './collections/PaymentWebhookEvents'
import { PDPStatic } from './globals/PDPStatic'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const requireEnv = (key: string): string => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`${key} is not defined`)
  }
  return value
}

const allowedOrigins = requireEnv('PAYLOAD_CORS_ORIGINS')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const resendApiKey = process.env.RESEND_API_KEY?.trim()
const emailFrom = process.env.EMAIL_FROM?.trim()
const emailAdapter =
  resendApiKey && emailFrom
    ? resendAdapter({
        apiKey: resendApiKey,
        defaultFromAddress: emailFrom,
        defaultFromName: process.env.EMAIL_FROM_NAME?.trim() || 'Wear Vine',
      })
    : undefined

export default buildConfig({
  serverURL: requireEnv('NEXT_PUBLIC_API_URL'),
  cors: allowedOrigins,
  csrf: allowedOrigins,
  ...(emailAdapter ? { email: emailAdapter } : {}),
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Products,
    Categories,
    Tags,
    Colors,
    Sizes,
    Pages,
    Policies,
    Carts,
    Wishlists,
    Orders,
    RateLimitBuckets,
    PaymentAttempts,
    PaymentWebhookEvents,
  ],
  globals: [Header, Footer, PDPStatic, SiteSettings],
  editor: lexicalEditor(),
  secret: requireEnv('PAYLOAD_SECRET'),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      // DATABASE_URI is the Payload-conventional name; fall back to DATABASE_URL
      // so a single variable works across Vercel, Render, and local environments.
      connectionString: process.env.DATABASE_URI ?? requireEnv('DATABASE_URL'),
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: requireEnv('S3_BUCKET'),
      config: {
        endpoint: process.env.S3_ENDPOINT || `https://s3.${process.env.S3_REGION}.amazonaws.com`,
        region: requireEnv('S3_REGION'),
        credentials: {
          accessKeyId: requireEnv('S3_ACCESS_KEY'),
          secretAccessKey: requireEnv('S3_SECRET_KEY'),
        },
      },
    }),
  ],
})
