import type { CollectionConfig } from 'payload'

export const Analytics: CollectionConfig = {
  slug: 'analytics',
  labels: {
    singular: 'Visita',
    plural: 'Analítica Web',
  },
  admin: {
    // La ocultamos del menú lateral porque crearemos un Dashboard visual personalizado después
    hidden: true, 
    useAsTitle: 'timestamp',
    defaultColumns: ['timestamp', 'page', 'country', 'companyName'],
  },
  access: {
    // Permitimos crear (para que la API pueda guardar datos)
    create: () => true,
    // Solo los administradores pueden leer o borrar estos datos
    read: ({ req: { user } }) => Boolean(user),
    update: () => false, // Los logs de visitas no se deben editar
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'timestamp',
      type: 'date',
      required: true,
      index: true, // Indexado para filtrar por fechas rápidamente en los gráficos
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'page',
      type: 'text',
      label: 'Página Visitada',
      index: true,
    },
    {
      name: 'country',
      type: 'text',
      label: 'País (Código)',
      index: true,
    },
    {
      name: 'city',
      type: 'text',
      label: 'Ciudad',
    },
    {
      name: 'device',
      type: 'text',
      label: 'Dispositivo', // Desktop, Mobile, Tablet
    },
    {
      name: 'browser',
      type: 'text',
      label: 'Navegador',
    },
    {
      name: 'source',
      type: 'text',
      label: 'Fuente / Referer', // De dónde vienen (Google, LinkedIn, Directo)
    },
    // --- INTELIGENCIA B2B ---
    {
      name: 'companyName',
      type: 'text',
      label: 'Empresa / ISP Detectado',
      index: true,
    },
    {
      name: 'ipHash',
      type: 'text',
      label: 'Hash IP', // IP anonimizada para contar usuarios únicos sin violar privacidad
    },
  ],
}