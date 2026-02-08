/**
 * Script para actualizar redes sociales en company_info
 * Ejecutar: npx tsx scripts/seed-social.ts
 */

import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URI || 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

const socialData = {
  facebook: 'https://www.facebook.com/cronojob',
  github: 'https://github.com/R3v180',
  linkedin: null,
  twitter: null,
};

async function seedSocial() {
  await client.connect();
  
  console.log('🌱 Actualizando redes sociales en company_info...\n');
  
  // Obtener IDs de company_info
  const companies = await client.query(`SELECT id FROM company_info`);
  
  if (companies.rows.length === 0) {
    console.log('❌ No existe company_info. Abortando.');
    await client.end();
    return;
  }
  
  console.log(`📄 Encontrados ${companies.rows.length} registros de company_info\n`);
  
  // Primero verificar si existe la columna facebook
  const columns = await client.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'company_info' AND column_name = 'facebook'
  `);
  
  if (columns.rows.length === 0) {
    console.log('⚠️  La columna "facebook" no existe en la BD.');
    console.log('   Necesitas ejecutar primero: npm run payload migrate\n');
    console.log('   Mientras tanto, solo actualizaré GitHub...\n');
    
    // Actualizar solo GitHub
    for (const row of companies.rows) {
      const companyId = row.id;
      
      await client.query(`
        UPDATE company_info 
        SET github = $1
        WHERE id = $2
      `, [socialData.github, companyId]);
      
      console.log(`✅ GitHub actualizado para company_info ID: ${companyId}`);
    }
    
    console.log(`\n🎉 GitHub actualizado: ${socialData.github}`);
    console.log(`⚠️  Para añadir Facebook, ejecuta: npm run payload migrate`);
    
  } else {
    // Actualizar todas las redes sociales
    for (const row of companies.rows) {
      const companyId = row.id;
      
      await client.query(`
        UPDATE company_info 
        SET facebook = $1, github = $2, linkedin = $3, twitter = $4
        WHERE id = $5
      `, [
        socialData.facebook,
        socialData.github,
        socialData.linkedin,
        socialData.twitter,
        companyId
      ]);
      
      console.log(`✅ Actualizado company_info ID: ${companyId}`);
    }
    
    console.log(`\n🎉 Redes sociales actualizadas:`);
    console.log(`   Facebook: ${socialData.facebook}`);
    console.log(`   GitHub: ${socialData.github}`);
    console.log(`   LinkedIn: ${socialData.linkedin || 'No configurado'}`);
    console.log(`   Twitter: ${socialData.twitter || 'No configurado'}`);
  }
  
  await client.end();
}

seedSocial().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
