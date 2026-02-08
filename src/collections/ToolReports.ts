import type { CollectionConfig } from 'payload'

export const ToolReports: CollectionConfig = {
  slug: 'tool-reports',
  labels: {
    singular: 'Reporte de Tool',
    plural: 'Reportes de Tools',
  },
  admin: {
    useAsTitle: 'toolSlug',
    defaultColumns: ['toolSlug', 'status', 'reporterEmail', 'createdAt'],
    group: 'Herramientas',
  },
  access: {
    // Solo admins pueden ver en el panel
    read: ({ req: { user } }) => Boolean(user),
    create: () => true, // API pública para crear reportes
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'toolSlug',
      type: 'text',
      required: true,
      label: 'Herramienta',
      admin: {
        description: 'Slug de la herramienta reportada',
      },
    },
    {
      name: 'reporterEmail',
      type: 'email',
      required: true,
      label: 'Email del reportante',
    },
    {
      name: 'reporterName',
      type: 'text',
      label: 'Nombre (opcional)',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Descripción del problema',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Estado',
      options: [
        { label: 'Pendiente', value: 'pending' },
        { label: 'En progreso', value: 'in_progress' },
        { label: 'Resuelto', value: 'fixed' },
        { label: 'Descartado', value: 'dismissed' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notas internas',
      admin: {
        description: 'Notas para el equipo de desarrollo',
      },
    },
  ],
  timestamps: true,
}
