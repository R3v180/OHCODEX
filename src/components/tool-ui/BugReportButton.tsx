'use client'

import { useState } from 'react'
import { Bug } from 'lucide-react'
import { BugReportForm } from './BugReportForm'

interface BugReportButtonProps {
  toolSlug: string
  toolName: string
}

export function BugReportButton({ toolSlug, toolName }: BugReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-amber-400 transition-colors group"
        title="Reportar un problema"
      >
        <Bug className="w-3.5 h-3.5 group-hover:animate-bounce" />
        <span>¿No funciona?</span>
      </button>

      <BugReportForm
        toolSlug={toolSlug}
        toolName={toolName}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
