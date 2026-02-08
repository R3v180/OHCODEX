import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URI || 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

async function check() {
  await client.connect();
  
  console.log('🔍 Analizando contenido del blog...\n');
  
  // Ver columnas de posts
  const columns = await client.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'posts'
    ORDER BY ordinal_position
  `);
  console.log('📋 Columnas en posts:', columns.rows.map(r => r.column_name).join(', '));
  
  // 1. Ver categorías
  const categories = await client.query(`
    SELECT c.id, c.slug, cl.name, cl._locale
    FROM categories c
    LEFT JOIN categories_locales cl ON c.id = cl._parent_id
    ORDER BY c.slug
  `);
  
  console.log('\n📁 CATEGORÍAS:');
  const catsBySlug: Record<string, string[]> = {};
  categories.rows.forEach(row => {
    if (!catsBySlug[row.slug]) catsBySlug[row.slug] = [];
    catsBySlug[row.slug].push(`${row._locale}: ${row.name}`);
  });
  Object.entries(catsBySlug).forEach(([slug, names]) => {
    console.log(`   • ${slug}`);
    names.forEach(n => console.log(`       ${n}`));
  });
  
  // 2. Ver posts 
  const posts = await client.query(`
    SELECT p.id, pl.slug, p.published_date, pl.title, pl._locale
    FROM posts p
    LEFT JOIN posts_locales pl ON p.id = pl._parent_id
    ORDER BY p.published_date DESC NULLS LAST
    LIMIT 20
  `);
  
  console.log(`\n📝 POSTS (${posts.rows.length} registros):`);
  
  // Agrupar por post
  const postsById: Record<string, {slug: string, date: string, titles: Record<string, string>}> = {};
  posts.rows.forEach(row => {
    if (!postsById[row.id]) {
      postsById[row.id] = { slug: row.slug, date: row.published_date, titles: {} };
    }
    postsById[row.id].titles[row._locale] = row.title;
  });
  
  Object.entries(postsById).forEach(([id, post], idx) => {
    const date = post.date ? new Date(post.date).toLocaleDateString('es-ES') : 'borrador';
    const titleES = post.titles.es || post.titles.en || Object.values(post.titles)[0] || 'Sin título';
    console.log(`   ${idx + 1}. ${titleES}`);
    console.log(`       Slug: ${post.slug || 'sin-slug'} | Fecha: ${date}`);
  });
  
  // 3. Buscar posts sobre pool o piscinas
  console.log('\n🔎 Buscando posts sobre Pool/Piscinas...');
  const poolPosts = await client.query(`
    SELECT p.id, pl.slug, pl.title, pl._locale
    FROM posts p
    LEFT JOIN posts_locales pl ON p.id = pl._parent_id
    WHERE (pl.title ILIKE '%pool%' OR pl.title ILIKE '%piscina%')
  `);
  
  if (poolPosts.rows.length === 0) {
    console.log('   ❌ No hay artículos sobre Pool/Piscinas');
  } else {
    poolPosts.rows.forEach(row => {
      console.log(`   • [${row._locale}] ${row.title}`);
    });
  }
  
  // 4. Buscar posts sobre SaaS o ERP
  console.log('\n🔎 Buscando posts sobre SaaS/ERP...');
  const saasPosts = await client.query(`
    SELECT p.id, pl.slug, pl.title, pl._locale
    FROM posts p
    LEFT JOIN posts_locales pl ON p.id = pl._parent_id
    WHERE (pl.title ILIKE '%saas%' OR pl.title ILIKE '%erp%' OR pl.title ILIKE '%vertical%')
  `);
  
  if (saasPosts.rows.length === 0) {
    console.log('   ❌ No hay artículos sobre SaaS/ERP');
  } else {
    saasPosts.rows.forEach(row => {
      console.log(`   • [${row._locale}] ${row.title}`);
    });
  }
  
  await client.end();
}

check().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
