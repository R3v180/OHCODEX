'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    label: string
  }
  loading?: boolean
}

export const StatsCard = ({ title, value, icon: Icon, trend, loading }: StatsCardProps) => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm transition-all hover:border-zinc-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          {loading ? (
            <div className="mt-2 h-8 w-24 animate-pulse rounded bg-zinc-800" />
          ) : (
            <h3 className="mt-2 text-3xl font-bold text-white tracking-tight">{value}</h3>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-cyan-500">
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {trend && !loading && (
        <div className="mt-4 flex items-center text-xs">
          <span
            className={`font-medium ${
              trend.value >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {trend.value > 0 ? '+' : ''}{trend.value}%
          </span>
          <span className="ml-2 text-zinc-500">{trend.label}</span>
        </div>
      )}
      
      {/* Efecto de brillo decorativo */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />
    </div>
  )
}