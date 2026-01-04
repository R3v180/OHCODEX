import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { es } from 'payload/i18n/es'
// import { en } from 'payload/i18n/en' // ❌ Desactivado para que el admin sea solo ES

// 1. Colecciones
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Analytics } from './collections/Analytics'

// 2. Globales
import { Company } from './globals/Company'
import { Legal } from './globals/Legal'
import { Landing } from './globals/Landing'
import { EmailSettings } from './globals/EmailSettings'
// import { AnalyticsDashboard } from './globals/AnalyticsDashboard' // ⚠️ Comentado por error de build

// 3. Componentes UI
// import { NotificationBell } from './components/admin/NotificationBell' // ⚠️ Comentado por error de build

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // components: {
    //   actions: [NotificationBell as any], // ⚠️ Desactivado temporalmente
    // },
  },
  
  // 2. Configuración de Localización de Contenido (Base de Datos)
  // Esto permite que tus campos (título, contenido) sigan teniendo inglés y español
  localization: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    fallback: true,
  },

  // 3. Configuración de Idioma de la INTERFAZ del Admin (Botones, menús, etc)
  i18n: {
    supportedLanguages: { es }, // ✅ Forzado solo Español
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
  ],
  globals: [
    // AnalyticsDashboard, // ⚠️ Desactivado temporalmente
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