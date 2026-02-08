'use client'

import { useState } from 'react'
import { X, Bug, Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface BugReportFormProps {
  toolSlug: string
  toolName: string
  isOpen: boolean
  onClose: () => void
}

export function BugReportForm({ toolSlug, toolName, isOpen, onClose }: BugReportFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/tools/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolSlug,
          reporterEmail: formData.email,
          reporterName: formData.name,
          description: formData.description,
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => {
          onClose()
          setIsSuccess(false)
          setFormData({ email: '', name: '', description: '' })
        }, 2000)
      } else {
        setError('Error al enviar el reporte. Intenta de nuevo.')
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-white">Reportar problema</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">¡Gracias!</h4>
              <p className="text-zinc-400">
                Hemos recibido tu reporte. Te contactaremos por email si necesitamos más información.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-zinc-400 mb-4">
                Reportando problema en: <span className="text-cyan-400 font-medium">{toolName}</span>
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-zinc-300">
                    Tu email <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@email.com"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  />
                </div>

                <div>
                  <Label htmlFor="name" className="text-zinc-300">
                    Tu nombre <span className="text-zinc-500">(opcional)</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Juan Pérez"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-zinc-300">
                    ¿Qué no funciona? <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe el problema con todo detalle. ¿Qué esperabas que pasara? ¿Qué pasó en su lugar?"
                    rows={4}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 resize-none"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Enviar reporte
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
