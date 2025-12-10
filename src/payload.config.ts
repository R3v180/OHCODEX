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
import { EmailSettings } from './globals/EmailSettings'

// Importación con llaves (Named Export)
import { NotificationBell } from './components/admin/NotificationBell'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // Inyectamos el componente
    components: {
      // Usamos 'as any' para evitar el error de tipado estricto de TypeScript
      // ya que Payload espera tipos muy específicos para los componentes de acción.
      actions: [NotificationBell as any],
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