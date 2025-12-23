import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { es } from 'payload/i18n/es'

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
// 👇 NUEVO GLOBAL
import { AnalyticsDashboard } from './globals/AnalyticsDashboard'

// 3. Componentes UI
import { NotificationBell } from './components/admin/NotificationBell'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      // Dejamos solo la campana, quitamos el SidebarDashboardLink manual
      actions: [NotificationBell as any],
      
      // ❌ HEMOS QUITADO EL BLOQUE "views: { Dashboard: ... }" 
      // para que deje de intentar reemplazar la home y no dé problemas.
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
    Categories,
    Analytics,
  ],
  globals: [
    // 👇 Registramos el nuevo Dashboard aquí para que salga en el menú
    AnalyticsDashboard, 
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