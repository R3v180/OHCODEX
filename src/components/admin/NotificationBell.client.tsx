'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bell } from 'lucide-react'

export function NotificationBellClient() {
  const [count, setCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkUnread = async () => {
      try {
        const req = await fetch('/api/contact-submissions?where[isRead][equals]=false&limit=0')
        const data = await req.json()
        setCount(data.totalDocs || 0)
      } catch (e) {
        console.error('Error checking notifications', e)
      }
    }

    checkUnread()
  }, [])

  if (!mounted) return null

  return (
    <Link 
      href="/admin/collections/contact-submissions?where[isRead][equals]=false" 
      className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-800 transition-colors mr-2"
      title="Bandeja de Entrada"
    >
      <Bell className="w-5 h-5 text-zinc-400" />
      
      {count > 0 && (
        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
          {count > 9 ? '+9' : count}
        </span>
      )}
    </Link>
  )
}