'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { UploadCloud, FileSearch, Trash2, Download, CheckCircle2, FileKey2, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useTranslations } from 'next-intl'

// Tipos de archivos a recuperar (Magic Bytes)
const SIGNATURES = [
  { type: 'JPEG', ext: 'jpg', sig: [0xFF, 0xD8, 0xFF] },
  { type: 'PNG', ext: 'png', sig: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] },
  { type: 'GIF', ext: 'gif', sig: [0x47, 0x49, 0x46, 0x38] },
  { type: 'PDF', ext: 'pdf', sig: [0x25, 0x50, 0x44, 0x46] },
  { type: 'ZIP / DOCX / XLSX', ext: 'zip', sig: [0x50, 0x4B, 0x03, 0x04] },
  { type: 'MP3 (ID3)', ext: 'mp3', sig: [0x49, 0x44, 0x33] },
  { type: 'WAV', ext: 'wav', sig: [0x52, 0x49, 0x46, 0x46] },
]

const MAX_EXTRACT_SIZE = 5 * 1024 * 1024  // 5 MB per carved file
const YIELD_EVERY = 50_000                 // Yield to UI every 50k bytes

type CarvedFile = { type: string; ext: string; blob: Blob; offset: number; size: number }

export function FileCarverTool() {
  const t = useTranslations('tools.fileCarver')

  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [foundFiles, setFoundFiles] = useState<CarvedFile[]>([])
  const [done, setDone] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  // Track object URLs for cleanup
  const objectUrls = useRef<string[]>([])

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => { objectUrls.current.forEach(URL.revokeObjectURL) }
  }, [])

  const resetState = () => {
    objectUrls.current.forEach(URL.revokeObjectURL)
    objectUrls.current = []
    setFile(null)
    setFoundFiles([])
    setProgress(0)
    setDone(false)
  }

  const loadFile = (f: File) => {
    objectUrls.current.forEach(URL.revokeObjectURL)
    objectUrls.current = []
    setFile(f)
    setFoundFiles([])
    setProgress(0)
    setDone(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) loadFile(e.target.files[0])
  }

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => setIsDragging(false)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.[0]) loadFile(e.dataTransfer.files[0])
  }

  const matchesSig = (view: Uint8Array, i: number, sig: number[]) => {
    if (i + sig.length > view.length) return false
    for (let j = 0; j < sig.length; j++) if (view[i + j] !== sig[j]) return false
    return true
  }

  const matchesWav = (view: Uint8Array, i: number) => {
    if (i + 11 >= view.length) return false
    return matchesSig(view, i, [0x52, 0x49, 0x46, 0x46]) &&
      view[i + 8] === 0x57 && view[i + 9] === 0x41 && view[i + 10] === 0x56 && view[i + 11] === 0x45
  }

  const startCarving = async () => {
    if (!file) return
    setIsProcessing(true)
    setProgress(0)
    setDone(false)
    setFoundFiles([])

    try {
      const buffer = await file.arrayBuffer()
      const view = new Uint8Array(buffer)
      const total = view.length
      const result: CarvedFile[] = []

      let i = 0
      while (i < total) {
        // Yield to main thread regularly so UI stays responsive
        if (i % YIELD_EVERY === 0) {
          setProgress(Math.round((i / total) * 100))
          await new Promise(r => setTimeout(r, 0))
        }

        for (const sig of SIGNATURES) {
          let matched = sig.ext === 'wav' ? matchesWav(view, i) : matchesSig(view, i, sig.sig)
          if (!matched) continue

          // Find footer / determine end
          let end = Math.min(i + MAX_EXTRACT_SIZE, total)

          if (sig.ext === 'jpg') {
            for (let j = i; j < end - 1; j++) {
              if (view[j] === 0xFF && view[j + 1] === 0xD9) { end = j + 2; break }
            }
          } else if (sig.ext === 'png') {
            // IEND+CRC = 12 bytes after IEND marker
            for (let j = i; j < end - 7; j++) {
              if (view[j] === 0x49 && view[j + 1] === 0x45 && view[j + 2] === 0x4E && view[j + 3] === 0x44) { end = j + 8; break }
            }
          } else if (sig.ext === 'pdf') {
            for (let j = i; j < end - 4; j++) {
              if (view[j] === 0x25 && view[j + 1] === 0x45 && view[j + 2] === 0x4F && view[j + 3] === 0x46) {
                end = j + 4
                while (end < total && (view[end] === 0x0A || view[end] === 0x0D || view[end] === 0x20)) end++
                break
              }
            }
          } else if (sig.ext === 'wav') {
            // WAV size is in header bytes 4-7 (little-endian) + 8
            if (i + 7 < total) {
              const wavSize = view[i + 4] | (view[i + 5] << 8) | (view[i + 6] << 16) | (view[i + 7] << 24)
              end = Math.min(i + wavSize + 8, total)
            }
          } else {
            end = Math.min(i + 1024 * 1024, total)
          }

          result.push({ type: sig.type, ext: sig.ext, blob: new Blob([view.slice(i, end)]), offset: i, size: end - i })
          i += (end - i)   // skip past the extracted block
          break
        }
        i++
      }

      setFoundFiles(result)
      setProgress(100)
      setDone(true)
    } catch (e) {
      console.error('Carving error:', e)
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadFile = (item: CarvedFile, index: number) => {
    const url = URL.createObjectURL(item.blob)
    objectUrls.current.push(url)
    const a = Object.assign(document.createElement('a'), { href: url, download: `carved_${index + 1}.${item.ext}` })
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ── DROP ZONE ── */}
      {!file ? (
        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-8">
            <div
              className={`flex flex-col justify-center items-center border-2 border-dashed rounded-2xl p-8 sm:p-14 transition-all cursor-pointer group ${isDragging
                  ? 'border-cyan-400 bg-cyan-500/5 scale-[1.01]'
                  : 'border-zinc-700 hover:border-cyan-500/50 bg-black/20'
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <FileSearch className={`w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 transition-all duration-300 ${isDragging ? 'text-cyan-400 scale-110' : 'text-zinc-600 group-hover:text-cyan-400 group-hover:scale-110'}`} />
              <p className="text-base sm:text-xl font-medium text-zinc-300 mb-2 text-center">
                {t('dropMessage') || 'Drag & Drop a corrupted file here'}
              </p>
              <p className="text-xs sm:text-sm text-zinc-500 mb-5 text-center">
                {t('supportMessage') || 'Supports RAW dumps, corrupted ZIPs, missing headers, etc.'}
              </p>
              <Button type="button" variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                <UploadCloud className="w-4 h-4 mr-2" />
                {t('browseButton') || 'Browse File'}
              </Button>
              <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" />
            </div>
          </CardContent>
        </Card>

      ) : (
        <Card className="border-zinc-800 bg-black/40">
          <CardHeader className="flex flex-row space-y-0 justify-between items-start sm:items-center border-b border-zinc-800 pb-4 gap-3">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base sm:text-xl flex items-center text-white">
                <FileKey2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-cyan-400 flex-shrink-0" />
                <span className="truncate">{file.name}</span>
              </CardTitle>
              <div className="text-xs sm:text-sm text-zinc-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
            <Button
              variant="ghost" size="icon"
              onClick={resetState}
              className="text-zinc-500 hover:text-red-400 hover:bg-red-950/30 flex-shrink-0"
              disabled={isProcessing}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Start button */}
            {!isProcessing && !done && (
              <div className="flex justify-center py-4">
                <Button
                  size="lg" onClick={startCarving}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white w-full sm:w-auto sm:min-w-[220px]"
                >
                  {t('startCarving') || 'Start Data Recovery'}
                </Button>
              </div>
            )}

            {/* Progress bar */}
            {(isProcessing || (done && progress === 100)) && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">
                    {isProcessing ? (t('analyzing') || 'Analyzing binary signatures...') : (t('completed') || 'Analysis completed')}
                  </span>
                  <span className="text-cyan-400 font-mono">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-zinc-800" />
              </div>
            )}

            {/* Results */}
            {foundFiles.length > 0 && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <h3 className="text-base sm:text-lg font-medium text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                  {t('foundFiles') || 'Found Data Extracts'}{' '}
                  <span className="text-cyan-400">({foundFiles.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {foundFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-cyan-900/50 transition-colors gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center border border-zinc-800 flex-shrink-0">
                          <span className="text-[10px] font-bold text-cyan-400 uppercase">{f.ext}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-zinc-300 truncate">{f.type}</div>
                          <div className="text-xs text-zinc-500 font-mono">0x{f.offset.toString(16).toUpperCase()} · ~{(f.size / 1024).toFixed(1)} KB</div>
                        </div>
                      </div>
                      <Button
                        variant="secondary" size="sm"
                        className="bg-black hover:bg-zinc-800 text-white border border-zinc-700 flex-shrink-0"
                        onClick={() => downloadFile(f, i)}
                      >
                        <Download className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">{t('download') || 'Save'}</span>
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Scan again button */}
                <div className="flex justify-center pt-2">
                  <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-400 hover:text-white" onClick={resetState}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t('scanAnother') || 'Scan Another File'}
                  </Button>
                </div>
              </div>
            )}

            {/* No results */}
            {done && foundFiles.length === 0 && (
              <div className="text-center py-8 space-y-3">
                <p className="text-zinc-400">{t('noResults') || 'No recognizable magic bytes found in this file.'}</p>
                <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-400 hover:text-white" onClick={resetState}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('scanAnother') || 'Try Another File'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── FEATURE CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: '100% Client-Side', key: 'feature1', fallback: 'No files are uploaded. Processing happens entirely in your local browser memory.' },
          { label: 'Magic Bytes', key: 'feature2', fallback: 'Detects JPEG, PNG, GIF, PDF, ZIP, MP3 and WAV signatures.' },
          { label: 'Zero Logging', key: 'feature3', fallback: 'Ideal for cybersecurity, forensics and recovering sensitive dropped data.' },
        ].map(f => (
          <div key={f.key} className="p-4 rounded-xl bg-black border border-zinc-800">
            <Badge className="bg-zinc-900 text-zinc-400 border-zinc-800 mb-2 text-xs">{f.label}</Badge>
            <p className="text-xs text-zinc-500">{t(f.key as any) || f.fallback}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
