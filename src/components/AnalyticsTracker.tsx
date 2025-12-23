'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export const AnalyticsTracker = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  // Usamos un ref para evitar doble conteo en modo desarrollo estricto
  const initialized = useRef(false)

  useEffect(() => {
    // Función para registrar la visita
    const trackPage = async () => {
      try {
        // Datos del navegador
        const userAgent = window.navigator.userAgent
        const referrer = document.referrer
        const isMobile = /mobile/i.test(userAgent)
        
        // Enviamos a tu API
        await fetch('/api/tracking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: pathname,
            referrer: referrer || 'Direct',
            device: isMobile ? 'Mobile' : 'Desktop',
            browser: userAgent,
            // La IP la resolverá el servidor, no hace falta enviarla desde aquí
          })
        })
        console.log('📡 Analytics: Visita registrada', pathname)
      } catch (err) {
        console.error('Error tracking:', err)
      }
    }

    // Pequeño timeout para no bloquear el renderizado inicial y asegurar que la navegación ha terminado
    const timeoutId = setTimeout(() => {
      trackPage()
    }, 1000)

    return () => clearTimeout(timeoutId)
    
  }, [pathname, searchParams]) // Se ejecuta cada vez que cambia la URL

  return null // Este componente no renderiza nada visual
}