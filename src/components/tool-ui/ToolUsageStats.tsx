'use client'

import { useEffect, useState } from 'react'
import { Flame, Users } from 'lucide-react'

interface UsageStats {
  totalUses: number
  uniqueUsers: number
}

interface ToolUsageStatsProps {
  toolSlug: string
}

export function ToolUsageStats({ toolSlug }: ToolUsageStatsProps) {
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(`/api/tools/${toolSlug}/stats`)
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [toolSlug])

  if (loading || !stats) {
    return (
      <div className="flex items-center gap-3 text-xs text-zinc-600">
        <span className="animate-pulse">Cargando estadísticas...</span>
      </div>
    )
  }

  // Formatear números grandes (1.2k, 1.5M, etc.)
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
    return num.toString()
  }

  return (
    <div className="flex items-center gap-4 text-xs">
      <div className="flex items-center gap-1.5 text-zinc-400">
        <Flame className="w-3.5 h-3.5 text-orange-500" />
        <span>
          <span className="font-semibold text-zinc-300">{formatNumber(stats.totalUses)}</span>
          {' '}usos
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-zinc-400">
        <Users className="w-3.5 h-3.5 text-cyan-500" />
        <span>
          <span className="font-semibold text-zinc-300">{formatNumber(stats.uniqueUsers)}</span>
          {' '}personas
        </span>
      </div>
    </div>
  )
}
