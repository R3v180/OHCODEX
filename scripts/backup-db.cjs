// scripts/backup-db.cjs
// Script sencillo para hacer un dump de la BD de Neon usando pg_dump y DATABASE_URI del .env

const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })

const uri = process.env.DATABASE_URI

if (!uri) {
  console.error('❌ DATABASE_URI no está definido en .env')
  process.exit(1)
}

// Carpeta donde dejaremos los backups (local, fuera de git)
const backupsDir = path.resolve(process.cwd(), 'backups')
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true })
}

const now = new Date()
const pad = (n) => String(n).padStart(2, '0')
const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(
  now.getHours()
)}${pad(now.getMinutes())}${pad(now.getSeconds())}`

const filePath = path.join(backupsDir, `ohcodex-neon-backup-${timestamp}.dump`)

console.log('📦 Creando backup de Neon...')
console.log('   URI:', uri.replace(/:[^:@/]+@/, ':******@')) // ocultar password en logs
console.log('   Fichero:', filePath)
console.log('')

// Construimos comando: pg_dump "URI" -Fc -f filePath
const args = ['-Fc', '-f', filePath, uri]

// Ruta explícita a pg_dump en tu sistema Windows
const pgDumpPath = 'C:\\Program Files\\PostgreSQL\\17\\bin\\pg_dump.exe'

const child = spawn(pgDumpPath, args, {
  stdio: 'inherit',
})

child.on('error', (err) => {
  console.error('❌ Error al lanzar pg_dump. Asegúrate de tener el cliente de PostgreSQL instalado (pg_dump en PATH).')
  console.error(err.message)
  process.exit(1)
})

child.on('exit', (code) => {
  if (code === 0) {
    console.log('')
    console.log('✅ Backup completado sin errores.')
    console.log('   Archivo generado:', filePath)
  } else {
    console.error('')
    console.error(`❌ pg_dump terminó con código ${code}. Revisa los mensajes anteriores.`)
  }
  process.exit(code)
})

