'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  KeyRound, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  Trash2, 
  Shield,
  ShieldAlert,
  ShieldCheck,
  FileJson,
  Fingerprint,
  Calendar,
  Timer,
  Sparkles,
  XCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

interface JWTHeader {
  alg: string
  typ?: string
  [key: string]: unknown
}

interface JWTPayload {
  sub?: string
  iss?: string
  aud?: string | string[]
  exp?: number
  iat?: number
  nbf?: number
  jti?: string
  [key: string]: unknown
}

interface DecodedJWT {
  header: JWTHeader
  payload: JWTPayload
  signature: string
}

interface TokenValidation {
  isValid: boolean
  isExpired: boolean
  isNotBefore: boolean
  errors: string[]
}

// Sample JWT token for demonstration
const SAMPLE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjIsImlzcyI6Im9oY29kZXguY29tIiwiYXVkIjoidGVzdC1hcHAifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

function base64UrlDecode(str: string): string {
  // Add padding if necessary
  const padding = '='.repeat((4 - (str.length % 4)) % 4)
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/') + padding
  
  try {
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
  } catch {
    return atob(base64)
  }
}

function decodeJWT(token: string): DecodedJWT | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    const header = JSON.parse(base64UrlDecode(parts[0])) as JWTHeader
    const payload = JSON.parse(base64UrlDecode(parts[1])) as JWTPayload
    const signature = parts[2]

    return { header, payload, signature }
  } catch {
    return null
  }
}

function validateToken(decoded: DecodedJWT): TokenValidation {
  const now = Math.floor(Date.now() / 1000)
  const errors: string[] = []
  let isExpired = false
  let isNotBefore = false

  if (decoded.payload.exp && decoded.payload.exp < now) {
    isExpired = true
    errors.push('Token has expired')
  }

  if (decoded.payload.nbf && decoded.payload.nbf > now) {
    isNotBefore = true
    errors.push('Token not yet valid')
  }

  return {
    isValid: !isExpired && !isNotBefore,
    isExpired,
    isNotBefore,
    errors
  }
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  })
}

function getTimeAgo(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000)
  const diff = timestamp - now
  
  if (diff > 0) {
    const days = Math.floor(diff / 86400)
    const hours = Math.floor((diff % 86400) / 3600)
    const minutes = Math.floor((diff % 3600) / 60)
    
    if (days > 0) return `in ${days}d ${hours}h`
    if (hours > 0) return `in ${hours}h ${minutes}m`
    return `in ${minutes}m`
  } else {
    const absDiff = Math.abs(diff)
    const days = Math.floor(absDiff / 86400)
    const hours = Math.floor((absDiff % 86400) / 3600)
    const minutes = Math.floor((absDiff % 3600) / 60)
    
    if (days > 0) return `${days}d ${hours}h ago`
    if (hours > 0) return `${hours}h ${minutes}m ago`
    return `${minutes}m ago`
  }
}

function syntaxHighlight(json: object): string {
  const str = JSON.stringify(json, null, 2)
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/("(?:[^"\\]|\\.)*")(\s*:)/g, '<span class="text-orange-400">$1</span><span class="text-zinc-400">$2</span>')
    .replace(/: ("(?:[^"\\]|\\.)*")/g, ': <span class="text-green-400">$1</span>')
    .replace(/: (true|false)/g, ': <span class="text-purple-400">$1</span>')
    .replace(/: (null)/g, ': <span class="text-zinc-500">$1</span>')
    .replace(/: (\d+)/g, ': <span class="text-cyan-400">$1</span>')
}

