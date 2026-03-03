'use client'

import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface AdSlotProps {
  position: 'top' | 'sidebar' | 'bottom'
  className?: string
  config?: {
    enabled: boolean
    network?: 'adsense' | 'ezoic' | 'house'
    adsenseClientId?: string
    adSlotId?: string
    ezoicPlaceholderId?: string
    houseImageUrl?: string
    houseHref?: string
    houseAlt?: string
    houseHtml?: string
    variantId?: string
    variantLabel?: string
    toolSlug?: string
    locale?: string
  }
}

declare global {
  interface Window {
    adsbygoogle?: any[]
  }
}

export function AdSlot({ position, className, config }: AdSlotProps) {
  const sizes = {
    top: 'h-[90px] w-[728px] max-w-full',
    sidebar: 'h-[250px] w-[300px]',
    bottom: 'h-[90px] w-[728px] max-w-full'
  }

  const adRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!config?.enabled || !adRef.current) return

    // Registro de impresión básica
    try {
      fetch('/api/ads/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotPosition: position,
          network: config.network || 'house',
          variantId: config.variantId,
          variantLabel: config.variantLabel,
          eventType: 'impression',
          toolSlug: config.toolSlug,
          locale: config.locale,
        }),
      }).catch(() => {})
    } catch {
      // Ignorar errores de tracking
    }

    // Lógica específica por red
    if (config.network === 'adsense') {
      if (!config.adsenseClientId || !config.adSlotId) return
      const scriptId = 'adsbygoogle-js'
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script')
        script.id = scriptId
        script.async = true
        const baseSrc = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
        script.src = `${baseSrc}?client=${encodeURIComponent(config.adsenseClientId)}`
        script.crossOrigin = 'anonymous'
        document.head.appendChild(script)
      }

      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch {
        // Silenciar errores de AdSense
      }
    } else if (config.network === 'ezoic') {
      // Para Ezoic normalmente basta con que el script global esté cargado.
      // Aquí solo nos aseguramos de que exista el contenedor con el ID correcto.
      // La inicialización concreta se hará según las instrucciones de Ezoic.
      // No hacemos nada especial en el hook por ahora.
    }
  }, [config, position])

  // Si AdSense no está configurado, mostramos el placeholder actual
  if (!config?.enabled || !config.network) {
    return (
      <div
        className={cn(
          'bg-zinc-900/50 border-2 border-dashed border-zinc-700 rounded-lg flex items-center justify-center',
          sizes[position],
          className
        )}
        role="complementary"
        aria-label={`Advertisement ${position}`}
      >
        <div className="text-center text-zinc-500">
          <p className="text-sm font-medium">Publicidad</p>
          <p className="text-xs text-zinc-600">
            {position === 'top' && 'Leaderboard 728x90'}
            {position === 'sidebar' && 'Rectangle 300x250'}
            {position === 'bottom' && 'Leaderboard 728x90'}
          </p>
        </div>
      </div>
    )
  }

  // Bloques reales según red
  return (
    <div
      ref={adRef}
      className={cn(
        'flex items-center justify-center',
        sizes[position],
        className
      )}
    >
      {config.network === 'adsense' && config.adsenseClientId && config.adSlotId && (
        <ins
          className="adsbygoogle block"
          style={{ display: 'block' }}
          data-ad-client={config.adsenseClientId}
          data-ad-slot={config.adSlotId}
          data-ad-format={position === 'sidebar' ? 'rectangle' : 'horizontal'}
          data-full-width-responsive="true"
        />
      )}

      {config.network === 'ezoic' && config.ezoicPlaceholderId && (
        <div
          id={config.ezoicPlaceholderId}
          className="w-full h-full flex items-center justify-center"
          data-ezoic-id={config.ezoicPlaceholderId}
        />
      )}

      {config.network === 'house' && (
        <>
          {config.houseHtml ? (
            <div
              className="w-full h-full flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: config.houseHtml }}
            />
          ) : config.houseImageUrl && config.houseHref ? (
            <a
              href={config.houseHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-full flex items-center justify-center"
            >
              <img
                src={config.houseImageUrl}
                alt={config.houseAlt || config.variantLabel || 'Publicidad'}
                className="max-h-full max-w-full object-contain"
              />
            </a>
          ) : (
            <div className="text-center text-zinc-500">
              <p className="text-sm font-medium">Publicidad</p>
              <p className="text-xs text-zinc-600">Slot House sin creatividades configuradas</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
