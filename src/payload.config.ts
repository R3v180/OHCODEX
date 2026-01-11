// =============== INICIO ARCHIVO: src/payload.config.ts =============== //
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// Importamos los idiomas para la Interfaz del Admin
import { es } from 'payload/i18n/es'
import { en } from 'payload/i18n/en'
import { fr } from 'payload/i18n/fr'
import { de } from 'payload/i18n/de'
import { it } from 'payload/i18n/it'
import { pt } from 'payload/i18n/pt'

// 1. Colecciones
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Analytics } from './collections/Analytics'
import { Tools } from './collections/Tools'

// 2. Globales
import { Company } from './globals/Company'
import { Legal } from './globals/Legal'
import { Landing } from './globals/Landing'
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
  
  // 2. Configuración de Localización de Contenido (Base de Datos)
  localization: {
    // Añadimos todos los idiomas nuevos aquí
    locales: ['es', 'en', 'fr', 'de', 'it', 'pt'],
    defaultLocale: 'es',
    fallback: true,
  },

  // 3. Configuración de Idioma de la INTERFAZ (Admin Panel)
  i18n: {
    supportedLanguages: { es, en, fr, de, it, pt },
    fallbackLanguage: 'es',
  },

  collections: [
    Users, 
    Media, 
    Products, 
    ContactSubmissions,
    Posts,      
    Categories,
    Analytics,
    Tools, 
  ],
  globals: [
    Company, 
    Legal, 
    Landing, 
    EmailSettings
  ],
  
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
// =============== FIN ARCHIVO: src/payload.config.ts =============== //