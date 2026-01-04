// src/scripts/local-backup.ts

import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

// Configuración para ES Modules (necesario para leer rutas relativas correctamente)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno (subimos 2 niveles desde src/scripts/ para llegar a la raíz)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const execAsync = promisify(exec);

// ==========================================
// ⚙️ CONFIGURACIÓN USUARIO
// ==========================================

// Carpeta donde guardarás los backups de OHCodex
const BACKUP_DIR = 'C:/OHCodex_Backups'; 
const RETENTION_DAYS = 30; 

// Ruta a pg_dump.exe (Puedes usar la misma que ya tenías si funciona)
// Asegúrate de que este archivo exista en tu PC
const PG_DUMP_EXE = 'C:/CronoJob_Backups/pgsql/bin/pg_dump.exe'; 

// ==========================================

async function main() {
  console.log('📦 [Backup Local OHCodex] Iniciando proceso...');

  // NOTA: Payload usa DATABASE_URI, no DATABASE_URL
  const dbUrl = process.env.DATABASE_URI;
  
  if (!dbUrl) {
    console.error('❌ Error: DATABASE_URI no definida en .env');
    process.exit(1);
  }

  // Verificar directorio backup
  if (!fs.existsSync(BACKUP_DIR)) {
    try {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
        console.log(`📁 Carpeta creada: ${BACKUP_DIR}`);
    } catch (e) {
        console.error(`❌ Error: No se pudo crear la carpeta: "${BACKUP_DIR}"`);
        process.exit(1);
    }
  }

  // Verificar herramienta pg_dump
  if (!fs.existsSync(PG_DUMP_EXE)) {
    console.error(`❌ Error: No encuentro pg_dump en: "${PG_DUMP_EXE}"`);
    console.error('   Por favor, verifica la ruta de pg_dump.exe en la configuración del script.');
    process.exit(1);
  }

  const now = new Date();
  const timestamp = now.toISOString().replace(/T/, '_').replace(/:/g, '-').split('.')[0];
  const fileName = `ohcodex_backup_${timestamp}.dump`;
  const filePath = path.join(BACKUP_DIR, fileName);

  console.log(`⏳ Conectando a Neon y descargando...`);
  console.log(`   Destino: ${filePath}`);

  try {
    // Ejecutar comando
    // -F c : Formato Custom (comprimido y más flexible para restaurar)
    // --no-owner --no-acl : Importante para evitar errores de permisos al restaurar en local o en otro Neon
    const command = `"${PG_DUMP_EXE}" "${dbUrl}" -F c --no-owner --no-acl -f "${filePath}"`;
    
    await execAsync(command);

    if (!fs.existsSync(filePath)) throw new Error('El archivo no se generó.');
    
    const stats = fs.statSync(filePath);
    const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);

    if (stats.size < 1024) {
        throw new Error(`El archivo es demasiado pequeño (${stats.size} bytes). Posible error de conexión o credenciales.`);
    }

    console.log(`✅ ¡Backup ÉXITOSO!`);
    console.log(`   Tamaño: ${sizeMb} MB`);

    cleanOldBackups();

  } catch (error: any) {
    console.error('💥 ERROR CRÍTICO EN EL BACKUP:');
    console.error(error.message || error);
    
    if (fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (e) {}
      console.log('🗑️  Archivo corrupto eliminado.');
    }
    process.exit(1);
  }
}

function cleanOldBackups() {
  console.log('🧹 Ejecutando política de retención...');
  try {
    const files = fs.readdirSync(BACKUP_DIR);
    const now = new Date();
    let deletedCount = 0;

    files.forEach(file => {
      if (!file.startsWith('ohcodex_backup_') || !file.endsWith('.dump')) return;

      const fullPath = path.join(BACKUP_DIR, file);
      const stats = fs.statSync(fullPath);
      const daysOld = (now.getTime() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

      if (daysOld > RETENTION_DAYS) {
        fs.unlinkSync(fullPath);
        console.log(`   🗑️  Eliminado antiguo: ${file}`);
        deletedCount++;
      }
    });
    
    if (deletedCount === 0) console.log('   Todo limpio (no hay archivos caducados).');
    
  } catch (error) {
    console.warn('⚠️ Aviso menor en limpieza:', error);
  }
}

main();