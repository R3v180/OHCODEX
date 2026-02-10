'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

const demoRequestSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  company: z.string().optional(),
  phone: z.string().optional(),
  poolCount: z.string().optional(),
  message: z.string().optional(),
})

type DemoRequestFormData = z.infer<typeof demoRequestSchema>

interface DemoRequestFormProps {
  utmSource?: string
  utmMedium?: string
  onSuccess?: () => void
}

export function DemoRequestForm({ 
  utmSource = 'website', 
  utmMedium = 'form',
  onSuccess 
}: DemoRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DemoRequestFormData>({
    resolver: zodResolver(demoRequestSchema),
  })

  const onSubmit = async (data: DemoRequestFormData) => {
    setIsSubmitting(true)
    setResult(null)

    try {
      const response = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          utmSource,
          utmMedium,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: '¡Perfecto! Revisa tu email para acceder a la demo de PoolControl.',
        })
        reset()
        onSuccess?.()
      } else {
        setResult({
          success: false,
          message: result.message || 'Error al enviar la solicitud',
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Error de conexión. Inténtalo de nuevo.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (result?.success) {
    return (
      <div className="rounded-lg bg-green-50 p-6 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="mt-4 text-lg font-semibold text-green-900">
          ¡Solicitud enviada!
        </h3>
        <p className="mt-2 text-green-700">{result.message}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setResult(null)}
        >
          Enviar otra solicitud
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Nombre <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Tu nombre"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company">Empresa / Piscina</Label>
          <Input
            id="company"
            placeholder="Nombre de tu empresa"
            {...register('company')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            placeholder="+34 600 000 000"
            {...register('phone')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="poolCount">Cantidad de piscinas</Label>
        <Select {...register('poolCount')}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-5">1-5 piscinas</SelectItem>
            <SelectItem value="6-20">6-20 piscinas</SelectItem>
            <SelectItem value="21-50">21-50 piscinas</SelectItem>
            <SelectItem value="50+">Más de 50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">¿Qué te gustaría ver?</Label>
        <Textarea
          id="message"
          placeholder="Cuéntanos qué funcionalidades te interesan más..."
          rows={3}
          {...register('message')}
        />
      </div>

      {result && !result.success && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">{result.message}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          '🔐 Solicitar acceso a la demo'
        )}
      </Button>

      <p className="text-center text-xs text-gray-500">
        Te enviaremos un email con acceso directo. Válido por 7 días.
      </p>
    </form>
  )
}
