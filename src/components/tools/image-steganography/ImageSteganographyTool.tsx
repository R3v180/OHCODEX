'use client'

import React, { useCallback, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Image as ImageIcon,
  UploadCloud,
  Lock,
  Unlock,
  Download,
  Copy,
  CheckCircle2,
  Info,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

type Mode = 'embed' | 'extract'
type PayloadType = 'text' | 'file'

interface CapacityInfo {
  totalBits: number
  usableBits: number
  maxBytes: number
}

function computeCapacity(width: number, height: number): CapacityInfo {
  const pixels = width * height
  // 3 channels (RGB) * 1 bit por canal
  const totalBits = pixels * 3
  // Reservamos 32 bits para longitud / marcador de fin
  const usableBits = Math.max(0, totalBits - 32)
  const maxBytes = Math.floor(usableBits / 8)
  return { totalBits, usableBits, maxBytes }
}

function embedBytesLSB(imageData: ImageData, payload: Uint8Array): ImageData {
  const data = imageData.data
  const requiredBits = (payload.length + 1) * 8 // +1 para byte terminador 0x00
  const capacityBits = Math.floor((data.length / 4) * 3) // por píxel, 3 canales
  if (requiredBits > capacityBits) {
    throw new Error('Payload too large for this image')
  }

  const extended = new Uint8Array(payload.length + 1)
  extended.set(payload, 0)
  extended[extended.length - 1] = 0 // terminador

  let bitIndex = 0
  for (let i = 0; i < data.length && bitIndex < requiredBits; i += 4) {
    for (let c = 0; c < 3 && bitIndex < requiredBits; c++) {
      const byteIndex = Math.floor(bitIndex / 8)
      const bitInByte = 7 - (bitIndex % 8)
      const bit = (extended[byteIndex] >> bitInByte) & 1
      const channelIndex = i + c
      data[channelIndex] = (data[channelIndex] & 0xfe) | bit
      bitIndex++
    }
  }

  return new ImageData(data, imageData.width, imageData.height)
}

function extractBytesLSB(imageData: ImageData, maxBytes: number): Uint8Array {
  const data = imageData.data
  const bytes: number[] = []
  let currentByte = 0
  let bitsCollected = 0

  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const bit = data[i + c] & 1
      currentByte = (currentByte << 1) | bit
      bitsCollected++
      if (bitsCollected === 8) {
        if (currentByte === 0) {
          return new Uint8Array(bytes)
        }
        bytes.push(currentByte)
        if (bytes.length >= maxBytes) {
          return new Uint8Array(bytes)
        }
        currentByte = 0
        bitsCollected = 0
      }
    }
  }

  return new Uint8Array(bytes)
}

