'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileDiff, Trash2, Cpu, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useTranslations } from 'next-intl'

const CHUNK_SIZE = 16    // bytes per row
const MAX_LINES = 1000  // ~16KB display limit
const COMPUTE_YIELD = 200   // yield every N rows during diff

type DiffLine = {
    offset: number
    hex1: string[]
    hex2: string[]
    ascii1: string
    ascii2: string
    diffMap: boolean[]
}

type FileData = { name: string; data: Uint8Array }

function toAscii(b: number) {
    return b >= 32 && b <= 126 ? String.fromCharCode(b) : '.'
}

export function HexDiffTool() {
    const t = useTranslations('tools.hexDiff')

    const [file1, setFile1] = useState<FileData | null>(null)
    const [file2, setFile2] = useState<FileData | null>(null)
    const [diffLines, setDiffLines] = useState<DiffLine[]>([])
    const [computing, setComputing] = useState(false)
    const [diffCount, setDiffCount] = useState(0)

    const file1Ref = useRef<HTMLInputElement>(null)
    const file2Ref = useRef<HTMLInputElement>(null)

    const loadFile = async (f: File, setter: (d: FileData | null) => void) => {
        const buf = await f.arrayBuffer()
        setter({ name: f.name, data: new Uint8Array(buf) })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (d: FileData | null) => void) => {
        if (e.target.files?.[0]) loadFile(e.target.files[0], setter)
    }

    // Run async diff whenever both files are ready
    useEffect(() => {
        if (!file1 || !file2) { setDiffLines([]); setDiffCount(0); return }

        let cancelled = false

            ; (async () => {
                setComputing(true)
                setDiffLines([])

                const d1 = file1.data
                const d2 = file2.data
                const maxLen = Math.max(d1.length, d2.length)
                const linesToProcess = Math.min(Math.ceil(maxLen / CHUNK_SIZE), MAX_LINES)
                const result: DiffLine[] = []
                let totalDiffs = 0

                for (let i = 0; i < linesToProcess; i++) {
                    if (cancelled) break

                    // Yield to UI regularly
                    if (i % COMPUTE_YIELD === 0) await new Promise(r => setTimeout(r, 0))

                    const offset = i * CHUNK_SIZE
                    const h1: string[] = []
                    const h2: string[] = []
                    let a1 = '', a2 = ''
                    const dMap: boolean[] = []

                    for (let j = 0; j < CHUNK_SIZE; j++) {
                        const b1 = offset + j < d1.length ? d1[offset + j] : null
                        const b2 = offset + j < d2.length ? d2[offset + j] : null

                        h1.push(b1 !== null ? b1.toString(16).padStart(2, '0').toUpperCase() : '--')
                        h2.push(b2 !== null ? b2.toString(16).padStart(2, '0').toUpperCase() : '--')
                        a1 += b1 !== null ? toAscii(b1) : ' '
                        a2 += b2 !== null ? toAscii(b2) : ' '

                        const diff = b1 !== b2
                        dMap.push(diff)
                        if (diff) totalDiffs++
                    }

                    result.push({ offset, hex1: h1, hex2: h2, ascii1: a1, ascii2: a2, diffMap: dMap })
                }

                if (!cancelled) {
                    setDiffLines(result)
                    setDiffCount(totalDiffs)
                    setComputing(false)
                }
            })()

        return () => { cancelled = true }
    }, [file1, file2])

    const FileCard = ({
        label, accent, file, fileRef, setter
    }: {
        label: string
        accent: 'cyan' | 'purple'
        file: FileData | null
        fileRef: React.RefObject<HTMLInputElement | null>
        setter: (d: FileData | null) => void
    }) => (
        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <CardHeader className="border-b border-zinc-800 bg-black/40 pb-3 pt-4 px-4">
                <CardTitle className="text-sm sm:text-base text-zinc-300">{label}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 flex flex-col justify-center items-center min-h-[140px]">
                {!file ? (
                    <>
                        <Button
                            variant="outline"
                            className={`mb-2 ${accent === 'cyan'
                                ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10'
                                : 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10'
                                }`}
                            onClick={() => fileRef.current?.click()}
                        >
                            <FileDiff className="w-4 h-4 mr-2" />
                            {t('browseButton') || 'Select File'}
                        </Button>
                        <div className="text-xs text-zinc-600 text-center">
                            {accent === 'cyan'
                                ? 'Any binary or text file'
                                : 'Select second file to compare'}
                        </div>
                    </>
                ) : (
                    <div className="text-center w-full">
                        <Cpu className={`w-7 h-7 mx-auto mb-2 opacity-80 ${accent === 'cyan' ? 'text-cyan-400' : 'text-purple-400'}`} />
                        <div className="text-white text-sm font-medium mb-1 break-all px-2">{file.name}</div>
                        <div className="text-xs text-zinc-500">{(file.data.length / 1024).toFixed(2)} KB</div>
                        <Button
                            variant="ghost" size="sm"
                            className="mt-3 text-red-400 hover:text-red-300 hover:bg-red-950/30"
                            onClick={() => setter(null)}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t('remove') || 'Remove'}
                        </Button>
                    </div>
                )}
                <input
                    ref={fileRef} type="file" className="hidden"
                    onChange={(e) => handleChange(e, setter)}
                />
            </CardContent>
        </Card>
    )

    const hasDiffs = diffLines.some(l => l.diffMap.some(Boolean))

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* ── FILE PICKERS ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FileCard
                    label={t('originalFile') || 'Original File (A)'}
                    accent="cyan"
                    file={file1}
                    fileRef={file1Ref}
                    setter={setFile1}
                />
                <FileCard
                    label={t('modifiedFile') || 'Modified File (B)'}
                    accent="purple"
                    file={file2}
                    fileRef={file2Ref}
                    setter={setFile2}
                />
            </div>

            {/* ── COMPUTING INDICATOR ── */}
            {computing && (
                <div className="flex items-center justify-center gap-3 py-8 text-zinc-400 animate-in fade-in duration-300">
                    <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                    Computing binary diff...
                </div>
            )}

            {/* ── STATS BAR ── */}
            {!computing && diffLines.length > 0 && (
                <div className="flex flex-wrap gap-3 items-center animate-in fade-in duration-300">
                    <Badge className={`${hasDiffs ? 'bg-red-950/60 text-red-300 border-red-800' : 'bg-green-950/60 text-green-300 border-green-800'}`}>
                        {hasDiffs ? `${diffCount} byte differences` : 'Files are identical'}
                    </Badge>
                    <Badge className="bg-zinc-900 text-zinc-400 border-zinc-800">
                        {diffLines.length * CHUNK_SIZE} bytes shown
                    </Badge>
                    {Math.max(file1?.data.length ?? 0, file2?.data.length ?? 0) > MAX_LINES * CHUNK_SIZE && (
                        <span className="text-xs text-zinc-600">First {MAX_LINES * CHUNK_SIZE} bytes displayed</span>
                    )}
                </div>
            )}

            {/* ── HEX VIEWER ── */}
            {!computing && diffLines.length > 0 && (
                <Card className="border-zinc-800 bg-[#0d0d0d] font-mono text-xs sm:text-sm overflow-hidden animate-in fade-in zoom-in-95 duration-500 shadow-2xl">
                    {/* Header legend */}
                    <div className="flex bg-black border-b border-zinc-800 px-4 py-2 items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-zinc-300 font-sans font-medium text-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
                            Binary Diff
                        </h3>
                        <div className="flex gap-4 text-xs font-sans text-zinc-400 flex-wrap">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-[#3a1b1b] rounded-sm border border-red-900/50" /> A changed
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-[#1b2a3a] rounded-sm border border-cyan-900/50" /> B changed
                            </div>
                        </div>
                    </div>

                    {/* Scrollable hex table — key mobile fix: scroll on the outer wrapper */}
                    <div className="overflow-x-auto overflow-y-auto h-[50vh] sm:h-[600px]">
                        <div className="p-3 sm:p-4 min-w-[640px]">
                            {/* Column headers */}
                            <div className="flex pb-2 text-zinc-600 text-[10px] tracking-widest border-b border-zinc-900 mb-2 font-bold select-none uppercase">
                                <div className="w-[90px] flex-shrink-0">Offset</div>
                                <div className="flex-1 min-w-0">Hex A</div>
                                <div className="w-[16px] flex-shrink-0" />
                                <div className="flex-1 min-w-0">Hex B</div>
                                <div className="w-[16px] flex-shrink-0" />
                                <div className="w-[140px] flex-shrink-0">ASCII A</div>
                                <div className="w-[140px] flex-shrink-0">ASCII B</div>
                            </div>

                            {/* Rows */}
                            {diffLines.map((line, i) => {
                                const hasDiff = line.diffMap.some(Boolean)
                                return (
                                    <div
                                        key={i}
                                        className={`flex items-baseline mb-[2px] leading-5 hover:bg-zinc-900/50 transition-colors rounded ${hasDiff ? 'bg-zinc-900/20' : ''}`}
                                    >
                                        {/* Offset */}
                                        <div className="w-[90px] flex-shrink-0 text-zinc-600 select-none pr-2">
                                            {line.offset.toString(16).padStart(8, '0').toUpperCase()}
                                        </div>

                                        {/* HEX A */}
                                        <div className="flex-1 min-w-0 flex flex-wrap gap-[3px]">
                                            {line.hex1.map((h, j) => (
                                                <span
                                                    key={j}
                                                    className={`${line.diffMap[j] ? 'text-red-400 bg-[#3a1b1b]' : 'text-zinc-400'} px-[1px] rounded-sm`}
                                                >{h}</span>
                                            ))}
                                        </div>

                                        <div className="w-[16px] flex-shrink-0 text-zinc-800 text-center">|</div>

                                        {/* HEX B */}
                                        <div className="flex-1 min-w-0 flex flex-wrap gap-[3px]">
                                            {line.hex2.map((h, j) => (
                                                <span
                                                    key={j}
                                                    className={`${line.diffMap[j] ? 'text-cyan-400 bg-[#1b2a3a]' : 'text-zinc-400'} px-[1px] rounded-sm`}
                                                >{h}</span>
                                            ))}
                                        </div>

                                        <div className="w-[16px] flex-shrink-0 text-zinc-800 text-center">|</div>

                                        {/* ASCII A */}
                                        <div className="w-[140px] flex-shrink-0 flex">
                                            {Array.from(line.ascii1).map((c, j) => (
                                                <span
                                                    key={j}
                                                    className={`${line.diffMap[j] ? 'text-red-400 bg-[#3a1b1b]' : 'text-zinc-500'} rounded-sm whitespace-pre`}
                                                >{c}</span>
                                            ))}
                                        </div>

                                        {/* ASCII B */}
                                        <div className="w-[140px] flex-shrink-0 flex">
                                            {Array.from(line.ascii2).map((c, j) => (
                                                <span
                                                    key={j}
                                                    className={`${line.diffMap[j] ? 'text-cyan-400 bg-[#1b2a3a]' : 'text-zinc-500'} rounded-sm whitespace-pre`}
                                                >{c}</span>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </Card>
            )}

            {/* ── EMPTY STATE: load both files ── */}
            {!computing && !file1 && !file2 && (
                <div className="text-center py-6 text-zinc-600 text-sm">
                    Load both files above to start comparing
                </div>
            )}

        </div>
    )
}
