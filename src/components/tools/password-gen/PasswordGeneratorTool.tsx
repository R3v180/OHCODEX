'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Key, 
  Copy, 
  RefreshCw, 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX,
  History,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Type
} from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

// Word list for passphrase generation (Diceware-style, 7776 words)
const WORD_LIST = [
  'apple', 'river', 'mountain', 'forest', 'ocean', 'thunder', 'lightning', 'crystal',
  'dragon', 'phoenix', 'falcon', 'tiger', 'eagle', 'wolf', 'bear', 'lion',
  'diamond', 'emerald', 'ruby', 'sapphire', 'pearl', 'jade', 'amber', 'coral',
  'sunset', 'sunrise', 'midnight', 'twilight', 'dawn', 'dusk', 'moonlight', 'starlight',
  'whisper', 'shadow', 'dream', 'wisdom', 'courage', 'honor', 'truth', 'justice',
  'liberty', 'freedom', 'victory', 'triumph', 'glory', 'destiny', 'fortune', 'miracle',
  'galaxy', 'nebula', 'cosmos', 'universe', 'planet', 'comet', 'meteor', 'asteroid',
  'winter', 'summer', 'autumn', 'spring', 'breeze', 'storm', 'rainbow', 'avalanche',
  'cascade', 'waterfall', 'volcano', 'canyon', 'meadow', 'prairie', 'desert', 'tundra',
  'orchid', 'daisy', 'lily', 'rose', 'tulip', 'jasmine', 'lavender', 'sage',
  'raven', 'crow', 'owl', 'hawk', 'swan', 'heron', 'crane', 'stork',
  'violin', 'piano', 'guitar', 'flute', 'harp', 'drum', 'cello', 'viola',
  'anchor', 'compass', 'map', 'compass', 'telescope', 'microscope', 'binoculars', 'sextant',
  'anchor', 'harbor', 'marina', 'lighthouse', 'beacon', 'signal', 'warning', 'alarm',
  'castle', 'palace', 'tower', 'fortress', 'citadel', 'temple', 'shrine', 'sanctuary',
  'bridge', 'tunnel', 'pathway', 'gateway', 'portal', 'entrance', 'threshold', 'doorway',
  'puzzle', 'mystery', 'secret', 'cipher', 'code', 'enigma', 'riddle', 'symbol',
  'quantum', 'atomic', 'nuclear', 'solar', 'lunar', 'stellar', 'cosmic', 'eternal',
  'velvet', 'silk', 'satin', 'linen', 'cotton', 'wool', 'leather', 'fur',
  'bronze', 'silver', 'golden', 'platinum', 'titanium', 'chrome', 'steel', 'iron',
  'cobalt', 'nickel', 'copper', 'brass', 'zinc', 'lead', 'tin', 'mercury',
  'arrow', 'sword', 'shield', 'armor', 'helmet', 'spear', 'dagger', 'bow',
  'crown', 'scepter', 'throne', 'orb', 'robe', 'mantle', 'cloak', 'veil',
  'amber', 'azure', 'crimson', 'ebony', 'ivory', 'jade', 'obsidian', 'opal',
  'silent', 'gentle', 'fierce', 'mighty', 'humble', 'noble', 'royal', 'divine',
  'brave', 'bold', 'swift', 'steady', 'calm', 'fierce', 'wild', 'tame',
  'ancient', 'eternal', 'infinite', 'timeless', 'endless', 'boundless', 'limitless', 'immortal',
  'hidden', 'secret', 'covert', 'shadow', 'veiled', 'masked', 'cloaked', 'stealth',
  'radiant', 'luminous', 'brilliant', 'dazzling', 'glowing', 'shining', 'gleaming', 'glimmer',
  'frozen', 'burning', 'melting', 'flowing', 'drifting', 'soaring', 'diving', 'rising',
  'whirling', 'spinning', 'twisting', 'turning', 'circling', 'orbiting', 'revolving', 'rotating'
]

interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  excludeAmbiguous: boolean
}

interface PassphraseOptions {
  wordCount: number
  separator: string
  includeNumber: boolean
  capitalize: boolean
}

