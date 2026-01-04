// =============== INICIO ARCHIVO: src/components/tools/pdf-studio/PDFStudioTool.tsx =============== //
'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, Download, FileText, RotateCw, Merge, Trash2, CheckCircle2, PenLine } from 'lucide-react'
// FIX: Importamos 'degrees' necesario para la rotación
import { PDFDocument, degrees } from 'pdf-lib'
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
    setFiles(prev => [...prev, ...pdfFiles])
  }

  const handleRotate = async (index: number, angle: number) => {
    try {
      const file = files[index]
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      const pages = pdfDoc.getPages()
      
      // Rotar todas las páginas
      pages.forEach(page => {
        const currentRotation = page.getRotation()
        // FIX: Usamos la función helper 'degrees' de pdf-lib
        page.setRotation(degrees(currentRotation.angle + angle))
      })
      
      const pdfBytes = await pdfDoc.save()
      // FIX: Casting 'as any' para el Blob
      const newBlob = new Blob([pdfBytes as any], { type: 'application/pdf' })

      const newFiles = [...files]
      newFiles[index] = new File([newBlob], file.name, { type: 'application/pdf' })
      setFiles(newFiles)
      toast.success(t('rotateSuccess'))
    } catch (error) {
      console.error(error)
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
      // FIX: Casting 'as any' para el Blob
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'merged.pdf'
      a.click()
      URL.revokeObjectURL(url)
      toast.success(t('mergeSuccess'))
    } catch (error) {
      console.error(error)
      toast.error(t('mergeError'))
    } finally {
      setProcessing(false)
    }
  }

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

      const signatureImageBytes = Uint8Array.from(atob(signatureBase64.split(',')[1]), c => c.charCodeAt(0))
      const signatureImage = await pdfDoc.embedPng(signatureImageBytes)

      const page = pdfDoc.getPage(0)
      const { width, height } = page.getSize()

      const signatureWidth = width * 0.25
      const signatureHeight = (signatureImage.height / signatureImage.width) * signatureWidth

      // Posición: abajo a la derecha con margen
      const x = width - signatureWidth - 30
      const y = 30 

      page.drawImage(signatureImage, {
        x,
        y,
        width: signatureWidth,
        height: signatureHeight,
      })

      const pdfBytes = await pdfDoc.save()
      // FIX: Casting 'as any' para el Blob
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name.replace('.pdf', '_signed.pdf')
      a.click()
      URL.revokeObjectURL(url)

      toast.success(t('download'))
    } catch (error) {
      console.error('Error downloading:', error)
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
          <h1 className="text-4xl font-bold text-white">{t('header')}</h1>
        </div>
        <p className="text-zinc-400 text-lg">
          {t('subtitle')}
        </p>
      </div>

      <Alert className="mb-8 bg-purple-950/20 border-purple-900/50 text-purple-200">
        <FileText className="h-4 w-4 text-purple-400" />
        <AlertDescription>
          {t('infoAlert')}
        </AlertDescription>
      </Alert>

      {/* Upload Section */}
      <Card className="mb-8 border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              files.length > 0 ? 'border-purple-500 bg-purple-950/10' : 'border-zinc-700 hover:border-purple-500/50 hover:bg-zinc-800 cursor-pointer'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              e.currentTarget.classList.add('border-purple-500', 'bg-purple-950/10')
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              e.currentTarget.classList.remove('border-purple-500', 'bg-purple-950/10')
            }}
            onDrop={(e) => {
              e.preventDefault()
              e.currentTarget.classList.remove('border-purple-500', 'bg-purple-950/10')
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
                <Upload className="w-12 h-12 mx-auto text-zinc-500" />
                <p className="text-white font-medium">{t('dragPdfs')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <CheckCircle2 className="w-12 h-12 mx-auto text-green-400" />
                <p className="text-white font-medium">{t('pdfsSelected', { count: files.length })}</p>
              </div>
            )}
          </div>

          {files.length > 1 && (
            <Button onClick={handleMerge} disabled={processing} className="w-full mt-6 bg-purple-600 hover:bg-purple-500 text-white">
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
            <Card key={index} className="border-zinc-800 bg-zinc-950/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  {signatures[index] ? (
                    <div className="w-8 h-8 rounded-full bg-green-950/30 border border-green-900/50 flex items-center justify-center text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-8 h-8" />
                  )}
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => handleOpenSignature(index)} className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800">
                      <PenLine className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleRotate(index, 90)} className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800">
                      <RotateCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-base truncate text-white" title={file.name}>{file.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {signatures[index] && (
                  <div className="relative rounded-lg overflow-hidden bg-white/10 p-2">
                    <img
                      src={signatures[index]}
                      alt="Signature"
                      className="w-full h-12 object-contain"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between text-sm text-zinc-500">
                  <span>{t('page', { page: 1 })}</span>
                  <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleDownload(index)} className="flex-1 border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800">
                    <Download className="w-4 h-4 mr-2" />
                    {t('download')}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleRemove(index)} className="border-red-900/30 text-red-400 hover:bg-red-950/20 hover:text-red-300">
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
// =============== FIN ARCHIVO: src/components/tools/pdf-studio/PDFStudioTool.tsx =============== //