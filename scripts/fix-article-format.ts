import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

// Función para crear un nodo de párrafo
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

// Función para crear un heading h2
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

// Contenido estructurado del Artículo 1 en español
const contentES = {
  root: {
    type: "root",
    format: "",
    indent: 0,
    version: 1,
    children: [
      p("Cuando una empresa de mantenimiento de piscinas supera los 50.000€ anuales en facturación, surge una encrucijada tecnológica inevitable: ¿implementar un ERP genérico como SAP Business One, Odoo o Microsoft Dynamics, o apostar por una solución vertical especializada como Pool-Control? Esta decisión determinará no solo la eficiencia operativa de los próximos años, sino también la capacidad de la empresa para escalar sin quebraderos de cabeza."),
      h2("El Engaño de la Personalización Ilimitada"),
      p("Los ERP genéricos prometen \"adaptarse a cualquier sector\" a través de módulos configurables y desarrollos a medida. La realidad, sin embargo, suele ser menos idílica. Implementar SAP u Odoo para una empresa de piscinas requiere entre 6 y 18 meses de desarrollo, docenas de consultores especializados y un presupuesto inicial que raramente baja de los 30.000€."),
      p("El problema principal no es técnico, sino conceptual. Un ERP genérico nace para gestionar empresas manufactureras, retailers o servicios profesionales estándar. No entiende intrínsecamente qué es una piscina pública frente a una privada, no gestiona lotes de cloro con fechas de caducidad críticas, y mucho menos optimiza rutas de técnicos considerando la estacionalidad del negocio."),
      h2("Mantenimiento Preditivo vs Correctivo"),
      p("Pool-Control incluye algoritmos de mantenimiento predictivo basados en parámetros químicos, histórico de visitas y condiciones climáticas. El sistema anticipa cuándo una piscina necesitará atención antes de que el cliente llame quejándose del agua verde. Los ERP genéricos operan en modo reactivo: un ticket se genera cuando algo ya ha fallado."),
      p("Esta diferencia paradigmática impacta directamente en la retención de clientes. Las empresas que utilizan Pool-Control reportan reducciones del 40% en incidencias urgentes y aumentos del 25% en la satisfacción medida mediante NPS, simplemente porque anticipan problemas que otros sistemas ignoran hasta que es demasiado tarde."),
      h2("Optimización de Rutas Inteligente"),
      p("Un técnico de piscinas no es un repartidor de paquetería. Su trabajo implica tiempos de desplazamiento variables según tráfico urbano, tiempos de servicio impredecibles según el estado del agua, y prioridades dinámicas según alertas de cloro o pH. Pool-Control integra todos estos factores en su motor de optimización de rutas, reduciendo los kilómetros innecesarios en un 30% promedio."),
      p("Los ERP genéricos con módulos de \"field service\" aplican algoritmos de logística de transporte que ignoran la complejidad química del negocio. El resultado son rutas teóricamente óptimas pero prácticamente inviables, donde el técnico pierde tiempo valioso desplazándose innecesariamente entre zonas que un planificador inteligente hubiera agrupado lógicamente."),
      h2("Cumplimiento Normativo Sanitario"),
      p("Las piscinas públicas en España están sujetas al Real Decreto 742/2013, que exige controles periódicos de legionella, registro de parámetros químicos y trazabilidad de tratamientos. Pool-Control genera automáticamente los informes exigidos por las autoridades sanitarias, con sellos de tiempo inmutables y firmas digitales válidas jurídicamente."),
      p("Adaptar un ERP genérico para cumplir estas exigencias requiere desarrollos específicos que fácilmente superan los 15.000€ adicionales. Y aún así, el resultado nunca será tan pulido como una solución nativa que ha evolucionado durante años junto a empresas reales del sector."),
      h2("El Coste Real de la \"Solución Económica\""),
      p("Un análisis comparativo de TCO (Coste Total de Propiedad) a 5 años revela cifras sorprendentes. Un ERP genérico \"económico\" como Odoo Community, con todos los desarrollos necesarios para igualar la funcionalidad de Pool-Control, acumula entre 45.000€ y 80.000€ cuando sumamos licencias, consultoría, personalización y mantenimiento."),
      p("Pool-Control, con su modelo SaaS que incluye actualizaciones automáticas, soporte especializado y evolución constante del producto, raramente supera los 18.000€ en el mismo período. La diferencia no es solo económica: es la tranquilidad de saber que el software evolucionará con el negocio sin depender de consultoras externas para cada pequeño cambio."),
      h2("Conclusión: Especialización como Ventaja Competitiva"),
      p("En un mercado donde la diferenciación es cada vez más difícil, utilizar herramientas diseñadas específicamente para tu negocio constituye una ventaja estratégica tangible. Pool-Control no es simplemente \"otro ERP\" con un skin de piscinas: es el resultado de años de iteración junto a empresas reales que enfrentan los mismos retos que la tuya cada día."),
      p("La pregunta no es si tu empresa puede permitirse una solución vertical especializada. La pregunta es si puede permitirse seguir operando con herramientas genéricas que nunca entenderán realmente el negocio de las piscinas.")
    ]
  }
};

async function fix() {
  await client.connect();
  
  // Actualizar solo el contenido en español del artículo 1 (ID 17)
  await client.query(`
    UPDATE posts_locales 
    SET content = $1
    WHERE _parent_id = 17 AND _locale = 'es'
  `, [JSON.stringify(contentES)]);
  
  console.log('✅ Artículo 1 (ES) actualizado con formato correcto');
  
  await client.end();
}

fix();