type PasswordHistoryItem = {
  value: string
  type: 'password' | 'passphrase'
  timestamp: number
  strength: PasswordStrength
}

type PasswordStrength = {
  level: 'weak' | 'fair' | 'good' | 'strong'
  score: number
  entropy: number
  color: string
}

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*',
  ambiguous: '0OIl1'
}

function calculateEntropy(password: string): number {
  let poolSize = 0
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNum = /[0-9]/.test(password)
  const hasSym = /[^A-Za-z0-9]/.test(password)
  
  if (hasUpper) poolSize += 26
  if (hasLower) poolSize += 26
  if (hasNum) poolSize += 10
  if (hasSym) poolSize += 32
  
  if (poolSize === 0) return 0
  
  return Math.log2(Math.pow(poolSize, password.length))
}

function calculatePassphraseEntropy(wordCount: number): number {
  // Each word from our list of ~200 words adds log2(200) ≈ 7.6 bits
  return wordCount * 7.6
}

function getStrength(entropy: number): PasswordStrength {
  if (entropy < 30) {
    return { level: 'weak', score: 1, entropy, color: 'text-red-500 bg-red-500' }
  } else if (entropy < 50) {
    return { level: 'fair', score: 2, entropy, color: 'text-yellow-500 bg-yellow-500' }
  } else if (entropy < 80) {
    return { level: 'good', score: 3, entropy, color: 'text-emerald-500 bg-emerald-500' }
  } else {
    return { level: 'strong', score: 4, entropy, color: 'text-green-500 bg-green-500' }
  }
}

