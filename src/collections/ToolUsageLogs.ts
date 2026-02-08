import type { CollectionConfig } from 'payload'

export const ToolUsageLogs: CollectionConfig = {
  slug: 'tool-usage-logs',
  labels: {
    singular: 'Log de Uso',
    plural: 'Logs de Uso',
  },
  admin: {
    useAsTitle: 'toolSlug',
    defaultColumns: ['toolSlug', 'ipHash', 'createdAt'],
    group: 'Herramientas',
    hidden: true, // Ocultar del admin principal, solo accesible por API
  },
  access: {
    read: () => false, // Solo accesible por API interna
    create: () => true, // API puede crear logs
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'toolSlug',
      type: 'text',
      required: true,
      label: 'Herramienta',
    },
    {
      name: 'ipHash',
      type: 'text',
      required: true,
      label: 'IP Hash',
    },
  ],
  timestamps: true,
}