export function ImageSteganographyTool() {
  const t = useTranslations('tools.image-steganography')

  const [mode, setMode] = useState<Mode>('embed')
  const [payloadType, setPayloadType] = useState<PayloadType>('text')

  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [stegoFile, setStegoFile] = useState<File | null>(null)
  const [payloadFile, setPayloadFile] = useState<File | null>(null)
  const [payloadText, setPayloadText] = useState('')

  const [capacity, setCapacity] = useState<CapacityInfo | null>(null)
  const [usedBytes, setUsedBytes] = useState<number>(0)

  const [processing, setProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState('')
  const [extractedFileUrl, setExtractedFileUrl] = useState<string | null>(null)

  const coverInputRef = useRef<HTMLInputElement>(null)
  const stegoInputRef = useRef<HTMLInputElement>(null)
  const payloadInputRef = useRef<HTMLInputElement>(null)

  const loadImageToCanvas = useCallback(
    async (file: File): Promise<{ imageData: ImageData; canvas: HTMLCanvasElement }> => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Cannot get canvas context'))
            return
          }
          ctx.drawImage(img, 0, 0)
          const imageData = ctx.getImageData(0, 0, img.width, img.height)
          resolve({ imageData, canvas })
        }
        img.onerror = () => reject(new Error('Error loading image'))
        const reader = new FileReader()
        reader.onload = (e) => {
          img.src = e.target?.result as string
        }
        reader.onerror = () => reject(new Error('Error reading image file'))
        reader.readAsDataURL(file)
      })
    },
    [],
  )

  const handleCoverSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error(t('errors.onlyImages'))
      return
    }
    setCoverFile(file)
    setResultUrl(null)
    // Calcular capacidad
    loadImageToCanvas(file)
      .then(({ imageData }) => {
        const cap = computeCapacity(imageData.width, imageData.height)
        setCapacity(cap)
        setUsedBytes(0)
      })
      .catch(() => {
        toast.error(t('errors.loadImage'))
      })
  }

  const handleStegoSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error(t('errors.onlyImages'))
      return
    }
    setStegoFile(file)
    setExtractedText('')
    setExtractedFileUrl(null)
  }

  const handleEmbed = async () => {
    if (!coverFile) {
      toast.error(t('errors.noCover'))
      return
    }

    try {
      setProcessing(true)
      setResultUrl(null)

      const { imageData, canvas } = await loadImageToCanvas(coverFile)
      let payloadBytes: Uint8Array

      if (payloadType === 'text') {
        if (!payloadText.trim()) {
          toast.error(t('errors.noPayloadText'))
          setProcessing(false)
          return
        }
        const encoder = new TextEncoder()
        payloadBytes = encoder.encode(payloadText)
      } else {
        if (!payloadFile) {
          toast.error(t('errors.noPayloadFile'))
          setProcessing(false)
          return
        }
        const buffer = await payloadFile.arrayBuffer()
        payloadBytes = new Uint8Array(buffer)
      }

      const cap = capacity ?? computeCapacity(imageData.width, imageData.height)
      if (payloadBytes.length + 1 > cap.maxBytes) {
        toast.error(t('errors.notEnoughCapacity'))
        setProcessing(false)
        return
      }

      const stegoData = embedBytesLSB(imageData, payloadBytes)
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas context lost')
      ctx.putImageData(stegoData, 0, 0)

      // SIEMPRE guardar como PNG: JPEG es lossy y destruye los bits LSB
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            toast.error(t('errors.encode'))
            setProcessing(false)
            return
          }
          if (resultUrl) URL.revokeObjectURL(resultUrl)
          const url = URL.createObjectURL(blob)
          setResultUrl(url)
          setUsedBytes(payloadBytes.length)
          toast.success(t('success.embed'))
          setProcessing(false)
        },
        'image/png',
      )
    } catch (error) {
      console.error(error)
      toast.error(t('errors.encode'))
      setProcessing(false)
    }
  }

  const handleExtract = async () => {
    if (!stegoFile) {
      toast.error(t('errors.noStego'))
      return
    }
    try {
      setProcessing(true)
      setExtractedText('')
      setExtractedFileUrl(null)

      const { imageData } = await loadImageToCanvas(stegoFile)
      const cap = computeCapacity(imageData.width, imageData.height)
      const bytes = extractBytesLSB(imageData, cap.maxBytes)

      if (payloadType === 'text') {
        const decoder = new TextDecoder()
        const text = decoder.decode(bytes)
        setExtractedText(text)
      } else {
        // Clona los bytes a un Uint8Array normal para evitar problemas de tipos con SharedArrayBuffer
        const safeBytes = new Uint8Array(bytes.length)
        safeBytes.set(bytes)
        const blob = new Blob([safeBytes])
        const url = URL.createObjectURL(blob)
        setExtractedFileUrl(url)
      }

      toast.success(t('success.extract'))
    } catch (error) {
      console.error(error)
      toast.error(t('errors.decode'))
    } finally {
      setProcessing(false)
    }
  }

  const coverCapacityPercent = capacity
    ? capacity.maxBytes > 0
      ? Math.min(100, Math.round((usedBytes / capacity.maxBytes) * 100))
      : 0
    : 0

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-white">{t('header')}</h1>
        </div>
        <p className="text-zinc-400 text-lg">{t('subtitle')}</p>
      </div>

      <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-white text-lg sm:text-xl flex items-center gap-2">
              {mode === 'embed' ? <Lock className="w-5 h-5 text-cyan-400" /> : <Unlock className="w-5 h-5 text-emerald-400" />}
              {mode === 'embed' ? t('modes.embedTitle') : t('modes.extractTitle')}
            </span>
            <Tabs
              value={mode}
              onValueChange={(v) => {
                setMode(v as Mode)
                setResultUrl(null)
                setExtractedText('')
                setExtractedFileUrl(null)
              }}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-2 bg-zinc-900 border border-zinc-800 w-full sm:w-auto">
                <TabsTrigger value="embed" className="data-[state=active]:bg-cyan-900/40 data-[state=active]:text-cyan-300">
                  {t('modes.embed')}
                </TabsTrigger>
                <TabsTrigger
                  value="extract"
                  className="data-[state=active]:bg-emerald-900/40 data-[state=active]:text-emerald-300"
                >
                  {t('modes.extract')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardTitle>
          <CardDescription className="text-zinc-400">{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Payload type selector */}
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>{t('privacy')}</span>
            </div>
            <div className="inline-flex items-center gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
              <button
                type="button"
                onClick={() => setPayloadType('text')}
                className={`px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium ${
                  payloadType === 'text' ? 'bg-cyan-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t('payload.text')}
              </button>
              <button
                type="button"
                onClick={() => setPayloadType('file')}
                className={`px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium ${
                  payloadType === 'file' ? 'bg-cyan-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t('payload.file')}
              </button>
            </div>
          </div>

          {mode === 'embed' ? (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: cover image */}
              <div className="space-y-4">
                <Label className="text-zinc-300 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  {t('coverImage')}
                </Label>
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer group ${
                    coverFile ? 'border-cyan-500 bg-cyan-950/10' : 'border-zinc-700 hover:border-cyan-500/60 hover:bg-zinc-900'
                  }`}
                  onClick={() => coverInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault()
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    const file = e.dataTransfer.files?.[0]
                    if (file) handleCoverSelect(file)
                  }}
                >
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleCoverSelect(file)
                    }}
                  />
                  {coverFile ? (
                    <div className="space-y-2">
                      <CheckCircle2 className="w-10 h-10 mx-auto text-cyan-400" />
                      <p className="text-white font-medium">{coverFile.name}</p>
                      <p className="text-zinc-500 text-xs">
                        {(coverFile.size / 1024 / 1024).toFixed(2)} MB · {capacity ? capacity.maxBytes : '?'} bytes máx.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <UploadCloud className="w-10 h-10 mx-auto text-zinc-500 group-hover:text-cyan-400" />
                      <p className="text-white">{t('coverDrop')}</p>
                      <p className="text-zinc-500 text-xs">{t('coverHint')}</p>
                    </div>
                  )}
                </div>

                {capacity && (
                  <div className="space-y-2 text-xs text-zinc-400">
                    <p>
                      {t('capacity.total', {
                        pixels: capacity.totalBits / 3,
                        bytes: capacity.maxBytes,
                      })}
                    </p>
                    <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 transition-all"
                        style={{ width: `${coverCapacityPercent}%` }}
                      />
                    </div>
                    <p className="text-zinc-500">
                      {t('capacity.used', {
                        used: usedBytes,
                        percent: coverCapacityPercent,
                      })}
                    </p>
                  </div>
                )}
              </div>

              {/* Right: payload input */}
              <div className="space-y-4">
                {payloadType === 'text' ? (
                  <>
                    <Label className="text-zinc-300">{t('payloadTextLabel')}</Label>
                    <Textarea
                      value={payloadText}
                      onChange={(e) => setPayloadText(e.target.value)}
                      rows={10}
                      className="bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-600"
                      placeholder={t('payloadTextPlaceholder')}
                    />
                    <div className="flex justify-between text-xs text-zinc-500">
                      <span>
                        {payloadText.length} {t('characters')}
                      </span>
                      {capacity && (
                        <span>
                          {t('bytesAvailable', {
                            bytes: Math.max(0, capacity.maxBytes - new TextEncoder().encode(payloadText).length),
                          })}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <Label className="text-zinc-300">{t('payloadFileLabel')}</Label>
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer group ${
                        payloadFile
                          ? 'border-emerald-500 bg-emerald-950/10'
                          : 'border-zinc-700 hover:border-emerald-500/60 hover:bg-zinc-900'
                      }`}
                      onClick={() => payloadInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault()
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        const file = e.dataTransfer.files?.[0]
                        if (file) setPayloadFile(file)
                      }}
                    >
                      <input
                        ref={payloadInputRef}
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) setPayloadFile(file)
                        }}
                      />
                      {payloadFile ? (
                        <div className="space-y-2">
                          <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
                          <p className="text-white font-medium break-all">{payloadFile.name}</p>
                          <p className="text-zinc-500 text-xs">
                            {(payloadFile.size / 1024).toFixed(2)} KB
                            {capacity &&
                              ` · ${
                                payloadFile.size <= capacity.maxBytes
                                  ? t('fits')
                                  : t('tooLarge', { max: capacity.maxBytes })
                              }`}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <UploadCloud className="w-10 h-10 mx-auto text-zinc-500 group-hover:text-emerald-400" />
                          <p className="text-white">{t('payloadDrop')}</p>
                          <p className="text-zinc-500 text-xs">{t('payloadHint')}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <Button
                  onClick={handleEmbed}
                  disabled={processing}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white mt-2"
                >
                  {processing ? t('processing') : <>{t('actions.embed')} <Lock className="w-4 h-4 ml-2" /></>}
                </Button>

                {resultUrl && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t('success.embedShort')}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                      <div className="relative w-full max-w-xs aspect-video bg-black rounded-lg border border-zinc-800 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={resultUrl} alt="Stego preview" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <Button
                          asChild
                          className="bg-emerald-600 hover:bg-emerald-500 text-white"
                        >
                          <a href={resultUrl} download={coverFile ? `${coverFile.name}.stego.png` : 'stego-image.png'}>
                            <Download className="w-4 h-4 mr-2" />
                            {t('actions.downloadStego')}
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                          onClick={() => {
                            if (resultUrl) {
                              navigator.clipboard
                                .writeText(resultUrl)
                                .then(() => toast.success(t('copied')))
                                .catch(() => toast.error(t('errors.copy')))
                            }
                          }}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          {t('actions.copyUrl')}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: stego image */}
              <div className="space-y-4">
                <Label className="text-zinc-300 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  {t('stegoImage')}
                </Label>
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer group ${
                    stegoFile ? 'border-emerald-500 bg-emerald-950/10' : 'border-zinc-700 hover:border-emerald-500/60 hover:bg-zinc-900'
                  }`}
                  onClick={() => stegoInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault()
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    const file = e.dataTransfer.files?.[0]
                    if (file) handleStegoSelect(file)
                  }}
                >
                  <input
                    ref={stegoInputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleStegoSelect(file)
                    }}
                  />
                  {stegoFile ? (
                    <div className="space-y-2">
                      <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
                      <p className="text-white font-medium">{stegoFile.name}</p>
                      <p className="text-zinc-500 text-xs">{(stegoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <UploadCloud className="w-10 h-10 mx-auto text-zinc-500 group-hover:text-emerald-400" />
                      <p className="text-white">{t('stegoDrop')}</p>
                      <p className="text-zinc-500 text-xs">{t('stegoHint')}</p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleExtract}
                  disabled={processing}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white mt-2"
                >
                  {processing ? t('processing') : <>{t('actions.extract')} <Unlock className="w-4 h-4 ml-2" /></>}
                </Button>
              </div>

              {/* Right: extracted */}
              <div className="space-y-4">
                {payloadType === 'text' ? (
                  <>
                    <Label className="text-zinc-300">{t('extractedTextLabel')}</Label>
                    <Textarea
                      value={extractedText}
                      readOnly
                      rows={10}
                      className="bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-600"
                      placeholder={t('extractedTextPlaceholder')}
                    />
                    <div className="flex justify-between items-center text-xs text-zinc-500">
                      <span>
                        {extractedText.length} {t('characters')}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                        onClick={() => {
                          if (!extractedText) return
                          navigator.clipboard
                            .writeText(extractedText)
                            .then(() => toast.success(t('copied')))
                            .catch(() => toast.error(t('errors.copy')))
                        }}
                        disabled={!extractedText}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        {t('actions.copyText')}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Label className="text-zinc-300">{t('extractedFileLabel')}</Label>
                    <Card className="bg-zinc-900/60 border-zinc-800">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <ImageIcon className="w-6 h-6 text-zinc-400" />
                          <div className="text-sm text-zinc-300">
                            {extractedFileUrl ? t('fileReady') : t('noFileYet')}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          disabled={!extractedFileUrl}
                          className="bg-cyan-600 hover:bg-cyan-500 text-white"
                          onClick={() => {
                            if (!extractedFileUrl) return
                            const a = document.createElement('a')
                            a.href = extractedFileUrl
                            a.download = 'hidden-payload.bin'
                            a.click()
                          }}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          {t('actions.downloadPayload')}
                        </Button>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>
          )}

          <Alert className="bg-zinc-900/70 border-zinc-800 text-zinc-300">
            <Info className="w-4 h-4 text-cyan-400" />
            <AlertDescription className="text-xs sm:text-sm">
              {t('disclaimer')}{' '}
              <span className="font-semibold text-cyan-300">{t('localOnly')}</span>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}

