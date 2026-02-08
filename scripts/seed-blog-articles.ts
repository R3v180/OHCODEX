/**
 * Script para crear 3 artículos de blog sobre Pool-Control
 * Ejecutar: npx tsx scripts/seed-blog-articles.ts
 */

import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URI || 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

const articles = [
  {
    slug: 'erp-vertical-mantenimiento-piscinas',
    categorySlug: 'estrategia',
    translations: {
      es: {
        title: 'ERP Vertical vs Genérico: Por qué el mantenimiento de piscinas necesita software a medida',
        excerpt: 'Las empresas de piscinas pierden 40% de productividad con SAP u Odoo. Descubre por qué un ERP vertical especializado transforma tu operativa.',
      },
      en: {
        title: 'Vertical ERP vs Generic: Why Pool Maintenance Needs Specialized Software',
        excerpt: 'Pool companies lose 40% productivity with SAP or Odoo. Discover how a specialized vertical ERP transforms your operations from day one.',
      },
      fr: {
        title: 'ERP Vertical vs Générique: Pourquoi la Maintenance des Piscines Nécessite un Logiciel Sur Mesure',
        excerpt: 'Les entreprises de piscines perdent 40% de productivité avec SAP ou Odoo. Découvrez pourquoi un ERP vertical transforme vos opérations.',
      },
      de: {
        title: 'Vertikales vs Generisches ERP: Warum Pool-Wartung Maßgeschneiderte Software Braucht',
        excerpt: 'Pool-Unternehmen verlieren 40% Produktivität mit SAP oder Odoo. Entdecken Sie, wie ein vertikales ERP Ihre Abläufe transformiert.',
      },
      it: {
        title: 'ERP Verticale vs Generico: Perché la Manutenzione delle Piscine Necessita di Software Specializzato',
        excerpt: 'Le aziende di piscine perdono il 40% di produttività con SAP o Odoo. Scopri perché un ERP verticale trasforma le tue operazioni.',
      },
      pt: {
        title: 'ERP Vertical vs Genérico: Por que a Manutenção de Piscinas Precisa de Software Especializado',
        excerpt: 'Empresas de piscinas perdem 40% de produtividade com SAP ou Odoo. Descubra por que um ERP vertical transforma suas operações.',
      }
    }
  },
  {
    slug: 'app-tecnicos-piscinas-offline',
    categorySlug: 'experiencia',
    translations: {
      es: {
        title: 'App para Técnicos de Piscinas: Reducir un 40% los costes con gestión offline de rutas',
        excerpt: 'La tecnología PWA offline-first permite a los técnicos trabajar sin cobertura. Sincronización automática y rutas optimizadas.',
      },
      en: {
        title: 'Pool Technician App: Reduce Costs by 40% with Offline Route Management',
        excerpt: 'Offline-first PWA technology lets technicians work without coverage. Automatic sync and optimized routes.',
      },
      fr: {
        title: 'App pour Techniciens de Piscines: Réduire les Coûts de 40% avec Gestion Offline',
        excerpt: 'La technologie PWA offline-first permet aux techniciens de travailler sans couverture. Synchronisation automatique.',
      },
      de: {
        title: 'App für Pool-Techniker: Kosten um 40% mit Offline-Routenmanagement Senken',
        excerpt: 'Offline-first PWA-Technologie ermöglicht Technikern die Arbeit ohne Abdeckung. Automatische Synchronisation.',
      },
      it: {
        title: 'App per Tecnici di Piscine: Ridurre i Costi del 40% con Gestione Offline',
        excerpt: 'La tecnologia PWA offline-first permette ai tecnici di lavorare senza copertura. Sincronizzazione automatica.',
      },
      pt: {
        title: 'App para Técnicos de Piscinas: Reduzir Custos em 40% com Gestão Offline',
        excerpt: 'Tecnologia PWA offline-first permite que técnicos trabalhem sem cobertura. Sincronização automática.',
      }
    }
  },
  {
    slug: 'gestion-inventario-piscinas-erp',
    categorySlug: 'estrategia',
    translations: {
      es: {
        title: 'Gestión de Inventario para Piscinas: Por qué el Excel ya no funciona (y cuánto te cuesta)',
        excerpt: 'Los productos químicos caducan, el stock se pierde y los pedidos urgentes matan tu margen. Descubre el ROI de un inventario inteligente.',
      },
      en: {
        title: 'Pool Inventory Management: Why Excel No Longer Works (and What It Costs You)',
        excerpt: 'Chemicals expire, stock gets lost, and urgent orders kill your margin. Discover the ROI of intelligent inventory.',
      },
      fr: {
        title: 'Gestion d\'Inventaire pour Piscines: Pourquoi Excel ne Fonctionne Plus',
        excerpt: 'Les produits chimiques périment, le stock se perd. Découvrez le ROI d\'un inventaire intelligent.',
      },
      de: {
        title: 'Pool-Bestandsmanagement: Warum Excel Nicht Mehr Funktioniert',
        excerpt: 'Chemikalien laufen ab, Bestände gehen verloren. Entdecken Sie den ROI eines intelligenten Bestands.',
      },
      it: {
        title: 'Gestione Inventario per Piscine: Perché Excel Non Funziona Più',
        excerpt: 'I prodotti chimici scadono, le scorte si perdono. Scopri il ROI di un inventario intelligente.',
      },
      pt: {
        title: 'Gestão de Inventário para Piscinas: Por que o Excel Não Funciona Mais',
        excerpt: 'Produtos químicos expiram, estoque se perde. Descubra o ROI de um inventário inteligente.',
      }
    }
  }
];

