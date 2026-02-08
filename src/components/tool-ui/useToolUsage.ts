'use client'

import { useEffect } from 'react'

export function useToolUsage(toolSlug: string) {
  useEffect(() => {
    // Registrar uso cuando el componente se monta
    // Solo en el cliente y una vez por sesión (usamos sessionStorage)
    const sessionKey = `tool_used_${toolSlug}`
    
    if (typeof window !== 'undefined' && !sessionStorage.getItem(sessionKey)) {
      // Marcar como usado en esta sesión
      sessionStorage.setItem(sessionKey, 'true')
      
      // Enviar a la API
      fetch(`/api/tools/${toolSlug}/usage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).catch(console.error)
    }
  }, [toolSlug])
}
