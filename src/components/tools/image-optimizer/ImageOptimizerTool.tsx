// =============== INICIO ARCHIVO: src/components/tools/image-optimizer/ImageOptimizerTool.tsx =============== //
'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import JSZip from 'jszip'
import { Upload, Download, Image as ImageIcon, CheckCircle2, Zap, FileArchive } from 'lucide-react'
import { processBatch, formatFileSize, calculateReduction } from '@/lib/engines/image-engine'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export function ImageOptimizerTool() {
  const t = useTranslations('tools.imageOptimizer')
  const tCommon = useTranslations('common.buttons')
  const [files, setFiles] = useState<File[]>([])
  const [results, setResults] = useState<Array<{ original: File; processed: any }>>([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  // Settings
  const [quality, setQuality] = useState([80])
  const [format, setFormat] = useState<'image/webp' | 'image/jpeg' | 'image/png'>('image/webp')
  const [maxWidth, setMaxWidth] = useState<number>(1920)
  const [resizeEnabled, setResizeEnabled] = useState(false)

  const handleFiles = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return
    const imageFiles = Array.from(selectedFiles).filter(f => f.type.startsWith('image/'))
    setFiles(imageFiles)
    setResults([])
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const handleProcess = async () => {
    if (files.length === 0) {
      toast.error(t('selectImages'))
      return
    }

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

      // Mapeamos los resultados para mantener la referencia
      const newResults = processedImages.map((processed, index) => ({
        original: files[index],
        processed
      }))

      setResults(newResults)
      toast.success(t('processedSuccess', { count: processedImages.length }))
      setProcessing(false)
      setProgress(100)
    } catch (error) {
      console.error(error)
      toast.error(t('processingError'))
      setProcessing(false)
    }
  }

  const downloadImage = (result: any) => {
    const url = URL.createObjectURL(result.blob)
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
      a.download = 'optimized-images.zip'
      a.click()
      URL.revokeObjectURL(url)

      toast.success('ZIP downloaded successfully')
    } catch (error) {
      console.error(error)
      toast.error('Error creating ZIP')
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Zap className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-white">{t('header')}</h1>
        </div>
        <p className="text-zinc-400 text-lg">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-xl h-fit">
          <CardHeader>
            <CardTitle className="text-white">{t('settings')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-zinc-300">{t('outputFormat')}</Label>
              <Select value={format} onValueChange={(v: any) => setFormat(v)}>
                <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                  <SelectItem value="image/webp">{t('webp')}</SelectItem>
                  <SelectItem value="image/jpeg">JPEG</SelectItem>
                  <SelectItem value="image/png">PNG</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">{t('quality')}: {quality[0]}%</Label>
              <Slider value={quality} onValueChange={setQuality} min={1} max={100} className="py-4" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="resize" className="text-zinc-300">{t('resize')}</Label>
                <Switch id="resize" checked={resizeEnabled} onCheckedChange={setResizeEnabled} />
              </div>
              {resizeEnabled && (
                <div className="space-y-2">
                  <Label className="text-zinc-300">{t('maxWidth')}: {maxWidth}px</Label>
                  <Slider value={[maxWidth]} onValueChange={([v]) => setMaxWidth(v)} min={100} max={4000} step={100} className="py-4" />
                </div>
              )}
            </div>

            <Alert className="bg-green-950/20 border-green-900/50 text-green-200">
              <Zap className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-xs">
                {t('privacyAlert')}
              </AlertDescription>
            </Alert>

            <Button onClick={handleProcess} disabled={processing || files.length === 0} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white">
              {processing ? t('processing') : t('processAll')}
            </Button>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="lg:col-span-2 border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
          <CardContent className="p-6">
            {/* Dropzone */}
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                files.length > 0 ? 'border-cyan-500 bg-cyan-950/10' : 'border-zinc-700 hover:border-cyan-500/50 hover:bg-zinc-900 cursor-pointer'
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
              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              {files.length === 0 ? (
                <div className="space-y-2">
                  <Upload className="w-12 h-12 mx-auto text-zinc-500" />
                  <p className="text-white font-medium">{t('dragImages')}</p>
                  <p className="text-zinc-500 text-sm">{t('clickToSelect')}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <CheckCircle2 className="w-12 h-12 mx-auto text-green-400" />
                  <p className="text-white font-medium">{t('imagesSelected', { count: files.length })}</p>
                </div>
              )}
            </div>

            {/* Progress */}
            {processing && (
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>{t('processing')}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Results Grid */}
            {results.length > 0 && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{t('results')}</h3>
                  <Button onClick={handleDownloadAll} variant="outline" className="flex items-center gap-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                    <FileArchive className="w-4 h-4" />
                    {tCommon('download')} ZIP
                  </Button>
                </div>
                <div className="grid gap-4">
                  {results.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded bg-cyan-950/30 text-cyan-400 border border-cyan-900/50">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-white font-medium truncate max-w-[200px] sm:max-w-xs">{result.original.name}</p>
                          <p className="text-sm text-zinc-500">
                            {formatFileSize(result.original.size)} → {formatFileSize(result.processed.processedSize)}
                            <span className="ml-2 text-green-400 font-mono">
                              (-{calculateReduction(result.original.size, result.processed.processedSize)}%)
                            </span>
                          </p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => downloadImage(result.processed)} className="bg-zinc-800 hover:bg-zinc-700 text-white">
                        <Download className="w-4 h-4 mr-2" />
                        {tCommon('download')}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
// =============== FIN ARCHIVO: src/components/tools/image-optimizer/ImageOptimizerTool.tsx =============== //