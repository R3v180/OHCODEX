/**
 * Script para inyectar Testimonios en la landing page
 * Ejecutar: npx tsx scripts/seed-testimonials.ts
 */

import { Client } from 'pg';
import { randomUUID } from 'crypto';

const client = new Client({
  connectionString: process.env.DATABASE_URI || 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

// Testimonios en español
const testimonialsES = [
  {
    authorName: 'Carlos Martínez',
    authorRole: 'CEO',
    companyName: 'AquaClean Solutions',
    quote: 'El equipo de OHCodex transformó completamente nuestra operación. La plataforma SaaS que desarrollaron redujo nuestros tiempos de gestión en un 70%. Su enfoque técnico y la comunicación directa con ingenieros hizo toda la diferencia.'
  },
  {
    authorName: 'Laura Sánchez',
    authorRole: 'CTO',
    companyName: 'TechVentures España',
    quote: 'Trabajar con OHCodex fue diferente desde el primer día. No nos vendieron humo, nos entregaron código que funciona y escala. El sistema de control horario que implementaron cumplió con todas las normativas y funciona perfectamente.'
  },
  {
    authorName: 'Miguel Ángel Ruiz',
    authorRole: 'Director de Operaciones',
    companyName: 'Pool Service Pro',
    quote: 'La app móvil para nuestros técnicos de piscinas cambió nuestra forma de trabajar. Rutas optimizadas, inventario en tiempo real y todo funciona offline. OHCodex entendió perfectamente nuestras necesidades específicas.'
  }
];

// Testimonios en inglés
const testimonialsEN = [
  {
    authorName: 'Carlos Martinez',
    authorRole: 'CEO',
    companyName: 'AquaClean Solutions',
    quote: 'The OHCodex team completely transformed our operation. The SaaS platform they developed reduced our management time by 70%. Their technical approach and direct communication with engineers made all the difference.'
  },
  {
    authorName: 'Laura Sanchez',
    authorRole: 'CTO',
    companyName: 'TechVentures Spain',
    quote: 'Working with OHCodex was different from day one. They didn\'t sell us smoke, they delivered working code that scales. The time tracking system they implemented met all regulations and works perfectly.'
  },
  {
    authorName: 'Miguel Angel Ruiz',
    authorRole: 'Operations Director',
    companyName: 'Pool Service Pro',
    quote: 'The mobile app for our pool technicians changed the way we work. Optimized routes, real-time inventory, and everything works offline. OHCodex perfectly understood our specific needs.'
  }
];

// Testimonios en francés
const testimonialsFR = [
  {
    authorName: 'Carlos Martinez',
    authorRole: 'PDG',
    companyName: 'AquaClean Solutions',
    quote: 'L\'équipe OHCodex a complètement transformé notre opération. La plateforme SaaS qu\'ils ont développée a réduit notre temps de gestion de 70%. Leur approche technique et la communication directe avec les ingénieurs ont fait toute la différence.'
  },
  {
    authorName: 'Laura Sanchez',
    authorRole: 'CTO',
    companyName: 'TechVentures Espagne',
    quote: 'Travailler avec OHCodex était différent dès le premier jour. Ils ne nous ont pas vendu de fumée, ils ont livré du code fonctionnel qui scale. Le système de suivi du temps qu\'ils ont mis en œuvre répond à toutes les réglementations et fonctionne parfaitement.'
  },
  {
    authorName: 'Miguel Angel Ruiz',
    authorRole: 'Directeur des Opérations',
    companyName: 'Pool Service Pro',
    quote: 'L\'application mobile pour nos techniciens de piscines a changé notre façon de travailler. Itinéraires optimisés, inventaire en temps réel, et tout fonctionne hors ligne. OHCodex a parfaitement compris nos besoins spécifiques.'
  }
];

// Testimonios en alemán
const testimonialsDE = [
  {
    authorName: 'Carlos Martinez',
    authorRole: 'CEO',
    companyName: 'AquaClean Solutions',
    quote: 'Das OHCodex-Team hat unsere Operation vollständig transformiert. Die von ihnen entwickelte SaaS-Plattform reduzierte unsere Managementzeit um 70%. Ihr technischer Ansatz und die direkte Kommunikation mit Ingenieuren machten den Unterschied.'
  },
  {
    authorName: 'Laura Sanchez',
    authorRole: 'CTO',
    companyName: 'TechVentures Spanien',
    quote: 'Die Zusammenarbeit mit OHCodex war von Tag eins an anders. Sie haben uns keinen Rauch verkauft, sondern funktionierenden Code geliefert, der skaliert. Das Zeiterfassungssystem, das sie implementiert haben, erfüllt alle Vorschriften und funktioniert perfekt.'
  },
  {
    authorName: 'Miguel Angel Ruiz',
    authorRole: 'Betriebsleiter',
    companyName: 'Pool Service Pro',
    quote: 'Die mobile App für unsere Pooltechniker hat unsere Arbeitsweise verändert. Optimierte Routen, Echtzeit-Inventar und alles funktioniert offline. OHCodex hat unsere spezifischen Bedürfnisse perfekt verstanden.'
  }
];

// Testimonios en italiano
const testimonialsIT = [
  {
    authorName: 'Carlos Martinez',
    authorRole: 'CEO',
    companyName: 'AquaClean Solutions',
    quote: 'Il team OHCodex ha completamente trasformato la nostra operazione. La piattaforma SaaS che hanno sviluppato ha ridotto il nostro tempo di gestione del 70%. Il loro approccio tecnico e la comunicazione diretta con gli ingegneri hanno fatto tutta la differenza.'
  },
  {
    authorName: 'Laura Sanchez',
    authorRole: 'CTO',
    companyName: 'TechVentures Spagna',
    quote: 'Lavorare con OHCodex è stato diverso dal primo giorno. Non ci hanno venduto fumo, ci hanno consegnato codice che funziona e scala. Il sistema di tracciamento del tempo che hanno implementato soddisfa tutte le normative e funziona perfettamente.'
  },
  {
    authorName: 'Miguel Angel Ruiz',
    authorRole: 'Direttore Operativo',
    companyName: 'Pool Service Pro',
    quote: 'L\'app mobile per i nostri tecnici piscine ha cambiato il nostro modo di lavorare. Percorsi ottimizzati, inventario in tempo reale e tutto funziona offline. OHCodex ha perfettamente compreso le nostre esigenze specifiche.'
  }
];

// Testimonios en portugués
const testimonialsPT = [
  {
    authorName: 'Carlos Martinez',
    authorRole: 'CEO',
    companyName: 'AquaClean Solutions',
    quote: 'A equipe OHCodex transformou completamente nossa operação. A plataforma SaaS que desenvolveram reduziu nosso tempo de gestão em 70%. Sua abordagem técnica e comunicação direta com engenheiros fizeram toda a diferença.'
  },
  {
    authorName: 'Laura Sanchez',
    authorRole: 'CTO',
    companyName: 'TechVentures Espanha',
    quote: 'Trabalhar com OHCodex foi diferente desde o primeiro dia. Eles não nos venderam fumaça, entregaram código que funciona e escala. O sistema de controle de tempo que implementaram cumpre todas as normas e funciona perfeitamente.'
  },
  {
    authorName: 'Miguel Angel Ruiz',
    authorRole: 'Diretor de Operações',
    companyName: 'Pool Service Pro',
    quote: 'O aplicativo móvel para nossos técnicos de piscinas mudou nossa forma de trabalhar. Rotas otimizadas, inventário em tempo real e tudo funciona offline. OHCodex entendeu perfeitamente nossas necessidades específicas.'
  }
];

const locales: Record<string, typeof testimonialsES> = {
  es: testimonialsES,
  en: testimonialsEN,
  fr: testimonialsFR,
  de: testimonialsDE,
  it: testimonialsIT,
  pt: testimonialsPT,
};

async function seedTestimonials() {
  await client.connect();
  
  console.log('🌱 Inyectando Testimonios en la base de datos...\n');
  
  // Obtener el ID de la landing page
  const landing = await client.query(`SELECT id FROM landing_page LIMIT 1`);
  
  if (!landing.rows[0]) {
    console.log('❌ No existe landing page. Abortando.');
    await client.end();
    return;
  }
  
  const landingId = landing.rows[0].id;
  console.log(`📄 Landing page ID: ${landingId}\n`);
  
  // Verificar si ya hay testimonios
  const existing = await client.query(
    `SELECT COUNT(*) as count FROM landing_page_testimonials WHERE _parent_id = $1`,
    [landingId]
  );
  
  const count = parseInt(existing.rows[0].count);
  
  if (count > 0) {
    console.log(`⚠️  Ya existen ${count} testimonios en la base de datos.`);
    await client.end();
    return;
  }
  
  // Insertar testimonios
  let order = 0;
  
  for (const t of testimonialsES) {
    const testimonialId = randomUUID();
    
    // Insertar fila base con datos del español
    await client.query(`
      INSERT INTO landing_page_testimonials (id, _parent_id, _order, author_name, company_name)
      VALUES ($1, $2, $3, $4, $5)
    `, [testimonialId, landingId, order, t.authorName, t.companyName]);
    
    // Insertar traducciones para cada idioma
    for (const [locale, testimonials] of Object.entries(locales)) {
      const translated = testimonials[order];
      await client.query(`
        INSERT INTO landing_page_testimonials_locales (_parent_id, _locale, author_role, quote)
        VALUES ($1, $2, $3, $4)
      `, [testimonialId, locale, translated.authorRole, translated.quote]);
    }
    
    console.log(`✅ Testimonio ${order + 1}: ${t.authorName} - ${t.companyName.substring(0, 30)}...`);
    order++;
  }
  
  console.log(`\n🎉 ${order} testimonios insertados correctamente en 6 idiomas`);
  
  await client.end();
}

seedTestimonials().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
