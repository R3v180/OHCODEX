'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import JSZip from 'jszip'
import { Upload, Download, Image as ImageIcon, CheckCircle2, Zap, FileArchive, ArrowRight, Settings2, Trash2 } from 'lucide-react'
import { processBatch, formatFileSize, calculateReduction } from '@/lib/engines/image-engine'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

export function ImageOptimizerTool() {
  const t = useTranslations('tools.image-optimizer')
  
  const [files, setFiles] = useState<File[]>([])
  const [results, setResults] = useState<Array<{ original: File; processed: any }>>([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  // Configuración
  const [quality, setQuality] = useState([80])
  const [format, setFormat] = useState<'image/webp' | 'image/jpeg' | 'image/png'>('image/webp')
  const [maxWidth, setMaxWidth] = useState<number>(1920)
  const [resizeEnabled, setResizeEnabled] = useState(false)

  const handleFiles = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return
    // Aceptamos imágenes y específicamente HEIC
    const imageFiles = Array.from(selectedFiles).filter(f => 
      f.type.startsWith('image/') || 
      f.name.toLowerCase().endsWith('.heic') || 
      f.name.toLowerCase().endsWith('.heif')
    )
    
    if (imageFiles.length === 0) {
      toast.error('Formato no soportado. Usa JPG, PNG o HEIC.')
      return
    }

    // Limpiamos resultados anteriores si suben nuevos archivos
    if (results.length > 0) {
        setResults([])
        setFiles(imageFiles)
    } else {
        setFiles(prev => [...prev, ...imageFiles])
    }
    toast.success(`${imageFiles.length} imágenes añadidas`)
  }, [results.length])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const handleProcess = async () => {
    if (files.length === 0) return

    setProcessing(true)
    setProgress(0)

    try {
      const processedImages = await processBatch(
        files,
        {
          maxWidth: resizeEnabled ? maxWidth : undefined,
          quality: quality[0] / 100,
          format,
          stripExif: true
        },
        (current, total) => {
          setProgress((current / total) * 100)
        }
      )

      const newResults = processedImages.map((processed, index) => ({
        original: files[index],
        processed
      }))

      setResults(newResults)
      toast.success(t('processedSuccess', { count: processedImages.length }))
    } catch (error) {
      console.error(error)
      toast.error(t('processingError'))
    } finally {
      setProcessing(false)
      setProgress(100)
    }
  }

  const downloadImage = (result: any) => {
    const url = URL.createObjectURL(result.processed.blob)
    const a = document.createElement('a')
    a.href = url
    const ext = format === 'image/webp' ? 'webp' : format === 'image/jpeg' ? 'jpg' : 'png'
    a.download = `${result.original.name.split('.')[0]}_optimized.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadAll = async () => {
    if (results.length === 0) return

    try {
      const zip = new JSZip()
      results.forEach((result) => {
        const ext = format === 'image/webp' ? 'webp' : format === 'image/jpeg' ? 'jpg' : 'png'
        const fileName = `${result.original.name.split('.')[0]}_optimized.${ext}`
        zip.file(fileName, result.processed.blob)
      })

      const content = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = url
      a.download = 'optimized_images_ohcodex.zip'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('ZIP generado correctamente')
    } catch (error) {
      console.error(error)
      toast.error('Error al crear ZIP')
    }
  }

  const clearAll = () => {
    setFiles([])
    setResults([])
    setProgress(0)
  }

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      
      {/* 1. PANEL LATERAL DE AJUSTES */}
      <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl sticky top-24">
          <CardHeader className="border-b border-zinc-800 pb-4">
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <Settings2 className="w-5 h-5 text-cyan-500" />
              {t('settings')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            
            {/* Formato */}
            <div className="space-y-3">
              <Label className="text-zinc-300 font-medium">{t('outputFormat')}</Label>
              <Select value={format} onValueChange={(v: any) => setFormat(v)}>
                <SelectTrigger className="bg-black border-zinc-700 text-white h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                  <SelectItem value="image/webp">WebP (Ultraligero)</SelectItem>
                  <SelectItem value="image/jpeg">JPEG (Universal)</SelectItem>
                  <SelectItem value="image/png">PNG (Sin pérdida)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Calidad */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-zinc-300 font-medium">{t('quality')}</Label>
                <Badge variant="outline" className="bg-zinc-950 text-cyan-400 border-cyan-900">{quality[0]}%</Badge>
              </div>
              <Slider value={quality} onValueChange={setQuality} min={10} max={100} step={5} className="py-2 cursor-pointer" />
              <p className="text-xs text-zinc-500">Menor calidad = Menor peso de archivo.</p>
            </div>

            {/* Redimensionar */}
            <div className="space-y-4 pt-2 border-t border-zinc-800/50">
              <div className="flex items-center justify-between">
                <Label htmlFor="resize" className="text-zinc-300 font-medium cursor-pointer">{t('resize')}</Label>
                <Switch id="resize" checked={resizeEnabled} onCheckedChange={setResizeEnabled} />
              </div>
              {resizeEnabled && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <div className="flex justify-between text-xs text-zinc-400 mb-1">
                    <span>Ancho Máximo</span>
                    <span>{maxWidth}px</span>
                  </div>
                  <Slider value={[maxWidth]} onValueChange={([v]) => setMaxWidth(v)} min={500} max={3840} step={100} />
                </div>
              )}
            </div>

            {/* Botón de Acción Principal */}
            <Button 
                onClick={handleProcess} 
                disabled={processing || files.length === 0} 
                className="w-full h-12 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-base shadow-lg shadow-cyan-900/20"
            >
              {processing ? (
                <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 animate-pulse" /> {t('processing')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4" /> {t('processAll')}
                </span>
              )}
            </Button>

            {/* Aviso Privacidad */}
            <div className="bg-green-950/20 border border-green-900/30 rounded-lg p-3 flex gap-3 items-start">
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              <p className="text-xs text-green-200/80 leading-relaxed">
                {t('privacyAlert')}
              </p>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* 2. ZONA DE TRABAJO PRINCIPAL */}
      <div className="lg:col-span-8 space-y-6 order-1 lg:order-2">
        
        {/* Dropzone */}
        {results.length === 0 && (
            <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 h-[300px] flex flex-col items-center justify-center ${
                files.length > 0 
                    ? 'border-cyan-500 bg-cyan-950/5' 
                    : 'border-zinc-700 bg-zinc-900/30 hover:border-cyan-500/50 hover:bg-zinc-900 cursor-pointer'
                }`}
                onDragOver={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.add('border-cyan-500', 'bg-cyan-950/10')
                }}
                onDragLeave={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.remove('border-cyan-500', 'bg-cyan-950/10')
                }}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
            >
                {/* 👇 MODIFICADO: Accept explicito para HEIC/HEIF */}
                <input
                    id="file-input"
                    type="file"
                    multiple
                    accept="image/*,.heic,.heif"
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                />
                
                {files.length === 0 ? (
                    <div className="space-y-4 group">
                        <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 group-hover:bg-zinc-700">
                            <Upload className="w-10 h-10 text-zinc-400 group-hover:text-white" />
                        </div>
                        <div>
                            <p className="text-xl font-medium text-white mb-2">{t('dragImages')}</p>
                            {/* 👇 MODIFICADO: Texto explicito para el usuario */}
                            <p className="text-zinc-500 text-sm">JPG, PNG, WebP, HEIC (iPhone)</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-cyan-950/30 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto">
                            <ImageIcon className="w-10 h-10 text-cyan-400" />
                        </div>
                        <div>
                            <p className="text-xl font-medium text-white mb-1">{t('imagesSelected', { count: files.length })}</p>
                            <p className="text-zinc-400 text-sm">Listas para optimizar</p>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* Barra de Progreso */}
        {processing && (
          <div className="space-y-2 bg-zinc-900 p-4 rounded-lg border border-zinc-800 animate-in fade-in">
            <div className="flex justify-between text-sm">
              <span className="text-cyan-400 font-medium">Optimizando...</span>
              <span className="text-zinc-400">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-zinc-800" />
          </div>
        )}

        {/* Resultados */}
        {results.length > 0 && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white">Resultados</h3>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={clearAll} className="text-zinc-400 hover:text-white">
                        <Trash2 className="w-4 h-4 mr-2" /> Limpiar
                    </Button>
                    <Button onClick={handleDownloadAll} className="bg-white text-black hover:bg-zinc-200 font-semibold">
                        <FileArchive className="w-4 h-4 mr-2" />
                        Descargar ZIP
                    </Button>
                </div>
            </div>

            <div className="grid gap-3">
              {results.map((result, index) => {
                const reduction = calculateReduction(result.original.size, result.processed.processedSize)
                const isPositive = reduction > 0

                return (
                  <div key={index} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-900 transition-colors gap-4">
                    
                    {/* Info Archivo */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-12 h-12 rounded-lg bg-black/50 border border-zinc-800 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-6 h-6 text-zinc-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate max-w-[200px]" title={result.original.name}>
                            {result.original.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                            <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">
                                {formatFileSize(result.original.size)}
                            </span>
                            <ArrowRight className="w-3 h-3" />
                            <span className="bg-cyan-950/30 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-900/30">
                                {formatFileSize(result.processed.processedSize)}
                            </span>
                        </div>
                      </div>
                    </div>

                    {/* Badge Ahorro y Botón */}
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <Badge className={`h-8 px-3 text-sm ${isPositive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-zinc-800 text-zinc-400'}`}>
                            {isPositive ? `-${reduction}%` : '0%'}
                        </Badge>
                        
                        <Button size="sm" onClick={() => downloadImage(result)} variant="outline" className="border-zinc-700 bg-transparent text-white hover:bg-zinc-800">
                            <Download className="w-4 h-4 mr-2" />
                            Guardar
                        </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}