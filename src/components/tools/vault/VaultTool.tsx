// =============== INICIO ARCHIVO: src/components/tools/vault/VaultTool.tsx =============== //
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Lock, Unlock, Eye, EyeOff, Copy, CheckCircle2, Upload, Shield } from 'lucide-react'
import { encryptText, decryptText, encryptFile, decryptFile } from '@/lib/engines/crypto-engine'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

export function VaultTool() {
  const t = useTranslations('tools.vault')
  const tCommon = useTranslations('common.buttons')
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text')

  // Text encryption state
  const [textMode, setTextMode] = useState<'encrypt' | 'decrypt'>('encrypt')
  const [textInput, setTextInput] = useState('')
  const [textPassword, setTextPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [textOutput, setTextOutput] = useState('')
  const [textProcessing, setTextProcessing] = useState(false)

  // File encryption state
  const [fileMode, setFileMode] = useState<'encrypt' | 'decrypt'>('encrypt')
  const [file, setFile] = useState<File | null>(null)
  const [filePassword, setFilePassword] = useState('')
  const [showFilePassword, setShowFilePassword] = useState(false)
  const [fileProcessing, setFileProcessing] = useState(false)

  const handleTextEncrypt = async () => {
    if (!textInput || !textPassword) {
      toast.error(t('enterTextPassword'))
      return
    }

    try {
      setTextProcessing(true)
      const result = await encryptText(textInput, textPassword)
      const combined = JSON.stringify(result)
      setTextOutput(combined)
      toast.success(t('encryptedSuccess'))
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('encryptionError'))
    } finally {
      setTextProcessing(false)
    }
  }

  const handleTextDecrypt = async () => {
    if (!textOutput || !textPassword) {
      toast.error(t('enterEncrypted'))
      return
    }

    try {
      setTextProcessing(true)
      const encrypted = JSON.parse(textOutput)
      const result = await decryptText(encrypted, textPassword)
      setTextInput(result)
      toast.success(t('decryptedSuccess'))
    } catch (error) {
      toast.error(t('decryptionError'))
    } finally {
      setTextProcessing(false)
    }
  }

  const copyToClipboard = async () => {
    if (!textOutput) return
    try {
      await navigator.clipboard.writeText(textOutput)
      toast.success(t('copied'))
    } catch (error) {
      toast.error(t('copyError'))
    }
  }

  const handleFileEncrypt = async () => {
    if (!file || !filePassword) {
      toast.error(t('selectFilePassword'))
      return
    }

    try {
      setFileProcessing(true)
      const encryptedBlob = await encryptFile(file, filePassword, true)
      const url = URL.createObjectURL(encryptedBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${file.name}.ohc`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(t('encryptedSuccess'))
      setFile(null)
      setFilePassword('')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('encryptionError'))
    } finally {
      setFileProcessing(false)
    }
  }

  const handleFileDecrypt = async () => {
    if (!file || !filePassword) {
      toast.error(t('selectOhcFile'))
      return
    }

    try {
      setFileProcessing(true)
      const { file: decryptedFile, metadata } = await decryptFile(file, filePassword)
      const url = URL.createObjectURL(decryptedFile)
      const a = document.createElement('a')
      a.href = url
      a.download = metadata?.name || `decrypted.${decryptedFile.type.split('/')[1] || 'bin'}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(t('decryptedSuccess'))
      setFile(null)
      setFilePassword('')
    } catch (error) {
      toast.error(t('decryptionError'))
    } finally {
      setFileProcessing(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-white">{t('header')}</h1>
        </div>
        <p className="text-zinc-400 text-lg">
          {t('subtitle')}
        </p>
      </div>

      {/* Main Card */}
      <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'text' | 'file')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-zinc-900 border border-zinc-800">
              <TabsTrigger value="text" className="text-base data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                <Lock className="w-4 h-4 mr-2" />
                {t('textTab')}
              </TabsTrigger>
              <TabsTrigger value="file" className="text-base data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                <Upload className="w-4 h-4 mr-2" />
                {t('fileTab')}
              </TabsTrigger>
            </TabsList>

            {/* Text Tab */}
            <TabsContent value="text" className="space-y-6">
              <Alert className="bg-cyan-950/30 border-cyan-900/50 text-cyan-200">
                <Shield className="h-4 w-4 text-cyan-400" />
                <AlertDescription>
                  {t('alert')}
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="text-input" className="text-zinc-300">
                      {textMode === 'encrypt' ? t('textToEncrypt') : t('textDecrypted')}
                    </Label>
                    <Textarea
                      id="text-input"
                      placeholder={textMode === 'encrypt' ? 'Pega aquí el texto sensible...' : 'El resultado aparecerá aquí...'}
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      rows={10}
                      className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600"
                      readOnly={textMode === 'decrypt'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="text-password">{t('password')}</Label>
                    <div className="relative">
                      <Input
                        id="text-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('enterPassword')}
                        value={textPassword}
                        onChange={(e) => setTextPassword(e.target.value)}
                        className="bg-zinc-900/50 border-zinc-800 text-white pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {textMode === 'encrypt' ? (
                      <Button
                        onClick={handleTextEncrypt}
                        disabled={textProcessing || !textInput || !textPassword}
                        className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white"
                      >
                        {textProcessing ? 'Encriptando...' : (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            {t('encrypt')}
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleTextDecrypt}
                        disabled={textProcessing || !textOutput || !textPassword}
                        className="flex-1 bg-green-600 hover:bg-green-500 text-white"
                      >
                        {textProcessing ? 'Desencriptando...' : (
                          <>
                            <Unlock className="w-4 h-4 mr-2" />
                            {t('decrypt')}
                          </>
                        )}
                      </Button>
                    )}
                    {textMode === 'encrypt' && (
                      <Button
                        onClick={() => setTextMode('decrypt')}
                        variant="outline"
                        disabled={!textOutput}
                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                      >
                        {t('changeToDecrypt')}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Output Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="text-output" className="text-zinc-300">
                      {textMode === 'encrypt' ? t('encryptedText') : t('encrypted')}
                    </Label>
                    <Textarea
                      id="text-output"
                      placeholder="El resultado encriptado aparecerá aquí..."
                      value={textOutput}
                      onChange={(e) => setTextOutput(e.target.value)}
                      rows={10}
                      className="bg-zinc-900/50 border-zinc-800 text-cyan-400 font-mono text-sm placeholder:text-zinc-700"
                      readOnly={textMode === 'encrypt'}
                    />
                  </div>

                  <div className="flex gap-2">
                    {textMode === 'encrypt' ? (
                      <Button
                        onClick={copyToClipboard}
                        disabled={!textOutput}
                        variant="outline"
                        className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        {tCommon('copy')}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setTextMode('encrypt')}
                        variant="outline"
                        disabled={!textInput}
                        className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                      >
                        {t('changeToEncrypt')}
                      </Button>
                    )}
                  </div>

                  {/* Status Indicator */}
                  {textOutput && (
                    <div className="flex items-center gap-2 text-sm text-green-400 bg-green-950/20 p-2 rounded border border-green-900/50">
                      <CheckCircle2 className="w-4 h-4" />
                      {textMode === 'encrypt' ? t('encryptedSuccess') : t('readyToDecrypt')}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* File Tab */}
            <TabsContent value="file" className="space-y-6">
              <Alert className="bg-cyan-950/30 border-cyan-900/50 text-cyan-200">
                <Shield className="h-4 w-4 text-cyan-400" />
                <AlertDescription>
                  {t('fileAlert')}
                </AlertDescription>
              </Alert>

              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    {fileMode === 'encrypt' ? (
                      <>
                        <Lock className="w-5 h-5 text-cyan-400" />
                        {t('encryptFile')}
                      </>
                    ) : (
                      <>
                        <Unlock className="w-5 h-5 text-green-400" />
                        {t('decryptFile')}
                      </>
                    )}
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    {fileMode === 'encrypt'
                      ? t('encryptDesc')
                      : t('decryptDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* File Dropzone */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      file
                        ? 'border-cyan-500 bg-cyan-950/10'
                        : 'border-zinc-700 hover:border-cyan-500/50 hover:bg-zinc-800 cursor-pointer'
                    }`}
                    onClick={() => document.getElementById('file-input')?.click()}
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
                      if (droppedFile) setFile(droppedFile)
                    }}
                  >
                    <input
                      id="file-input"
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0]
                        if (selectedFile) setFile(selectedFile)
                      }}
                    />
                    {file ? (
                      <div className="space-y-2">
                        <CheckCircle2 className="w-12 h-12 mx-auto text-green-400" />
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-zinc-500 text-sm">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
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

                  {/* Password Input */}
                  <div className="space-y-2">
                    <Label htmlFor="file-password" className="text-zinc-300">{t('encryptionPassword')}</Label>
                    <div className="relative">
                      <Input
                        id="file-password"
                        type={showFilePassword ? 'text' : 'password'}
                        placeholder={t('enterPassword')}
                        value={filePassword}
                        onChange={(e) => setFilePassword(e.target.value)}
                        className="bg-zinc-900 border-zinc-700 text-white pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowFilePassword(!showFilePassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                      >
                        {showFilePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    {fileMode === 'encrypt' ? (
                      <>
                        <Button
                          onClick={handleFileEncrypt}
                          disabled={fileProcessing || !file || !filePassword}
                          className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white"
                        >
                          {fileProcessing ? 'Encriptando...' : (
                            <>
                              <Lock className="w-4 h-4 mr-2" />
                              {t('encryptAndDownload')}
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => setFileMode('decrypt')}
                          variant="outline"
                          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                        >
                          {t('decryptFileButton')}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={handleFileDecrypt}
                          disabled={fileProcessing || !file || !filePassword}
                          className="flex-1 bg-green-600 hover:bg-green-500 text-white"
                        >
                          {fileProcessing ? 'Desencriptando...' : (
                            <>
                              <Unlock className="w-4 h-4 mr-2" />
                              {t('decryptAndDownload')}
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => setFileMode('encrypt')}
                          variant="outline"
                          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                        >
                          {t('encryptFileButton')}
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
// =============== FIN ARCHIVO: src/components/tools/vault/VaultTool.tsx =============== //