'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Code2, 
  FileCode2, 
  Copy, 
  CheckCircle2, 
  Upload, 
  ArrowRightLeft, 
  Trash2, 
  Download,
  Image as ImageIcon,
  FileText,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

export function Base64Tool() {
  const t = useTranslations('tools.base64')
  const tCommon = useTranslations('common.buttons')
  
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  
  // Text mode state
  const [textInput, setTextInput] = useState('')
  const [textOutput, setTextOutput] = useState('')
  
  // File mode state
  const [file, setFile] = useState<File | null>(null)
  const [fileBase64, setFileBase64] = useState('')
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [isImage, setIsImage] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Text encoding/decoding
  useEffect(() => {
    if (activeTab !== 'text') return
    
    if (!textInput.trim()) {
      setTextOutput('')
      return
    }

    try {
      if (mode === 'encode') {
        // Encode text to Base64
        const encoded = btoa(unescape(encodeURIComponent(textInput)))
        setTextOutput(encoded)
      } else {
        // Decode Base64 to text
        const decoded = decodeURIComponent(escape(atob(textInput)))
        setTextOutput(decoded)
      }
    } catch (error) {
      // Don't show error while typing, just clear output
      setTextOutput('')
    }
  }, [textInput, mode, activeTab])

  // Handle mode swap
  const handleSwap = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode'
    setMode(newMode)
    
    if (activeTab === 'text') {
      // Swap input and output
      setTextInput(textOutput)
      setTextOutput(textInput)
    }
  }

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      toast.success(t('copied'))
    } catch (error) {
      toast.error(t('copyError'))
    }
  }

  // Clear all
  const handleClear = () => {
    setTextInput('')
    setTextOutput('')
    setFile(null)
    setFileBase64('')
    setFilePreview(null)
    setIsImage(false)
  }

  // File handling
  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setIsImage(selectedFile.type.startsWith('image/'))
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      // Extract base64 part (remove data:image/png;base64, prefix)
      const base64String = result.split(',')[1] || result
      setFileBase64(base64String)
      
      if (selectedFile.type.startsWith('image/')) {
        setFilePreview(result)
      } else {
        setFilePreview(null)
      }
    }
    reader.readAsDataURL(selectedFile)
  }

  // Decode base64 to file
  const handleBase64Input = (base64String: string) => {
    setFileBase64(base64String)
    
    if (!base64String.trim()) {
      setFilePreview(null)
      setFile(null)
      setIsImage(false)
      return
    }

    try {
      // Try to detect if it's an image
      const byteCharacters = atob(base64String)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      
      // Try to detect MIME type from magic numbers
      let mimeType = 'application/octet-stream'
      if (byteArray[0] === 0xFF && byteArray[1] === 0xD8) {
        mimeType = 'image/jpeg'
      } else if (byteArray[0] === 0x89 && byteArray[1] === 0x50) {
        mimeType = 'image/png'
      } else if (byteArray[0] === 0x47 && byteArray[1] === 0x49) {
        mimeType = 'image/gif'
      } else if (byteArray[0] === 0x52 && byteArray[1] === 0x49) {
        mimeType = 'image/webp'
      } else if (byteArray[0] === 0x25 && byteArray[1] === 0x50) {
        mimeType = 'application/pdf'
      }
      
      setIsImage(mimeType.startsWith('image/'))
      
      if (mimeType.startsWith('image/')) {
        const blob = new Blob([byteArray], { type: mimeType })
        const url = URL.createObjectURL(blob)
        setFilePreview(url)
      } else {
        setFilePreview(null)
      }
    } catch (error) {
      // Invalid base64, don't show preview
      setFilePreview(null)
      setIsImage(false)
    }
  }

  // Download decoded file
  const downloadDecodedFile = () => {
    if (!fileBase64) return
    
    try {
      const byteCharacters = atob(fileBase64)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      
      const blob = new Blob([byteArray])
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file?.name || 'decoded-file'
      a.click()
      URL.revokeObjectURL(url)
      toast.success(t('downloaded'))
    } catch (error) {
      toast.error(t('decodeError'))
    }
  }

  // Download base64 as text file
  const downloadBase64Text = () => {
    if (!fileBase64) return
    
    const blob = new Blob([fileBase64], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file?.name || 'file'}.b64.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(t('downloaded'))
  }

  // Character count display
  const InputCount = ({ count }: { count: number }) => (
    <span className="text-xs text-zinc-500">
      {count} {t('characters')}
    </span>
  )

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Code2 className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-white">{t('header')}</h1>
        </div>
        <p className="text-zinc-400 text-lg">
          {t('subtitle')}
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
          <button
            onClick={() => setMode('encode')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              mode === 'encode'
                ? 'bg-cyan-600 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t('encode')}
          </button>
          <button
            onClick={handleSwap}
            className="p-2 text-zinc-500 hover:text-cyan-400 transition-colors"
            title={t('swap')}
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              mode === 'decode'
                ? 'bg-cyan-600 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t('decode')}
          </button>
        </div>
      </div>

      {/* Main Card */}
      <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'text' | 'file')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-zinc-900 border border-zinc-800">
              <TabsTrigger 
                value="text" 
                className="text-base data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                {t('textTab')}
              </TabsTrigger>
              <TabsTrigger 
                value="file" 
                className="text-base data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                {t('fileTab')}
              </TabsTrigger>
            </TabsList>

            {/* Text Tab */}
            <TabsContent value="text" className="space-y-6">
              <Alert className="bg-cyan-950/30 border-cyan-900/50 text-cyan-200">
                <Code2 className="h-4 w-4 text-cyan-400" />
                <AlertDescription>
                  {mode === 'encode' ? t('encodeAlert') : t('decodeAlert')}
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-zinc-300">
                      {mode === 'encode' ? t('textInput') : t('base64Input')}
                    </Label>
                    <InputCount count={textInput.length} />
                  </div>
                  <Textarea
                    placeholder={mode === 'encode' ? t('textPlaceholder') : t('base64Placeholder')}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    rows={12}
                    className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 font-mono text-sm"
                  />
                </div>

                {/* Output Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-zinc-300">
                      {mode === 'encode' ? t('base64Output') : t('textOutput')}
                    </Label>
                    <div className="flex items-center gap-3">
                      <InputCount count={textOutput.length} />
                      {textOutput && (
                        <button
                          onClick={() => copyToClipboard(textOutput)}
                          className="text-zinc-500 hover:text-cyan-400 transition-colors"
                          title={tCommon('copy')}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <Textarea
                    value={textOutput}
                    readOnly
                    placeholder={mode === 'encode' ? t('base64OutputPlaceholder') : t('textOutputPlaceholder')}
                    rows={12}
                    className="bg-zinc-900/50 border-zinc-800 text-cyan-400 font-mono text-sm placeholder:text-zinc-700"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  disabled={!textInput && !textOutput}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {tCommon('clear')}
                </Button>
                <Button
                  onClick={() => copyToClipboard(textOutput)}
                  disabled={!textOutput}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {tCommon('copy')}
                </Button>
              </div>
            </TabsContent>

            {/* File Tab */}
            <TabsContent value="file" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: File Upload or Base64 Input */}
                <div className="space-y-4">
                  <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-base text-zinc-300 flex items-center gap-2">
                        {mode === 'encode' ? (
                          <>
                            <Upload className="w-4 h-4 text-cyan-500" />
                            {t('uploadFile')}
                          </>
                        ) : (
                          <>
                            <FileCode2 className="w-4 h-4 text-cyan-500" />
                            {t('pasteBase64')}
                          </>
                        )}
                      </CardTitle>
                      <CardDescription className="text-zinc-400">
                        {mode === 'encode' ? t('uploadFileDesc') : t('pasteBase64Desc')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {mode === 'encode' ? (
                        <>
                          {/* File Dropzone */}
                          <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                              file
                                ? 'border-cyan-500 bg-cyan-950/10'
                                : 'border-zinc-700 hover:border-cyan-500/50 hover:bg-zinc-800 cursor-pointer'
                            }`}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => {
                              e.preventDefault()
                              e.currentTarget.classList.add('border-cyan-500', 'bg-cyan-950/10')
                            }}
                            onDragLeave={(e) => {
                              e.preventDefault()
                              e.currentTarget.classList.remove('border-cyan-500', 'bg-cyan-950/10')
                            }}
                            onDrop={(e) => {
                              e.preventDefault()
                              e.currentTarget.classList.remove('border-cyan-500', 'bg-cyan-950/10')
                              const droppedFile = e.dataTransfer.files[0]
                              if (droppedFile) handleFileSelect(droppedFile)
                            }}
                          >
                            <input
                              ref={fileInputRef}
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                const selectedFile = e.target.files?.[0]
                                if (selectedFile) handleFileSelect(selectedFile)
                              }}
                            />
                            {file ? (
                              <div className="space-y-2">
                                <CheckCircle2 className="w-12 h-12 mx-auto text-green-400" />
                                <p className="text-white font-medium">{file.name}</p>
                                <p className="text-zinc-500 text-sm">
                                  {(file.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <Upload className="w-12 h-12 mx-auto text-zinc-500" />
                                <p className="text-white">{t('dragHere')}</p>
                                <p className="text-zinc-500 text-sm">{t('clickToSelect')}</p>
                              </div>
                            )}
                          </div>

                          {fileBase64 && (
                            <>
                              <div className="space-y-2">
                                <Label className="text-zinc-300">{t('base64Output')}</Label>
                                <Textarea
                                  value={fileBase64}
                                  readOnly
                                  rows={6}
                                  className="bg-zinc-950 border-zinc-700 text-cyan-400 font-mono text-xs break-all"
                                />
                                <div className="text-right text-xs text-zinc-500">
                                  {fileBase64.length} {t('characters')}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => copyToClipboard(fileBase64)}
                                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white"
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  {tCommon('copy')}
                                </Button>
                                <Button
                                  onClick={downloadBase64Text}
                                  variant="outline"
                                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {/* Base64 Input for Decoding */}
                          <div className="space-y-2">
                            <Textarea
                              placeholder={t('pasteBase64Placeholder')}
                              value={fileBase64}
                              onChange={(e) => handleBase64Input(e.target.value)}
                              rows={8}
                              className="bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-600 font-mono text-sm"
                            />
                            <div className="text-right text-xs text-zinc-500">
                              {fileBase64.length} {t('characters')}
                            </div>
                          </div>

                          {fileBase64 && (
                            <Button
                              onClick={downloadDecodedFile}
                              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white"
                              disabled={!filePreview && isImage}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              {t('downloadFile')}
                            </Button>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Right: Preview */}
                <div className="space-y-4">
                  <Card className="bg-zinc-900/50 border-zinc-800 h-full">
                    <CardHeader>
                      <CardTitle className="text-base text-zinc-300 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-cyan-500" />
                        {t('preview')}
                      </CardTitle>
                      <CardDescription className="text-zinc-400">
                        {mode === 'encode' ? t('previewDesc') : t('previewDecodeDesc')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {mode === 'encode' ? (
                        // Encode mode preview
                        file ? (
                          isImage && filePreview ? (
                            <div className="flex flex-col items-center gap-4">
                              <div className="relative w-full max-w-sm aspect-square bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                  src={filePreview} 
                                  alt="Preview" 
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <p className="text-zinc-400 text-sm">{file.name}</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
                              <FileText className="w-16 h-16 mb-4" />
                              <p>{file.name}</p>
                              <p className="text-sm">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                          )
                        ) : (
                          <div className="flex flex-col items-center justify-center h-64 text-zinc-600">
                            <ImageIcon className="w-16 h-16 mb-4" />
                            <p>{t('noPreview')}</p>
                          </div>
                        )
                      ) : (
                        // Decode mode preview
                        fileBase64 ? (
                          isImage && filePreview ? (
                            <div className="flex flex-col items-center gap-4">
                              <div className="relative w-full max-w-sm aspect-square bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                  src={filePreview} 
                                  alt="Decoded preview" 
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <p className="text-green-400 text-sm flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                {t('decodeSuccess')}
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
                              {fileBase64 ? (
                                <>
                                  <FileText className="w-16 h-16 mb-4" />
                                  <p>{t('fileReady')}</p>
                                  <Button
                                    onClick={downloadDecodedFile}
                                    className="mt-4 bg-cyan-600 hover:bg-cyan-500 text-white"
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    {t('downloadFile')}
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-16 h-16 mb-4" />
                                  <p>{t('pasteBase64ToPreview')}</p>
                                </>
                              )}
                            </div>
                          )
                        ) : (
                          <div className="flex flex-col items-center justify-center h-64 text-zinc-600">
                            <ImageIcon className="w-16 h-16 mb-4" />
                            <p>{t('pasteBase64ToPreview')}</p>
                          </div>
                        )
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Clear Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  disabled={!file && !fileBase64}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {tCommon('clear')}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
