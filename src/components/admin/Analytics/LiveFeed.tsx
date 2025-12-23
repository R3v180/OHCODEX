'use client'

import React from 'react'
import { Building2, Globe, Laptop, Smartphone, MapPin, ExternalLink } from 'lucide-react'

// Definimos el tipo de dato que esperamos
export interface VisitData {
  id: string
  timestamp: string
  page: string
  country: string
  city: string
  device: string
  companyName?: string | null
  source: string
}

interface LiveFeedProps {
  visits: VisitData[]
  loading?: boolean
}

export const LiveFeed = ({ visits, loading }: LiveFeedProps) => {
  // Skeleton de carga
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 w-full animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50" />
        ))}
      </div>
    )
  }

  if (!visits || visits.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 text-zinc-500">
        Esperando tráfico en tiempo real...
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-800 p-4">
        <h3 className="flex items-center gap-2 font-semibold text-white">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          </span>
          Actividad Reciente
        </h3>
        <span className="text-xs text-zinc-500">Últimas 24h</span>
      </div>

      {/* --- VISTA ESCRITORIO (Tabla) --- */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900/80 text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Hora</th>
              <th className="px-4 py-3 font-medium">Visitante / Empresa</th>
              <th className="px-4 py-3 font-medium">Ubicación</th>
              <th className="px-4 py-3 font-medium">Página</th>
              <th className="px-4 py-3 font-medium text-right">Dispositivo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {visits.map((visit) => (
              <tr key={visit.id} className="hover:bg-zinc-800/30 transition-colors">
                <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">
                  {new Date(visit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {visit.companyName ? (
                      <>
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-500/10 text-indigo-400">
                          <Building2 className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-medium text-white">{visit.companyName}</span>
                      </>
                    ) : (
                      <>
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-zinc-800 text-zinc-500">
                          <Globe className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-zinc-400">Visitante Anónimo</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-zinc-300">
                  {visit.city !== 'Unknown' ? visit.city : ''} {visit.country}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-block max-w-[200px] truncate text-cyan-400/80 bg-cyan-950/30 px-2 py-0.5 rounded text-xs border border-cyan-900/50">
                    {visit.page}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {visit.device === 'Mobile' ? (
                    <Smartphone className="ml-auto h-4 w-4 text-zinc-500" />
                  ) : (
                    <Laptop className="ml-auto h-4 w-4 text-zinc-500" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- VISTA MÓVIL (Tarjetas) --- */}
      <div className="block md:hidden divide-y divide-zinc-800">
        {visits.map((visit) => (
          <div key={visit.id} className="p-4 flex items-start gap-3">
            <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${visit.companyName ? 'bg-indigo-500/10 text-indigo-400' : 'bg-zinc-800 text-zinc-500'}`}>
              {visit.companyName ? <Building2 className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-white truncate pr-2">
                  {visit.companyName || 'Visitante Anónimo'}
                </p>
                <span className="text-xs text-zinc-500 shrink-0">
                  {new Date(visit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-zinc-400 mb-2">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {visit.country}
                </span>
                <span className="flex items-center gap-1">
                  {visit.device === 'Mobile' ? <Smartphone className="h-3 w-3" /> : <Laptop className="h-3 w-3" />}
                  {visit.device}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-cyan-400/80 bg-zinc-900/80 p-2 rounded border border-zinc-800/50">
                <ExternalLink className="h-3 w-3 shrink-0" />
                <span className="truncate">{visit.page}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}