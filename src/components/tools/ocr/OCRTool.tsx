'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Upload, FileText, Copy, Download, RefreshCw, ScanLine, Image as ImageIcon, Languages, Trash2 } from 'lucide-react'
import { recognizeText, OCRLanguage } from '@/lib/engines/ocr-engine'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import Image from 'next/image'

export function OCRTool() {
  const t = useTranslations('tools.ocr-vision')
  const tCommon = useTranslations('common.buttons')

  const [image, setImage] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [language, setLanguage] = useState<OCRLanguage>('spa') // Por defecto español
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImage(url)
      setText('')
      setProgress(0)
    }
  }

  const handleProcess = async () => {
    if (!image) return

    setIsProcessing(true)
    setProgress(0)
    setText('')

    try {
      // Llamamos al motor que creamos en el paso anterior
      const result = await recognizeText(image, language, (prog) => {
        setProgress(prog)
      })
      setText(result.text)
      toast.success(t('success'))
    } catch (error) {
      console.error(error)
      toast.error(t('error'))
    } finally {
      setIsProcessing(false)
      setProgress(100)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    toast.success(tCommon('copy'))
  }

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'extracted_text_ohcodex.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClear = () => {
    if (image) URL.revokeObjectURL(image)
    setImage(null)
    setText('')
    setProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      
      {/* COLUMNA IZQUIERDA: IMAGEN */}
      <div className="space-y-6">
        <Card className="border-zinc-800 bg-zinc-950/50 h-full min-h-[500px] flex flex-col">
          <CardContent className="p-6 flex-1 flex flex-col">
            
            {/* Toolbar Superior */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-zinc-400">
                <ImageIcon className="w-5 h-5" />
                <span className="font-medium text-sm">{t('sourceImage')}</span>
              </div>
              
              <div className="flex gap-2">
                <Select value={language} onValueChange={(v) => setLanguage(v as OCRLanguage)}>
                  <SelectTrigger className="w-[140px] bg-zinc-900 border-zinc-700 text-white h-9">
                    <Languages className="w-4 h-4 mr-2 text-zinc-400" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                    <SelectItem value="spa">Español</SelectItem>
                    <SelectItem value="eng">English</SelectItem>
                    <SelectItem value="fra">Français</SelectItem>
                    <SelectItem value="deu">Deutsch</SelectItem>
                    <SelectItem value="ita">Italiano</SelectItem>
                    <SelectItem value="por">Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Zona de Imagen / Dropzone */}
            <div className="flex-1 bg-zinc-900/50 rounded-xl border-2 border-dashed border-zinc-800 relative overflow-hidden flex items-center justify-center min-h-[300px]">
              {image ? (
                <div className="relative w-full h-full min-h-[300px] p-4 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={image} 
                    alt="Source" 
                    className="max-h-[400px] w-auto object-contain rounded-lg shadow-xl"
                  />
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    className="absolute top-4 right-4 z-10 shadow-lg hover:bg-red-600"
                    onClick={handleClear}
                    title="Eliminar imagen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="text-center cursor-pointer p-10 w-full h-full flex flex-col items-center justify-center hover:bg-zinc-900/80 transition-colors group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-10 h-10" />
                  </div>
                  <p className="text-zinc-200 font-semibold text-lg mb-2">{t('dragImage')}</p>
                  <p className="text-zinc-500 text-sm">JPG, PNG, HEIC, WebP</p>
                </div>
              )}
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*,.heic,.heif" 
                className="hidden" 
                onChange={handleFileUpload} 
              />
            </div>

            {/* Botón de Acción Principal */}
            <div className="mt-6">
              <Button 
                onClick={handleProcess} 
                disabled={!image || isProcessing} 
                className="w-full h-12 bg-amber-600 hover:bg-amber-500 text-white font-bold text-lg shadow-[0_0_20px_-5px_rgba(217,119,6,0.3)] hover:shadow-[0_0_25px_-5px_rgba(217,119,6,0.5)] transition-all"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" /> {t('extracting')} {Math.round(progress)}%
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ScanLine className="w-5 h-5" /> {t('extractText')}
                  </span>
                )}
              </Button>
              
              {/* Barra de Progreso */}
              {isProcessing && (
                <div className="mt-4 space-y-2 animate-in fade-in">
                   <div className="flex justify-between text-xs text-amber-400">
                      <span>Procesando imagen con IA...</span>
                      <span>{Math.round(progress)}%</span>
                   </div>
                   <Progress value={progress} className="h-2 bg-zinc-800" />
                </div>
              )}
            </div>

          </CardContent>
        </Card>
      </div>

      {/* COLUMNA DERECHA: TEXTO RESULTANTE */}
      <div className="space-y-6">
        <Card className="border-zinc-800 bg-zinc-950/50 h-full min-h-[500px] flex flex-col">
          <CardContent className="p-6 flex-1 flex flex-col">
            
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-zinc-400">
                <FileText className="w-5 h-5" />
                <span className="font-medium text-sm">{t('result')}</span>
              </div>
              {text && (
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-3 py-1">
                  {text.length} caracteres
                </Badge>
              )}
            </div>

            <Textarea 
              value={text} 
              onChange={(e) => setText(e.target.value)}
              placeholder={t('placeholder')}
              className="flex-1 bg-zinc-900 border-zinc-800 text-zinc-200 font-mono text-sm leading-relaxed p-6 min-h-[300px] resize-none focus:ring-amber-500/50 focus:border-amber-500/50 placeholder:text-zinc-700"
            />

            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button variant="outline" onClick={handleCopy} disabled={!text} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white h-12">
                <Copy className="w-4 h-4 mr-2" /> {tCommon('copy')}
              </Button>
              <Button variant="secondary" onClick={handleDownload} disabled={!text} className="bg-zinc-800 text-white hover:bg-zinc-700 h-12">
                <Download className="w-4 h-4 mr-2" /> {tCommon('download')} .txt
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>

    </div>
  )
}