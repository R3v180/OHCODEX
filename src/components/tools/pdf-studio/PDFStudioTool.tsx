'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, Download, FileText, RotateCw, Merge, Trash2, CheckCircle2, PenLine, Plus, Info } from 'lucide-react'
import { PDFDocument, degrees } from 'pdf-lib'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { SignatureDialog } from './SignatureDialog'
import { Badge } from '@/components/ui/badge'

export function PDFStudioTool() {
  const t = useTranslations('tools.pdf-studio')
  const tCommon = useTranslations('common.buttons')
  
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
    // TRADUCCIÓN: filesAdded
    toast.success(t('filesAdded', { count: pdfFiles.length }))
  }

  const handleRotate = async (index: number, angle: number) => {
    try {
      const file = files[index]
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      const pages = pdfDoc.getPages()
      
      pages.forEach(page => {
        const currentRotation = page.getRotation().angle
        page.setRotation(degrees(currentRotation + angle))
      })
      
      const pdfBytes = await pdfDoc.save()
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
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'merged_ohcodex.pdf'
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

      if (!signatureBase64) {
        const url = URL.createObjectURL(file)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name
        a.click()
        URL.revokeObjectURL(url)
        return
      }

      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)

      const signatureImageBytes = Uint8Array.from(atob(signatureBase64.split(',')[1]), c => c.charCodeAt(0))
      const signatureImage = await pdfDoc.embedPng(signatureImageBytes)

      const page = pdfDoc.getPage(0)
      const { width, height } = page.getSize()

      const signatureWidth = width * 0.25
      const signatureHeight = (signatureImage.height / signatureImage.width) * signatureWidth

      const x = width - signatureWidth - 30
      const y = 30 

      page.drawImage(signatureImage, {
        x,
        y,
        width: signatureWidth,
        height: signatureHeight,
      })

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name.replace('.pdf', '_signed.pdf')
      a.click()
      URL.revokeObjectURL(url)

      toast.success(tCommon('download'))
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
    <div className="space-y-8">
      {/* 1. ZONA DE CARGA (DROPZONE) */}
      <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-xl border-dashed border-2 hover:border-purple-500/50 transition-colors group">
        <CardContent className="p-10 flex flex-col items-center justify-center text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="h-16 w-16 bg-purple-500/10 text-purple-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">{t('dragPdfs')}</h3>
          {/* TRADUCCIÓN: dropzoneSubtitle */}
          <p className="text-zinc-500 max-w-sm">
            {t('dropzoneSubtitle')}
          </p>
        </CardContent>
      </Card>

      {/* 2. ALERTA DE PRIVACIDAD */}
      <Alert className="bg-purple-950/10 border-purple-900/30 text-purple-300">
        <Info className="h-4 w-4 text-purple-400" />
        {/* TRADUCCIÓN: privacyAlert */}
        <AlertDescription>
          {t('privacyAlert')}
        </AlertDescription>
      </Alert>

      {/* 3. LISTA DE ARCHIVOS */}
      {files.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between">
            {/* TRADUCCIÓN: documents */}
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-500" />
              {t('documents')} ({files.length})
            </h3>
            {files.length > 1 && (
              <Button onClick={handleMerge} disabled={processing} className="bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/20">
                {processing ? t('merging') : (
                  <>
                    <Merge className="w-4 h-4 mr-2" />
                    {t('mergeAll')}
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, index) => (
              <Card key={index} className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors group">
                <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                  <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <FileText className="h-6 w-6" />
                  </div>
                  {signatures[index] && (
                    /* TRADUCCIÓN: signed */
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                      {t('signed')}
                    </Badge>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <CardTitle className="text-sm font-medium text-white truncate mb-1" title={file.name}>
                      {file.name}
                    </CardTitle>
                    <p className="text-xs text-zinc-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • PDF Document
                    </p>
                  </div>

                  {/* PREVISUALIZACIÓN DE FIRMA */}
                  {signatures[index] && (
                    <div className="relative rounded-md overflow-hidden bg-white/5 border border-white/10 p-2 h-12 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={signatures[index]} alt="Firma" className="max-h-full object-contain opacity-80" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleRotate(index, 90)} className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800">
                      <RotateCw className="w-3.5 h-3.5 mr-2" />
                      {t('rotate')}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleOpenSignature(index)} className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800">
                      <PenLine className="w-3.5 h-3.5 mr-2" />
                      {/* TRADUCCIÓN: sign */}
                      {t('sign')}
                    </Button>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-zinc-800/50">
                    <Button size="sm" className="flex-1 bg-zinc-100 text-zinc-900 hover:bg-white" onClick={() => handleDownload(index)}>
                      <Download className="w-3.5 h-3.5 mr-2" />
                      {tCommon('download')}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleRemove(index)} className="text-red-400 hover:bg-red-950/20 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* BOTÓN AÑADIR MÁS */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-zinc-800 bg-transparent rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer hover:border-purple-500/50 hover:bg-purple-950/5 transition-all min-h-[240px]"
            >
              <Plus className="h-8 w-8 text-zinc-600 mb-2" />
              {/* TRADUCCIÓN: addMore */}
              <span className="text-sm text-zinc-500">{t('addMore')}</span>
            </div>
          </div>
        </div>
      )}

      <SignatureDialog
        open={signatureDialogOpen}
        onClose={() => setSignatureDialogOpen(false)}
        onSave={handleSaveSignature}
      />
    </div>
  )
}