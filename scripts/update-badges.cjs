const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URI;

async function updateBadges() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('✓ Conectado a la base de datos');

    // Actualizar badges para las nuevas herramientas
    const updates = [
      { slug: 'base64', badge: 'Multi-Formato' },
      { slug: 'css-minifier', badge: 'Clean Code' },
      { slug: 'password-generator', badge: 'Military Grade' },
      { slug: 'color-palette', badge: 'Design Pro' },
      { slug: 'jwt-decoder', badge: 'Dev Essential' },
      { slug: 'regex-tester', badge: 'Pattern Master' }
    ];

    for (const { slug, badge } of updates) {
      const result = await client.query(
        'UPDATE tools SET badge = $1 WHERE slug = $2 RETURNING id',
        [badge, slug]
      );
      
      if (result.rowCount > 0) {
        console.log('✓ Actualizado', slug, '→', badge);
      } else {
        console.log('⚠️ No encontrado:', slug);
      }
    }

    console.log('\n✅ Badges actualizados correctamente');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

updateBadges();