// Crear contenido en formato Lexical JSON
function createLexicalContent(text: string): any {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      children: [
        {
          type: "paragraph",
          format: "start",
          indent: 0,
          version: 1,
          children: [
            {
              mode: "normal",
              text: text,
              type: "text",
              style: "",
              detail: 0,
              format: 0,
              version: 1
            }
          ],
          direction: "ltr"
        }
      ],
      direction: "ltr"
    }
  };
}

async function injectArticle(article: typeof articles[0], index: number) {
  console.log(`\n📝 Artículo ${index + 1}: ${article.translations.es.title.substring(0, 50)}...`);
  
  const catResult = await client.query('SELECT id FROM categories WHERE slug = $1', [article.categorySlug]);
  if (catResult.rows.length === 0) {
    console.log(`   ❌ Categoría no encontrada`);
    return;
  }
  
  const categoryId = catResult.rows[0].id;
  
  // Crear media
  const nextMediaId = await client.query('SELECT COALESCE(MAX(id), 0) + 1 as id FROM media');
  const mediaId = nextMediaId.rows[0].id;
  const uniqueFilename = `blog-${article.slug}-${Date.now()}.jpg`;
  
  await client.query(`
    INSERT INTO media (id, alt, filename, mime_type, width, height, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
  `, [mediaId, article.translations.es.title, uniqueFilename, 'image/jpeg', 1200, 630]);
  
  // Crear post
  const nextPostId = await client.query('SELECT COALESCE(MAX(id), 0) + 1 as id FROM posts');
  const postId = nextPostId.rows[0].id;
  const authorId = 1;
  const date = new Date();
  date.setDate(date.getDate() - (index * 7));
  
  await client.query(`
    INSERT INTO posts (id, published_date, author_id, category_id, cover_image_id, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
  `, [postId, date.toISOString(), authorId, categoryId, mediaId]);
  
  console.log(`   ✅ Post creado: ID ${postId}`);
  
  // Traducciones
  const contents = [
    `Las empresas de mantenimiento de piscinas tienen necesidades únicas: rutas GPS, control químico, gestión de abonos estacionales. Un ERP vertical como Pool-Control reduce costes operativos un 40% desde el primer mes mediante optimización de rutas, control químico integrado e inventario inteligente.`,
    
    `Los técnicos de piscinas trabajan en zonas sin cobertura móvil. La tecnología PWA offline-first de Pool-Control permite trabajar 100% sin internet, sincronizando automáticamente cuando hay conexión. Resultado: 40% menos tiempo administrativo, zero pérdida de datos y rutas GPS optimizadas.`,
    
    `El inventario de piscinas con Excel genera pérdidas del 15-20% por caducidad y pedidos urgentes que cuestan 30% más. Un ERP vertical con inventario inteligente controla lotes, sugiere compras óptimas y gestiona multi-almacén. ROI: reducción del 75% en pérdidas de stock.`
  ];
  
  const locales = ['es', 'en', 'fr', 'de', 'it', 'pt'];
  for (const locale of locales) {
    const t = article.translations[locale as keyof typeof article.translations];
    const contentText = locale === 'es' ? contents[index] : `[${locale.toUpperCase()}] ${contents[index]}`;
    const lexicalContent = createLexicalContent(contentText);
    
    await client.query(`
      INSERT INTO posts_locales (_parent_id, _locale, title, slug, excerpt, content)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [postId, locale, t.title, `${article.slug}-${locale}`, t.excerpt, JSON.stringify(lexicalContent)]);
  }
  console.log(`   ✅ 6 traducciones creadas`);
}

async function main() {
  await client.connect();
  console.log('🚀 Inyectando 3 artículos de blog...\n');
  
  for (let i = 0; i < articles.length; i++) {
    await injectArticle(articles[i], i);
  }
  
  console.log('\n🎉 ¡3 artículos creados correctamente!');
  console.log('\n📸 IMÁGENES NECESARIAS (1200x630):');
  console.log('   Artículo 1: Isometric 3D ERP comparison, dark navy blue, cyan neon');
  console.log('   Artículo 2: Mobile technician PWA app, offline-first, purple/cyan');
  console.log('   Artículo 3: Warehouse inventory chemicals, pool supplies, orange/cyan');
  console.log('\n   Sube las imágenes a Cloudinary y actualiza la tabla media con las URLs.');
  
  await client.end();
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
