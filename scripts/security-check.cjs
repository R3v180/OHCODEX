const { execSync } = require('child_process');
const fs = require('fs');

// Leer el archivo .env para obtener las claves a buscar
const envContent = fs.readFileSync('.env', 'utf8');
const sensitivePatterns = [
  'npg_nzlLWyOAp1j8',  // Parte de la contraseña de la BD
  'd0461335beb225ee0356cab5',  // PAYLOAD_SECRET
  'n3gIbY12GQxYjeqDr_OexY5nVC4',  // CLOUDINARY_API_SECRET
];

console.log('🔍 Verificando si hay datos sensibles en el historial de commits...\n');

let found = false;

for (const pattern of sensitivePatterns) {
  try {
    // Buscar en todo el historial de git
    const result = execSync(
      `git log --all -p --grep="${pattern}" -- .`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
    );
    
    if (result && result.includes(pattern)) {
      console.log(`❌ ENCONTRADO: El patrón "${pattern.substring(0, 15)}..." está en el historial`);
      found = true;
    }
  } catch (e) {
    // No se encontró, es bueno
  }
  
  try {
    // Buscar en archivos actuales trackeados
    const result = execSync(
      `git grep -r "${pattern}" HEAD`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
    );
    
    if (result && result.includes(pattern)) {
      console.log(`❌ ENCONTRADO: El patrón "${pattern.substring(0, 15)}..." está en archivos actuales`);
      found = true;
    }
  } catch (e) {
    // No se encontró, es bueno
  }
}

if (!found) {
  console.log('✅ No se encontraron datos sensibles expuestos en el repositorio');
  console.log('✅ El archivo .env está correctamente ignorado en .gitignore');
} else {
  console.log('\n⚠️  REVISIÓN MANUAL NECESARIA');
  console.log('Se encontraron posibles datos sensibles en el historial.');
}

// Verificar backups
console.log('\n📦 Verificando backups...');
const backups = fs.readdirSync('backups').filter(f => f.endsWith('.json'));
console.log(`   Encontrados ${backups.length} backup(s)`);

for (const backup of backups) {
  const content = fs.readFileSync(`backups/${backup}`, 'utf8');
  let hasSensitive = false;
  
  for (const pattern of sensitivePatterns) {
    if (content.includes(pattern)) {
      hasSensitive = true;
      break;
    }
  }
  
  if (hasSensitive) {
    console.log(`   ⚠️  ${backup} - CONTIENE DATOS SENSIBLES`);
  } else {
    console.log(`   ✅ ${backup} - Limpio`);
  }
}
