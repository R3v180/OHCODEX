'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { 
  Code, 
  Copy, 
  Download, 
  Eraser, 
  Minimize2, 
  Maximize2, 
  FileCode2, 
  Wand2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  FileType
} from 'lucide-react'
import Editor from '@monaco-editor/react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { minifyCSS, beautifyCSS, analyzeCSS } from '@/lib/engines/css-engine'

// --- SAMPLE CSS DATA ---
const SAMPLE_CSS = `/* Modern CSS Reset and Base Styles */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --primary-color: #ec4899;
  --secondary-color: #8b5cf6;
  --bg-dark: #09090b;
  --bg-card: #18181b;
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --border-color: #27272a;
  
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'Fira Code', 'Monaco', monospace;
  
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}

body {
  font-family: var(--font-sans);
  background-color: var(--bg-dark);
  color: var(--text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
  outline: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .card {
    padding: 1rem;
  }
}`

const SAMPLE_SCSS = `// SCSS Variables
$primary: #ec4899;
$secondary: #8b5cf6;
$dark-bg: #09090b;

// Mixins
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin card-shadow($elevation: 'md') {
  @if $elevation == 'sm' {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  } @else if $elevation == 'lg' {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  } @else {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  }
}

// Base styles
.component {
  @include flex-center;
  background: linear-gradient(135deg, $primary, $secondary);
  border-radius: 0.75rem;
  padding: 2rem;
  
  @include card-shadow('lg');
  
  // Nested elements
  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    margin-bottom: 0.5rem;
  }
  
  &__description {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.5;
  }
  
  // Modifiers
  &--compact {
    padding: 1rem;
    
    .component__title {
      font-size: 1.125rem;
    }
  }
  
  // Media queries
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1.5rem;
  }
}

// Parent selector
.button {
  background: $primary;
  
  .dark & {
    background: darken($primary, 10%);
  }
  
  &:hover:not(:disabled) {
    filter: brightness(1.1);
  }
}`

// --- TYPES ---
type Mode = 'minify' | 'beautify'
type Language = 'css' | 'scss'

interface Stats {
  originalSize: number
  processedSize: number
  savings: number
  savingsPercent: number
  rules: number
  selectors: number
  declarations: number
}

