// ========== next.config.mjs ========== //
import { withPayload } from '@payloadcms/next/withPayload'
/** @type {import('next').NextConfig} */
const nextConfig = {
// Configuración para permitir imágenes externas (Cloudinary)
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
// Opciones experimentales o de compilación si fueran necesarias
experimental: {
// serverActions: true, // En Next 15 ya es default, pero no estorba
},
}
// Envolvemos la config con el plugin de Payload
export default withPayload(nextConfig)
// ========== Fin de next.config.mjs ========== //