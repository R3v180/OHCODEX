/**
 * Script para inyectar FAQs en la landing page
 * Ejecutar: npx tsx scripts/seed-faqs.ts
 */

import { Client } from 'pg';
import { randomUUID } from 'crypto';

const client = new Client({
  connectionString: process.env.DATABASE_URI || 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

// FAQs en español
const faqsES = [
  {
    question: '¿Qué servicios ofrece OHCodex?',
    answer: 'Desarrollamos aplicaciones web progresivas (PWA), plataformas SaaS escalables, sistemas de gestión empresarial y soluciones de integración API. Nuestro stack tecnológico principal incluye Next.js, TypeScript, Node.js y PostgreSQL.'
  },
  {
    question: '¿Cuánto tiempo tarda desarrollar un proyecto?',
    answer: 'El tiempo varía según la complejidad. Un MVP (Producto Mínimo Viable) suele estar listo en 4-8 semanas. Proyectos más complejos con múltiples integraciones pueden requerir 3-6 meses. Siempre trabajamos con metodologías ágiles para entregas incrementales.'
  },
  {
    question: '¿Trabajan con clientes internacionales?',
    answer: 'Sí, operamos con modelo Remote First y tenemos experiencia trabajando con clientes de España, Europa y Latinoamérica. Nos adaptamos a diferentes zonas horarias y todos nuestros procesos están diseñados para la colaboración remota eficiente.'
  },
  {
    question: '¿Ofrecen mantenimiento post-lanzamiento?',
    answer: 'Absolutamente. Ofrecemos planes de mantenimiento continuo que incluyen monitorización 24/7, actualizaciones de seguridad, backups automatizados y soporte técnico. Entendemos que el software vivo requiere evolución constante.'
  },
  {
    question: '¿Qué diferencia a OHCodex de otras agencias?',
    answer: 'Somos un equipo técnico puro, sin comerciales. Trabajas directamente con ingenieros senior. Además, desarrollamos todas las herramientas que usamos (encryption, OCR, procesamiento de imágenes) lo que demuestra nuestra capacidad técnica real.'
  },
  {
    question: '¿Cómo garantizan la seguridad de los proyectos?',
    answer: 'Implementamos buenas prácticas de seguridad desde el día uno: encriptación AES-256, autenticación segura, protección contra inyecciones SQL y XSS, y cumplimiento GDPR. Nuestras herramientas de Vault demuestran nuestro compromiso con la privacidad.'
  }
];

// FAQs en inglés
const faqsEN = [
  {
    question: 'What services does OHCodex offer?',
    answer: 'We develop progressive web applications (PWA), scalable SaaS platforms, business management systems, and API integration solutions. Our main technology stack includes Next.js, TypeScript, Node.js, and PostgreSQL.'
  },
  {
    question: 'How long does it take to develop a project?',
    answer: 'Time varies depending on complexity. An MVP (Minimum Viable Product) is usually ready in 4-8 weeks. More complex projects with multiple integrations may require 3-6 months. We always work with agile methodologies for incremental deliveries.'
  },
  {
    question: 'Do you work with international clients?',
    answer: 'Yes, we operate with a Remote First model and have experience working with clients from Spain, Europe, and Latin America. We adapt to different time zones and all our processes are designed for efficient remote collaboration.'
  },
  {
    question: 'Do you offer post-launch maintenance?',
    answer: 'Absolutely. We offer continuous maintenance plans that include 24/7 monitoring, security updates, automated backups, and technical support. We understand that living software requires constant evolution.'
  },
  {
    question: 'What differentiates OHCodex from other agencies?',
    answer: 'We are a pure technical team, without salespeople. You work directly with senior engineers. Additionally, we develop all the tools we use (encryption, OCR, image processing) which demonstrates our real technical capability.'
  },
  {
    question: 'How do you guarantee project security?',
    answer: 'We implement security best practices from day one: AES-256 encryption, secure authentication, protection against SQL injections and XSS, and GDPR compliance. Our Vault tools demonstrate our commitment to privacy.'
  }
];

// FAQs en francés
const faqsFR = [
  {
    question: 'Quels services OHCodex propose-t-il ?',
    answer: 'Nous développons des applications web progressives (PWA), des plateformes SaaS évolutives, des systèmes de gestion d\'entreprise et des solutions d\'intégration API. Notre stack technologique principal comprend Next.js, TypeScript, Node.js et PostgreSQL.'
  },
  {
    question: 'Combien de temps faut-il pour développer un projet ?',
    answer: 'Le temps varie selon la complexité. Un MVP (Produit Minimum Viable) est généralement prêt en 4-8 semaines. Les projets plus complexes avec plusieurs intégrations peuvent nécessiter 3-6 mois. Nous travaillons toujours avec des méthodologies agiles pour des livraisons incrémentales.'
  },
  {
    question: 'Travaillez-vous avec des clients internationaux ?',
    answer: 'Oui, nous opérons avec un modèle Remote First et avons de l\'expérience avec des clients d\'Espagne, d\'Europe et d\'Amérique latine. Nous nous adaptons aux différents fuseaux horaires et tous nos processus sont conçus pour une collaboration à distance efficace.'
  },
  {
    question: 'Proposez-vous une maintenance post-lancement ?',
    answer: 'Absolument. Nous proposons des plans de maintenance continue qui incluent une surveillance 24/7, des mises à jour de sécurité, des sauvegardes automatisées et un support technique. Nous comprenons que les logiciels vivants nécessitent une évolution constante.'
  },
  {
    question: 'Qu\'est-ce qui différencie OHCodex des autres agences ?',
    answer: 'Nous sommes une équipe purement technique, sans commerciaux. Vous travaillez directement avec des ingénieurs seniors. De plus, nous développons tous les outils que nous utilisons (chiffrement, OCR, traitement d\'images) ce qui démontre notre capacité technique réelle.'
  },
  {
    question: 'Comment garantissez-vous la sécurité des projets ?',
    answer: 'Nous mettons en œuvre les meilleures pratiques de sécurité dès le premier jour : chiffrement AES-256, authentification sécurisée, protection contre les injections SQL et XSS, et conformité RGPD. Nos outils Vault démontrent notre engagement envers la confidentialité.'
  }
];

// FAQs en alemán
const faqsDE = [
  {
    question: 'Welche Dienstleistungen bietet OHCodex an?',
    answer: 'Wir entwickeln Progressive Web Apps (PWA), skalierbare SaaS-Plattformen, Unternehmensmanagementsysteme und API-Integrationslösungen. Unser Haupttechnologie-Stack umfasst Next.js, TypeScript, Node.js und PostgreSQL.'
  },
  {
    question: 'Wie lange dauert die Entwicklung eines Projekts?',
    answer: 'Die Zeit variiert je nach Komplexität. Ein MVP (Minimum Viable Product) ist normalerweise in 4-8 Wochen fertig. Komplexere Projekte mit mehreren Integrationen können 3-6 Monate erfordern. Wir arbeiten immer mit agilen Methoden für inkrementelle Lieferungen.'
  },
  {
    question: 'Arbeiten Sie mit internationalen Kunden?',
    answer: 'Ja, wir arbeiten mit einem Remote-First-Modell und haben Erfahrung mit Kunden aus Spanien, Europa und Lateinamerika. Wir passen uns verschiedenen Zeitzonen an und alle unsere Prozesse sind für effiziente Remote-Zusammenarbeit konzipiert.'
  },
  {
    question: 'Bieten Sie Wartung nach dem Launch an?',
    answer: 'Absolut. Wir bieten kontinuierliche Wartungspläne an, die 24/7 Überwachung, Sicherheitsupdates, automatisierte Backups und technischen Support umfassen. Wir verstehen, dass lebende Software ständige Weiterentwicklung erfordert.'
  },
  {
    question: 'Was unterscheidet OHCodex von anderen Agenturen?',
    answer: 'Wir sind ein rein technisches Team, ohne Vertriebsmitarbeiter. Sie arbeiten direkt mit Senior-Ingenieuren. Außerdem entwickeln wir alle Tools, die wir verwenden (Verschlüsselung, OCR, Bildverarbeitung), was unsere echte technische Fähigkeit demonstriert.'
  },
  {
    question: 'Wie garantieren Sie die Sicherheit von Projekten?',
    answer: 'Wir implementieren Best Practices für Sicherheit vom ersten Tag an: AES-256-Verschlüsselung, sichere Authentifizierung, Schutz gegen SQL-Injection und XSS, sowie DSGVO-Konformität. Unsere Vault-Tools demonstrieren unser Engagement für Datenschutz.'
  }
];

// FAQs en italiano
const faqsIT = [
  {
    question: 'Quali servizi offre OHCodex?',
    answer: 'Sviluppiamo applicazioni web progressive (PWA), piattaforme SaaS scalabili, sistemi di gestione aziendale e soluzioni di integrazione API. Il nostro stack tecnologico principale include Next.js, TypeScript, Node.js e PostgreSQL.'
  },
  {
    question: 'Quanto tempo ci vuole per sviluppare un progetto?',
    answer: 'Il tempo varia a seconda della complessità. Un MVP (Minimum Viable Product) è solitamente pronto in 4-8 settimane. Progetti più complessi con multiple integrazioni possono richiedere 3-6 mesi. Lavoriamo sempre con metodologie agili per consegne incrementali.'
  },
  {
    question: 'Lavorate con clienti internazionali?',
    answer: 'Sì, operiamo con un modello Remote First e abbiamo esperienza nel lavorare con clienti dalla Spagna, Europa e America Latina. Ci adattiamo a diversi fusi orari e tutti i nostri processi sono progettati per una collaborazione remota efficiente.'
  },
  {
    question: 'Offrite manutenzione post-lancio?',
    answer: 'Assolutamente. Offriamo piani di manutenzione continua che includono monitoraggio 24/7, aggiornamenti di sicurezza, backup automatizzati e supporto tecnico. Capiremo che il software vivente richiede un\'evoluzione costante.'
  },
  {
    question: 'Cosa differenzia OHCodex da altre agenzie?',
    answer: 'Siamo un team puramente tecnico, senza commercianti. Lavori direttamente con ingegneri senior. Inoltre, sviluppiamo tutti gli strumenti che utilizziamo (crittografia, OCR, elaborazione immagini) che dimostra la nostra reale capacità tecnica.'
  },
  {
    question: 'Come garantite la sicurezza dei progetti?',
    answer: 'Implementiamo le migliori pratiche di sicurezza dal primo giorno: crittografia AES-256, autenticazione sicura, protezione contro injection SQL e XSS, e conformità GDPR. I nostri strumenti Vault dimostrano il nostro impegno per la privacy.'
  }
];

// FAQs en portugués
const faqsPT = [
  {
    question: 'Quais serviços a OHCodex oferece?',
    answer: 'Desenvolvemos aplicações web progressivas (PWA), plataformas SaaS escaláveis, sistemas de gestão empresarial e soluções de integração API. Nossa stack tecnológica principal inclui Next.js, TypeScript, Node.js e PostgreSQL.'
  },
  {
    question: 'Quanto tempo leva para desenvolver um projeto?',
    answer: 'O tempo varia dependendo da complexidade. Um MVP (Produto Mínimo Viável) geralmente fica pronto em 4-8 semanas. Projetos mais complexos com múltiplas integrações podem exigir 3-6 meses. Trabalhamos sempre com metodologias ágeis para entregas incrementais.'
  },
  {
    question: 'Trabalham com clientes internacionais?',
    answer: 'Sim, operamos com um modelo Remote First e temos experiência trabalhando com clientes da Espanha, Europa e América Latina. Adaptamo-nos a diferentes fusos horários e todos os nossos processos são projetados para colaboração remota eficiente.'
  },
  {
    question: 'Oferecem manutenção pós-lançamento?',
    answer: 'Absolutamente. Oferecemos planos de manutenção contínua que incluem monitoramento 24/7, atualizações de segurança, backups automatizados e suporte técnico. Entendemos que software vivo requer evolução constante.'
  },
  {
    question: 'O que diferencia a OHCodex de outras agências?',
    answer: 'Somos uma equipe puramente técnica, sem vendedores. Você trabalha diretamente com engenheiros sênior. Além disso, desenvolvemos todas as ferramentas que usamos (encriptação, OCR, processamento de imagens) o que demonstra nossa capacidade técnica real.'
  },
  {
    question: 'Como garantem a segurança dos projetos?',
    answer: 'Implementamos boas práticas de segurança desde o primeiro dia: encriptação AES-256, autenticação segura, proteção contra injeções SQL e XSS, e conformidade com GDPR. Nossas ferramentas Vault demonstram nosso compromisso com a privacidade.'
  }
];

const locales: Record<string, typeof faqsES> = {
  es: faqsES,
  en: faqsEN,
  fr: faqsFR,
  de: faqsDE,
  it: faqsIT,
  pt: faqsPT,
};

async function seedFaqs() {
  await client.connect();
  
  console.log('🌱 Inyectando FAQs en la base de datos...\n');
  
  // Obtener el ID de la landing page
  const landing = await client.query(`SELECT id FROM landing_page LIMIT 1`);
  
  if (!landing.rows[0]) {
    console.log('❌ No existe landing page. Abortando.');
    await client.end();
    return;
  }
  
  const landingId = landing.rows[0].id;
  console.log(`📄 Landing page ID: ${landingId}\n`);
  
  // Verificar si ya hay FAQs
  const existingFaqs = await client.query(
    `SELECT COUNT(*) as count FROM landing_page_faqs WHERE _parent_id = $1`,
    [landingId]
  );
  
  const count = parseInt(existingFaqs.rows[0].count);
  
  if (count > 0) {
    console.log(`⚠️  Ya existen ${count} FAQs en la base de datos.`);
    console.log('   Usa el script de reset si quieres reemplazarlas.');
    await client.end();
    return;
  }
  
  // Insertar FAQs para cada idioma
  let order = 0;
  
  // Primero insertamos las filas base (español como principal)
  for (const faq of faqsES) {
    const faqId = randomUUID();
    
    await client.query(`
      INSERT INTO landing_page_faqs (id, _parent_id, _order)
      VALUES ($1, $2, $3)
    `, [faqId, landingId, order]);
    
    // Insertar traducciones para cada idioma
    for (const [locale, faqs] of Object.entries(locales)) {
      const translatedFaq = faqs[order];
      await client.query(`
        INSERT INTO landing_page_faqs_locales (_parent_id, _locale, question, answer)
        VALUES ($1, $2, $3, $4)
      `, [faqId, locale, translatedFaq.question, translatedFaq.answer]);
    }
    
    console.log(`✅ FAQ ${order + 1}: ${faq.question.substring(0, 40)}...`);
    order++;
  }
  
  console.log(`\n🎉 ${order} FAQs insertadas correctamente en 6 idiomas`);
  console.log('   Idiomas: es, en, fr, de, it, pt');
  
  await client.end();
}

seedFaqs().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
