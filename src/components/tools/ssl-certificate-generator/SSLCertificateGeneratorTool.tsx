'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Shield, FileDigit, Download, Copy, Info, CalendarDays } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

type KeyAlgo = 'rsa' | 'ecdsa'

interface CSRFields {
  cn: string
  o: string
  ou: string
  c: string
  st: string
  l: string
}

interface GeneratedCertBundle {
  privateKeyPem: string
  csrPem: string
  certPem: string
}

function randomSerialHex(bytes: number = 16) {
  const arr = new Uint8Array(bytes)
  crypto.getRandomValues(arr)
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function pseudoPEM(label: string, body: string) {
  return [`-----BEGIN ${label}-----`, body, `-----END ${label}-----`].join('\n')
}

function generateSelfSigned({ algo, days, fields }: { algo: KeyAlgo; days: number; fields: CSRFields }): GeneratedCertBundle {
  const randomCore = btoa(
    JSON.stringify({
      algo,
      days,
      fields,
      serial: randomSerialHex(),
    }),
  )

  const privateKeyPem = pseudoPEM(
    algo === 'rsa' ? 'RSA PRIVATE KEY' : 'EC PRIVATE KEY',
    randomCore.slice(0, 64),
  )

  const csrPem = pseudoPEM(
    'CERTIFICATE REQUEST',
    btoa(`CSR::${fields.cn}::${fields.o}::${fields.c}`),
  )

  const certPem = pseudoPEM(
    'CERTIFICATE',
    btoa(`CERT::${fields.cn}::${fields.o}::${fields.c}::${days}`),
  )

  return { privateKeyPem, csrPem, certPem }
}

export function SSLCertificateGeneratorTool() {
  const t = useTranslations('tools.sslCertGen')

  const [algo, setAlgo] = useState<KeyAlgo>('rsa')
  const [validYears, setValidYears] = useState(1)
  const [fields, setFields] = useState<CSRFields>({
    cn: '',
    o: '',
    ou: '',
    c: '',
    st: '',
    l: '',
  })
  const [bundle, setBundle] = useState<GeneratedCertBundle | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChangeField = (key: keyof CSRFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }))
  }

  const handleGenerate = () => {
    if (!fields.cn || !fields.c) {
      toast.error(t('errors.missingRequired'))
      return
    }

    try {
      setLoading(true)
      const days = validYears * 365
      const result = generateSelfSigned({ algo, days, fields })
      setBundle(result)
      toast.success(t('generated'))
    } catch {
      toast.error(t('errors.generate'))
    } finally {
      setLoading(false)
    }
  }

  const copy = (value: string) => {
    if (!value) return
    navigator.clipboard
      .writeText(value)
      .then(() => toast.success(t('copied')))
      .catch(() => toast.error(t('errors.copy')))
  }

  const downloadBundle = () => {
    if (!bundle) return
    const zipText =
      '# Self-signed SSL certificate bundle (mock ZIP)\n\n' +
      bundle.privateKeyPem +
      '\n\n' +
      bundle.csrPem +
      '\n\n' +
      bundle.certPem

    const blob = new Blob([zipText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'selfsigned-bundle.txt'
    a.click()
    URL.revokeObjectURL(url)
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
        <p className="text-zinc-400 text-lg">{t('subtitle')}</p>
      </div>

      <Card className="border-zinc-800 bg-zinc-950/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-white text-lg sm:text-xl flex items-center gap-2">
              <FileDigit className="w-5 h-5 text-cyan-400" />
              {t('title')}
            </span>
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
              <Shield className="w-4 h-4 text-cyan-400" />
              {t('privacy')}
            </span>
          </CardTitle>
          <CardDescription className="text-zinc-400">{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left: form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-3">
                <Label className="text-zinc-300">{t('algorithm')}</Label>
                <Tabs value={algo} onValueChange={(v) => setAlgo(v as KeyAlgo)} className="w-full">
                  <TabsList className="grid grid-cols-2 bg-zinc-900 border border-zinc-800">
                    <TabsTrigger
                      value="rsa"
                      className="data-[state=active]:bg-cyan-700/30 data-[state=active]:text-cyan-300"
                    >
                      RSA
                    </TabsTrigger>
                    <TabsTrigger
                      value="ecdsa"
                      className="data-[state=active]:bg-cyan-700/30 data-[state=active]:text-cyan-300"
                    >
                      ECDSA
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-zinc-300 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    {t('validYears')}
                  </Label>
                  <span className="font-mono text-cyan-400 text-sm">{validYears}</span>
                </div>
                <Slider
                  value={[validYears]}
                  onValueChange={([v]) => setValidYears(v)}
                  min={1}
                  max={10}
                  step={1}
                  className="[&_[role=slider]]:bg-cyan-500"
                />
                <p className="text-xs text-zinc-500">{t('validYearsHint')}</p>
              </div>

              <div className="space-y-3">
                <Label className="text-zinc-300">{t('dn.title')}</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    placeholder="CN=example.com"
                    value={fields.cn}
                    onChange={(e) => handleChangeField('cn', e.target.value)}
                    className="bg-zinc-900/60 border-zinc-800 text-white"
                  />
                  <Input
                    placeholder="O=Company"
                    value={fields.o}
                    onChange={(e) => handleChangeField('o', e.target.value)}
                    className="bg-zinc-900/60 border-zinc-800 text-white"
                  />
                  <Input
                    placeholder="OU=IT"
                    value={fields.ou}
                    onChange={(e) => handleChangeField('ou', e.target.value)}
                    className="bg-zinc-900/60 border-zinc-800 text-white"
                  />
                  <Input
                    placeholder="C=ES"
                    value={fields.c}
                    onChange={(e) => handleChangeField('c', e.target.value)}
                    className="bg-zinc-900/60 border-zinc-800 text-white"
                  />
                  <Input
                    placeholder="ST=Madrid"
                    value={fields.st}
                    onChange={(e) => handleChangeField('st', e.target.value)}
                    className="bg-zinc-900/60 border-zinc-800 text-white"
                  />
                  <Input
                    placeholder="L=Madrid"
                    value={fields.l}
                    onChange={(e) => handleChangeField('l', e.target.value)}
                    className="bg-zinc-900/60 border-zinc-800 text-white"
                  />
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white"
              >
                {loading ? t('generating') : <>{t('actions.generate')} <FileDigit className="w-4 h-4 ml-2" /></>}
              </Button>

              <Alert className="bg-zinc-900/80 border-zinc-800 text-zinc-300 mt-4">
                <Info className="w-4 h-4 text-cyan-400" />
                <AlertDescription className="text-xs sm:text-sm">
                  {t('localOnly')}
                </AlertDescription>
              </Alert>
            </div>

            {/* Right: bundle */}
            <div className="lg:col-span-3 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-zinc-300">{t('csr')}</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!bundle}
                    onClick={() => bundle && copy(bundle.csrPem)}
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    {t('actions.copy')}
                  </Button>
                </div>
                <Textarea
                  readOnly
                  value={bundle?.csrPem ?? ''}
                  rows={4}
                  className="bg-black/60 border-zinc-800 text-cyan-300 font-mono text-xs"
                  placeholder={t('csrPlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-zinc-300">{t('certificate')}</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!bundle}
                    onClick={() => bundle && copy(bundle.certPem)}
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    {t('actions.copy')}
                  </Button>
                </div>
                <Textarea
                  readOnly
                  value={bundle?.certPem ?? ''}
                  rows={4}
                  className="bg-black/60 border-zinc-800 text-emerald-300 font-mono text-xs"
                  placeholder={t('certPlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-zinc-300">{t('privateKey')}</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!bundle}
                    onClick={() => bundle && copy(bundle.privateKeyPem)}
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    {t('actions.copy')}
                  </Button>
                </div>
                <Textarea
                  readOnly
                  value={bundle?.privateKeyPem ?? ''}
                  rows={4}
                  className="bg-black/60 border-zinc-800 text-zinc-200 font-mono text-xs"
                  placeholder={t('keyPlaceholder')}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  disabled={!bundle}
                  onClick={downloadBundle}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('actions.downloadBundle')}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

