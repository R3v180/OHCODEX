import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

async function fix() {
  await client.connect();
  console.log('🔍 Verificando posts del blog...\n');
  
  // Ver todos los posts recientes
  const posts = await client.query(`
    SELECT p.id, p.published_date, pl.title, pl.slug, pl._locale
    FROM posts p
    LEFT JOIN posts_locales pl ON p.id = pl._parent_id
    WHERE pl._locale = 'es'
    ORDER BY p.id DESC
    LIMIT 10
  `);
  
  console.log('Posts recientes:');
  posts.rows.forEach(row => {
    console.log(`  ID ${row.id}: ${row.title?.substring(0, 50) || 'SIN TÍTULO'}... (${row.published_date ? new Date(row.published_date).toISOString().split('T')[0] : 'sin fecha'})`);
  });
  
  // Buscar posts sin título o vacíos
  const emptyPosts = await client.query(`
    SELECT p.id 
    FROM posts p
    LEFT JOIN posts_locales pl ON p.id = pl._parent_id
    WHERE pl.title IS NULL OR pl.title = ''
  `);
  
  if (emptyPosts.rows.length > 0) {
    console.log(`\n⚠️  Posts vacíos encontrados: ${emptyPosts.rows.length}`);
    console.log('  IDs:', emptyPosts.rows.map(r => r.id).join(', '));
    
    // Eliminar posts vacíos
    for (const row of emptyPosts.rows) {
      await client.query('DELETE FROM posts WHERE id = $1', [row.id]);
      console.log(`  ✅ Eliminado post vacío ID: ${row.id}`);
    }
  }
  
  // Verificar registros media
  const media = await client.query(`
    SELECT m.id, m.filename, m.alt, p.id as post_id
    FROM media m
    LEFT JOIN posts p ON p.cover_image_id = m.id
    WHERE m.filename LIKE 'blog-%'
    ORDER BY m.id DESC
  `);
  
  console.log('\n📸 Registros de media:');
  media.rows.forEach(row => {
    console.log(`  ID ${row.id}: ${row.filename} (Post: ${row.post_id || 'sin asignar'})`);
  });
  
  await client.end();
}

fix().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
