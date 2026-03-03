'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Hash, Copy, Zap, Info } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

type Algo = 'sha256' | 'sha512' | 'pbkdf2'

function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function hashSha(algo: 'SHA-256' | 'SHA-512', data: string): Promise<string> {
  const enc = new TextEncoder()
  const buf = enc.encode(data)
  const digest = await crypto.subtle.digest(algo, buf)
  return bufferToHex(digest)
}

async function derivePBKDF2(
  password: string,
  salt: string,
  iterations: number,
  length: number,
): Promise<string> {
  const enc = new TextEncoder()
  const passKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      iterations,
      salt: enc.encode(salt),
    },
    passKey,
    length * 8,
  )
  return bufferToHex(bits)
}

export function AdvancedHashGeneratorTool() {
  const t = useTranslations('tools.advHash')

  const [algo, setAlgo] = useState<Algo>('sha256')
  const [input, setInput] = useState('')
  const [salt, setSalt] = useState('')
  const [iterations, setIterations] = useState(100_000)
  const [length, setLength] = useState(32)
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!input) {
      toast.error(t('errors.noInput'))
      return
    }
    try {
      setLoading(true)
      let result = ''
      if (algo === 'sha256') {
        result = await hashSha('SHA-256', input)
      } else if (algo === 'sha512') {
        result = await hashSha('SHA-512', input)
      } else {
        if (!salt) {
          toast.error(t('errors.noSalt'))
          setLoading(false)
          return
        }
        result = await derivePBKDF2(input, salt, iterations, length)
      }
      setOutput(result)
      toast.success(t('generated'))
    } catch (e) {
      console.error(e)
      toast.error(t('errors.generate'))
    } finally {
      setLoading(false)
    }
  }

  const copy = () => {
    if (!output) return
    navigator.clipboard
      .writeText(output)
      .then(() => toast.success(t('copied')))
      .catch(() => toast.error(t('errors.copy')))
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-sky-500/10 text-sky-400">
            <Hash className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-white">{t('header')}</h1>
        </div>
        <p className="text-zinc-400 text-lg">{t('subtitle')}</p>
      </div>

      <Card className="border-zinc-800 bg-zinc-950/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-white text-lg sm:text-xl flex items-center gap-2">
              <Shield className="w-5 h-5 text-sky-400" />
              {t('title')}
            </span>
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
              <Info className="w-4 h-4 text-sky-400" />
              {t('privacy')}
            </span>
          </CardTitle>
          <CardDescription className="text-zinc-400">{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <Tabs value={algo} onValueChange={(v) => setAlgo(v as Algo)} className="w-full">
            <TabsList className="grid grid-cols-3 bg-zinc-900 border border-zinc-800 mb-6">
              <TabsTrigger
                value="sha256"
                className="data-[state=active]:bg-sky-700/30 data-[state=active]:text-sky-300"
              >
                SHA-256
              </TabsTrigger>
              <TabsTrigger
                value="sha512"
                className="data-[state=active]:bg-sky-700/30 data-[state=active]:text-sky-300"
              >
                SHA-512
              </TabsTrigger>
              <TabsTrigger
                value="pbkdf2"
                className="data-[state=active]:bg-sky-700/30 data-[state=active]:text-sky-300"
              >
                PBKDF2
              </TabsTrigger>
            </TabsList>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Left: input & params */}
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-2">
                  <Label className="text-zinc-300">{t('inputLabel')}</Label>
                  <Textarea
                    rows={6}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-600"
                    placeholder={t('inputPlaceholder')}
                  />
                </div>

                {algo === 'pbkdf2' && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-zinc-300">{t('salt')}</Label>
                      <Input
                        value={salt}
                        onChange={(e) => setSalt(e.target.value)}
                        placeholder={t('saltPlaceholder')}
                        className="bg-zinc-900/60 border-zinc-800 text-white"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-zinc-300">{t('iterations')}</Label>
                        <span className="font-mono text-sky-400 text-sm">
                          {iterations.toLocaleString()}
                        </span>
                      </div>
                      <Slider
                        value={[iterations]}
                        onValueChange={([v]) => setIterations(v)}
                        min={10_000}
                        max={500_000}
                        step={10_000}
                        className="[&_[role=slider]]:bg-sky-500"
                      />
                      <p className="text-xs text-zinc-500">{t('iterationsHint')}</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-zinc-300">{t('length')}</Label>
                        <span className="font-mono text-sky-400 text-sm">{length} B</span>
                      </div>
                      <Slider
                        value={[length]}
                        onValueChange={([v]) => setLength(v)}
                        min={16}
                        max={64}
                        step={4}
                        className="[&_[role=slider]]:bg-sky-500"
                      />
                      <p className="text-xs text-zinc-500">{t('lengthHint')}</p>
                    </div>
                  </>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full bg-sky-600 hover:bg-sky-500 text-white"
                >
                  {loading ? t('generating') : <>{t('actions.generate')} <Zap className="w-4 h-4 ml-2" /></>}
                </Button>

                <Alert className="bg-zinc-900/80 border-zinc-800 text-zinc-300 mt-4">
                  <Info className="w-4 h-4 text-sky-400" />
                  <AlertDescription className="text-xs sm:text-sm">
                    {t('localOnly')}
                  </AlertDescription>
                </Alert>
              </div>

              {/* Right: output */}
              <div className="lg:col-span-3 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-zinc-300">{t('outputLabel')}</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!output}
                    onClick={copy}
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    {t('actions.copy')}
                  </Button>
                </div>
                <Textarea
                  readOnly
                  rows={8}
                  value={output}
                  className="bg-black/60 border-zinc-800 text-sky-300 font-mono text-xs"
                  placeholder={t('outputPlaceholder')}
                />
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

