'use client'

import React, { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { UploadCloud, BarChart3, Info, FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'

type EntropyResult = {
  histogram: number[]
  entropy: number
  randomness: number
  sizeBytes: number
}

function computeEntropy(bytes: Uint8Array): EntropyResult {
  const counts = new Array(256).fill(0)
  for (let i = 0; i < bytes.length; i++) {
    counts[bytes[i]]++
  }
  const total = bytes.length || 1
  let entropy = 0
  for (let i = 0; i < 256; i++) {
    if (counts[i] === 0) continue
    const p = counts[i] / total
    entropy -= p * Math.log2(p)
  }
  const randomness = (entropy / 8) * 100
  return { histogram: counts, entropy, randomness, sizeBytes: bytes.length }
}

export function FileEntropyAnalyzerTool() {
  const t = useTranslations('tools.fileEntropy')

  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<EntropyResult | null>(null)

  const handleFile = (f: File) => {
    setFile(f)
    setResult(null)
  }

  const handleAnalyze = () => {
    if (!file) {
      toast.error(t('errors.noFile'))
      return
    }
    setLoading(true)
    file
      .arrayBuffer()
      .then((buf) => {
        const bytes = new Uint8Array(buf)
        const res = computeEntropy(bytes)
        setResult(res)
      })
      .catch(() => toast.error(t('errors.read')))
      .finally(() => setLoading(false))
  }

  const chartData = useMemo(() => {
    if (!result) return []
    const { histogram } = result
    const bucketSize = 16
    const data: { bucket: string; count: number }[] = []
    for (let i = 0; i < 256; i += bucketSize) {
      const sum = histogram.slice(i, i + bucketSize).reduce((a, b) => a + b, 0)
      data.push({ bucket: `${i}-${i + bucketSize - 1}`, count: sum })
    }
    return data
  }, [result])

  const classification = useMemo(() => {
    if (!result) return null
    const r = result.randomness
    if (r < 40) return t('classification.plain')
    if (r < 70) return t('classification.compressed')
    return t('classification.encrypted')
  }, [result, t])

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-white">{t('header')}</h1>
        </div>
        <p className="text-zinc-400 text-lg">{t('subtitle')}</p>
      </div>

      <Card className="border-zinc-800 bg-zinc-950/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-white text-lg sm:text-xl flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              {t('title')}
            </span>
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
              <Info className="w-4 h-4 text-amber-400" />
              {t('privacy')}
            </span>
          </CardTitle>
          <CardDescription className="text-zinc-400">{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left: upload + stats */}
            <div className="lg:col-span-2 space-y-6">
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer group ${
                  file ? 'border-amber-500 bg-amber-950/10' : isDragging
                    ? 'border-amber-400 bg-amber-950/10'
                    : 'border-zinc-700 hover:border-amber-500/60 hover:bg-zinc-900'
                }`}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                  const f = e.dataTransfer.files?.[0]
                  if (f) handleFile(f)
                }}
                onClick={() => document.getElementById('entropy-file-input')?.click()}
              >
                <input
                  id="entropy-file-input"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleFile(f)
                  }}
                />
                {file ? (
                  <div className="space-y-2">
                    <UploadCloud className="w-10 h-10 mx-auto text-amber-400" />
                    <p className="text-white font-medium break-all">{file.name}</p>
                    <p className="text-zinc-500 text-xs">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <UploadCloud className="w-10 h-10 mx-auto text-zinc-500 group-hover:text-amber-400" />
                    <p className="text-white">{t('dropHere')}</p>
                    <p className="text-zinc-500 text-xs">{t('dropHint')}</p>
                  </div>
                )}
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={!file || loading}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white"
              >
                {loading ? t('analyzing') : t('actions.analyze')}
              </Button>

              {result && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">{t('metrics.entropy')}</span>
                    <span className="font-mono text-amber-300">
                      {result.entropy.toFixed(2)} {t('bitsPerByte')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">{t('metrics.randomness')}</span>
                    <span className="font-mono text-amber-300">
                      {result.randomness.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={Math.min(100, result.randomness)}
                    className="h-2 bg-zinc-800"
                  />
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>
                      {t('metrics.size')}{' '}
                      <span className="font-mono text-zinc-300">
                        {(result.sizeBytes / 1024).toFixed(2)} KB
                      </span>
                    </span>
                    <span className="font-semibold text-amber-300">
                      {classification}
                    </span>
                  </div>
                </div>
              )}

              <Alert className="bg-zinc-900/80 border-zinc-800 text-zinc-300 mt-4">
                <Info className="w-4 h-4 text-amber-400" />
                <AlertDescription className="text-xs sm:text-sm">
                  {t('localOnly')}
                </AlertDescription>
              </Alert>
            </div>

            {/* Right: histogram */}
            <div className="lg:col-span-3 space-y-4">
              <Label className="text-zinc-300 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {t('histogramTitle')}
              </Label>
              <div className="w-full h-64 sm:h-80 bg-black/60 border border-zinc-800 rounded-xl flex items-center justify-center">
                {result ? (
                  <ChartContainer
                    config={{
                      count: {
                        label: t('histogramLabel'),
                        color: 'hsl(37, 100%, 50%)',
                      },
                    }}
                    className="w-full h-full"
                  >
                    <ResponsiveContainer>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                        <XAxis
                          dataKey="bucket"
                          tick={{ fill: '#71717a', fontSize: 10 }}
                          interval={3}
                        />
                        <YAxis tick={{ fill: '#71717a', fontSize: 10 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="count"
                          fill="hsl(37, 100%, 50%)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="text-center text-zinc-600 text-sm px-4">
                    {t('noData')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

