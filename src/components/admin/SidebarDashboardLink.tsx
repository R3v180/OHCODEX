'use client'

import React from 'react'
import Link from 'next/link'
import { LayoutDashboard } from 'lucide-react'
import { usePathname } from 'next/navigation'

export const SidebarDashboardLink = () => {
  const pathname = usePathname()
  // En Payload, la raíz "/admin" es el dashboard
  const isActive = pathname === '/admin'

  return (
    <Link 
      href="/admin"
      className={`
        group flex items-center gap-3 px-3 py-2 rounded-md mb-4 transition-all duration-200
        ${isActive 
          ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700' 
          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
        }
      `}
    >
      <LayoutDashboard size={18} className={isActive ? 'text-cyan-500' : 'text-zinc-500 group-hover:text-zinc-300'} />
      <span className="font-medium text-sm">Dashboard</span>
    </Link>
  )
}