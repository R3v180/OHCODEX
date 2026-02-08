import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URI || 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

async function check() {
  await client.connect();
  
  console.log('🔍 Analizando contenido de la landing page...\n');
  
  // 1. Ver el landing_page principal
  const landing = await client.query(`SELECT id FROM landing_page LIMIT 1`);
  console.log('📄 Landing page ID:', landing.rows[0]?.id || 'No hay registros');
  
  if (!landing.rows[0]) {
    console.log('❌ No existe landing page');
    await client.end();
    return;
  }
  
  const landingId = landing.rows[0].id;
  
  // 2. Ver FAQs
  const faqs = await client.query(`
    SELECT f.id, f._order, fl.question, fl.answer, fl._locale
    FROM landing_page_faqs f
    LEFT JOIN landing_page_faqs_locales fl ON f.id = fl._parent_id
    WHERE f._parent_id = $1
    ORDER BY f._order
  `, [landingId]);
  
  console.log('\n❓ FAQs encontradas:', faqs.rows.length);
  if (faqs.rows.length > 0) {
    console.log('   Primeras FAQs:');
    faqs.rows.slice(0, 6).forEach(f => {
      console.log(`   [${f._locale}] ${f.question?.substring(0, 50)}...`);
    });
  }
  
  // 3. Ver Testimonios
  const testimonials = await client.query(`
    SELECT t.id, t._order, tl.quote, tl._locale, t.author_name, t.company_name
    FROM landing_page_testimonials t
    LEFT JOIN landing_page_testimonials_locales tl ON t.id = tl._parent_id
    WHERE t._parent_id = $1
    ORDER BY t._order
  `, [landingId]);
  
  console.log('\n💬 Testimonios encontrados:', testimonials.rows.length);
  if (testimonials.rows.length > 0) {
    console.log('   Primeros testimonios:');
    testimonials.rows.slice(0, 6).forEach(t => {
      console.log(`   [${t._locale}] ${t.author_name} (${t.company_name})`);
    });
  }
  
  // 4. Ver Features
  const features = await client.query(`
    SELECT f.id, f._order, fl.title, fl.description, fl._locale
    FROM landing_page_features_list f
    LEFT JOIN landing_page_features_list_locales fl ON f.id = fl._parent_id
    WHERE f._parent_id = $1
    ORDER BY f._order
  `, [landingId]);
  
  console.log('\n⭐ Features encontrados:', features.rows.length);
  if (features.rows.length > 0) {
    console.log('   Primeros features:');
    features.rows.slice(0, 6).forEach(f => {
      console.log(`   [${f._locale}] ${f.title?.substring(0, 50)}...`);
    });
  }
  
  // 5. Ver Company Info
  const company = await client.query(`
    SELECT c.id, cl._locale, cl.default_title, cl.default_description, c.contact_email, c.linkedin, c.github, c.twitter
    FROM company_info c
    LEFT JOIN company_info_locales cl ON c.id = cl._parent_id
    LIMIT 5
  `);
  
  console.log('\n🏢 Company info:');
  if (company.rows.length > 0) {
    company.rows.forEach(c => {
      console.log(`   [${c._locale}]`);
      console.log(`       Email: ${c.contact_email || '❌'}`);
      console.log(`       LinkedIn: ${c.linkedin || '❌'}`);
      console.log(`       GitHub: ${c.github || '❌'}`);
      console.log(`       Twitter: ${c.twitter || '❌'}`);
    });
  } else {
    console.log('   ❌ No hay datos de company info');
  }
  
  await client.end();
}

check().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
