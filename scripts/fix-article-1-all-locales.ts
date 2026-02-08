import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

function p(text: string) {
  return {
    type: "paragraph",
    format: "start",
    indent: 0,
    version: 1,
    children: [{
      mode: "normal",
      text,
      type: "text",
      style: "",
      detail: 0,
      format: 0,
      version: 1
    }],
    direction: "ltr"
  };
}

function h2(text: string) {
  return {
    tag: "h2",
    type: "heading",
    format: "start",
    indent: 0,
    version: 1,
    children: [{
      text,
      type: "text",
      version: 1
    }],
    direction: "ltr"
  };
}

// Contenidos por idioma
const contents: Record<string, any> = {
  en: {
    root: {
      type: "root", format: "", indent: 0, version: 1,
      children: [
        p("When a pool maintenance company exceeds €50,000 in annual revenue, an inevitable technological crossroads emerges: implement a generic ERP like SAP Business One, Odoo, or Microsoft Dynamics, or bet on a specialized vertical solution like Pool-Control? This decision will determine not only operational efficiency for the coming years but also the company's ability to scale without headaches."),
        h2("The Unlimited Customization Trap"),
        p("Generic ERPs promise to \"adapt to any sector\" through configurable modules and custom developments. Reality, however, is usually less idyllic. Implementing SAP or Odoo for a pool company requires between 6 and 18 months of development, dozens of specialized consultants, and an initial budget that rarely drops below €30,000."),
        p("The main problem isn't technical but conceptual. A generic ERP is born to manage manufacturing companies, retailers, or standard professional services. It doesn't intrinsically understand what a public pool is versus a private one, doesn't manage chlorine batches with critical expiration dates, and certainly doesn't optimize technician routes considering business seasonality."),
        h2("Predictive vs Corrective Maintenance"),
        p("Pool-Control includes predictive maintenance algorithms based on chemical parameters, visit history, and weather conditions. The system anticipates when a pool will need attention before the customer calls complaining about green water. Generic ERPs operate in reactive mode: a ticket is generated when something has already failed."),
        p("This paradigm difference directly impacts customer retention. Companies using Pool-Control report 40% reductions in urgent incidents and 25% increases in satisfaction measured by NPS, simply because they anticipate problems that other systems ignore until it's too late."),
        h2("Intelligent Route Optimization"),
        p("A pool technician isn't a package delivery driver. Their job involves variable travel times depending on urban traffic, unpredictable service times depending on water condition, and dynamic priorities based on chlorine or pH alerts. Pool-Control integrates all these factors into its route optimization engine, reducing unnecessary kilometers by an average of 30%."),
        p("Generic ERPs with \"field service\" modules apply transport logistics algorithms that ignore the chemical complexity of the business. The result is theoretically optimal but practically unviable routes, where the technician wastes valuable time traveling unnecessarily between areas that an intelligent planner would have logically grouped."),
        h2("Sanitary Regulatory Compliance"),
        p("Public pools in Spain are subject to Royal Decree 742/2013, which requires periodic legionella controls, chemical parameter records, and treatment traceability. Pool-Control automatically generates the reports required by health authorities, with immutable timestamps and legally valid digital signatures."),
        p("Adapting a generic ERP to meet these requirements requires specific developments that easily exceed an additional €15,000. And even then, the result will never be as polished as a native solution that has evolved over years alongside real companies in the sector."),
        h2("The Real Cost of the \"Economical Solution\""),
        p("A comparative TCO (Total Cost of Ownership) analysis over 5 years reveals surprising figures. A \"cheap\" generic ERP like Odoo Community, with all the developments needed to match Pool-Control's functionality, accumulates between €45,000 and €80,000 when we add licenses, consultancy, customization, and maintenance."),
        p("Pool-Control, with its SaaS model that includes automatic updates, specialized support, and constant product evolution, rarely exceeds €18,000 in the same period. The difference isn't just economic: it's the peace of mind of knowing that the software will evolve with the business without depending on external consultancies for every small change."),
        h2("Conclusion: Specialization as Competitive Advantage"),
        p("In a market where differentiation is increasingly difficult, using tools specifically designed for your business constitutes a tangible strategic advantage. Pool-Control isn't simply \"another ERP\" with a pool skin: it's the result of years of iteration alongside real companies facing the same challenges as yours every day."),
        p("The question isn't whether your company can afford a specialized vertical solution. The question is whether it can afford to continue operating with generic tools that will never truly understand the pool business.")
      ]
    }
  },
  fr: {
    root: {
      type: "root", format: "", indent: 0, version: 1,
      children: [
        p("Lorsqu'une entreprise d'entretien de piscines dépasse 50 000 € de chiffre d'affaires annuel, un carrefour technologique inévitable émerge : implémenter un ERP générique comme SAP Business One, Odoo ou Microsoft Dynamics, ou miser sur une solution verticale spécialisée comme Pool-Control ? Cette décision déterminera non seulement l'efficacité opérationnelle des années à venir, mais aussi la capacité de l'entreprise à se développer sans maux de tête."),
        h2("Le Piège de la Personnalisation Illimitée"),
        p("Les ERP génériques promettent de \"s'adapter à n'importe quel secteur\" grâce à des modules configurables et des développements sur mesure. La réalité, cependant, est généralement moins idyllique. L'implémentation de SAP ou Odoo pour une entreprise de piscines nécessite entre 6 et 18 mois de développement, des dizaines de consultants spécialisés et un budget initial qui descend rarement en dessous de 30 000 €."),
        p("Le problème principal n'est pas technique mais conceptuel. Un ERP générique est conçu pour gérer des entreprises manufacturières, des commerces de détail ou des services professionnels standard. Il ne comprend pas intrinsèquement ce qu'est une piscine publique par rapport à une privée, ne gère pas les lots de chlore avec des dates d'expiration critiques, et ne optimise certainement pas les itinéraires des techniciens en tenant compte de la saisonnalité de l'activité."),
        h2("Maintenance Prédictive vs Corrective"),
        p("Pool-Control inclut des algorithmes de maintenance prédictive basés sur les paramètres chimiques, l'historique des visites et les conditions météorologiques. Le système anticipe quand une piscine aura besoin d'attention avant que le client n'appelle pour se plaindre de l'eau verte. Les ERP génériques fonctionnent en mode réactif : un ticket est généré lorsque quelque chose a déjà défaillu."),
        p("Cette différence de paradigme impacte directement la rétention des clients. Les entreprises utilisant Pool-Control rapportent des réductions de 40% des incidents urgents et des augmentations de 25% de la satisfaction mesurée par NPS, simplement parce qu'elles anticipent les problèmes que d'autres systèmes ignorent jusqu'à ce qu'il soit trop tard."),
        h2("Optimisation Intelligente des Itinéraires"),
        p("Un technicien de piscine n'est pas un livreur de colis. Son travail implique des temps de déplacement variables selon le trafic urbain, des temps de service imprévisibles selon l'état de l'eau, et des priorités dynamiques selon les alertes de chlore ou de pH. Pool-Control intègre tous ces facteurs dans son moteur d'optimisation d'itinéraires, réduisant les kilomètres inutiles de 30% en moyenne."),
        p("Les ERP génériques avec des modules \"field service\" appliquent des algorithmes de logistique de transport qui ignorent la complexité chimique de l'activité. Le résultat est des itinéraires théoriquement optimaux mais pratiquement inviables, où le technicien perd un temps précieux à se déplacer inutilement entre des zones qu'un planificateur intelligent aurait logiquement regroupées."),
        h2("Conformité Réglementaire Sanitaire"),
        p("Les piscines publiques en Espagne sont soumises au Décret Royal 742/2013, qui exige des contrôles périodiques de légionelle, des registres de paramètres chimiques et une traçabilité des traitements. Pool-Control génère automatiquement les rapports exigés par les autorités sanitaires, avec des horodatages immuables et des signatures numériques juridiquement valides."),
        p("Adapter un ERP générique pour répondre à ces exigences nécessite des développements spécifiques qui dépassent facilement 15 000 € supplémentaires. Et même alors, le résultat ne sera jamais aussi abouti qu'une solution native qui a évolué au fil des années aux côtés d'entreprises réelles du secteur."),
        h2("Le Coût Réel de la \"Solution Économique\""),
        p("Une analyse comparative du TCO (Coût Total de Possession) sur 5 ans révèle des chiffres surprenants. Un ERP générique \"bon marché\" comme Odoo Community, avec tous les développements nécessaires pour égaler la fonctionnalité de Pool-Control, accumule entre 45 000 € et 80 000 € quand on ajoute les licences, la consultance, la personnalisation et la maintenance."),
        p("Pool-Control, avec son modèle SaaS qui inclut les mises à jour automatiques, le support spécialisé et l'évolution constante du produit, dépasse rarement les 18 000 € sur la même période. La différence n'est pas seulement économique : c'est la tranquillité d'esprit de savoir que le logiciel évoluera avec l'entreprise sans dépendre de cabinets externes pour chaque petit changement."),
        h2("Conclusion : La Spécialisation comme Avantage Compétitif"),
        p("Dans un marché où la différenciation est de plus en plus difficile, utiliser des outils spécifiquement conçus pour votre entreprise constitue un avantage stratégique tangible. Pool-Control n'est pas simplement \"un autre ERP\" avec un habillage piscine : c'est le résultat d'années d'itération aux côtés d'entreprises réelles qui font face aux mêmes défis que la vôtre chaque jour."),
        p("La question n'est pas si votre entreprise peut se permettre une solution verticale spécialisée. La question est si elle peut se permettre de continuer à opérer avec des outils génériques qui ne comprendront jamais vraiment le métier des piscines.")
      ]
    }
  },
  de: {
    root: {
      type: "root", format: "", indent: 0, version: 1,
      children: [
        p("Wenn ein Pool-Wartungsunternehmen einen Jahresumsatz von 50.000 € übersteigt, entsteht ein unvermeidlicher technologischer Scheideweg: Implementierung eines generischen ERP-Systems wie SAP Business One, Odoo oder Microsoft Dynamics, oder Setzen auf eine spezialisierte Branchenlösung wie Pool-Control? Diese Entscheidung bestimmt nicht nur die operative Effizienz der kommenden Jahre, sondern auch die Fähigkeit des Unternehmens, ohne Kopfschmerzen zu wachsen."),
        h2("Die Falle der Unbegrenzten Anpassung"),
        p("Generische ERP-Systeme versprechen, sich \"an jeden Sektor anzupassen\" durch konfigurierbare Module und maßgeschneiderte Entwicklungen. Die Realität ist jedoch normalerweise weniger idyllisch. Die Implementierung von SAP oder Odoo für ein Pool-Unternehmen erfordert zwischen 6 und 18 Monaten Entwicklung, Dutzende spezialisierter Berater und ein Anfangsbudget, das selten unter 30.000 € liegt."),
        p("Das Hauptproblem ist nicht technischer, sondern konzeptioneller Natur. Ein generisches ERP-System ist für die Verwaltung von Fertigungsunternehmen, Einzelhändlern oder Standard-Dienstleistern konzipiert. Es versteht nicht von Natur aus, was ein öffentlicher Pool im Vergleich zu einem privaten ist, verwaltet keine Chlorchargen mit kritischen Verfallsdaten und optimiert schon gar nicht Routen von Technikern unter Berücksichtigung der Saisonalität des Geschäfts."),
        h2("Prädiktive vs Korrektive Wartung"),
        p("Pool-Control enthält prädiktive Wartungsalgorithmen basierend auf chemischen Parametern, Besuchshistorie und Wetterbedingungen. Das System antizipiert, wann ein Pool Aufmerksamkeit benötigt, bevor der Kunde anruft und sich über grünes Wasser beschwert. Generische ERP-Systeme arbeiten im reaktiven Modus: Ein Ticket wird erstellt, wenn etwas bereits ausgefallen ist."),
        p("Dieser Paradigmenunterschied wirkt sich direkt auf die Kundenbindung aus. Unternehmen, die Pool-Control nutzen, berichten von 40% Reduktionen bei dringenden Vorfällen und 25% Steigerungen der Zufriedenheit gemessen am NPS, einfach weil sie Probleme antizipieren, die andere Systeme ignorieren, bis es zu spät ist."),
        h2("Intelligente Routenoptimierung"),
        p("Ein Pool-Techniker ist kein Paketzusteller. Seine Arbeit umfasst variable Fahrzeiten je nach Stadtverkehr, unvorhersehbare Servicezeiten je nach Wasserzustand und dynamische Prioritäten basierend auf Chlor- oder pH-Warnungen. Pool-Control integriert all diese Faktoren in seine Routenoptimierungs-Engine und reduziert unnötige Kilometer durchschnittlich um 30%."),
        p("Generische ERP-Systeme mit \"Field Service\"-Modulen wenden Transportlogistik-Algorithmen an, die die chemische Komplexität des Geschäfts ignorieren. Das Ergebnis sind theoretisch optimale, aber praktisch undurchführbare Routen, bei denen der Techniker wertvolle Zeit damit verschwendet, unnötig zwischen Gebieten zu fahren, die ein intelligenter Planer logisch gruppiert hätte."),
        h2("Einhaltung von Gesundheitsvorschriften"),
        p("Öffentliche Pools in Spanien unterliegen dem Königlichen Dekret 742/2013, das regelmäßige Legionellen-Kontrollen, Aufzeichnungen chemischer Parameter und Rückverfolgbarkeit von Behandlungen erfordert. Pool-Control erstellt automatisch die von den Gesundheitsbehörden geforderten Berichte mit unveränderlichen Zeitstempeln und rechtlich gültigen digitalen Signaturen."),
        p("Die Anpassung eines generischen ERP-Systems zur Erfüllung dieser Anforderungen erfordert spezifische Entwicklungen, die leicht zusätzliche 15.000 € übersteigen. Und selbst dann wird das Ergebnis nie so ausgereift sein wie eine native Lösung, die über Jahre hinweg zusammen mit realen Unternehmen der Branche weiterentwickelt wurde."),
        h2("Die Realen Kosten der \"Günstigen Lösung\""),
        p("Eine vergleichende TCO-Gesamtbetrachtung (Total Cost of Ownership) über 5 Jahre ergibt überraschende Zahlen. Ein \"günstiges\" generisches ERP wie Odoo Community, mit allen Entwicklungen, die notwendig sind, um die Funktionalität von Pool-Control zu erreichen, summiert sich auf zwischen 45.000 € und 80.000 €, wenn wir Lizenzen, Beratung, Anpassung und Wartung hinzuzählen."),
        p("Pool-Control, mit seinem SaaS-Modell, das automatische Updates, spezialisierten Support und konstante Produktentwicklung umfasst, übersteigt in der gleichen Periode selten 18.000 €. Der Unterschied ist nicht nur wirtschaftlich: Es ist die Gewissheit, dass die Software mit dem Unternehmen weiterentwickelt wird, ohne für jede kleine Änderung auf externe Berater angewiesen zu sein."),
        h2("Fazit: Spezialisierung als Wettbewerbsvorteil"),
        p("In einem Markt, wo Differenzierung immer schwieriger wird, stellt die Verwendung von speziell für Ihr Geschäft entwickelten Tools einen greifbaren strategischen Vorteil dar. Pool-Control ist nicht einfach \"nur ein weiteres ERP\" mit einem Pool-Design: Es ist das Ergebnis jahrelanger Iteration zusammen mit realen Unternehmen, die jeden Tag denselben Herausforderungen wie Ihres gegenüberstehen."),
        p("Die Frage ist nicht, ob Ihr Unternehmen sich eine spezialisierte Branchenlösung leisten kann. Die Frage ist, ob es sich leisten kann, weiterhin mit generischen Tools zu arbeiten, die das Pool-Geschäft nie wirklich verstehen werden.")
      ]
    }
  },
  it: {
    root: {
      type: "root", format: "", indent: 0, version: 1,
      children: [
        p("Quando un'azienda di manutenzione piscine supera i 50.000 € di fatturato annuo, emerge un crocevia tecnologico inevitabile: implementare un ERP generico come SAP Business One, Odoo o Microsoft Dynamics, o puntare su una soluzione verticale specializzata come Pool-Control? Questa decisione determinerà non solo l'efficienza operativa dei prossimi anni, ma anche la capacità dell'azienda di scalare senza grattacapi."),
        h2("L'Inganno della Personalizzazione Illimitata"),
        p("Gli ERP generici promettono di \"adattarsi a qualsiasi settore\" attraverso moduli configurabili e sviluppi su misura. La realtà, tuttavia, è solitamente meno idilliaca. Implementare SAP o Odoo per un'azienda di piscine richiede tra i 6 e i 18 mesi di sviluppo, dozzine di consulenti specializzati e un budget iniziale che raramente scende sotto i 30.000 €."),
        p("Il problema principale non è tecnico, ma concettuale. Un ERP generico nasce per gestire aziende manifatturiere, rivenditori o servizi professionali standard. Non capisce intrinsecamente cosa sia una piscina pubblica rispetto a una privata, non gestisce lotti di cloro con scadenze critiche, e tanto meno ottimizza i percorsi dei tecnici considerando la stagionalità del business."),
        h2("Manutenzione Predittiva vs Correttiva"),
        p("Pool-Control include algoritmi di manutenzione predittiva basati su parametri chimici, storico delle visite e condizioni meteorologiche. Il sistema anticipa quando una piscina avrà bisogno di attenzione prima che il cliente chiami lamentandosi dell'acqua verde. Gli ERP generici operano in modalità reattiva: un ticket viene generato quando qualcosa è già fallito."),
        p("Questa differenza paradigmatica impatta direttamente sulla ritenzione dei clienti. Le aziende che utilizzano Pool-Control riportano riduzioni del 40% negli incidenti urgenti e aumenti del 25% nella soddisfazione misurata tramite NPS, semplicemente perché anticipano problemi che altri sistemi ignorano fino a quando è troppo tardi."),
        h2("Ottimizzazione Intelligente dei Percorsi"),
        p("Un tecnico di piscine non è un corriere di pacchi. Il suo lavoro comporta tempi di spostamento variabili in base al traffico urbano, tempi di servizio imprevedibili in base alle condizioni dell'acqua, e priorità dinamiche in base agli alert di cloro o pH. Pool-Control integra tutti questi fattori nel suo motore di ottimizzazione dei percorsi, riducendo i chilometri non necessari del 30% in media."),
        p("Gli ERP generici con moduli \"field service\" applicano algoritmi di logistica dei trasporti che ignorano la complessità chimica del business. Il risultato sono percorsi teoricamente ottimali ma praticamente inviabili, dove il tecnico perde tempo prezioso spostandosi inutilmente tra zone che un pianificatore intelligente avrebbe raggruppato logicamente."),
        h2("Conformità Normativa Sanitaria"),
        p("Le piscine pubbliche in Spagna sono soggette al Decreto Reale 742/2013, che richiede controlli periodici della legionella, registrazione dei parametri chimici e tracciabilità dei trattamenti. Pool-Control genera automaticamente le relazioni richieste dalle autorità sanitarie, con timestamp immutabili e firme digitali giuridicamente valide."),
        p("Adattare un ERP generico per soddisfare questi requisiti richiede sviluppi specifici che facilmente superano i 15.000 € aggiuntivi. E anche allora, il risultato non sarà mai così raffinato come una soluzione nativa che si è evoluta nel corso degli anni insieme a aziende reali del settore."),
        h2("Il Costo Reale della \"Soluzione Economica\""),
        p("Un'analisi comparativa del TCO (Costo Totale di Proprietà) a 5 anni rivela cifre sorprendenti. Un ERP generico \"economico\" come Odoo Community, con tutti gli sviluppi necessari per eguagliare la funzionalità di Pool-Control, accumula tra 45.000 € e 80.000 € quando sommiamo licenze, consulenza, personalizzazione e manutenzione."),
        p("Pool-Control, con il suo modello SaaS che include aggiornamenti automatici, supporto specializzato ed evoluzione costante del prodotto, supera raramente i 18.000 € nello stesso periodo. La differenza non è solo economica: è la tranquillità di sapere che il software evolverà con l'azienda senza dipendere da consulenze esterne per ogni piccolo cambiamento."),
        h2("Conclusione: Specializzazione come Vantaggio Competitivo"),
        p("In un mercato dove la differenziazione è sempre più difficile, utilizzare strumenti progettati specificamente per il proprio business costituisce un vantaggio strategico tangibile. Pool-Control non è semplicemente \"un altro ERP\" con un tema piscine: è il risultato di anni di iterazione insieme ad aziende reali che affrontano le stesse sfide della tua ogni giorno."),
        p("La domanda non è se la tua azienda possa permettersi una soluzione verticale specializzata. La domanda è se possa permettersi di continuare a operare con strumenti generici che non capiranno mai veramente il business delle piscine.")
      ]
    }
  },
  pt: {
    root: {
      type: "root", format: "", indent: 0, version: 1,
      children: [
        p("Quando uma empresa de manutenção de piscinas supera os 50.000 € em faturamento anual, surge uma encruzilhada tecnológica inevitável: implementar um ERP genérico como SAP Business One, Odoo ou Microsoft Dynamics, ou apostar em uma solução vertical especializada como Pool-Control? Esta decisão determinará não apenas a eficiência operacional dos próximos anos, mas também a capacidade da empresa de escalar sem dores de cabeça."),
        h2("O Engano da Personalização Ilimitada"),
        p("Os ERPs genéricos prometem \"adaptar-se a qualquer setor\" através de módulos configuráveis e desenvolvimentos sob medida. A realidade, no entanto, geralmente é menos idílica. Implementar SAP ou Odoo para uma empresa de piscinas requer entre 6 e 18 meses de desenvolvimento, dezenas de consultores especializados e um orçamento inicial que raramente fica abaixo de 30.000 €."),
        p("O problema principal não é técnico, mas conceitual. Um ERP genérico nasce para gerenciar empresas manufatureiras, varejistas ou serviços profissionais padrão. Não entende intrinsecamente o que é uma piscina pública versus uma privada, não gerencia lotes de cloro com datas de validade críticas, e muito menos otimiza rotas de técnicos considerando a sazonalidade do negócio."),
        h2("Manutenção Preditiva vs Corretiva"),
        p("Pool-Control inclui algoritmos de manutenção preditiva baseados em parâmetros químicos, histórico de visitas e condições climáticas. O sistema antecipa quando uma piscina precisará de atenção antes que o cliente ligue reclamando da água verde. Os ERPs genéricos operam em modo reativo: um ticket é gerado quando algo já falhou."),
        p("Esta diferença paradigmática impacta diretamente na retenção de clientes. As empresas que utilizam Pool-Control relatam reduções de 40% em incidentes urgentes e aumentos de 25% na satisfação medida através de NPS, simplesmente porque antecipam problemas que outros sistemas ignoram até ser tarde demais."),
        h2("Otimização Inteligente de Rotas"),
        p("Um técnico de piscinas não é um entregador de encomendas. Seu trabalho envolve tempos de deslocamento variáveis dependendo do tráfego urbano, tempos de serviço imprevisíveis dependendo da condição da água, e prioridades dinâmicas conforme alertas de cloro ou pH. Pool-Control integra todos esses fatores em seu motor de otimização de rotas, reduzindo os quilômetros desnecessários em 30% em média."),
        p("ERPs genéricos com módulos de \"field service\" aplicam algoritmos de logística de transporte que ignoram a complexidade química do negócio. O resultado são rotas teoricamente ótimas mas praticamente inviáveis, onde o técnico perde tempo valioso se deslocando desnecessariamente entre áreas que um planejador inteligente teria agrupado logicamente."),
        h2("Conformidade Regulatória Sanitária"),
        p("As piscinas públicas em Espanha estão sujeitas ao Decreto Real 742/2013, que exige controles periódicos de legionella, registro de parâmetros químicos e rastreabilidade de tratamentos. Pool-Control gera automaticamente os relatórios exigidos pelas autoridades sanitárias, com carimbos de tempo imutáveis e assinaturas digitais juridicamente válidas."),
        p("Adaptar um ERP genérico para atender a esses requisitos exige desenvolvimentos específicos que facilmente superam 15.000 € adicionais. E mesmo assim, o resultado nunca será tão polido quanto uma solução nativa que evoluiu ao longo dos anos junto a empresas reais do setor."),
        h2("O Custo Real da \"Solução Econômica\""),
        p("Uma análise comparativa de TCO (Custo Total de Propriedade) em 5 anos revela números surpreendentes. Um ERP genérico \"econômico\" como Odoo Community, com todos os desenvolvimentos necessários para igualar a funcionalidade do Pool-Control, acumula entre 45.000 € e 80.000 € quando somamos licenças, consultoria, personalização e manutenção."),
        p("Pool-Control, com seu modelo SaaS que inclui atualizações automáticas, suporte especializado e evolução constante do produto, raramente supera os 18.000 € no mesmo período. A diferença não é apenas econômica: é a tranquilidade de saber que o software evoluirá com o negócio sem depender de consultorias externas para cada pequena mudança."),
        h2("Conclusão: Especialização como Vantagem Competitiva"),
        p("Em um mercado onde a diferenciação é cada vez mais difícil, utilizar ferramentas projetadas especificamente para seu negócio constitui uma vantagem estratégica tangível. Pool-Control não é simplesmente \"outro ERP\" com uma interface de piscinas: é o resultado de anos de iteração junto a empresas reais que enfrentam os mesmos desafios que a sua todos os dias."),
        p("A questão não é se sua empresa pode pagar por uma solução vertical especializada. A questão é se pode se dar ao luxo de continuar operando com ferramentas genéricas que nunca entenderão realmente o negócio de piscinas.")
      ]
    }
  }
};

async function fix() {
  await client.connect();
  
  for (const [locale, content] of Object.entries(contents)) {
    await client.query(`
      UPDATE posts_locales 
      SET content = $1
      WHERE _parent_id = 17 AND _locale = $2
    `, [JSON.stringify(content), locale]);
    console.log(`✅ Artículo 1 - ${locale.toUpperCase()} actualizado`);
  }
  
  await client.end();
  console.log('\n✅ Todos los idiomas del Artículo 1 actualizados');
}

fix();
