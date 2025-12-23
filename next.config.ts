import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 👇 ESTA ES LA SOLUCIÓN:
  // Le dice a Next.js: "No toques estos paquetes, úsalos tal cual están en el servidor"
  serverExternalPackages: ['geoip-lite'],
}

export default withPayload(nextConfig)