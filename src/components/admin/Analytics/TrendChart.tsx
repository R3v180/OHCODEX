'use client'

import React from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'

// Tipos para los datos que recibirá el gráfico
interface ChartData {
  date: string
  visits: number
}

interface TrendChartProps {
  data: ChartData[]
  loading?: boolean
}

// Tooltip personalizado para que se vea bien en modo oscuro
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-zinc-700 bg-zinc-950 p-3 shadow-xl backdrop-blur-md">
        <p className="mb-1 text-xs text-zinc-400">{label}</p>
        <p className="text-sm font-bold text-cyan-400">
          {payload[0].value} Visitas
        </p>
      </div>
    )
  }
  return null
}

export const TrendChart = ({ data, loading }: TrendChartProps) => {
  if (loading) {
    return (
      <div className="h-[350px] w-full animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50" />
    )
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Tendencia de Tráfico</h3>
        <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-400 border border-zinc-700">
          Últimos 30 días
        </span>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {/* Definición del degradado Cian */}
            <defs>
              <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              vertical={false}
            />
            
            <XAxis
              dataKey="date"
              stroke="#71717a"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              minTickGap={30} // Importante: Evita que las fechas se monten en móviles
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3f3f46', strokeWidth: 1 }} />
            
            <Area
              type="monotone"
              dataKey="visits"
              stroke="#06b6d4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorVisits)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}