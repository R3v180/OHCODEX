import type { GlobalConfig } from 'payload'
// Importamos tu componente visual
import AnalyticsView from '../components/admin/Analytics/AnalyticsView'

export const AnalyticsDashboard: GlobalConfig = {
  slug: 'analytics-dashboard', 
  label: 'Analytics & KPIs',   
  admin: {
    group: 'Command Center',
    components: {
      views: {
        // CORRECCIÓN 1: 'edit' en minúscula y estructura 'root' para reemplazar toda la pantalla
        edit: {
          root: {
            Component: AnalyticsView as any,
          },
        },
      },
    },
  },
  access: {
    // Solo admins pueden verlo
    read: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    // CORRECCIÓN 2: Usamos un campo 'text' oculto en lugar de 'ui'
    // Esto satisface el requisito de Payload de tener campos sin dar errores de tipo.
    {
      name: 'placeholder',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
  ],
}