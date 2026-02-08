import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

async function deletePosts() {
  await client.connect();
  console.log('🗑️ Eliminando posts cortos...\n');
  
  // Eliminar los 3 posts que creamos (IDs 18, 19, 20)
  const postIds = [18, 19, 20];
  
  for (const id of postIds) {
    // Primero eliminar traducciones
    await client.query('DELETE FROM posts_locales WHERE _parent_id = $1', [id]);
    console.log(`  ✅ Traducciones eliminadas para post ${id}`);
    
    // Obtener cover_image_id antes de borrar
    const coverRes = await client.query('SELECT cover_image_id FROM posts WHERE id = $1', [id]);
    const coverId = coverRes.rows[0]?.cover_image_id;
    
    // Eliminar post
    await client.query('DELETE FROM posts WHERE id = $1', [id]);
    console.log(`  ✅ Post ${id} eliminado`);
    
    // Eliminar media asociada
    if (coverId) {
      await client.query('DELETE FROM media WHERE id = $1', [coverId]);
      console.log(`  ✅ Media ${coverId} eliminada`);
    }
  }
  
  console.log('\n🎉 Posts eliminados. Ahora puedo crear los artículos profesionales.');
  
  await client.end();
}

deletePosts().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
