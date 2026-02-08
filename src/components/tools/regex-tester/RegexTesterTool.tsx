'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  Regex,
  Copy,
  CheckCircle2,
  AlertCircle,
  Trash2,
  BookOpen,
  Sparkles,
  ChevronRight,
  Info,
  Flag,
  AlignLeft
} from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

interface RegexMatch {
  fullMatch: string
  groups: string[]
  index: number
  length: number
}

interface RegexPreset {
  name: string
  pattern: string
  flags: string
  description: string
}

interface CheatSheetItem {
  pattern: string
  description: string
  example?: string
}

const REGEX_PRESETS: RegexPreset[] = [
  {
    name: 'email',
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    flags: '',
    description: 'Validates email addresses'
  },
  {
    name: 'url',
    pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
    flags: '',
    description: 'Matches HTTP/HTTPS URLs'
  },
  {
    name: 'phone',
    pattern: '^(\\+\\d{1,3}[-.]?)?\\s?\\(?\\d{3}\\)?[-.]?\\s?\\d{3}[-.]?\\s?\\d{4}$',
    flags: '',
    description: 'US phone number format'
  },
  {
    name: 'ip',
    pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    flags: '',
    description: 'IPv4 address validation'
  },
  {
    name: 'hexColor',
    pattern: '^#(?:[0-9a-fA-F]{3}){1,2}$',
    flags: '',
    description: 'Hex color code (3 or 6 digits)'
  },
  {
    name: 'date',
    pattern: '^(\\d{4})-(\\d{2})-(\\d{2})$',
    flags: '',
    description: 'ISO date format (YYYY-MM-DD)'
  },
  {
    name: 'creditCard',
    pattern: '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$',
    flags: '',
    description: 'Major credit card formats'
  },
  {
    name: 'uuid',
    pattern: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
    flags: '',
    description: 'UUID/GUID format'
  },
  {
    name: 'password',
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
    flags: '',
    description: 'Strong password (8+ chars, mixed case, number, symbol)'
  },
  {
    name: 'hashtag',
    pattern: '#[a-zA-Z0-9_]+',
    flags: 'g',
    description: 'Social media hashtags'
  },
  {
    name: 'mention',
    pattern: '@[a-zA-Z0-9_]+',
    flags: 'g',
    description: 'Social media mentions'
  },
  {
    name: 'htmlTag',
    pattern: '<\\/?[a-zA-Z][^>]*>',
    flags: 'g',
    description: 'HTML/XML tags'
  }
]

const CHEAT_SHEET: Record<string, CheatSheetItem[]> = {
  anchors: [
    { pattern: '^', description: 'Start of string' },
    { pattern: '$', description: 'End of string' },
    { pattern: '\\b', description: 'Word boundary' },
    { pattern: '\\B', description: 'Non-word boundary' }
  ],
  characterClasses: [
    { pattern: '.', description: 'Any character except newline' },
    { pattern: '\\d', description: 'Digit (0-9)', example: '\\d{3}' },
    { pattern: '\\D', description: 'Non-digit' },
    { pattern: '\\w', description: 'Word character (a-z, A-Z, 0-9, _)', example: '\\w+' },
    { pattern: '\\W', description: 'Non-word character' },
    { pattern: '\\s', description: 'Whitespace', example: '\\s+' },
    { pattern: '\\S', description: 'Non-whitespace' }
  ],
  quantifiers: [
    { pattern: '*', description: 'Zero or more', example: 'a*' },
    { pattern: '+', description: 'One or more', example: 'a+' },
    { pattern: '?', description: 'Zero or one', example: 'a?' },
    { pattern: '{n}', description: 'Exactly n times', example: 'a{3}' },
    { pattern: '{n,}', description: 'n or more times', example: 'a{2,}' },
    { pattern: '{n,m}', description: 'Between n and m times', example: 'a{1,3}' }
  ],
  groups: [
    { pattern: '(abc)', description: 'Capturing group', example: '(\\w+)' },
    { pattern: '(?:abc)', description: 'Non-capturing group' },
    { pattern: '(?=abc)', description: 'Positive lookahead' },
    { pattern: '(?!abc)', description: 'Negative lookahead' },
    { pattern: '(?<=abc)', description: 'Positive lookbehind' },
    { pattern: '(?<!abc)', description: 'Negative lookbehind' }
  ],
  brackets: [
    { pattern: '[abc]', description: 'Any of a, b, or c' },
    { pattern: '[^abc]', description: 'Not a, b, or c' },
    { pattern: '[a-z]', description: 'Range a to z', example: '[a-z]+' },
    { pattern: '[0-9]', description: 'Range 0 to 9' }
  ],
  flags: [
    { pattern: 'g', description: 'Global - find all matches' },
    { pattern: 'i', description: 'Case insensitive' },
    { pattern: 'm', description: 'Multiline - ^ and $ match each line' },
    { pattern: 's', description: 'DotAll - . matches newlines' },
    { pattern: 'u', description: 'Unicode' },
    { pattern: 'y', description: 'Sticky - match from lastIndex' }
  ]
}

