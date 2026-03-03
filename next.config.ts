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

  // Desactivar ESLint en el build de producción (Render) para no requerir eslint instalado en prod
  eslint: {
    ignoreDuringBuilds: true,
  },
  
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

  // 👇 PASO PARA SEO: Redirecciones 301 para limpiar Search Console
  async redirects() {
    return [
      {
        source: '/privacidad',
        destination: '/es/privacidad',
        permanent: true,
      },
      {
        source: '/terminos',
        destination: '/es/terminos',
        permanent: true,
      },
      {
        source: '/aviso-legal',
        destination: '/es/aviso-legal',
        permanent: true,
      },
      {
        source: '/terms', // Soluciona el 404 específico detectado por Google
        destination: '/es/terminos',
        permanent: true,
      },
      {
        source: '/productos/:path*', // Redirige rutas antiguas de productos
        destination: '/es/products/:path*',
        permanent: true,
      },
    ]
  },
}

export default withPayload(withNextIntl(nextConfig))