export function JWTDecoderTool() {
  const t = useTranslations('tools.jwt-decoder')
  const tCommon = useTranslations('common.buttons')
  
  const [token, setToken] = useState('')
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null)
  const [validation, setValidation] = useState<TokenValidation | null>(null)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('header')

  useEffect(() => {
    if (!token.trim()) {
      setDecoded(null)
      setValidation(null)
      setError('')
      return
    }

    const result = decodeJWT(token.trim())
    if (result) {
      setDecoded(result)
      setValidation(validateToken(result))
      setError('')
    } else {
      setDecoded(null)
      setValidation(null)
      setError(t('invalidToken'))
    }
  }, [token, t])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(t('copied'))
    } catch {
      toast.error(t('copyError'))
    }
  }

  const loadSample = () => {
    setToken(SAMPLE_JWT)
    toast.success(t('sampleLoaded'))
  }

  const clearToken = () => {
    setToken('')
    setDecoded(null)
    setValidation(null)
    setError('')
  }

  const getAlgorithmColor = (alg: string): string => {
    const secureAlgs = ['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512']
    const weakAlgs = ['none', 'None', 'NONE']
    
    if (weakAlgs.includes(alg)) return 'text-red-500'
    if (secureAlgs.includes(alg)) return 'text-green-500'
    return 'text-yellow-500'
  }

  const getAlgorithmIcon = (alg: string) => {
    const weakAlgs = ['none', 'None', 'NONE']
    if (weakAlgs.includes(alg)) return <ShieldAlert className="w-5 h-5 text-red-500" />
    return <ShieldCheck className="w-5 h-5 text-green-500" />
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-orange-500/10 text-orange-500">
            <KeyRound className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-white">{t('header')}</h1>
        </div>
        <p className="text-zinc-400 text-lg">{t('subtitle')}</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column - Input */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-base text-zinc-300 flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-orange-500" />
                {t('inputToken')}
              </CardTitle>
              <CardDescription className="text-zinc-400">
                {t('inputDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={t('tokenPlaceholder')}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                rows={10}
                className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 font-mono text-sm resize-none"
              />
              
              {error && (
                <Alert className="bg-red-950/30 border-red-900/50">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={loadSample}
                  variant="outline"
                  className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t('loadSample')}
                </Button>
                <Button
                  onClick={clearToken}
                  variant="outline"
                  className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  disabled={!token}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {tCommon('clear')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Token Metadata Card */}
          {decoded && decoded.payload && (
            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardHeader>
                <CardTitle className="text-base text-zinc-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  {t('tokenTimeline')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Issued At */}
                {decoded.payload.iat && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-zinc-800">
                      <Calendar className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-zinc-400">{t('issuedAt')}</p>
                      <p className="text-white font-mono text-sm">{formatTimestamp(decoded.payload.iat)}</p>
                      <p className="text-xs text-zinc-500">{getTimeAgo(decoded.payload.iat)}</p>
                    </div>
                  </div>
                )}

                {/* Expires At */}
                {decoded.payload.exp && (
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${validation?.isExpired ? 'bg-red-900/30' : 'bg-zinc-800'}`}>
                      <Timer className={`w-4 h-4 ${validation?.isExpired ? 'text-red-400' : 'text-zinc-400'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-zinc-400">{t('expiresAt')}</p>
                      <p className={`font-mono text-sm ${validation?.isExpired ? 'text-red-400' : 'text-white'}`}>
                        {formatTimestamp(decoded.payload.exp)}
                      </p>
                      <p className={`text-xs ${validation?.isExpired ? 'text-red-400 font-medium' : 'text-zinc-500'}`}>
                        {getTimeAgo(decoded.payload.exp)}
                        {validation?.isExpired && ` (${t('expired')})`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Not Before */}
                {decoded.payload.nbf && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-zinc-800">
                      <Clock className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-zinc-400">{t('notBefore')}</p>
                      <p className="text-white font-mono text-sm">{formatTimestamp(decoded.payload.nbf)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Security Status */}
          {validation && (
            <Card className={`border-zinc-800 ${validation.isValid ? 'bg-green-950/10' : 'bg-red-950/10'}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {validation.isValid ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-medium text-sm ${validation.isValid ? 'text-green-400' : 'text-red-400'}`}>
                      {validation.isValid ? t('tokenValid') : t('tokenInvalid')}
                    </p>
                    {validation.errors.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {validation.errors.map((err, idx) => (
                          <li key={idx} className="text-red-300/80 text-xs flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {err}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Decoded Output */}
        <div className="lg:col-span-7">
          <Card className="border-zinc-800 bg-zinc-950/50 h-full">
            <CardHeader>
              <CardTitle className="text-base text-zinc-300 flex items-center gap-2">
                <FileJson className="w-4 h-4 text-orange-500" />
                {t('decodedOutput')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {decoded ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-zinc-900 border border-zinc-800 mb-6">
                    <TabsTrigger 
                      value="header" 
                      className="text-sm data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                    >
                      {t('headerTab')}
                      <Badge variant="outline" className="ml-2 text-xs border-zinc-700 text-zinc-400">
                        {Object.keys(decoded.header).length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="payload" 
                      className="text-sm data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                    >
                      {t('payloadTab')}
                      <Badge variant="outline" className="ml-2 text-xs border-zinc-700 text-zinc-400">
                        {Object.keys(decoded.payload).length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="signature" 
                      className="text-sm data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                    >
                      {t('signatureTab')}
                    </TabsTrigger>
                  </TabsList>

                  {/* Header Tab */}
                  <TabsContent value="header" className="space-y-4">
                    <div className="space-y-4">
                      {/* Algorithm Display */}
                      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-zinc-400">{t('algorithm')}</span>
                          <div className="flex items-center gap-2">
                            {getAlgorithmIcon(decoded.header.alg)}
                            <span className={`font-mono font-semibold ${getAlgorithmColor(decoded.header.alg)}`}>
                              {decoded.header.alg}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-400">{t('type')}</span>
                          <Badge variant="outline" className="border-orange-500/30 text-orange-400 font-mono">
                            {decoded.header.typ || 'JWT'}
                          </Badge>
                        </div>
                      </div>

                      {/* Raw Header JSON */}
                      <div className="relative">
                        <div className="absolute top-2 right-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(JSON.stringify(decoded.header, null, 2))}
                            className="h-8 w-8 p-0 text-zinc-500 hover:text-white"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <pre 
                          className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 overflow-x-auto font-mono text-sm"
                          dangerouslySetInnerHTML={{ __html: syntaxHighlight(decoded.header) }}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Payload Tab */}
                  <TabsContent value="payload" className="space-y-4">
                    <div className="space-y-4">
                      {/* Standard Claims */}
                      <div className="grid grid-cols-2 gap-3">
                        {decoded.payload.sub && (
                          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                            <span className="text-xs text-zinc-500 block mb-1">sub</span>
                            <span className="font-mono text-sm text-white truncate block">{decoded.payload.sub}</span>
                          </div>
                        )}
                        {decoded.payload.iss && (
                          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                            <span className="text-xs text-zinc-500 block mb-1">iss</span>
                            <span className="font-mono text-sm text-white truncate block">{decoded.payload.iss}</span>
                          </div>
                        )}
                        {decoded.payload.aud && (
                          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                            <span className="text-xs text-zinc-500 block mb-1">aud</span>
                            <span className="font-mono text-sm text-white truncate block">
                              {Array.isArray(decoded.payload.aud) ? decoded.payload.aud.join(', ') : decoded.payload.aud}
                            </span>
                          </div>
                        )}
                        {decoded.payload.jti && (
                          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                            <span className="text-xs text-zinc-500 block mb-1">jti</span>
                            <span className="font-mono text-sm text-white truncate block">{decoded.payload.jti}</span>
                          </div>
                        )}
                      </div>

                      {/* Custom Claims */}
                      {Object.keys(decoded.payload).filter(k => !['sub', 'iss', 'aud', 'exp', 'iat', 'nbf', 'jti'].includes(k)).length > 0 && (
                        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                          <h4 className="text-sm font-medium text-zinc-300 mb-3">{t('customClaims')}</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(decoded.payload)
                              .filter(([key]) => !['sub', 'iss', 'aud', 'exp', 'iat', 'nbf', 'jti'].includes(key))
                              .map(([key, value]) => (
                                <div key={key} className="p-2 bg-zinc-950 rounded border border-zinc-800">
                                  <span className="text-xs text-orange-400 block mb-1">{key}</span>
                                  <span className="font-mono text-sm text-white truncate block">
                                    {typeof value === 'string' ? value : JSON.stringify(value)}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Raw Payload JSON */}
                      <div className="relative">
                        <div className="absolute top-2 right-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(JSON.stringify(decoded.payload, null, 2))}
                            className="h-8 w-8 p-0 text-zinc-500 hover:text-white"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <pre 
                          className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 overflow-x-auto font-mono text-sm"
                          dangerouslySetInnerHTML={{ __html: syntaxHighlight(decoded.payload) }}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Signature Tab */}
                  <TabsContent value="signature" className="space-y-4">
                    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-5 h-5 text-orange-500" />
                        <span className="text-zinc-300 font-medium">{t('signatureInfo')}</span>
                      </div>
                      <p className="text-sm text-zinc-400 mb-4">{t('signatureDescription')}</p>
                      
                      <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-zinc-500">{t('signatureValue')}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(decoded.signature)}
                            className="h-6 text-xs text-zinc-500 hover:text-white"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            {tCommon('copy')}
                          </Button>
                        </div>
                        <code className="block font-mono text-xs text-zinc-400 break-all">
                          {decoded.signature}
                        </code>
                      </div>
                    </div>

                    <Alert className="bg-blue-950/30 border-blue-900/50">
                      <Shield className="h-4 w-4 text-blue-400" />
                      <AlertDescription className="text-blue-200 text-sm">
                        {t('signatureNote')}
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
                  <FileJson className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg">{t('noToken')}</p>
                  <p className="text-sm mt-2">{t('enterTokenHint')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
