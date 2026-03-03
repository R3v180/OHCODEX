import type { CollectionConfig } from 'payload'

export const AdsEvents: CollectionConfig = {
  slug: 'ads-events',
  labels: {
    singular: 'Evento de Anuncio',
    plural: 'Eventos de Anuncios',
  },
  admin: {
    useAsTitle: 'slotPosition',
    defaultColumns: ['createdAt', 'slotPosition', 'network', 'variantLabel', 'eventType', 'toolSlug'],
    group: 'Monetización',
  },
  access: {
    create: () => true, // El endpoint público puede registrar eventos
    read: ({ req: { user } }) => Boolean(user), // Solo usuarios logueados pueden ver estadísticas crudas
    update: () => false,
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'slotPosition',
      type: 'select',
      label: 'Posición del Slot',
      options: [
        { label: 'Top', value: 'top' },
        { label: 'Sidebar', value: 'sidebar' },
        { label: 'Bottom', value: 'bottom' },
      ],
      required: true,
      index: true,
    },
    {
      name: 'network',
      type: 'select',
      label: 'Red / Tipo',
      options: [
        { label: 'AdSense', value: 'adsense' },
        { label: 'Ezoic', value: 'ezoic' },
        { label: 'House', value: 'house' },
      ],
      required: true,
      index: true,
    },
    {
      name: 'variantId',
      type: 'text',
      label: 'ID variante',
    },
    {
      name: 'variantLabel',
      type: 'text',
      label: 'Nombre variante',
    },
    {
      name: 'eventType',
      type: 'select',
      label: 'Tipo de evento',
      options: [
        { label: 'Impresión', value: 'impression' },
        { label: 'Click', value: 'click' },
      ],
      required: true,
      index: true,
    },
    {
      name: 'toolSlug',
      type: 'text',
      label: 'Slug de herramienta',
      index: true,
    },
    {
      name: 'locale',
      type: 'text',
      label: 'Locale',
      index: true,
    },
    {
      name: 'userAgent',
      type: 'text',
      label: 'User Agent',
    },
    {
      name: 'ipHash',
      type: 'text',
      label: 'Hash IP (opcional)',
    },
  ],
}

