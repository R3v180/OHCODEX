'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Palette, 
  Copy, 
  RefreshCw, 
  Download, 
  Trash2, 
  History,
  Dice5,
  Sun,
  Moon,
  Monitor,
  CheckCircle2
} from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

// ==================== TYPES ====================

type ColorFormat = 'hex' | 'rgb' | 'hsl'

type PaletteAlgorithm = 
  | 'complementary' 
  | 'triadic' 
  | 'tetradic' 
  | 'analogous' 
  | 'monochromatic' 
  | 'splitComplementary'

interface ColorInfo {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
}

interface SavedPalette {
  id: string
  name: string
  colors: ColorInfo[]
  algorithm: PaletteAlgorithm
  baseColor: string
  timestamp: number
}

// ==================== COLOR UTILITIES ====================

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return null
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  }
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360
  s /= 100
  l /= 100
  
  let r: number, g: number, b: number

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

function getColorInfo(hex: string): ColorInfo {
  const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 }
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  return { hex, rgb, hsl }
}

// ==================== PALETTE GENERATORS ====================

function generateComplementary(baseColor: string): ColorInfo[] {
  const base = getColorInfo(baseColor)
  const complementHsl = { ...base.hsl, h: (base.hsl.h + 180) % 360 }
  const complementRgb = hslToRgb(complementHsl.h, complementHsl.s, complementHsl.l)
  return [base, getColorInfo(rgbToHex(complementRgb.r, complementRgb.g, complementRgb.b))]
}

function generateTriadic(baseColor: string): ColorInfo[] {
  const base = getColorInfo(baseColor)
  return [
    base,
    getColorInfo(rgbToHex(...Object.values(hslToRgb((base.hsl.h + 120) % 360, base.hsl.s, base.hsl.l)) as [number, number, number])),
    getColorInfo(rgbToHex(...Object.values(hslToRgb((base.hsl.h + 240) % 360, base.hsl.s, base.hsl.l)) as [number, number, number]))
  ]
}

function generateTetradic(baseColor: string): ColorInfo[] {
  const base = getColorInfo(baseColor)
  const h = base.hsl.h
  const s = base.hsl.s
  const l = base.hsl.l
  return [
    base,
    getColorInfo(rgbToHex(...Object.values(hslToRgb((h + 90) % 360, s, l)) as [number, number, number])),
    getColorInfo(rgbToHex(...Object.values(hslToRgb((h + 180) % 360, s, l)) as [number, number, number])),
    getColorInfo(rgbToHex(...Object.values(hslToRgb((h + 270) % 360, s, l)) as [number, number, number]))
  ]
}

function generateAnalogous(baseColor: string): ColorInfo[] {
  const base = getColorInfo(baseColor)
  const h = base.hsl.h
  const s = base.hsl.s
  const l = base.hsl.l
  return [
    getColorInfo(rgbToHex(...Object.values(hslToRgb((h - 30 + 360) % 360, s, l)) as [number, number, number])),
    getColorInfo(rgbToHex(...Object.values(hslToRgb((h - 15 + 360) % 360, s, l)) as [number, number, number])),
    base,
    getColorInfo(rgbToHex(...Object.values(hslToRgb((h + 15) % 360, s, l)) as [number, number, number])),
    getColorInfo(rgbToHex(...Object.values(hslToRgb((h + 30) % 360, s, l)) as [number, number, number]))
  ]
}

function generateMonochromatic(baseColor: string): ColorInfo[] {
  const base = getColorInfo(baseColor)
  const h = base.hsl.h
  const s = base.hsl.s
  return [
    getColorInfo(rgbToHex(...Object.values(hslToRgb(h, s, 20)) as [number, number, number])),
    getColorInfo(rgbToHex(...Object.values(hslToRgb(h, s, 35)) as [number, number, number])),
    base,
    getColorInfo(rgbToHex(...Object.values(hslToRgb(h, s, 65)) as [number, number, number])),
    getColorInfo(rgbToHex(...Object.values(hslToRgb(h, s, 80)) as [number, number, number]))
  ]
}

function generateSplitComplementary(baseColor: string): ColorInfo[] {
  const base = getColorInfo(baseColor)
  const h = base.hsl.h
  const s = base.hsl.s
  const l = base.hsl.l
  return [
    base,
    getColorInfo(rgbToHex(...Object.values(hslToRgb((h + 150) % 360, s, l)) as [number, number, number])),
    getColorInfo(rgbToHex(...Object.values(hslToRgb((h + 210) % 360, s, l)) as [number, number, number]))
  ]
}

