'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import { useEffect } from 'react'
import { toast } from 'sonner'

// 1. Quitamos "export" de aquí
const ReadStatusHandler = () => {
  const { id } = useDocumentInfo()
  
  useEffect(() => {
    // Si no hay ID, estamos creando, no editando. No hacemos nada.
    if (!id) return

    const markAsRead = async () => {
      try {
        // 1. Consultar estado actual
        const fetchRes = await fetch(`/api/contact-submissions/${id}`)
        const data = await fetchRes.json()

        // 2. Si ya está leído, no hacer nada (permite desmarcarlo manualmente)
        if (data.isRead) return

        // 3. Si no está leído, marcarlo
        await fetch(`/api/contact-submissions/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isRead: true }),
        })

        toast.success('Mensaje marcado como leído')
        
      } catch (error) {
        console.error('Error auto-read:', error)
      }
    }

    markAsRead()
  }, [id])

  return null
}

// 2. Exportamos por defecto al final
export default ReadStatusHandler