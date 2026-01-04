import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// --- 1. CARGA DE ENTORNO MANUAL ---
const loadEnv = () => {
  const __filename = fileURLToPath(import.meta.url)
  const currentDir = path.dirname(__filename)
  const rootDir = path.resolve(currentDir, '..', '..')
  const envPath = path.resolve(rootDir, '.env')

  console.log(`🔌 Leyendo .env...`)
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ NO SE ENCUENTRA EL ARCHIVO .env')
    process.exit(1)
  }

  const content = fs.readFileSync(envPath, 'utf-8')
  content.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) return
    
    const index = trimmed.indexOf('=')
    const key = trimmed.substring(0, index).trim()
    let value = trimmed.substring(index + 1).trim()
    
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    
    process.env[key] = value
  })
}

// Ejecutamos carga de variables INMEDIATAMENTE
loadEnv()

async function backupData() {
  console.log('📦 Iniciando Backup...')

  try {
    // --- 2. IMPORTACIÓN DINÁMICA (Clave para evitar el error) ---
    // Importamos Payload y la Configuración AQUÍ, después de que env esté cargado
    const { getPayload } = await import('payload')
    
    // Importamos la configuración local usando ruta relativa
    // Nota: tsx maneja la extensión .ts automáticamente
    const configModule = await import('../payload.config') 
    const configPromise = configModule.default

    const payload = await getPayload({ config: configPromise })
    console.log('🔗 Conectado a la Base de Datos.')

    // Leer datos
    const landing = await payload.findGlobal({ slug: 'landing-page' as any })
    console.log('📄 Landing Page obtenida.')
    
    const company = await payload.findGlobal({ slug: 'company-info' as any })
    console.log('🏢 Company Info obtenida.')

    const backup = { landing, company }

    // Guardar
    const filePath = path.resolve(process.cwd(), 'backup-globals.json')
    fs.writeFileSync(filePath, JSON.stringify(backup, null, 2))
    
    console.log(`✅ BACKUP CREADO EXITOSAMENTE: ${filePath}`)

  } catch (error) {
    console.error('❌ ERROR:', error)
  }
  
  process.exit(0)
}

backupData()