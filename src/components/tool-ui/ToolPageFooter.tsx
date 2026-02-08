'use client'

import { ToolUsageStats } from './ToolUsageStats'
import { BugReportButton } from './BugReportButton'
import { useToolUsage } from './useToolUsage'

interface ToolPageFooterProps {
  toolSlug: string
  toolName: string
}

export function ToolPageFooter({ toolSlug, toolName }: ToolPageFooterProps) {
  // Registrar uso de la herramienta
  useToolUsage(toolSlug)

  return (
    <div className="mt-12 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
      <ToolUsageStats toolSlug={toolSlug} />
      <BugReportButton toolSlug={toolSlug} toolName={toolName} />
    </div>
  )
}
