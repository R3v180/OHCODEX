import React from 'react'
import { cn } from '@/lib/utils'

interface AdSlotProps {
  position: 'top' | 'sidebar' | 'bottom'
  className?: string
}

export function AdSlot({ position, className }: AdSlotProps) {
  const sizes = {
    top: 'h-[90px] w-[728px] max-w-full',
    sidebar: 'h-[250px] w-[300px]',
    bottom: 'h-[90px] w-[728px] max-w-full'
  }

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
