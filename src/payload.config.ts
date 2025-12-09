import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { es } from 'payload/i18n/es'

// 1. Importamos Colecciones Existentes
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { ContactSubmissions } from './collections/ContactSubmissions'

// 2. Importamos Colecciones Nuevas (BLOG)
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'

// 3. Importamos Globales
import { Company } from './globals/Company'
import { Legal } from './globals/Legal'
import { Landing } from './globals/Landing'
// --- NUEVO: Importamos la configuración de email ---
import { EmailSettings } from './globals/EmailSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  i18n: {
    supportedLanguages: { es },
    fallbackLanguage: 'es',
  },
  collections: [
    Users, 
    Media, 
    Products, 
    ContactSubmissions,
    Posts,      
    Categories  
  ],
  // --- AÑADIMOS EmailSettings AQUÍ ---
  globals: [Company, Legal, Landing, EmailSettings],
  
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
  ],
})