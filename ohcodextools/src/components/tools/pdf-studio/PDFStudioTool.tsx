'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, Download, FileText, RotateCw, Merge, Trash2, CheckCircle2, PenLine } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { SignatureDialog } from './SignatureDialog'

export function PDFStudioTool() {
  const t = useTranslations('tools.pdfStudio')
  const [files, setFiles] = useState<File[]>([])
  const [signatures, setSignatures] = useState<Record<number, string>>({})
  const [processing, setProcessing] = useState(false)
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false)
  const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return
    const pdfFiles = Array.from(selectedFiles).filter(f => f.type === 'application/pdf')
    setFiles(pdfFiles)
  }

  const handleRotate = async (index: number, angle: number) => {
    try {
      const file = files[index]
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      const page = pdfDoc.getPage(0)
      const currentRotation = page.getRotation().angle
      page.setRotation({ angle: currentRotation + angle })
      const pdfBytes = await pdfDoc.save()
      const newBlob = new Blob([pdfBytes], { type: 'application/pdf' })

      const newFiles = [...files]
      newFiles[index] = new File([newBlob], file.name, { type: 'application/pdf' })
      setFiles(newFiles)
      toast.success(t('rotateSuccess'))
    } catch (error) {
      toast.error(t('rotateError'))
    }
  }

  const handleOpenSignature = (index: number) => {
    setCurrentFileIndex(index)
    setSignatureDialogOpen(true)
  }

  const handleSaveSignature = (signatureImage: string) => {
    if (currentFileIndex !== null) {
      setSignatures(prev => ({ ...prev, [currentFileIndex]: signatureImage }))
      toast.success(t('signatureSaved'))
    }
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error(t('needTwoPdfs'))
      return
    }

    setProcessing(true)
    try {
      const mergedPdf = await PDFDocument.create()

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer()
        const pdfDoc = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())
        copiedPages.forEach(page => mergedPdf.addPage(page))
      }

      const pdfBytes = await mergedPdf.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'merged.pdf'
      a.click()
      URL.revokeObjectURL(url)
      toast.success(t('mergeSuccess'))
    } catch (error) {
      toast.error(t('mergeError'))
    } finally {
      setProcessing(false)
    }
  }

  /**
   * Corrección CRÍTICA: Esta función ahora incrusta la firma real en el PDF
   * antes de descargarlo.
   */
  const handleDownload = async (index: number) => {
    try {
      const file = files[index]
      const signatureBase64 = signatures[index]

      // Si no hay firma, descargar original
      if (!signatureBase64) {
        const url = URL.createObjectURL(file)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name
        a.click()
        URL.revokeObjectURL(url)
        return
      }

      // Si hay firma, incrustar en el PDF
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)

      // Convertir base64 a Uint8Array para embedPng
      const signatureImageBytes = Uint8Array.from(atob(signatureBase64.split(',')[1]), c => c.charCodeAt(0))
      const signatureImage = await pdfDoc.embedPng(signatureImageBytes)

      // Obtener la primera página
      const page = pdfDoc.getPage(0)
      const { width, height } = page.getSize()

      // Calcular posición y tamaño razonable para la firma
      const signatureWidth = width * 0.3  // 30% del ancho de la página
      const signatureHeight = signatureImageBytes ? (signatureImageBytes.length * 0.5) : 50 // Altura estimada
      const scaleFactor = Math.min(signatureWidth / 300, signatureHeight / 100) // Escalar razonablemente
      const finalSignatureWidth = 300 / scaleFactor
      const finalSignatureHeight = 100 / scaleFactor

      // Posición: abajo a la derecha
      const x = width - finalSignatureWidth - 50
      const y = height - finalSignatureHeight - 50

      // Dibujar la firma sobre la página
      page.drawImage(signatureImage, {
        x,
        y,
        width: finalSignatureWidth,
        height: finalSignatureHeight,
        opacity: 0.8
      })

      // Guardar el PDF modificado
      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })

      // Descargar
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name.replace('.pdf', '_signed.pdf')
      a.click()
      URL.revokeObjectURL(url)

      toast.success(t('download'))
    } catch (error) {
      console.error('Error al descargar PDF con firma:', error)
      toast.error(t('downloadError'))
    }
  }

  const handleRemove = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
    setSignatures(prev => {
      const newSignatures = { ...prev }
      delete newSignatures[index]
      return newSignatures
    })
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold">{t('header')}</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          {t('subtitle')}
        </p>
      </div>

      <Alert className="mb-8 bg-purple-500/10 border-purple-500/20">
        <FileText className="h-4 w-4 text-purple-400" />
        <AlertDescription>
          {t('infoAlert')}
        </AlertDescription>
      </Alert>

      {/* Upload Section */}
      <Card className="mb-8 border-border bg-card">
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              files.length > 0 ? 'border-purple-500 bg-purple-500/5' : 'border-border hover:border-purple-500/50 hover:bg-purple-500/5 cursor-pointer'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              e.currentTarget.classList.add('border-purple-500', 'bg-purple-500/10')
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              e.currentTarget.classList.remove('border-purple-500', 'bg-purple-500/10')
            }}
            onDrop={(e) => {
              e.preventDefault()
              e.currentTarget.classList.remove('border-purple-500', 'bg-purple-500/10')
              handleFiles(e.dataTransfer.files)
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            {files.length === 0 ? (
              <div className="space-y-2">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="text-foreground font-medium">{t('dragPdfs')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <CheckCircle2 className="w-12 h-12 mx-auto text-green-400" />
                <p className="text-foreground font-medium">{t('pdfsSelected', { count: files.length })}</p>
              </div>
            )}
          </div>

          {files.length > 1 && (
            <Button onClick={handleMerge} disabled={processing} className="w-full mt-6 bg-purple-600 hover:bg-purple-500">
              {processing ? t('merging') : (
                <>
                  <Merge className="w-4 h-4 mr-2" />
                  {t('mergeAll')}
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Files Grid */}
      {files.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <Card key={index} className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  {signatures[index] ? (
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-8 h-8" />
                  )}
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => handleOpenSignature(index)}>
                      <PenLine className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleRotate(index, 90)}>
                      <RotateCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-base truncate">{file.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {signatures[index] && (
                  <div className="relative rounded-lg overflow-hidden bg-zinc-900/50 p-2">
                    <img
                      src={signatures[index]}
                      alt={`Signature for ${file.name}`}
                      className="w-24 h-8 object-contain opacity-80"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{t('page', { page: 1 })}</span>
                  <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleDownload(index)}>
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleRemove(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Signature Dialog */}
      <SignatureDialog
        open={signatureDialogOpen}
        onClose={() => setSignatureDialogOpen(false)}
        onSave={handleSaveSignature}
      />
    </div>
  )
}