function generatePalette(algorithm: PaletteAlgorithm, baseColor: string): ColorInfo[] {
  switch (algorithm) {
    case 'complementary': return generateComplementary(baseColor)
    case 'triadic': return generateTriadic(baseColor)
    case 'tetradic': return generateTetradic(baseColor)
    case 'analogous': return generateAnalogous(baseColor)
    case 'monochromatic': return generateMonochromatic(baseColor)
    case 'splitComplementary': return generateSplitComplementary(baseColor)
    default: return generateComplementary(baseColor)
  }
}

function getRandomColor(): string {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return '#000000'
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

// ==================== CONSTANTS ====================

const HISTORY_KEY = 'color-palette-history'
const MAX_HISTORY = 10

const ALGORITHMS: { id: PaletteAlgorithm; name: string; count: number }[] = [
  { id: 'complementary', name: 'Complementary', count: 2 },
  { id: 'triadic', name: 'Triadic', count: 3 },
  { id: 'tetradic', name: 'Tetradic', count: 4 },
  { id: 'analogous', name: 'Analogous', count: 5 },
  { id: 'monochromatic', name: 'Monochromatic', count: 5 },
  { id: 'splitComplementary', name: 'Split Complementary', count: 3 },
]

// ==================== COMPONENT ====================

export function ColorPaletteTool() {
  const t = useTranslations('tools.color-palette')
  
  const [baseColor, setBaseColor] = useState('#3b82f6')
  const [algorithm, setAlgorithm] = useState<PaletteAlgorithm>('complementary')
  const [palette, setPalette] = useState<ColorInfo[]>([])
  const [history, setHistory] = useState<SavedPalette[]>([])
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<'light' | 'dark' | 'mixed'>('mixed')

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY)
      if (saved) {
        setHistory(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Failed to load history:', error)
    }
  }, [])

  // Save history to localStorage
  const saveHistory = useCallback((newHistory: SavedPalette[]) => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
      setHistory(newHistory)
    } catch (error) {
      console.error('Failed to save history:', error)
    }
  }, [])

  // Generate palette when base color or algorithm changes
  useEffect(() => {
    const newPalette = generatePalette(algorithm, baseColor)
    setPalette(newPalette)
  }, [baseColor, algorithm])

  // Copy color to clipboard
  const copyToClipboard = async (text: string, format: string) => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopiedFormat(format)
      setTimeout(() => setCopiedFormat(null), 1500)
      toast.success(t('copied'))
    } catch (error) {
      toast.error(t('copyError'))
    }
  }

  // Format color for display
  const formatColor = (color: ColorInfo, format: ColorFormat): string => {
    switch (format) {
      case 'hex': return color.hex.toUpperCase()
      case 'rgb': return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
      case 'hsl': return `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`
      default: return color.hex
    }
  }

  // Export palette as CSS variables
  const exportAsCSS = (): string => {
    let css = ':root {\n'
    palette.forEach((color, i) => {
      css += `  --color-${i + 1}: ${color.hex};\n`
    })
    css += '}'
    return css
  }

  // Export palette as JSON
  const exportAsJSON = (): string => {
    return JSON.stringify({
      name: `${algorithm} Palette`,
      baseColor,
      algorithm,
      colors: palette.map(c => ({
        hex: c.hex,
        rgb: c.rgb,
        hsl: c.hsl
      }))
    }, null, 2)
  }

  // Export palette as SCSS
  const exportAsSCSS = (): string => {
    let scss = ''
    palette.forEach((color, i) => {
      scss += `$color-${i + 1}: ${color.hex};\n`
    })
    return scss
  }

  // Save current palette to history
  const saveToHistory = () => {
    const newPalette: SavedPalette = {
      id: Date.now().toString(),
      name: `${algorithm} - ${baseColor.toUpperCase()}`,
      colors: [...palette],
      algorithm,
      baseColor,
      timestamp: Date.now()
    }
    const newHistory = [newPalette, ...history].slice(0, MAX_HISTORY)
    saveHistory(newHistory)
    toast.success(t('savedToHistory'))
  }

  // Load palette from history
  const loadFromHistory = (saved: SavedPalette) => {
    setBaseColor(saved.baseColor)
    setAlgorithm(saved.algorithm)
    setPalette(saved.colors)
    toast.success(t('loadedFromHistory'))
  }

  // Clear history
  const clearHistory = () => {
    saveHistory([])
    toast.success(t('historyCleared'))
  }

  // Generate random palette
  const generateRandom = () => {
    const randomColor = getRandomColor()
    const randomAlgorithm = ALGORITHMS[Math.floor(Math.random() * ALGORITHMS.length)]
    setBaseColor(randomColor)
    setAlgorithm(randomAlgorithm.id)
  }

  // Check if color is light
  const isLightColor = (hex: string): boolean => {
    const rgb = hexToRgb(hex)
    if (!rgb) return false
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
    return brightness > 128
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-rose-500/10 text-rose-500">
            <Palette className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-white">{t('header')}</h1>
        </div>
        <p className="text-zinc-400 text-lg">{t('subtitle')}</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column - Controls */}
        <div className="lg:col-span-4 space-y-6">
          {/* Base Color Picker */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-base text-zinc-300">{t('baseColor')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-lg border border-zinc-700 overflow-hidden flex-shrink-0">
                  <input
                    type="color"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="absolute inset-0 w-full h-full cursor-pointer p-0 border-0"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label className="text-zinc-400 text-xs">{t('hexValue')}</Label>
                  <div className="flex gap-2">
                    <Input
                      value={baseColor.toUpperCase()}
                      onChange={(e) => {
                        const value = e.target.value
                        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                          setBaseColor(value)
                        }
                      }}
                      className="bg-zinc-950 border-zinc-700 font-mono text-sm uppercase"
                      maxLength={7}
                    />
                  </div>
                </div>
              </div>
              
              <Button
                onClick={generateRandom}
                variant="outline"
                className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                <Dice5 className="w-4 h-4 mr-2" />
                {t('randomPalette')}
              </Button>
            </CardContent>
          </Card>

          {/* Algorithm Selector */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-base text-zinc-300">{t('algorithm')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {ALGORITHMS.map((alg) => (
                  <button
                    key={alg.id}
                    onClick={() => setAlgorithm(alg.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      algorithm === alg.id
                        ? 'bg-rose-950/30 border-rose-500/50 text-rose-400'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    <span className="text-sm font-medium block">{t(`algorithms.${alg.id}`)}</span>
                    <span className="text-xs opacity-60">{alg.count} {t('colors')}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-base text-zinc-300">{t('export')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => copyToClipboard(exportAsCSS(), 'CSS')}
                variant="outline"
                className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 justify-start"
              >
                <Copy className="w-4 h-4 mr-2" />
                {t('copyAsCSS')}
              </Button>
              <Button
                onClick={() => copyToClipboard(exportAsJSON(), 'JSON')}
                variant="outline"
                className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 justify-start"
              >
                <Copy className="w-4 h-4 mr-2" />
                {t('copyAsJSON')}
              </Button>
              <Button
                onClick={() => copyToClipboard(exportAsSCSS(), 'SCSS')}
                variant="outline"
                className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 justify-start"
              >
                <Copy className="w-4 h-4 mr-2" />
                {t('copyAsSCSS')}
              </Button>
            </CardContent>
          </Card>

          {/* History */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base text-zinc-300 flex items-center gap-2">
                <History className="w-4 h-4 text-rose-500" />
                {t('history.title')}
              </CardTitle>
              {history.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-4">{t('history.empty')}</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className="w-full flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors text-left"
                    >
                      <div className="flex -space-x-1">
                        {item.colors.slice(0, 3).map((color, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full border-2 border-zinc-950"
                            style={{ backgroundColor: color.hex }}
                          />
                        ))}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-zinc-300 truncate">{t(`algorithms.${item.algorithm}`)}</p>
                        <p className="text-xs text-zinc-500">{item.baseColor.toUpperCase()}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Palette & Preview */}
        <div className="lg:col-span-8 space-y-6">
          {/* Generated Palette */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base text-zinc-300">{t('generatedPalette')}</CardTitle>
              <Button
                onClick={saveToHistory}
                size="sm"
                className="bg-rose-600 hover:bg-rose-500 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                {t('savePalette')}
              </Button>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-4 ${
                palette.length <= 2 ? 'grid-cols-2' :
                palette.length <= 3 ? 'grid-cols-3' :
                'grid-cols-5'
              }`}>
                {palette.map((color, index) => (
                  <div key={index} className="space-y-3">
                    {/* Color Swatch */}
                    <div
                      className="relative aspect-square rounded-xl border-2 border-zinc-800 cursor-pointer group overflow-hidden"
                      style={{ backgroundColor: color.hex }}
                      onClick={() => copyToClipboard(color.hex, `hex-${index}`)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                        <Copy className="w-6 h-6 text-white" />
                      </div>
                      {copiedFormat === `hex-${index}` && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <CheckCircle2 className="w-6 h-6 text-green-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Color Values */}
                    <div className="space-y-1.5">
                      {(['hex', 'rgb', 'hsl'] as ColorFormat[]).map((format) => (
                        <button
                          key={format}
                          onClick={() => copyToClipboard(formatColor(color, format), `${format}-${index}`)}
                          className="w-full flex items-center justify-between p-1.5 rounded bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors text-left"
                        >
                          <span className="text-xs font-medium text-zinc-500 uppercase w-8">{format}</span>
                          <span className="text-xs font-mono text-zinc-300 truncate flex-1 px-2">
                            {formatColor(color, format)}
                          </span>
                          {copiedFormat === `${format}-${index}` ? (
                            <CheckCircle2 className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-zinc-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base text-zinc-300">{t('preview')}</CardTitle>
              <div className="flex gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                <button
                  onClick={() => setPreviewMode('light')}
                  className={`p-2 rounded-md transition-colors ${
                    previewMode === 'light' ? 'bg-zinc-800 text-rose-400' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title={t('lightMode')}
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('dark')}
                  className={`p-2 rounded-md transition-colors ${
                    previewMode === 'dark' ? 'bg-zinc-800 text-rose-400' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title={t('darkMode')}
                >
                  <Moon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('mixed')}
                  className={`p-2 rounded-md transition-colors ${
                    previewMode === 'mixed' ? 'bg-zinc-800 text-rose-400' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title={t('mixedMode')}
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Preview Container */}
              <div 
                className="rounded-xl border border-zinc-800 overflow-hidden"
                style={{ 
                  backgroundColor: previewMode === 'light' ? '#ffffff' : 
                                   previewMode === 'dark' ? '#18181b' : '#27272a'
                }}
              >
                {/* Mock UI */}
                <div className="p-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: previewMode === 'light' ? '#e4e4e7' : '#3f3f46' }}>
                    <div className="flex items-center gap-3">
                      {palette[0] && (
                        <div 
                          className="w-10 h-10 rounded-lg"
                          style={{ backgroundColor: palette[0].hex }}
                        />
                      )}
                      <div>
                        <div 
                          className="text-lg font-semibold"
                          style={{ color: previewMode === 'light' ? '#18181b' : '#fafafa' }}
                        >
                          Brand Name
                        </div>
                        <div className="text-sm" style={{ color: previewMode === 'light' ? '#71717a' : '#a1a1aa' }}>
                          tagline@example.com
                        </div>
                      </div>
                    </div>
                    {palette[1] && (
                      <button
                        className="px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                        style={{ 
                          backgroundColor: palette[1].hex,
                          color: getContrastColor(palette[1].hex)
                        }}
                      >
                        Action
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <div 
                      className="text-2xl font-bold"
                      style={{ color: palette[0]?.hex || (previewMode === 'light' ? '#18181b' : '#fafafa') }}
                    >
                      {t('sampleHeading')}
                    </div>
                    
                    <div 
                      className="text-base leading-relaxed"
                      style={{ color: previewMode === 'light' ? '#3f3f46' : '#d4d4d8' }}
                    >
                      {t('sampleText')}
                    </div>

                    {/* Button Variants */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      {palette.slice(0, 4).map((color, i) => (
                        <button
                          key={i}
                          className="px-4 py-2 rounded-lg font-medium text-sm transition-all hover:opacity-90"
                          style={{ 
                            backgroundColor: color.hex,
                            color: getContrastColor(color.hex)
                          }}
                        >
                          {t('button')} {i + 1}
                        </button>
                      ))}
                    </div>

                    {/* Card Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      {palette.slice(0, Math.min(palette.length, 4)).map((color, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-lg border"
                          style={{ 
                            backgroundColor: previewMode === 'light' ? '#fafafa' : '#18181b',
                            borderColor: color.hex
                          }}
                        >
                          <div 
                            className="text-sm font-medium mb-1"
                            style={{ color: color.hex }}
                          >
                            {t('cardTitle')} {i + 1}
                          </div>
                          <div 
                            className="text-xs"
                            style={{ color: previewMode === 'light' ? '#71717a' : '#a1a1aa' }}
                          >
                            {color.hex.toUpperCase()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Information */}
          <Card className="border-zinc-800 bg-rose-950/10">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Palette className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-rose-400 font-medium text-sm">{t('aboutPalette')}</p>
                  <p className="text-rose-300/70 text-xs mt-1">
                    {t('algorithmDescriptions.' + algorithm)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
