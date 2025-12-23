'use client'

import React, { useEffect, useState } from 'react'
import { Activity, Users, Clock, MousePointer2, RefreshCw, Laptop, Smartphone, Tablet } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, PieChart, Pie, Cell, Legend } from 'recharts'
import { StatsCard } from './StatsCard'

// Definimos tipos
interface VisitData {
  id: string
  timestamp: string
  page: string
  country: string
  city: string
  device: string
  companyName?: string | null
  source: string
}

interface DeviceData {
  name: string
  value: number
  color: string
  // 👇 SOLUCIÓN: Esto permite que Recharts lea el objeto sin quejas de TS
  [key: string]: any 
}

// Colores para el gráfico de Donut
const COLORS = ['#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6']

const AnalyticsView = () => {
  const [loading, setLoading] = useState(true)
  const [visits, setVisits] = useState<VisitData[]>([])
  const [stats, setStats] = useState({
    totalVisits: 0,
    activeUsers: 0,
    avgTime: '0m',
    conversionRate: 0
  })
  const [chartData, setChartData] = useState<any[]>([])
  const [deviceData, setDeviceData] = useState<DeviceData[]>([])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/analytics?limit=500&sort=-timestamp')
      const data = await res.json()
      
      // 1. Filtrado de datos "basura" (favicon, admin, api, etc.)
      const rawDocs = data.docs || []
      const cleanDocs = rawDocs.filter((doc: any) => {
        const p = doc.page || ''
        return !p.startsWith('/_next') && 
               !p.startsWith('/api') && 
               !p.startsWith('/favicon') && 
               !p.includes('.json') &&
               !p.includes('.png') &&
               !p.includes('.ico')
      })

      // 2. KPIs
      const now = new Date()
      const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000)
      const active = cleanDocs.filter((v: any) => new Date(v.timestamp) > fiveMinAgo).length

      setStats({
        totalVisits: cleanDocs.length,
        activeUsers: active,
        avgTime: '1m 32s', // Dato simulado por ahora
        conversionRate: 2.4
      })

      // 3. Tabla Reciente (Mapeo)
      setVisits(cleanDocs.slice(0, 10).map((doc: any) => ({
        id: doc.id,
        timestamp: doc.timestamp,
        page: doc.page,
        country: doc.country === 'Unknown' ? 'Local / Privado' : doc.country,
        city: doc.city,
        device: doc.device,
        companyName: doc.companyName,
        source: doc.source
      })))

      // 4. Gráfico de Área (Tráfico)
      const visitsByDate: Record<string, number> = {}
      cleanDocs.forEach((doc: any) => {
        const date = new Date(doc.timestamp).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })
        visitsByDate[date] = (visitsByDate[date] || 0) + 1
      })
      
      const chartArray = Object.keys(visitsByDate).map(date => ({
        date,
        visits: visitsByDate[date]
      })).reverse() 

      setChartData(chartArray)

      // 5. Gráfico de Donut (Dispositivos)
      const devicesCount: Record<string, number> = {}
      cleanDocs.forEach((doc: any) => {
        const d = doc.device || 'Desktop'
        devicesCount[d] = (devicesCount[d] || 0) + 1
      })

      const deviceChartArray = Object.keys(devicesCount).map((key, index) => ({
        name: key,
        value: devicesCount[key],
        color: COLORS[index % COLORS.length]
      }))
      
      setDeviceData(deviceChartArray)
      setLoading(false)

    } catch (error) {
      console.error('Error fetching analytics:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 15000) // Refresco cada 15s
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-black text-white p-4 md:p-6 space-y-6 font-sans min-h-full">
      
      {/* HEADER COMPACTO */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Resumen de Actividad</h2>
          <p className="text-sm text-zinc-500">Métricas en tiempo real</p>
        </div>
        <button 
          onClick={() => { setLoading(true); fetchData(); }}
          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
          title="Actualizar datos"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Usuarios Activos" 
          value={stats.activeUsers} 
          icon={Activity} 
          loading={loading}
          trend={stats.activeUsers > 0 ? { value: stats.activeUsers, label: 'online' } : undefined}
        />
        <StatsCard 
          title="Visitas Totales" 
          value={stats.totalVisits} 
          icon={Users} 
          loading={loading}
        />
        <StatsCard 
          title="Tiempo Medio" 
          value={stats.avgTime} 
          icon={Clock} 
          loading={loading}
        />
        <StatsCard 
          title="Tasa Conversión" 
          value={`${stats.conversionRate}%`} 
          icon={MousePointer2} 
          loading={loading}
        />
      </div>

      {/* CHART SECTION */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4">Tráfico (Últimos días)</h3>
        <div className="h-[250px] w-full">
          {loading ? (
             <div className="h-full w-full animate-pulse bg-zinc-800/30 rounded" />
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="date" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#06b6d4' }}
                />
                <Area type="monotone" dataKey="visits" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-600 text-sm">
              No hay suficientes datos para mostrar la gráfica aún.
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* RECENT ACTIVITY TABLE */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden backdrop-blur-sm">
          <div className="p-4 border-b border-zinc-800">
            <h3 className="font-semibold text-white text-sm">Últimas Visitas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-zinc-900 text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Hora</th>
                  <th className="px-4 py-3 font-medium">Ubicación</th>
                  <th className="px-4 py-3 font-medium">Página</th>
                  <th className="px-4 py-3 font-medium text-right">Disp.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {visits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-zinc-800/30">
                    <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">
                      {new Date(visit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 text-white truncate max-w-[150px]" title={visit.country}>
                      {visit.country}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-900/50 truncate max-w-[200px] block">
                        {visit.page}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {visit.device === 'Mobile' ? <Smartphone className="ml-auto h-4 w-4 text-zinc-500" /> : 
                       visit.device === 'Tablet' ? <Tablet className="ml-auto h-4 w-4 text-zinc-500" /> :
                       <Laptop className="ml-auto h-4 w-4 text-zinc-500" />}
                    </td>
                  </tr>
                ))}
                {visits.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-zinc-600">
                      Sin actividad reciente limpia.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TECH DONUT CHART */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm flex flex-col">
          <h3 className="font-semibold text-white text-sm mb-4">Dispositivos</h3>
          <div className="flex-1 min-h-[200px] relative">
            {deviceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-600 text-sm">
                Sin datos de dispositivos
              </div>
            )}
            
            {/* Dato central del donut (opcional) */}
            {deviceData.length > 0 && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="text-center">
                   <span className="block text-2xl font-bold text-white">{stats.totalVisits}</span>
                   <span className="text-xs text-zinc-500">Visitas</span>
                 </div>
               </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default AnalyticsView