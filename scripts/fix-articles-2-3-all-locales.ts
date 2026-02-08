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

// ARTÍCULO 2: App para Técnicos (ID 18)
const article2: Record<string, any> = {
  es: {
    root: {
      type: "root", format: "", indent: 0, version: 1,
      children: [
        p("Los técnicos de mantenimiento de piscinas pasan el 70% de su jornada fuera de la oficina. Sin embargo, la mayoría de empresas del sector aún dependen de sistemas que requieren conexión constante a internet para registrar visitas, consultar históricos o generar informes. Cuando el técnico llega a una urbanización sin cobertura, el sistema falla y la productividad se desploma."),
        h2("La Arquitectura Offline-First"),
        p("Pool-Control implementa una Progressive Web App (PWA) diseñada desde cero para funcionar sin conexión. Los datos se almacenan localmente en el dispositivo del técnico mediante tecnologías como IndexedDB, sincronizándose automáticamente con los servidores centrales cuando la conexión vuelve a estar disponible."),
        p("Esta arquitectura no es un parche temporal ni una versión \"light\" de la aplicación. Es el núcleo mismo del sistema, diseñado para tratar la ausencia de red como un estado normal de operación, no como un error a gestionar. El técnico puede registrar parámetros químicos, tomar fotografías, firmar albaranes y consultar el histórico completo del cliente sin depender de ninguna cobertura móvil."),
        h2("Cebado de Bombas sin Conexión"),
        p("Una de las funcionalidades más críticas en el mantenimiento de piscinas es el cebado de bombas después de una limpieza de filtros. Este proceso requiere seguir una secuencia precisa mientras se observa el manómetro, algo imposible si el técnico debe alternar entre la válvula y un manual en papel o una app que no responde."),
        p("La app de Pool-Control incluye guías visuales interactivas de cebado que funcionan completamente offline. El técnico puede seguir el procedimiento paso a paso, con diagramas animados que ilustran la posición correcta de cada válvula, incluso en sótanos o zonas rurales sin señal. Esta funcionalidad sola ha reducido los errores de cebado en un 60% según estudios internos."),
        h2("Geolocalización y Trazabilidad"),
        p("Cada visita registrada en Pool-Control incluye coordenadas GPS, timestamp inmutable y firma digital del cliente. Aunque la sincronización de datos se realice horas después cuando el técnico vuelve a zona con cobertura, la trazabilidad temporal y geográfica permanece intacta y jurídicamente válida."),
        p("Esta capacidad es especialmente valiosa para empresas que mantienen piscinas públicas sujetas a inspecciones sanitarias. Los informes de legionella requieren demostrar no solo qué tratamientos se aplicaron, sino cuándo y dónde exactamente. Pool-Control proporciona esta evidencia auditiva de forma automática, sin que el técnico deba preocuparse por la cobertura durante la visita."),
        h2("Reducción del Consumo de Datos"),
        p("A diferencia de las aplicaciones tradicionales que transfieren constantemente datos entre el dispositivo y el servidor, la arquitectura offline-first de Pool-Control minimiza drásticamente el consumo de datos móviles. Las sincronizaciones son incrementales y comprimidas, reduciendo el uso de datos en un 85% comparado con soluciones convencionales."),
        p("Para empresas con docenas de técnicos en ruta, esta reducción se traduce en ahorros significativos en planes de datos corporativos. Pero más importante aún: elimina la frustración del técnico cuando la app \"se cuelga\" esperando respuesta del servidor en una zona de mala cobertura, permitiéndole concentrarse en su trabajo técnico sin distracciones tecnológicas."),
        h2("Integración con Hardware Especializado"),
        p("La app de Pool-Control se integra con fotocolorímetros digitales y sondas multiparamétricas via Bluetooth. El técnico puede medir cloro libre, pH, alcalinidad y otros parámetros químicos, y los valores se transfieren automáticamente a la aplicación sin necesidad de teclear manualmente."),
        p("Esta integración funciona completamente offline: los datos se almacenan localmente junto con la medición, y se sincronizan posteriormente cuando hay conectividad. Eliminando el error humano en la transcripción de valores químicos, Pool-Control ha demostrado mejorar la precisión de los registros en un 40%, reduciendo incidencias posteriores por tratamientos inadecuados."),
        h2("Conclusión: Tecnología que Desaparece"),
        p("La mejor tecnología es aquella que se hace invisible, que facilita el trabajo sin convertirse en un obstáculo. La app offline-first de Pool-Control cumple exactamente esta promesa: el técnico puede concentrarse en lo que mejor sabe hacer (mantener piscinas impecables) mientras el sistema se encarga silenciosamente de documentar, trazar y sincronizar toda la información operativa."),
        p("En un sector donde la fiabilidad es tan crítica como la eficiencia, depender de la cobertura móvil para realizar el trabajo diario no es solo incómodo: es un riesgo operativo inaceptable. Pool-Control elimina este riesgo, garantizando que el negocio siga funcionando independientemente de la calidad de la conectividad en cada ubicación.")
      ]
    }
  },
  en: {
    root: {
      type: "root", format: "", indent: 0, version: 1,
      children: [
        p("Pool maintenance technicians spend 70% of their workday away from the office. However, most companies in the sector still depend on systems that require constant internet connection to record visits, consult histories, or generate reports. When the technician arrives at a development without coverage, the system fails and productivity plummets."),
        h2("The Offline-First Architecture"),
        p("Pool-Control implements a Progressive Web App (PWA) designed from scratch to work without connection. Data is stored locally on the technician's device using technologies like IndexedDB, automatically synchronizing with central servers when the connection becomes available again."),
        p("This architecture is not a temporary patch nor a \"light\" version of the application. It is the very core of the system, designed to treat network absence as a normal operating state, not as an error to manage. The technician can record chemical parameters, take photographs, sign delivery notes, and consult the client's complete history without depending on any mobile coverage."),
        h2("Pump Priming Without Connection"),
        p("One of the most critical functionalities in pool maintenance is pump priming after filter cleaning. This process requires following a precise sequence while observing the pressure gauge, something impossible if the technician must alternate between the valve and a paper manual or an app that doesn't respond."),
        p("Pool-Control's app includes interactive visual priming guides that work completely offline. The technician can follow the procedure step by step, with animated diagrams illustrating the correct position of each valve, even in basements or rural areas without signal. This functionality alone has reduced priming errors by 60% according to internal studies."),
        h2("Geolocation and Traceability"),
        p("Each visit recorded in Pool-Control includes GPS coordinates, immutable timestamp, and client's digital signature. Although data synchronization occurs hours later when the technician returns to an area with coverage, the temporal and geographic traceability remains intact and legally valid."),
        p("This capability is especially valuable for companies that maintain public pools subject to health inspections. Legionella reports require demonstrating not only what treatments were applied, but when and exactly where. Pool-Control provides this audit evidence automatically, without the technician having to worry about coverage during the visit."),
        h2("Data Consumption Reduction"),
        p("Unlike traditional applications that constantly transfer data between the device and server, Pool-Control's offline-first architecture drastically minimizes mobile data consumption. Synchronizations are incremental and compressed, reducing data usage by 85% compared to conventional solutions."),
        p("For companies with dozens of technicians on the road, this reduction translates into significant savings in corporate data plans. But more importantly: it eliminates the technician's frustration when the app \"hangs\" waiting for server response in an area with poor coverage, allowing them to concentrate on their technical work without technological distractions."),
        h2("Integration with Specialized Hardware"),
        p("Pool-Control's app integrates with digital photometers and multiparameter probes via Bluetooth. The technician can measure free chlorine, pH, alkalinity, and other chemical parameters, and the values are automatically transferred to the application without needing to type manually."),
        p("This integration works completely offline: data is stored locally along with the measurement, and synchronized later when there is connectivity. By eliminating human error in transcribing chemical values, Pool-Control has demonstrated improving record accuracy by 40%, reducing subsequent incidents from inadequate treatments."),
        h2("Conclusion: Technology that Disappears"),
        p("The best technology is that which becomes invisible, which facilitates work without becoming an obstacle. Pool-Control's offline-first app fulfills exactly this promise: the technician can concentrate on what they do best (keeping pools impeccable) while the system silently takes care of documenting, tracing, and synchronizing all operational information."),
        p("In a sector where reliability is as critical as efficiency, depending on mobile coverage to perform daily work is not just inconvenient: it is an unacceptable operational risk. Pool-Control eliminates this risk, guaranteeing that the business continues to function regardless of connectivity quality at each location.")
      ]
    }
  },
  fr: {
    root: {
      type: "root", format: "", indent: 0, version: 1,
      children: [
        p("Les techniciens d'entretien de piscines passent 70% de leur journée de travail hors du bureau. Cependant, la plupart des entreprises du secteur dépendent encore de systèmes qui nécessitent une connexion internet constante pour enregistrer les visites, consulter les historiques ou générer des rapports. Lorsque le technicien arrive dans un lotissement sans couverture, le système tombe en panne et la productivité s'effondre."),
        h2("L'Architecture Offline-First"),
        p("Pool-Control implémente une Progressive Web App (PWA) conçue from scratch pour fonctionner sans connexion. Les données sont stockées localement sur l'appareil du technicien en utilisant des technologies comme IndexedDB, se synchronisant automatiquement avec les serveurs centraux lorsque la connexion redevient disponible."),
        p("Cette architecture n'est pas un correctif temporaire ni une version \"light\" de l'application. C'est le cœur même du système, conçu pour traiter l'absence de réseau comme un état normal d'opération, pas comme une erreur à gérer. Le technicien peut enregistrer des paramètres chimiques, prendre des photographies, signer des bordereaux de livraison et consulter l'historique complet du client sans dépendre d'aucune couverture mobile."),
        h2("Amorçage des Pompes Sans Connexion"),
        p("L'une des fonctionnalités les plus critiques dans l'entretien des piscines est l'amorçage des pompes après le nettoyage des filtres. Ce processus nécessite de suivre une séquence précise tout en observant le manomètre, chose impossible si le technicien doit alterner entre la vanne et un manuel papier ou une application qui ne répond pas."),
        p("L'app de Pool-Control inclut des guides visuels interactifs d'amorçage qui fonctionnent complètement offline. Le technicien peut suivre la procédure étape par étape, avec des diagrammes animés illustrant la position correcte de chaque vanne, même dans des sous-sols ou zones rurales sans signal. Cette fonctionnalité seule a réduit les erreurs d'amorçage de 60% selon des études internes."),
        h2("Géolocalisation et Traçabilité"),
        p("Chaque visite enregistrée dans Pool-Control inclut les coordonnées GPS, l'horodatage immuable et la signature digitale du client. Bien que la synchronisation des données se fasse des heures plus tard lorsque le technicien revient en zone avec couverture, la traçabilité temporelle et géographique reste intacte et juridiquement valide."),
        p("Cette capacité est particulièrement précieuse pour les entreprises qui entretiennent des piscines publiques soumises à des inspections sanitaires. Les rapports de légionelle nécessitent de démontrer non seulement quels traitements ont été appliqués, mais quand et exactement où. Pool-Control fournit cette preuve d'audit automatiquement, sans que le technicien doive se soucier de la couverture pendant la visite."),
        h2("Réduction de la Consommation de Données"),
        p("Contrairement aux applications traditionnelles qui transfèrent constamment des données entre l'appareil et le serveur, l'architecture offline-first de Pool-Control minimise drastiquement la consommation de données mobiles. Les synchronisations sont incrémentielles et compressées, réduisant l'utilisation de données de 85% comparé aux solutions conventionnelles."),
        p("Pour les entreprises avec des dizaines de techniciens sur la route, cette réduction se traduit par des économies significatives sur les forfaits de données d'entreprise. Mais plus important encore : elle élimine la frustration du technicien quand l'app \"plante\" en attendant la réponse du serveur dans une zone de mauvaise couverture, lui permettant de se concentrer sur son travail technique sans distractions technologiques."),
        h2("Intégration avec Matériel Spécialisé"),
        p("L'app de Pool-Control s'intègre avec des photomètres numériques et des sondes multiparamétriques via Bluetooth. Le technicien peut mesurer le chlore libre, le pH, l'alcalinité et d'autres paramètres chimiques, et les valeurs sont automatiquement transférées à l'application sans avoir besoin de taper manuellement."),
        p("Cette intégration fonctionne complètement offline : les données sont stockées localement avec la mesure, et synchronisées ultérieurement quand il y a connectivité. En éliminant l'erreur humaine dans la transcription des valeurs chimiques, Pool-Control a démontré améliorer la précision des enregistrements de 40%, réduisant les incidents subséquents dus à des traitements inadéquats."),
        h2("Conclusion : Technologie qui Disparaît"),
        p("La meilleure technologie est celle qui devient invisible, qui facilite le travail sans devenir un obstacle. L'app offline-first de Pool-Control remplit exactement cette promesse : le technicien peut se concentrer sur ce qu'il sait faire de mieux (maintenir des piscines impeccables) pendant que le système s'occupe silencieusement de documenter, tracer et synchroniser toute l'information opérationnelle."),
        p("Dans un secteur où la fiabilité est aussi critique que l'efficacité, dépendre de la couverture mobile pour effectuer le travail quotidien n'est pas seulement inconfortable : c'est un risque opérationnel inacceptable. Pool-Control élimine ce risque, garantissant que l'entreprise continue de fonctionner indépendamment de la qualité de connectivité à chaque emplacement.")
      ]
    }
  },
  de: {
    root: {
      type: "root", format: "", indent: 0, version: 1,
      children: [
        p("Pool-Wartungstechniker verbringen 70% ihres Arbeitstages außerhalb des Büros. Die meisten Unternehmen in der Branche sind jedoch immer noch auf Systeme angewiesen, die eine ständige Internetverbindung erfordern, um Besuche zu erfassen, Historien zu konsultieren oder Berichte zu erstellen. Wenn der Techniker in einer Wohnanlage ohne Netzabdeckung ankommt, fällt das System aus und die Produktivität sinkt drastisch."),
        h2("Die Offline-First-Architektur"),
        p("Pool-Control implementiert eine Progressive Web App (PWA), die from scratch entwickelt wurde, um ohne Verbindung zu funktionieren. Daten werden lokal auf dem Gerät des Technikers unter Verwendung von Technologien wie IndexedDB gespeichert und synchronisieren sich automatisch mit den zentralen Servern, wenn die Verbindung wieder verfügbar ist."),
        p("Diese Architektur ist kein temporärer Patch noch eine \"light\"-Version der Anwendung. Sie ist der Kern des Systems selbst, entwickelt, um das Fehlen eines Netzwerks als normalen Betriebszustand zu behandeln, nicht als Fehler zu beheben. Der Techniker kann chemische Parameter erfassen, Fotos machen, Lieferscheine unterschreiben und die komplette Kundenhistorie konsultieren, ohne von einer Mobilfunkabdeckung abhängig zu sein."),
        h2("Pumpenanlaufen Ohne Verbindung"),
        p("Eine der kritischsten Funktionalitäten in der Pool-Wartung ist das Anlaufen der Pumpen nach der Filterreinigung. Dieser Prozess erfordert das Befolgen einer präzisen Sequenz während der Beobachtung des Manometers, etwas Unmögliches, wenn der Techniker zwischen dem Ventil und einem Papierhandbuch oder einer App wechseln muss, die nicht reagiert."),
        p("Pool-Controls App enthält interaktive visuelle Anlauf-Anleitungen, die komplett offline funktionieren. Der Techniker kann dem Verfahren Schritt für Schritt folgen, mit animierten Diagrammen, die die korrekte Position jedes Ventils illustrieren, sogar in Kellern oder ländlichen Gebieten ohne Signal. Diese Funktionalität allein hat Anlauffehler laut internen Studien um 60% reduziert."),
        h2("Geolokalisierung und Rückverfolgbarkeit"),
        p("Jeder in Pool-Control erfasste Besuch umfasst GPS-Koordinaten, unveränderlichen Zeitstempel und die digitale Signatur des Kunden. Obwohl die Datensynchronisierung Stunden später erfolgt, wenn der Techniker in ein Gebiet mit Netzabdeckung zurückkehrt, bleibt die zeitliche und geografische Rückverfolgbarkeit intakt und rechtlich gültig."),
        p("Diese Fähigkeit ist besonders wertvoll für Unternehmen, die öffentliche Pools warten, die Gesundheitsinspektionen unterliegen. Legionellen-Berichte erfordern den Nachweis nicht nur welche Behandlungen angewendet wurden, sondern wann und genau wo. Pool-Control liefert diese Audit-Evidenz automatisch, ohne dass sich der Techniker während des Besuchs um die Abdeckung sorgen muss."),
        h2("Reduktion des Datenverbrauchs"),
        p("Im Gegensatz zu herkömmlichen Anwendungen, die ständig Daten zwischen Gerät und Server übertragen, minimiert Pool-Controls Offline-First-Architektur den mobilen Datenverbrauch drastisch. Synchronisierungen sind inkrementell und komprimiert, was den Datenverbrauch im Vergleich zu herkömmlichen Lösungen um 85% reduziert."),
        p("Für Unternehmen mit Dutzenden Technikern unterwegs bedeutet diese Reduktion erhebliche Einsparungen bei den Unternehmensdatentarifen. Aber noch wichtiger: sie eliminiert die Frustration des Technikers, wenn die App \"hängt\" und auf die Serverantwort in einem Gebiet mit schlechter Abdeckung wartet, und erlaubt ihm, sich auf seine technische Arbeit zu konzentrieren, ohne technologische Ablenkungen."),
        h2("Integration mit Spezialhardware"),
        p("Pool-Controls App integriert sich mit digitalen Fotometern und Multiparameter-Sonden via Bluetooth. Der Techniker kann freies Chlor, pH, Alkalinität und andere chemische Parameter messen, und die Werte werden automatisch in die Anwendung übertragen, ohne manuelles Tippen zu erfordern."),
        p("Diese Integration funktioniert komplett offline: Daten werden lokal zusammen mit der Messung gespeichert und später synchronisiert, wenn Konnektivität besteht. Durch die Eliminierung menschlicher Fehler bei der Übertragung chemischer Werte hat Pool-Control gezeigt, dass die Genauigkeit der Aufzeichnungen um 40% verbessert und nachfolgende Vorfälle durch unzureichende Behandlungen reduziert werden."),
        h2("Fazit: Technologie, die Verschwindet"),
        p("Die beste Technologie ist die, die unsichtbar wird, die Arbeit erleichtert, ohne zum Hindernis zu werden. Pool-Controls Offline-First-App erfüllt genau dieses Versprechen: Der Techniker kann sich auf das konzentrieren, was er am besten kann (Pools makellos zu halten), während das System stillschweigend die Dokumentation, Rückverfolgung und Synchronisation aller Betriebsinformationen übernimmt."),
        p("In einem Sektor, wo Zuverlässigkeit genauso kritisch ist wie Effizienz, ist die Abhängigkeit von Mobilfunkabdeckung für die tägliche Arbeit nicht nur unbequem: es ist ein inakzeptables betriebliches Risiko. Pool-Control eliminiert dieses Risiko und garantiert, dass das Geschäft unabhängig von der Verbindungsqualität an jedem Standort weiter funktioniert.")
      ]
    }
  },
  it: {
    root: {
      type: "root", format: "", indent: 0, version: 1,
      children: [
        p("I tecnici di manutenzione piscine trascorrono il 70% della loro giornata lavorativa fuori dall'ufficio. Tuttavia, la maggior parte delle aziende del settore dipende ancora da sistemi che richiedono una connessione internet costante per registrare visite, consultare storici o generare rapporti. Quando il tecnico arriva in un complesso residenziale senza copertura, il sistema fallisce e la produttività crolla."),
        h2("L'Architettura Offline-First"),
        p("Pool-Control implementa una Progressive Web App (PWA) progettata da zero per funzionare senza connessione. I dati sono memorizzati localmente sul dispositivo del tecnico utilizzando tecnologie come IndexedDB, sincronizzandosi automaticamente con i server centrali quando la connessione torna disponibile."),
        p("Questa architettura non è una patch temporanea né una versione \"light\" dell'applicazione. È il nucleo stesso del sistema, progettato per trattare l'assenza di rete come uno stato normale di operazione, non come un errore da gestire. Il tecnico può registrare parametri chimici, scattare fotografie, firmare documenti di consegna e consultare la cronologia completa del cliente senza dipendere da alcuna copertura mobile."),
        h2("Spurgo delle Pompe Senza Connessione"),
        p("Una delle funzionalità più critiche nella manutenzione delle piscine è lo spurgo delle pompe dopo la pulizia dei filtri. Questo processo richiede di seguire una sequenza precisa mentre si osserva il manometro, qualcosa di impossibile se il tecnico deve alternarsi tra la valvola e un manuale cartaceo o un'app che non risponde."),
        p("L'app di Pool-Control include guide visive interattive per lo spurgo che funzionano completamente offline. Il tecnico può seguire la procedura passo dopo passo, con diagrammi animati che illustrano la posizione corretta di ciascuna valvola, anche in scantinati o zone rurali senza segnale. Questa funzionalità da sola ha ridotto gli errori di spurgo del 60% secondo studi interni."),
        h2("Geolocalizzazione e Tracciabilità"),
        p("Ogni visita registrata in Pool-Control include coordinate GPS, timestamp immutabile e firma digitale del cliente. Sebbene la sincronizzazione dei dati avvenga ore dopo quando il tecnico torna in una zona con copertura, la tracciabilità temporale e geografica rimane intatta e legalmente valida."),
        p("Questa capacità è particolarmente preziosa per le aziende che mantengono piscine pubbliche soggette a ispezioni sanitarie. I rapporti sulla legionella richiedono di dimostrare non solo quali trattamenti sono stati applicati, ma quando e esattamente dove. Pool-Control fornisce questa evidenza di audit automaticamente, senza che il tecnico debba preoccuparsi della copertura durante la visita."),
        h2("Riduzione del Consumo di Dati"),
        p("A differenza delle applicazioni tradizionali che trasferiscono costantemente dati tra il dispositivo e il server, l'architettura offline-first di Pool-Control minimizza drasticamente il consumo di dati mobili. Le sincronizzazioni sono incrementali e compresse, riducendo l'utilizzo dei dati dell'85% rispetto alle soluzioni convenzionali."),
        p("Per le aziende con dozzine di tecnici in viaggio, questa riduzione si traduce in significativi risparmi sui piani dati aziendali. Ma ancora più importante: elimina la frustrazione del tecnico quando l'app \"si blocca\" in attesa della risposta del server in una zona con scarsa copertura, permettendogli di concentrarsi sul lavoro tecnico senza distrazioni tecnologiche."),
        p("L'app di Pool-Control si integra con fotocolorimetri digitali e sonde multiparametriche via Bluetooth. Il tecnico può misurare cloro libero, pH, alcalinità e altri parametri chimici, e i valori vengono automaticamente trasferiti all'applicazione senza bisogno di digitare manualmente."),
        p("Questa integrazione funziona completamente offline: i dati sono memorizzati localmente insieme alla misurazione e sincronizzati successivamente quando c'è connettività. Eliminando l'errore umano nella trascrizione dei valori chimici, Pool-Control ha dimostrato di migliorare la precisione dei registri del 40%, riducendo incidenti successivi da trattamenti inadeguati."),
        h2("Conclusione: Tecnologia che Scompare"),
        p("La migliore tecnologia è quella che diventa invisibile, che facilita il lavoro senza diventare un ostacolo. L'app offline-first di Pool-Control adempie esattamente a questa promessa: il tecnico può concentrarsi su ciò che sa fare meglio (mantenere le piscine impeccabili) mentre il sistema si occupa silenziosamente di documentare, tracciare e sincronizzare tutte le informazioni operative."),
        p("In un settore dove l'affidabilità è tanto critica quanto l'efficienza, dipendere dalla copertura mobile per svolgere il lavoro quotidiano non è solo scomodo: è un rischio operativo inaccettabile. Pool-Control elimina questo rischio, garantendo che l'azienda continui a funzionare indipendentemente dalla qualità della connettività in ogni ubicazione.")
      ]
    }
  },
  pt: {
    root: {
      type: "root", format: "", indent: 0, version: 1,
      children: [
        p("Os técnicos de manutenção de piscinas passam 70% da sua jornada de trabalho fora do escritório. No entanto, a maioria das empresas do setor ainda depende de sistemas que exigem conexão constante com a internet para registrar visitas, consultar históricos ou gerar relatórios. Quando o técnico chega a um condomínio sem cobertura, o sistema falha e a produtividade despenca."),
        h2("A Arquitetura Offline-First"),
        p("Pool-Control implementa uma Progressive Web App (PWA) projetada do zero para funcionar sem conexão. Os dados são armazenados localmente no dispositivo do técnico usando tecnologias como IndexedDB, sincronizando-se automaticamente com os servidores centrais quando a conexão volta a ficar disponível."),
        p("Esta arquitetura não é um patch temporário nem uma versão \"light\" do aplicativo. É o núcleo mesmo do sistema, projetado para tratar a ausência de rede como um estado normal de operação, não como um erro a ser gerenciado. O técnico pode registrar parâmetros químicos, tirar fotografias, assinar documentos de entrega e consultar o histórico completo do cliente sem depender de nenhuma cobertura móvel."),
        h2("Escorvamento de Bombas Sem Conexão"),
        p("Uma das funcionalidades mais críticas na manutenção de piscinas é o escorvamento de bombas após a limpeza dos filtros. Este processo requer seguir uma sequência precisa enquanto se observa o manômetro, algo impossível se o técnico deve alternar entre a válvula e um manual em papel ou um app que não responde."),
        p("O app de Pool-Control inclui guias visuais interativos de escorvamento que funcionam completamente offline. O técnico pode seguir o procedimento passo a passo, com diagramas animados ilustrando a posição correta de cada válvula, mesmo em subsolos ou áreas rurais sem sinal. Esta funcionalidade sozinha reduziu os erros de escorvamento em 60% segundo estudos internos."),
        h2("Geolocalização e Rastreabilidade"),
        p("Cada visita registrada no Pool-Control inclui coordenadas GPS, timestamp imutável e assinatura digital do cliente. Embora a sincronização de dados ocorra horas depois quando o técnico retorna à zona com cobertura, a rastreabilidade temporal e geográfica permanece intacta e juridicamente válida."),
        p("Esta capacidade é especialmente valiosa para empresas que mantêm piscinas públicas sujeitas a inspeções sanitárias. Os relatórios de legionella exigem demonstrar não apenas quais tratamentos foram aplicados, mas quando e exatamente onde. Pool-Control fornece esta evidência de auditoria automaticamente, sem que o técnico precise se preocupar com a cobertura durante a visita."),
        h2("Redução do Consumo de Dados"),
        p("Ao contrário dos aplicativos tradicionais que transferem constantemente dados entre o dispositivo e o servidor, a arquitetura offline-first do Pool-Control minimiza drasticamente o consumo de dados móveis. As sincronizações são incrementais e compactadas, reduzindo o uso de dados em 85% comparado a soluções convencionais."),
        p("Para empresas com dezenas de técnicos na estrada, esta redução se traduz em economias significativas em planos de dados corporativos. Mas mais importante ainda: elimina a frustração do técnico quando o app \"trava\" esperando resposta do servidor em uma área de má cobertura, permitindo-lhe concentrar-se em seu trabalho técnico sem distrações tecnológicas."),
        h2("Integração com Hardware Especializado"),
        p("O app do Pool-Control integra-se com fotocolorímetros digitais e sondas multiparamétricas via Bluetooth. O técnico pode medir cloro livre, pH, alcalinidade e outros parâmetros químicos, e os valores são transferidos automaticamente para o aplicativo sem necessidade de digitar manualmente."),
        p("Esta integração funciona completamente offline: os dados são armazenados localmente junto com a medição e sincronizados posteriormente quando há conectividade. Eliminando o erro humano na transcrição de valores químicos, o Pool-Control demonstrou melhorar a precisão dos registros em 40%, reduzindo incidentes subsequentes por tratamentos inadequados."),
        h2("Conclusão: Tecnologia que Desaparece"),
        p("A melhor tecnologia é aquela que se torna invisível, que facilita o trabalho sem se tornar um obstáculo. O app offline-first do Pool-Control cumpre exatamente esta promessa: o técnico pode concentrar-se no que faz de melhor (manter piscinas impecáveis) enquanto o sistema cuida silenciosamente de documentar, rastrear e sincronizar todas as informações operacionais."),
        p("Em um setor onde a confiabilidade é tão crítica quanto a eficiência, depender da cobertura móvel para realizar o trabalho diário não é apenas inconveniente: é um risco operacional inaceitável. Pool-Control elimina este risco, garantindo que o negócio continue funcionando independentemente da qualidade da conectividade em cada localização.")
      ]
    }
  }
};

async function fix() {
  await client.connect();
  
  // Artículo 2 (ID 18) - App para Técnicos
  for (const [locale, content] of Object.entries(article2)) {
    await client.query(`
      UPDATE posts_locales 
      SET content = $1
      WHERE _parent_id = 18 AND _locale = $2
    `, [JSON.stringify(content), locale]);
    console.log(`✅ Artículo 2 (App Técnicos) - ${locale.toUpperCase()} actualizado`);
  }
  
  await client.end();
  console.log('\n✅ Todos los idiomas del Artículo 2 actualizados');
}

fix();
