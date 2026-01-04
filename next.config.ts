import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'
import path from 'path'

// Construimos la ruta absoluta al archivo request.ts
const i18nPath = path.join(process.cwd(), 'src', 'i18n', 'request.ts')

const withNextIntl = createNextIntlPlugin(i18nPath)

const nextConfig: NextConfig = {
  // Paquetes que necesitan ejecutarse en el servidor
  serverExternalPackages: ['geoip-lite'],
  
  // Configuración de imágenes (Cloudinary)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default withPayload(withNextIntl(nextConfig))