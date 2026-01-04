'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trash2, Upload, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

export interface SignatureDialogProps {
  open: boolean
  onClose: () => void
  onSave: (signatureImage: string) => void
}

export function SignatureDialog({ open, onClose, onSave }: SignatureDialogProps) {
  // CORRECCIÓN: 'pdf-studio' con guion
  const t = useTranslations('tools.pdf-studio.signature')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    const timer = setTimeout(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = 200
      } else {
        canvas.width = 600
        canvas.height = 200
      }

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }, 100)

    return () => clearTimeout(timer)
  }, [open])

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true)
    setHasSignature(true)
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx?.beginPath()
    }
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    let x, y

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.beginPath()
    
    setHasSignature(false)
    setUploadedImage(null)
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (uploadedImage) {
      onSave(uploadedImage)
      toast.success(t('save'))
    } else {
      const dataUrl = canvas.toDataURL('image/png')
      onSave(dataUrl)
      toast.success(t('save'))
    }

    handleClear()
    onClose()
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        const aspectRatio = img.width / img.height
        let drawWidth = canvas.width * 0.8
        let drawHeight = drawWidth / aspectRatio
        if (drawHeight > canvas.height * 0.8) {
          drawHeight = canvas.height * 0.8
          drawWidth = drawHeight * aspectRatio
        }
        const x = (canvas.width - drawWidth) / 2
        const y = (canvas.height - drawHeight) / 2
        ctx.drawImage(img, x, y, drawWidth, drawHeight)
        setUploadedImage(canvas.toDataURL('image/png'))
        setHasSignature(true)
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            {t('canvasPlaceholder')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative w-full h-[200px] border border-zinc-700 rounded-lg overflow-hidden bg-white touch-none">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onMouseMove={draw}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
              className="cursor-crosshair w-full h-full block"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleClear} variant="outline" className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              <Trash2 className="w-4 h-4 mr-2" />
              {t('clear')}
            </Button>
            <div className="flex-1 hidden sm:block" />
            <label className="cursor-pointer flex-1">
              <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  {t('upload')}
                </span>
              </Button>
              <input type="file" accept="image/png,image/jpeg" onChange={handleUpload} className="hidden" />
            </label>
            <Button onClick={handleSave} disabled={!hasSignature} className="flex-1 bg-green-600 hover:bg-green-500 text-white">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {t('save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}