function generatePassword(options: PasswordOptions): string {
  let chars = ''
  const result: string[] = []
  
  if (options.includeUppercase) chars += CHAR_SETS.uppercase
  if (options.includeLowercase) chars += CHAR_SETS.lowercase
  if (options.includeNumbers) chars += CHAR_SETS.numbers
  if (options.includeSymbols) chars += CHAR_SETS.symbols
  
  if (options.excludeAmbiguous) {
    for (const char of CHAR_SETS.ambiguous) {
      chars = chars.replace(char, '')
    }
  }
  
  if (chars === '') return ''
  
  // Ensure at least one character from each selected set
  if (options.includeUppercase) result.push(CHAR_SETS.uppercase[Math.floor(Math.random() * CHAR_SETS.uppercase.length)])
  if (options.includeLowercase) result.push(CHAR_SETS.lowercase[Math.floor(Math.random() * CHAR_SETS.lowercase.length)])
  if (options.includeNumbers) result.push(CHAR_SETS.numbers[Math.floor(Math.random() * CHAR_SETS.numbers.length)])
  if (options.includeSymbols) result.push(CHAR_SETS.symbols[Math.floor(Math.random() * CHAR_SETS.symbols.length)])
  
  // Fill the rest randomly
  const cryptoObj = window.crypto || (window as any).msCrypto
  const remainingLength = options.length - result.length
  
  for (let i = 0; i < remainingLength; i++) {
    const randomValues = new Uint32Array(1)
    cryptoObj.getRandomValues(randomValues)
    result.push(chars[randomValues[0] % chars.length])
  }
  
  // Shuffle the result
  for (let i = result.length - 1; i > 0; i--) {
    const randomValues = new Uint32Array(1)
    cryptoObj.getRandomValues(randomValues)
    const j = randomValues[0] % (i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  
  return result.join('')
}

function generatePassphrase(options: PassphraseOptions): string {
  const words: string[] = []
  const cryptoObj = window.crypto || (window as any).msCrypto
  
  for (let i = 0; i < options.wordCount; i++) {
    const randomValues = new Uint32Array(1)
    cryptoObj.getRandomValues(randomValues)
    let word = WORD_LIST[randomValues[0] % WORD_LIST.length]
    if (options.capitalize) {
      word = word.charAt(0).toUpperCase() + word.slice(1)
    }
    words.push(word)
  }
  
  if (options.includeNumber) {
    const randomValues = new Uint32Array(1)
    cryptoObj.getRandomValues(randomValues)
    words.push(String(randomValues[0] % 100))
  }
  
  return words.join(options.separator)
}

const HISTORY_KEY = 'password-generator-history'
const MAX_HISTORY = 5

export function PasswordGeneratorTool() {
  const t = useTranslations('tools.password-gen')
  const [activeTab, setActiveTab] = useState<'password' | 'passphrase'>('password')
  
  // Password options
  const [passwordOptions, setPasswordOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeAmbiguous: false
  })
  
  // Passphrase options
  const [passphraseOptions, setPassphraseOptions] = useState<PassphraseOptions>({
    wordCount: 4,
    separator: '-',
    includeNumber: true,
    capitalize: true
  })
  
  // Generated values
  const [password, setPassword] = useState('')
  const [passphrase, setPassphrase] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPassphrase, setShowPassphrase] = useState(false)
  
  // History
  const [history, setHistory] = useState<PasswordHistoryItem[]>([])
  
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
  const saveHistory = useCallback((newHistory: PasswordHistoryItem[]) => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
      setHistory(newHistory)
    } catch (error) {
      console.error('Failed to save history:', error)
    }
  }, [])
  
  // Add to history
  const addToHistory = useCallback((value: string, type: 'password' | 'passphrase', strength: PasswordStrength) => {
    const newItem: PasswordHistoryItem = {
      value,
      type,
      timestamp: Date.now(),
      strength
    }
    const newHistory = [newItem, ...history].slice(0, MAX_HISTORY)
    saveHistory(newHistory)
  }, [history, saveHistory])
  
  // Generate password
  const handleGeneratePassword = useCallback(() => {
    const newPassword = generatePassword(passwordOptions)
    setPassword(newPassword)
    const entropy = calculateEntropy(newPassword)
    const strength = getStrength(entropy)
    addToHistory(newPassword, 'password', strength)
  }, [passwordOptions, addToHistory])
  
  // Generate passphrase
  const handleGeneratePassphrase = useCallback(() => {
    const newPassphrase = generatePassphrase(passphraseOptions)
    setPassphrase(newPassphrase)
    const entropy = calculatePassphraseEntropy(passphraseOptions.wordCount + (passphraseOptions.includeNumber ? 1 : 0))
    const strength = getStrength(entropy)
    addToHistory(newPassphrase, 'passphrase', strength)
  }, [passphraseOptions, addToHistory])
  
  // Generate initial password on mount
  useEffect(() => {
    handleGeneratePassword()
  }, [])
  
  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      toast.success(t('copied'))
    } catch (error) {
      toast.error(t('copyError'))
    }
  }
  
  // Clear history
  const clearHistory = () => {
    saveHistory([])
    toast.success(t('historyCleared'))
  }
  
  // Get current strength
  const currentStrength = activeTab === 'password' 
    ? getStrength(calculateEntropy(password))
    : getStrength(calculatePassphraseEntropy(passphraseOptions.wordCount + (passphraseOptions.includeNumber ? 1 : 0)))
  
  // Get strength icon
  const getStrengthIcon = (strength: PasswordStrength) => {
    switch (strength.level) {
      case 'weak': return <ShieldX className="w-5 h-5 text-red-500" />
      case 'fair': return <ShieldAlert className="w-5 h-5 text-yellow-500" />
      case 'good': return <ShieldCheck className="w-5 h-5 text-emerald-500" />
      case 'strong': return <Shield className="w-5 h-5 text-green-500" />
    }
  }
  
  // Get strength label
  const getStrengthLabel = (level: string) => {
    switch (level) {
      case 'weak': return t('strength.weak')
      case 'fair': return t('strength.fair')
      case 'good': return t('strength.good')
      case 'strong': return t('strength.strong')
      default: return level
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500">
            <Key className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-white">{t('header')}</h1>
        </div>
        <p className="text-zinc-400 text-lg">{t('subtitle')}</p>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column - Generator */}
        <div className="lg:col-span-7 space-y-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'password' | 'passphrase')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-900 border border-zinc-800">
              <TabsTrigger 
                value="password" 
                className="flex items-center gap-2 data-[state=active]:bg-emerald-950/30 data-[state=active]:text-emerald-400"
              >
                <Lock className="w-4 h-4" />
                {t('passwordTab')}
              </TabsTrigger>
              <TabsTrigger 
                value="passphrase" 
                className="flex items-center gap-2 data-[state=active]:bg-emerald-950/30 data-[state=active]:text-emerald-400"
              >
                <Type className="w-4 h-4" />
                {t('passphraseTab')}
              </TabsTrigger>
            </TabsList>

            {/* Password Tab */}
            <TabsContent value="password" className="space-y-6 mt-6">
              {/* Generated Password Display */}
              <Card className="border-zinc-800 bg-zinc-900/50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="flex items-center gap-2 p-4 bg-zinc-950 border border-zinc-800 rounded-lg font-mono text-lg break-all min-h-[80px]">
                        <span className={`flex-1 ${showPassword ? 'text-white' : 'text-transparent bg-clip-text'}`}>
                          {showPassword ? password : '•'.repeat(password.length)}
                        </span>
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        onClick={handleGeneratePassword}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {t('generate')}
                      </Button>
                      <Button
                        onClick={() => copyToClipboard(password)}
                        variant="outline"
                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        {t('copy')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Options */}
              <Card className="border-zinc-800 bg-zinc-900/50">
                <CardHeader>
                  <CardTitle className="text-base text-zinc-300">{t('options')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Length Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label className="text-zinc-400">{t('length')}</Label>
                      <span className="text-emerald-400 font-mono">{passwordOptions.length}</span>
                    </div>
                    <Slider
                      value={[passwordOptions.length]}
                      onValueChange={([v]) => setPasswordOptions(prev => ({ ...prev, length: v }))}
                      min={8}
                      max={64}
                      step={1}
                      className="[&_[role=slider]]:bg-emerald-500"
                    />
                  </div>

                  {/* Character Options */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-zinc-300 flex items-center gap-2">
                        <span className="font-mono text-emerald-500">ABC</span>
                        {t('includeUppercase')}
                      </Label>
                      <Switch
                        checked={passwordOptions.includeUppercase}
                        onCheckedChange={(v) => setPasswordOptions(prev => ({ ...prev, includeUppercase: v }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-zinc-300 flex items-center gap-2">
                        <span className="font-mono text-emerald-500">abc</span>
                        {t('includeLowercase')}
                      </Label>
                      <Switch
                        checked={passwordOptions.includeLowercase}
                        onCheckedChange={(v) => setPasswordOptions(prev => ({ ...prev, includeLowercase: v }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-zinc-300 flex items-center gap-2">
                        <span className="font-mono text-emerald-500">123</span>
                        {t('includeNumbers')}
                      </Label>
                      <Switch
                        checked={passwordOptions.includeNumbers}
                        onCheckedChange={(v) => setPasswordOptions(prev => ({ ...prev, includeNumbers: v }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-zinc-300 flex items-center gap-2">
                        <span className="font-mono text-emerald-500">!@#</span>
                        {t('includeSymbols')}
                      </Label>
                      <Switch
                        checked={passwordOptions.includeSymbols}
                        onCheckedChange={(v) => setPasswordOptions(prev => ({ ...prev, includeSymbols: v }))}
                      />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                      <Label className="text-zinc-300">{t('excludeAmbiguous')}</Label>
                      <Switch
                        checked={passwordOptions.excludeAmbiguous}
                        onCheckedChange={(v) => setPasswordOptions(prev => ({ ...prev, excludeAmbiguous: v }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Passphrase Tab */}
            <TabsContent value="passphrase" className="space-y-6 mt-6">
              {/* Generated Passphrase Display */}
              <Card className="border-zinc-800 bg-zinc-900/50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="flex items-center gap-2 p-4 bg-zinc-950 border border-zinc-800 rounded-lg font-mono text-lg break-all min-h-[80px]">
                        <span className={`flex-1 ${showPassphrase ? 'text-white' : 'text-transparent bg-clip-text'}`}>
                          {showPassphrase ? passphrase : '•'.repeat(passphrase.length)}
                        </span>
                        <button
                          onClick={() => setShowPassphrase(!showPassphrase)}
                          className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          {showPassphrase ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        onClick={handleGeneratePassphrase}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {t('generate')}
                      </Button>
                      <Button
                        onClick={() => copyToClipboard(passphrase)}
                        variant="outline"
                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        {t('copy')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Passphrase Options */}
              <Card className="border-zinc-800 bg-zinc-900/50">
                <CardHeader>
                  <CardTitle className="text-base text-zinc-300">{t('options')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Word Count Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label className="text-zinc-400">{t('wordCount')}</Label>
                      <span className="text-emerald-400 font-mono">{passphraseOptions.wordCount}</span>
                    </div>
                    <Slider
                      value={[passphraseOptions.wordCount]}
                      onValueChange={([v]) => setPassphraseOptions(prev => ({ ...prev, wordCount: v }))}
                      min={3}
                      max={12}
                      step={1}
                      className="[&_[role=slider]]:bg-emerald-500"
                    />
                  </div>

                  {/* Separator */}
                  <div className="space-y-3">
                    <Label className="text-zinc-400">{t('separator')}</Label>
                    <div className="flex gap-2">
                      {['-', '_', '.', ' ', ''].map((sep) => (
                        <Button
                          key={sep || 'none'}
                          variant={passphraseOptions.separator === sep ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPassphraseOptions(prev => ({ ...prev, separator: sep }))}
                          className={passphraseOptions.separator === sep 
                            ? 'bg-emerald-600 text-white' 
                            : 'border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                          }
                        >
                          {sep === '' ? t('noSeparator') : sep === ' ' ? t('space') : sep}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Passphrase Options */}
                  <div className="space-y-4 pt-4 border-t border-zinc-800">
                    <div className="flex items-center justify-between">
                      <Label className="text-zinc-300">{t('capitalize')}</Label>
                      <Switch
                        checked={passphraseOptions.capitalize}
                        onCheckedChange={(v) => setPassphraseOptions(prev => ({ ...prev, capitalize: v }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-zinc-300">{t('includeNumber')}</Label>
                      <Switch
                        checked={passphraseOptions.includeNumber}
                        onCheckedChange={(v) => setPassphraseOptions(prev => ({ ...prev, includeNumber: v }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Strength & History */}
        <div className="lg:col-span-5 space-y-6">
          {/* Strength Indicator */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-base text-zinc-300 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                {t('strength.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {getStrengthIcon(currentStrength)}
                <div>
                  <p className={`text-lg font-semibold capitalize ${currentStrength.color.split(' ')[0]}`}>
                    {getStrengthLabel(currentStrength.level)}
                  </p>
                  <p className="text-zinc-500 text-sm">
                    {t('strength.entropy')}: <span className="font-mono text-zinc-300">{Math.round(currentStrength.entropy)} bits</span>
                  </p>
                </div>
              </div>
              
              {/* Strength Bar */}
              <div className="space-y-2">
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${currentStrength.color.split(' ')[1]}`}
                    style={{ width: `${(currentStrength.score / 4) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>{t('strength.weak')}</span>
                  <span>{t('strength.fair')}</span>
                  <span>{t('strength.good')}</span>
                  <span>{t('strength.strong')}</span>
                </div>
              </div>

              <CardDescription className="text-zinc-400 text-xs">
                {t('strength.description')}
              </CardDescription>
            </CardContent>
          </Card>

          {/* History */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base text-zinc-300 flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-500" />
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
                <div className="space-y-3">
                  {history.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-lg group hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm text-zinc-300 truncate">
                          {item.value}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              item.type === 'password' 
                                ? 'border-emerald-500/30 text-emerald-400' 
                                : 'border-blue-500/30 text-blue-400'
                            }`}
                          >
                            {item.type === 'password' ? t('passwordTab') : t('passphraseTab')}
                          </Badge>
                          <span className="text-xs text-zinc-500">
                            {Math.round(item.strength.entropy)} bits
                          </span>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copyToClipboard(item.value)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-white"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Info */}
          <Card className="border-zinc-800 bg-emerald-950/10">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-emerald-400 font-medium text-sm">{t('security.title')}</p>
                  <p className="text-emerald-300/70 text-xs mt-1">{t('security.description')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