export function CSSMinifierTool() {
  const t = useTranslations('tools.css-minifier')
  const tCommon = useTranslations('common.buttons')
  
  const [mode, setMode] = useState<Mode>('minify')
  const [language, setLanguage] = useState<Language>('css')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [indent, setIndent] = useState(2)
  const [stats, setStats] = useState<Stats | null>(null)

  const loadSample = useCallback(() => {
    const sample = language === 'css' ? SAMPLE_CSS : SAMPLE_SCSS
    setInput(sample)
    setOutput('')
    setStats(null)
    toast.success(t('sampleLoaded'))
  }, [language, t])

  const clearAll = useCallback(() => {
    setInput('')
    setOutput('')
    setStats(null)
  }, [])

  const processCSS = useCallback(() => {
    if (!input.trim()) {
      toast.error(t('noInput'))
      return
    }

    try {
      let result: string
      const analysis = analyzeCSS(input)
      
      if (mode === 'minify') {
        result = minifyCSS(input)
        toast.success(t('minifiedSuccess'))
      } else {
        result = beautifyCSS(input, indent)
        toast.success(t('beautifiedSuccess'))
      }

      setOutput(result)
      
      const originalSize = new Blob([input]).size
      const processedSize = new Blob([result]).size
      const savings = originalSize - processedSize
      
      setStats({
        originalSize,
        processedSize,
        savings: Math.abs(savings),
        savingsPercent: originalSize > 0 ? Math.round((savings / originalSize) * 100 * 10) / 10 : 0,
        rules: analysis.rules,
        selectors: analysis.selectors,
        declarations: analysis.declarations
      })
    } catch (error) {
      toast.error(t('processError'))
    }
  }, [input, mode, indent, t])

  const copyOutput = useCallback(async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    toast.success(tCommon('copy'))
  }, [output, tCommon])

  const downloadOutput = useCallback(() => {
    if (!output) return
    
    const extension = language === 'scss' ? 'scss' : 'css'
    const suffix = mode === 'minify' ? '.min' : ''
    const filename = `styles${suffix}.${extension}`
    
    const blob = new Blob([output], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success(t('downloaded'))
  }, [output, mode, language, t])

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const editorLanguage = useMemo(() => {
    return language === 'scss' ? 'scss' : 'css'
  }, [language])

  return (
    <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-xl shadow-2xl">
      <CardContent className="p-6">
        
        {/* HEADER CONTROLS */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
              <TabsList className="bg-zinc-900 border border-zinc-800">
                <TabsTrigger 
                  value="minify" 
                  className="flex items-center gap-2 data-[state=active]:bg-pink-950/30 data-[state=active]:text-pink-400"
                >
                  <Minimize2 className="w-4 h-4" />
                  {t('minify')}
                </TabsTrigger>
                <TabsTrigger 
                  value="beautify" 
                  className="flex items-center gap-2 data-[state=active]:bg-pink-950/30 data-[state=active]:text-pink-400"
                >
                  <Maximize2 className="w-4 h-4" />
                  {t('beautify')}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="h-6 w-px bg-zinc-800 hidden sm:block" />

            <Tabs value={language} onValueChange={(v) => { setLanguage(v as Language); clearAll(); }}>
              <TabsList className="bg-zinc-900 border border-zinc-800">
                <TabsTrigger 
                  value="css" 
                  className="flex items-center gap-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                >
                  <FileCode2 className="w-4 h-4" />
                  CSS
                </TabsTrigger>
                <TabsTrigger 
                  value="scss" 
                  className="flex items-center gap-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                >
                  <FileType className="w-4 h-4" />
                  SCSS
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {mode === 'beautify' && (
              <select
                value={indent}
                onChange={(e) => setIndent(Number(e.target.value))}
                className="h-9 px-3 text-sm bg-zinc-900 border border-zinc-800 rounded-md text-zinc-300 focus:outline-none focus:ring-1 focus:ring-pink-500/50"
              >
                <option value={2}>2 {t('spaces')}</option>
                <option value={4}>4 {t('spaces')}</option>
                <option value={0}>{t('tabs')}</option>
              </select>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadSample}
              className="text-pink-400 hover:text-pink-300 hover:bg-pink-950/30"
            >
              <Wand2 className="w-4 h-4 mr-1.5" />
              {t('loadSample')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-zinc-400 hover:text-red-400 hover:bg-red-950/20"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              {tCommon('clear')}
            </Button>
          </div>
        </div>

        {/* MAIN EDITOR AREA */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* INPUT COLUMN */}
          <div className="space-y-3 flex flex-col">
            <div className="flex items-center justify-between">
              <Label className="text-zinc-400 font-medium flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-pink-500" />
                {t('input')}
              </Label>
              {input && (
                <span className="text-xs text-zinc-500">
                  {formatBytes(new Blob([input]).size)}
                </span>
              )}
            </div>

            <div className="relative flex-1 min-h-[350px] lg:min-h-[450px] border border-zinc-800 rounded-xl overflow-hidden bg-[#1e1e1e]">
              <Editor
                height="100%"
                language={editorLanguage}
                theme="vs-dark"
                value={input}
                onChange={(value) => setInput(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                  fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
                  lineNumbers: 'on',
                  renderLineHighlight: 'line',
                  wordWrap: 'on',
                }}
              />
              {!input && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <FileCode2 className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                    <p className="text-zinc-600 text-sm">{t('pasteCSS')}</p>
                  </div>
                </div>
              )}
            </div>

            {/* PROCESS BUTTON */}
            <Button
              onClick={processCSS}
              disabled={!input.trim()}
              className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white shadow-lg shadow-pink-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {mode === 'minify' ? t('minifyButton') : t('beautifyButton')}
            </Button>
          </div>

          {/* OUTPUT COLUMN */}
          <div className="space-y-3 flex flex-col">
            <div className="flex items-center justify-between">
              <Label className="text-zinc-400 font-medium flex items-center gap-2">
                <Code className="w-4 h-4 text-green-500" />
                {t('output')}
              </Label>
              <div className="flex items-center gap-2">
                {output && (
                  <span className="text-xs text-zinc-500">
                    {formatBytes(new Blob([output]).size)}
                  </span>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyOutput}
                  disabled={!output}
                  className="h-8 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-50"
                >
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  {tCommon('copy')}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={downloadOutput}
                  disabled={!output}
                  className="h-8 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  {tCommon('download')}
                </Button>
              </div>
            </div>

            <div className="relative flex-1 min-h-[350px] lg:min-h-[450px] border border-zinc-800 rounded-xl overflow-hidden bg-[#1e1e1e]">
              <Editor
                height="100%"
                language={editorLanguage}
                theme="vs-dark"
                value={output}
                options={{
                  minimap: { enabled: false },
                  readOnly: true,
                  fontSize: 13,
                  padding: { top: 16 },
                  fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
                  lineNumbers: 'on',
                  renderLineHighlight: 'line',
                  wordWrap: 'on',
                }}
              />
              {!output && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-zinc-700 text-sm italic">{t('outputPlaceholder')}</p>
                </div>
              )}
            </div>

            {/* CLEAR BUTTON */}
            <Button
              variant="outline"
              onClick={() => setOutput('')}
              disabled={!output}
              className="w-full border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white disabled:opacity-50"
            >
              <Eraser className="w-4 h-4 mr-2" />
              {t('clearOutput')}
            </Button>
          </div>
        </div>

        {/* STATS SECTION */}
        {stats && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{t('originalSize')}</p>
              <p className="text-xl font-semibold text-zinc-300">{formatBytes(stats.originalSize)}</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{t('processedSize')}</p>
              <p className="text-xl font-semibold text-pink-400">{formatBytes(stats.processedSize)}</p>
            </div>
            <div className={`border rounded-xl p-4 ${stats.savingsPercent > 0 ? 'bg-green-950/20 border-green-900/50' : 'bg-zinc-900/50 border-zinc-800'}`}>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{t('savings')}</p>
              <div className="flex items-center gap-2">
                <p className={`text-xl font-semibold ${stats.savingsPercent > 0 ? 'text-green-400' : 'text-zinc-300'}`}>
                  {stats.savingsPercent > 0 ? `-${stats.savingsPercent}%` : `${Math.abs(stats.savingsPercent)}%`}
                </p>
                {stats.savingsPercent > 0 && <CheckCircle2 className="w-5 h-5 text-green-400" />}
              </div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{t('selectors')}</p>
              <p className="text-xl font-semibold text-zinc-300">{stats.selectors}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
