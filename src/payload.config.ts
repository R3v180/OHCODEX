import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { es } from 'payload/i18n/es'
// import { en } from 'payload/i18n/en' 

// 1. Colecciones
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Analytics } from './collections/Analytics'
import { Tools } from './collections/Tools' // 👈 NUEVA IMPORTACIÓN

// 2. Globales
import { Company } from './globals/Company'
import { Legal } from './globals/Legal'
import { Landing } from './globals/Landing'
import { EmailSettings } from './globals/EmailSettings'
// import { AnalyticsDashboard } from './globals/AnalyticsDashboard' 

// 3. Componentes UI
// import { NotificationBell } from './components/admin/NotificationBell' 

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // components: {
    //   actions: [NotificationBell as any], 
    // },
  },
  
  // 2. Configuración de Localización de Contenido
  localization: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    fallback: true,
  },

  // 3. Configuración de Idioma de la INTERFAZ
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
    Categories,
    Analytics,
    Tools, // 👈 NUEVA COLECCIÓN REGISTRADA
  ],
  globals: [
    // AnalyticsDashboard, 
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