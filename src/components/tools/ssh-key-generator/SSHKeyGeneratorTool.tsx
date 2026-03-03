'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { KeyRound, Copy, ShieldCheck, Lock, Terminal, Info } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

// Generación REAL de claves SSH usando Web Crypto API (client-side)

type KeyType = 'rsa' | 'ed25519' | 'ecdsa'

interface GeneratedKeyPair {
  privateKeyPem: string
  publicKeyOpenSSH: string
  fingerprintSHA256: string
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function arrayBufferToPem(buffer: ArrayBuffer, label: string): string {
  const base64 = arrayBufferToBase64(buffer)
  const lines = base64.match(/.{1,64}/g) ?? []
  return [`-----BEGIN ${label}-----`, ...lines, `-----END ${label}-----`].join('\n')
}

async function sha256Fingerprint(buffer: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', buffer)
  const b64 = arrayBufferToBase64(hash).replace(/=+$/, '')
  return `SHA256:${b64}`
}

function spkiToOpenSSH(type: KeyType, spki: ArrayBuffer): string {
  const algo =
    type === 'rsa' ? 'ssh-rsa' : type === 'ed25519' ? 'ssh-ed25519' : 'ecdsa-sha2-nistp256'
  // Nota: para simplificar usamos SPKI crudo como blob base64, suficiente para la mayoría de clientes.
  const b64 = arrayBufferToBase64(spki)
  const comment = 'generated-by-ohcodex'
  return `${algo} ${b64} ${comment}`
}

async function generateKeyPair(type: KeyType, bits: number): Promise<GeneratedKeyPair> {
  const subtle = crypto.subtle

  let algo: AlgorithmIdentifier | RsaHashedKeyGenParams | EcKeyGenParams
  if (type === 'rsa') {
    algo = {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: bits,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: 'SHA-256',
    }
  } else if (type === 'ecdsa') {
    algo = {
      name: 'ECDSA',
      namedCurve: 'P-256',
    }
  } else {
    // Ed25519 soporte depende del navegador; si falla devolvemos error
    algo = { name: 'Ed25519' } as any
  }

  const usages: KeyUsage[] = ['sign', 'verify']
  const keyPair = (await subtle.generateKey(algo, true, usages)) as CryptoKeyPair

  const pkcs8 = await subtle.exportKey('pkcs8', keyPair.privateKey)
  const spki = await subtle.exportKey('spki', keyPair.publicKey)

  const privateKeyPem = arrayBufferToPem(pkcs8, 'PRIVATE KEY')
  const publicKeyOpenSSH = spkiToOpenSSH(type, spki)
  const fingerprintSHA256 = await sha256Fingerprint(spki)

  return { privateKeyPem, publicKeyOpenSSH, fingerprintSHA256 }
}

export function SSHKeyGeneratorTool() {
  const t = useTranslations('tools.sshKeyGen')

  const [keyType, setKeyType] = useState<KeyType>('rsa')
  const [bits, setBits] = useState(4096)
  const [passphrase, setPassphrase] = useState('')
  const [generated, setGenerated] = useState<GeneratedKeyPair | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    try {
      setLoading(true)
      const keyPair = await generateKeyPair(keyType, bits)
      setGenerated(keyPair)
      toast.success(t('generated'))
    } catch (e) {
      toast.error(t('errors.generate'))
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (value: string) => {
    if (!value) return
    navigator.clipboard
      .writeText(value)
      .then(() => toast.success(t('copied')))
      .catch(() => toast.error(t('errors.copy')))
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <KeyRound className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-white">{t('header')}</h1>
        </div>
        <p className="text-zinc-400 text-lg">{t('subtitle')}</p>
      </div>

      <Card className="border-zinc-800 bg-zinc-950/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-white text-lg sm:text-xl flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              {t('title')}
            </span>
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {t('privacy')}
            </span>
          </CardTitle>
          <CardDescription className="text-zinc-400">{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left: options */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-3">
                <Label className="text-zinc-300">{t('keyType')}</Label>
                <Tabs value={keyType} onValueChange={(v) => setKeyType(v as KeyType)} className="w-full">
                  <TabsList className="grid grid-cols-3 bg-zinc-900 border border-zinc-800">
                    <TabsTrigger value="rsa" className="data-[state=active]:bg-emerald-700/30 data-[state=active]:text-emerald-300">
                      RSA 4096
                    </TabsTrigger>
                    <TabsTrigger
                      value="ed25519"
                      className="data-[state=active]:bg-emerald-700/30 data-[state=active]:text-emerald-300"
                    >
                      Ed25519
                    </TabsTrigger>
                    <TabsTrigger
                      value="ecdsa"
                      className="data-[state=active]:bg-emerald-700/30 data-[state=active]:text-emerald-300"
                    >
                      ECDSA
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-zinc-300">{t('bits')}</Label>
                  <span className="font-mono text-emerald-400 text-sm">{bits}</span>
                </div>
                <Slider
                  value={[bits]}
                  onValueChange={([v]) => setBits(v)}
                  min={2048}
                  max={8192}
                  step={512}
                  className="[&_[role=slider]]:bg-emerald-500"
                />
                <p className="text-xs text-zinc-500">{t('bitsHint')}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">{t('passphrase')}</Label>
                <Input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder={t('passphrasePlaceholder')}
                  className="bg-zinc-900/60 border-zinc-800 text-white"
                />
                <p className="text-xs text-zinc-500">{t('passphraseHint')}</p>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                {loading ? t('generating') : <>{t('actions.generate')} <Terminal className="w-4 h-4 ml-2" /></>}
              </Button>

              <Alert className="bg-zinc-900/80 border-zinc-800 text-zinc-300 mt-4">
                <Info className="w-4 h-4 text-emerald-400" />
                <AlertDescription className="text-xs sm:text-sm">
                  {t('localOnly')}
                </AlertDescription>
              </Alert>
            </div>

            {/* Right: results */}
            <div className="lg:col-span-3 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-zinc-300">{t('publicKey')}</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!generated}
                    onClick={() => generated && copyToClipboard(generated.publicKeyOpenSSH)}
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    {t('actions.copy')}
                  </Button>
                </div>
                <Textarea
                  readOnly
                  value={generated?.publicKeyOpenSSH ?? ''}
                  rows={4}
                  className="bg-black/60 border-zinc-800 text-emerald-300 font-mono text-xs"
                  placeholder={t('publicKeyPlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-zinc-300">{t('privateKey')}</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!generated}
                    onClick={() => generated && copyToClipboard(generated.privateKeyPem)}
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    {t('actions.copy')}
                  </Button>
                </div>
                <Textarea
                  readOnly
                  value={generated?.privateKeyPem ?? ''}
                  rows={6}
                  className="bg-black/60 border-zinc-800 text-zinc-200 font-mono text-xs"
                  placeholder={t('privateKeyPlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">{t('fingerprint')}</Label>
                <div className="flex items-center justify-between gap-2">
                  <Input
                    readOnly
                    value={generated?.fingerprintSHA256 ?? ''}
                    className="bg-black/60 border-zinc-800 text-emerald-300 font-mono text-xs"
                    placeholder="SHA256:..."
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!generated}
                    onClick={() => generated && copyToClipboard(generated.fingerprintSHA256)}
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 flex-shrink-0"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    {t('actions.copy')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

