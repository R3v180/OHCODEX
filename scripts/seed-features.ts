/**
 * Script para inyectar Features (Metodología) en la landing page
 * Ejecutar: npx tsx scripts/seed-features.ts
 */

import { Client } from 'pg';
import { randomUUID } from 'crypto';

const client = new Client({
  connectionString: process.env.DATABASE_URI || 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

// Features en español
const featuresES = [
  {
    icon: 'rocket',
    title: 'Arquitectura Cloud-Native',
    description: 'Diseñamos sistemas distribuidos y escalables desde el inicio. Infraestructura que crece con tu negocio sin reescribir código.'
  },
  {
    icon: 'zap',
    title: 'Rendimiento Ultra-Rápido',
    description: 'Optimización extrema en cada línea. PWAs que cargan en menos de 2 segundos y mantienen la fluidez incluso offline.'
  },
  {
    icon: 'shield',
    title: 'Seguridad por Diseño',
    description: 'Seguridad no es un add-on. Encriptación AES-256, autenticación robusta y cumplimiento GDPR desde el primer commit.'
  },
  {
    icon: 'database',
    title: 'Integración Total',
    description: 'Conectamos tu software con cualquier sistema existente. APIs REST, GraphQL, webhooks y sincronización de datos en tiempo real.'
  }
];

// Features en inglés
const featuresEN = [
  {
    icon: 'rocket',
    title: 'Cloud-Native Architecture',
    description: 'We design distributed and scalable systems from the start. Infrastructure that grows with your business without rewriting code.'
  },
  {
    icon: 'zap',
    title: 'Ultra-Fast Performance',
    description: 'Extreme optimization in every line. PWAs that load in less than 2 seconds and maintain fluidity even offline.'
  },
  {
    icon: 'shield',
    title: 'Security by Design',
    description: 'Security is not an add-on. AES-256 encryption, robust authentication, and GDPR compliance from the first commit.'
  },
  {
    icon: 'database',
    title: 'Total Integration',
    description: 'We connect your software with any existing system. REST APIs, GraphQL, webhooks, and real-time data synchronization.'
  }
];

// Features en francés
const featuresFR = [
  {
    icon: 'rocket',
    title: 'Architecture Cloud-Native',
    description: 'Nous concevons des systèmes distribués et évolutifs dès le départ. Infrastructure qui grandit avec votre entreprise sans réécrire de code.'
  },
  {
    icon: 'zap',
    title: 'Performance Ultra-Rapide',
    description: 'Optimisation extrême dans chaque ligne. PWAs qui se chargent en moins de 2 secondes et maintiennent la fluidité même hors ligne.'
  },
  {
    icon: 'shield',
    title: 'Sécurité par Conception',
    description: 'La sécurité n\'est pas une option. Chiffrement AES-256, authentification robuste et conformité RGPD dès le premier commit.'
  },
  {
    icon: 'database',
    title: 'Intégration Totale',
    description: 'Nous connectons votre logiciel à tout système existant. APIs REST, GraphQL, webhooks et synchronisation de données en temps réel.'
  }
];

// Features en alemán
const featuresDE = [
  {
    icon: 'rocket',
    title: 'Cloud-Native Architektur',
    description: 'Wir entwerfen verteilte und skalierbare Systeme von Anfang an. Infrastruktur, die mit Ihrem Unternehmen wächst, ohne Code neu zu schreiben.'
  },
  {
    icon: 'zap',
    title: 'Ultraschnelle Performance',
    description: 'Extreme Optimierung in jeder Zeile. PWAs, die in weniger als 2 Sekunden laden und die Flüssigkeit auch offline aufrechterhalten.'
  },
  {
    icon: 'shield',
    title: 'Sicherheit durch Design',
    description: 'Sicherheit ist kein Add-on. AES-256-Verschlüsselung, robuste Authentifizierung und DSGVO-Konformität vom ersten Commit an.'
  },
  {
    icon: 'database',
    title: 'Totale Integration',
    description: 'Wir verbinden Ihre Software mit jedem bestehenden System. REST-APIs, GraphQL, Webhooks und Echtzeit-Datensynchronisation.'
  }
];

// Features en italiano
const featuresIT = [
  {
    icon: 'rocket',
    title: 'Architettura Cloud-Native',
    description: 'Progettiamo sistemi distribuiti e scalabili fin dall\'inizio. Infrastruttura che cresce con la tua azienda senza riscrivere codice.'
  },
  {
    icon: 'zap',
    title: 'Prestazioni Ultra-Rapide',
    description: 'Ottimizzazione estrema in ogni riga. PWA che si caricano in meno di 2 secondi e mantengono la fluidità anche offline.'
  },
  {
    icon: 'shield',
    title: 'Sicurezza by Design',
    description: 'La sicurezza non è un optional. Crittografia AES-256, autenticazione robusta e conformità GDPR dal primo commit.'
  },
  {
    icon: 'database',
    title: 'Integrazione Totale',
    description: 'Colleghiamo il tuo software a qualsiasi sistema esistente. API REST, GraphQL, webhook e sincronizzazione dati in tempo reale.'
  }
];

// Features en portugués
const featuresPT = [
  {
    icon: 'rocket',
    title: 'Arquitetura Cloud-Native',
    description: 'Projetamos sistemas distribuídos e escaláveis desde o início. Infraestrutura que cresce com o seu negócio sem reescrever código.'
  },
  {
    icon: 'zap',
    title: 'Desempenho Ultra-Rápido',
    description: 'Otimização extrema em cada linha. PWAs que carregam em menos de 2 segundos e mantêm a fluidez mesmo offline.'
  },
  {
    icon: 'shield',
    title: 'Segurança por Design',
    description: 'Segurança não é um add-on. Encriptação AES-256, autenticação robusta e conformidade com GDPR desde o primeiro commit.'
  },
  {
    icon: 'database',
    title: 'Integração Total',
    description: 'Conectamos seu software a qualquer sistema existente. APIs REST, GraphQL, webhooks e sincronização de dados em tempo real.'
  }
];

const locales: Record<string, typeof featuresES> = {
  es: featuresES,
  en: featuresEN,
  fr: featuresFR,
  de: featuresDE,
  it: featuresIT,
  pt: featuresPT,
};

async function seedFeatures() {
  await client.connect();
  
  console.log('🌱 Inyectando Features (Metodología) en la base de datos...\n');
  
  // Obtener el ID de la landing page
  const landing = await client.query(`SELECT id FROM landing_page LIMIT 1`);
  
  if (!landing.rows[0]) {
    console.log('❌ No existe landing page. Abortando.');
    await client.end();
    return;
  }
  
  const landingId = landing.rows[0].id;
  console.log(`📄 Landing page ID: ${landingId}\n`);
  
  // Verificar si ya hay features
  const existing = await client.query(
    `SELECT COUNT(*) as count FROM landing_page_features_list WHERE _parent_id = $1`,
    [landingId]
  );
  
  const count = parseInt(existing.rows[0].count);
  
  if (count > 0) {
    console.log(`⚠️  Ya existen ${count} features en la base de datos.`);
    await client.end();
    return;
  }
  
  // Insertar features
  let order = 0;
  
  for (const f of featuresES) {
    const featureId = randomUUID();
    
    // Insertar fila base con icono
    await client.query(`
      INSERT INTO landing_page_features_list (id, _parent_id, _order, icon)
      VALUES ($1, $2, $3, $4)
    `, [featureId, landingId, order, f.icon]);
    
    // Insertar traducciones para cada idioma
    for (const [locale, features] of Object.entries(locales)) {
      const translated = features[order];
      await client.query(`
        INSERT INTO landing_page_features_list_locales (_parent_id, _locale, title, description)
        VALUES ($1, $2, $3, $4)
      `, [featureId, locale, translated.title, translated.description]);
    }
    
    console.log(`✅ Feature ${order + 1}: ${f.title}`);
    order++;
  }
  
  console.log(`\n🎉 ${order} features insertados correctamente en 6 idiomas`);
  
  await client.end();
}

seedFeatures().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
