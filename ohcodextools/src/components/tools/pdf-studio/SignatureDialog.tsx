'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Trash2, Upload, Download, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

export interface SignatureDialogProps {
  open: boolean
  onClose: () => void
  onSave: (signatureImage: string) => void
}

export function SignatureDialog({ open, onClose, onSave }: SignatureDialogProps) {
  const t = useTranslations('tools.pdfStudio.signature')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = 600
    canvas.height = 200

    // Set white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Set drawing style
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [open])

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true)
    setHasSignature(true)
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
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
    setHasSignature(false)
    setUploadedImage(null)
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (uploadedImage) {
      onSave(uploadedImage)
      toast.success(t('saved'))
    } else {
      const dataUrl = canvas.toDataURL('image/png')
      onSave(dataUrl)
      toast.success(t('saved'))
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

        // Clear and draw uploaded image centered
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {t('canvasPlaceholder')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Canvas */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onMouseMove={isDrawing ? draw : undefined}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={isDrawing ? draw : undefined}
              className="border border-border rounded-lg cursor-crosshair w-full bg-white"
              style={{ touchAction: 'none' }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleClear}
              variant="outline"
              className="flex-1"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t('clear')}
            </Button>

            <div className="flex-1" />

            <label className="cursor-pointer">
              <Button variant="outline" className="w-full" asChild>
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {t('upload')}
                </>
              </Button>
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleUpload}
                className="hidden"
              />
            </label>

            <Button
              onClick={handleSave}
              disabled={!hasSignature}
              className="flex-1 bg-green-600 hover:bg-green-500"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {t('save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
