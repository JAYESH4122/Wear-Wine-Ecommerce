import { postgresAdapter } from '@payloadcms/db-postgres'
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

export default buildConfig({
  serverURL: requireEnv('NEXT_PUBLIC_API_URL'),
  cors: [requireEnv('PAYLOAD_CORS_ORIGINS')],
  csrf: [requireEnv('PAYLOAD_CORS_ORIGINS')],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Products, Categories, Tags, Colors, Sizes, Pages, Policies],
  globals: [Header, Footer, PDPStatic, SiteSettings],
  editor: lexicalEditor(),
  secret: requireEnv('PAYLOAD_SECRET'),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: requireEnv('DATABASE_URI'),
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