function explainRegex(pattern: string): string {
  if (!pattern) return ''
  
  const explanations: string[] = []
  
  // Simple pattern explanations
  if (pattern.includes('^')) explanations.push('starts with')
  if (pattern.includes('$')) explanations.push('ends with')
  if (pattern.includes('\\d')) explanations.push('digits')
  if (pattern.includes('\\w')) explanations.push('word characters')
  if (pattern.includes('\\s')) explanations.push('whitespace')
  if (pattern.includes('+')) explanations.push('one or more occurrences')
  if (pattern.includes('*')) explanations.push('zero or more occurrences')
  if (pattern.includes('?')) explanations.push('optional')
  if (pattern.includes('(')) explanations.push('capturing groups')
  if (pattern.includes('[')) explanations.push('character class')
  if (pattern.includes('|')) explanations.push('alternation (OR)')
  
  if (explanations.length === 0) {
    return 'Pattern searches for literal characters'
  }
  
  return 'Pattern contains: ' + explanations.join(', ')
}

export function RegexTesterTool() {
  const t = useTranslations('tools.regex-tester')
  const tCommon = useTranslations('common.buttons')
  
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState({
    g: true,
    i: false,
    m: false,
    s: false,
    u: false,
    y: false
  })
  const [testString, setTestString] = useState('')
  const [matches, setMatches] = useState<RegexMatch[]>([])
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('test')
  
  const flagsString = useMemo(() => {
    return Object.entries(flags)
      .filter(([, enabled]) => enabled)
      .map(([flag]) => flag)
      .join('')
  }, [flags])
  
  const performMatch = useCallback(() => {
    if (!pattern || !testString) {
      setMatches([])
      setError(null)
      return
    }
    
    try {
      const regex = new RegExp(pattern, flagsString)
      const results: RegexMatch[] = []
      
      if (flags.g) {
        let match
        while ((match = regex.exec(testString)) !== null) {
          // Prevent infinite loop on zero-width matches
          if (match.index === regex.lastIndex) {
            regex.lastIndex++
          }
          results.push({
            fullMatch: match[0],
            groups: match.slice(1),
            index: match.index,
            length: match[0].length
          })
        }
      } else {
        const match = regex.exec(testString)
        if (match) {
          results.push({
            fullMatch: match[0],
            groups: match.slice(1),
            index: match.index,
            length: match[0].length
          })
        }
      }
      
      setMatches(results)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid regex pattern')
      setMatches([])
    }
  }, [pattern, testString, flagsString, flags.g])
  
  useEffect(() => {
    performMatch()
  }, [performMatch])
  
  const highlightedText = useMemo(() => {
    if (!testString || matches.length === 0) return null
    
    const elements: React.ReactNode[] = []
    let lastIndex = 0
    
    matches.forEach((match, i) => {
      // Add text before match
      if (match.index > lastIndex) {
        elements.push(
          <span key={`text-${i}`}>
            {testString.slice(lastIndex, match.index)}
          </span>
        )
      }
      
      // Add highlighted match
      elements.push(
        <span 
          key={`match-${i}`}
          className="bg-green-500/20 text-green-400 px-0.5 rounded border-b-2 border-green-500"
          title={`Match ${i + 1} at position ${match.index}`}
        >
          {match.fullMatch}
        </span>
      )
      
      lastIndex = match.index + match.length
    })
    
    // Add remaining text
    if (lastIndex < testString.length) {
      elements.push(
        <span key="text-end">{testString.slice(lastIndex)}</span>
      )
    }
    
    return elements
  }, [testString, matches])
  
  const copyToClipboard = async (text: string) => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      toast.success(t('copied'))
    } catch (error) {
      toast.error(t('copyError'))
    }
  }
  
  const copyFullRegex = () => {
    const fullRegex = `/${pattern}/${flagsString}`
    copyToClipboard(fullRegex)
  }
  
  const loadPreset = (preset: RegexPreset) => {
    setPattern(preset.pattern)
    setFlags(prev => ({
      ...prev,
      g: preset.flags.includes('g'),
      i: preset.flags.includes('i'),
      m: preset.flags.includes('m'),
      s: preset.flags.includes('s'),
      u: preset.flags.includes('u'),
      y: preset.flags.includes('y')
    }))
    toast.success(t('presetLoaded', { name: t(`presets.${preset.name}`) }))
  }
  
  const clearAll = () => {
    setPattern('')
    setTestString('')
    setMatches([])
    setError(null)
  }
  
  const toggleFlag = (flag: keyof typeof flags) => {
    setFlags(prev => ({ ...prev, [flag]: !prev[flag] }))
  }
  
  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-violet-500/10 text-violet-500">
              <Regex className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold text-white">{t('header')}</h1>
          </div>
          <p className="text-zinc-400 text-lg">{t('subtitle')}</p>
        </div>
        
        {/* Main Content */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Column - Main Tester */}
          <div className="lg:col-span-8 space-y-6">
            {/* Pattern Input */}
            <Card className="border-zinc-800 bg-zinc-950/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-zinc-300 flex items-center gap-2">
                    <Regex className="w-4 h-4 text-violet-500" />
                    {t('pattern')}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {pattern && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyFullRegex}
                        className="text-zinc-400 hover:text-violet-400"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        /{pattern}/{flagsString}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pattern Input Row */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500 font-mono">/</span>
                    <Input
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      placeholder={t('patternPlaceholder')}
                      className="pl-6 pr-4 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-1 px-2 bg-zinc-900 border border-zinc-800 rounded-md">
                    <span className="text-zinc-500 text-sm">/</span>
                    {(['g', 'i', 'm', 's', 'u', 'y'] as const).map((flag) => (
                      <Tooltip key={flag}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => toggleFlag(flag)}
                            className={`w-6 h-6 rounded text-xs font-mono transition-colors ${
                              flags[flag]
                                ? 'bg-violet-600 text-white'
                                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                            }`}
                          >
                            {flag}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t(`flags.${flag}`)}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
                
                {/* Error Display */}
                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-950/20 border border-red-900/50 rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                
                {/* Explanation */}
                {pattern && !error && (
                  <div className="flex items-start gap-2 text-violet-400/80 text-sm bg-violet-950/10 border border-violet-900/30 rounded-lg p-3">
                    <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{explainRegex(pattern)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Test String Input */}
            <Card className="border-zinc-800 bg-zinc-950/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-zinc-300 flex items-center gap-2">
                    <AlignLeft className="w-4 h-4 text-violet-500" />
                    {t('testString')}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">
                      {testString.length} {t('characters')}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  placeholder={t('testStringPlaceholder')}
                  rows={6}
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 resize-none"
                />
                
                {/* Highlighted Result */}
                {testString && (
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-sm">{t('matches')}</Label>
                    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg font-mono text-sm whitespace-pre-wrap break-all min-h-[80px]">
                      {matches.length > 0 ? (
                        highlightedText
                      ) : (
                        <span className="text-zinc-600">{testString}</span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Match Results */}
            {matches.length > 0 && (
              <Card className="border-zinc-800 bg-zinc-950/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-zinc-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      {t('matchResults')}
                    </CardTitle>
                    <Badge variant="outline" className="border-green-500/30 text-green-400">
                      {matches.length} {matches.length === 1 ? t('match') : t('matches')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {matches.map((match, index) => (
                        <div
                          key={index}
                          className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-violet-400 font-medium">
                              {t('match')} #{index + 1}
                            </span>
                            <span className="text-xs text-zinc-500">
                              {t('position')}: {match.index} - {match.index + match.length}
                            </span>
                          </div>
                          <div className="font-mono text-sm text-green-400 bg-green-500/10 px-3 py-2 rounded border border-green-500/20">
                            {match.fullMatch}
                          </div>
                          {match.groups.length > 0 && (
                            <div className="space-y-1 pt-2">
                              <span className="text-xs text-zinc-500">{t('groups')}:</span>
                              {match.groups.map((group, groupIndex) => (
                                <div
                                  key={groupIndex}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <span className="text-violet-500 font-mono text-xs">
                                    ${groupIndex + 1}
                                  </span>
                                  <span className="text-zinc-300 font-mono">
                                    {group || <span className="text-zinc-600 italic">empty</span>}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
            
            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                onClick={clearAll}
                variant="outline"
                className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                disabled={!pattern && !testString}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {tCommon('clear')}
              </Button>
              <Button
                onClick={copyFullRegex}
                disabled={!pattern}
                className="bg-violet-600 hover:bg-violet-500 text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                {t('copyRegex')}
              </Button>
            </div>
          </div>
          
          {/* Right Column - Presets & Cheat Sheet */}
          <div className="lg:col-span-4 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-zinc-900 border border-zinc-800">
                <TabsTrigger 
                  value="test" 
                  className="data-[state=active]:bg-violet-950/30 data-[state=active]:text-violet-400"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t('presetsTab')}
                </TabsTrigger>
                <TabsTrigger 
                  value="cheat" 
                  className="data-[state=active]:bg-violet-950/30 data-[state=active]:text-violet-400"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  {t('cheatSheetTab')}
                </TabsTrigger>
              </TabsList>
              
              {/* Presets Tab */}
              <TabsContent value="test" className="mt-4 space-y-4">
                <Card className="border-zinc-800 bg-zinc-950/50">
                  <CardHeader>
                    <CardTitle className="text-base text-zinc-300">
                      {t('commonPresets')}
                    </CardTitle>
                    <CardDescription className="text-zinc-500 text-xs">
                      {t('presetsDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-2">
                        {REGEX_PRESETS.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => loadPreset(preset)}
                            className="w-full text-left p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-violet-500/50 hover:bg-violet-950/10 transition-colors group"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-zinc-300 font-medium text-sm group-hover:text-violet-400 transition-colors">
                                {t(`presets.${preset.name}`)}
                              </span>
                              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-violet-500" />
                            </div>
                            <code className="text-xs text-zinc-500 font-mono block truncate">
                              /{preset.pattern}/{preset.flags}
                            </code>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Cheat Sheet Tab */}
              <TabsContent value="cheat" className="mt-4 space-y-4">
                <Card className="border-zinc-800 bg-zinc-950/50">
                  <CardHeader>
                    <CardTitle className="text-base text-zinc-300 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-violet-500" />
                      {t('cheatSheet')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-6">
                        {Object.entries(CHEAT_SHEET).map(([category, items]) => (
                          <div key={category}>
                            <h4 className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-2">
                              {t(`categories.${category}`)}
                            </h4>
                            <div className="space-y-1">
                              {items.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between py-1.5 px-2 bg-zinc-900/50 rounded"
                                >
                                  <code className="text-sm text-green-400 font-mono">
                                    {item.pattern}
                                  </code>
                                  <span className="text-xs text-zinc-400 text-right">
                                    {item.description}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* Quick Info */}
            <Card className="border-zinc-800 bg-violet-950/10">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-violet-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-violet-400 font-medium text-sm">{t('tip.title')}</p>
                    <p className="text-violet-300/70 text-xs mt-1">{t('tip.description')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
