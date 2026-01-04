'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Code, Copy, FileJson, FileText, Database, Eraser } from 'lucide-react'
import Editor, { Monaco } from '@monaco-editor/react'
import { formatJSON, minifyJSON, validateJSON, jsonToCSV, csvToJSON, formatSQL } from '@/lib/engines/data-engine'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

export function DataStationTool() {
  // CORRECCIÓN: Namespace 'data-station' con guion
  const t = useTranslations('tools.data-station')
  const tCommon = useTranslations('common.buttons')
  
  const [activeTab, setActiveTab] = useState<'json' | 'convert' | 'sql'>('json')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [indent, setIndent] = useState(2)
  
  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    monaco.editor.defineTheme('ohcodex-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#09090b',
      }
    })
  }

  const handleFormatJSON = () => {
    if (!input.trim()) return
    try {
      const formatted = formatJSON(input, indent)
      setOutput(formatted)
      toast.success(t('jsonFormatted'))
    } catch (error) {
      toast.error(t('invalidJson'))
    }
  }

  const handleMinifyJSON = () => {
    if (!input.trim()) return
    try {
      const minified = minifyJSON(input)
      setOutput(minified)
      toast.success(t('jsonMinified'))
    } catch (error) {
      toast.error(t('invalidJson'))
    }
  }

  const handleValidateJSON = () => {
    if (!input.trim()) return
    const result = validateJSON(input)
    if (result.valid) {
      toast.success(t('jsonValid'))
      setOutput('✓ ' + t('jsonValid'))
    } else {
      toast.error(t('jsonInvalid', { error: result.error }))
      setOutput('✗ ' + t('jsonInvalid', { error: result.error }))
    }
  }

  const handleConvertJSONtoCSV = () => {
    if (!input.trim()) return
    const result = jsonToCSV(input)
    if (result.success) {
      setOutput(result.data || '')
      toast.success(t('convertedToCsv'))
    } else {
      toast.error(result.error || t('conversionError'))
    }
  }

  const handleConvertCSVtoJSON = () => {
    if (!input.trim()) return
    const result = csvToJSON(input)
    if (result.success) {
      setOutput(result.data || '')
      toast.success(t('convertedToJson'))
    } else {
      toast.error(result.error || t('conversionError'))
    }
  }

  const handleFormatSQL = () => {
    if (!input.trim()) return
    try {
      const formatted = formatSQL(input, 'standard')
      setOutput(formatted)
      toast.success(t('sqlFormatted'))
    } catch (error) {
      toast.error(t('formatError'))
    }
  }

  const copyOutput = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    toast.success(tCommon('copy')) 
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-green-500/10 text-green-400">
            <Database className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-white">{t('header')}</h1>
        </div>
        <p className="text-zinc-400 text-lg">
          {t('subtitle')}
        </p>
      </div>

      <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-zinc-900 border border-zinc-800">
              <TabsTrigger value="json" className="flex items-center gap-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                <FileJson className="w-4 h-4" />
                {t('json')}
              </TabsTrigger>
              <TabsTrigger value="convert" className="flex items-center gap-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                <FileText className="w-4 h-4" />
                {t('converter')}
              </TabsTrigger>
              <TabsTrigger value="sql" className="flex items-center gap-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                <Code className="w-4 h-4" />
                {t('sql')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="json" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-zinc-300">{t('inputJson')}</Label>
                    <Select value={String(indent)} onValueChange={(v: string) => setIndent(Number(v))}>
                      <SelectTrigger className="w-32 bg-zinc-900 border-zinc-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                        <SelectItem value="2">2 {t('spaces')}</SelectItem>
                        <SelectItem value="4">4 {t('spaces')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="h-[400px] border border-zinc-800 rounded-lg overflow-hidden">
                    <Editor
                      height="400px"
                      language="json"
                      theme="vs-dark"
                      value={input}
                      onChange={(value) => setInput(value || '')}
                      options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={handleFormatJSON} className="flex-1 bg-green-600 hover:bg-green-500 text-white">
                      {t('format')}
                    </Button>
                    <Button onClick={handleMinifyJSON} variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                      {t('minify')}
                    </Button>
                    <Button onClick={handleValidateJSON} variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                      {t('validate')}
                    </Button>
                    <Button onClick={handleClear} variant="outline" size="icon" className="border-zinc-700 text-red-400 hover:bg-red-950/20">
                      <Eraser className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-zinc-300">{t('output')}</Label>
                    <Button size="sm" variant="ghost" onClick={copyOutput} disabled={!output} className="text-zinc-400 hover:text-white">
                      <Copy className="w-4 h-4 mr-2" />
                      {tCommon('copy')}
                    </Button>
                  </div>
                  <div className="h-[400px] border border-zinc-800 rounded-lg overflow-hidden">
                    <Editor
                      height="400px"
                      language="json"
                      theme="vs-dark"
                      value={output}
                      options={{ minimap: { enabled: false }, readOnly: true, automaticLayout: true }}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="convert" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-zinc-300">{t('inputData')}</Label>
                  <div className="h-[400px] border border-zinc-800 rounded-lg overflow-hidden">
                    <Editor
                      height="400px"
                      language="json"
                      theme="vs-dark"
                      value={input}
                      onChange={(value) => setInput(value || '')}
                      options={{ minimap: { enabled: false }, automaticLayout: true }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleConvertJSONtoCSV} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white">
                      {t('jsonToCsv')}
                    </Button>
                    <Button onClick={handleConvertCSVtoJSON} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white">
                      {t('csvToJson')}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-zinc-300">{t('output')}</Label>
                    <Button size="sm" variant="ghost" onClick={copyOutput} disabled={!output} className="text-zinc-400 hover:text-white">
                      <Copy className="w-4 h-4 mr-2" />
                      {tCommon('copy')}
                    </Button>
                  </div>
                  <div className="h-[400px] border border-zinc-800 rounded-lg overflow-hidden">
                    <Editor
                      height="400px"
                      language="plaintext" 
                      theme="vs-dark"
                      value={output}
                      options={{ minimap: { enabled: false }, readOnly: true, automaticLayout: true }}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sql" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-zinc-300">{t('inputSql')}</Label>
                  <div className="h-[400px] border border-zinc-800 rounded-lg overflow-hidden">
                    <Editor
                      height="400px"
                      language="sql"
                      theme="vs-dark"
                      value={input}
                      onChange={(value) => setInput(value || '')}
                      options={{ minimap: { enabled: false }, automaticLayout: true }}
                    />
                  </div>
                  <Button onClick={handleFormatSQL} className="w-full bg-green-600 hover:bg-green-500 text-white">
                    {t('formatSql')}
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-zinc-300">{t('formattedSql')}</Label>
                    <Button size="sm" variant="ghost" onClick={copyOutput} disabled={!output} className="text-zinc-400 hover:text-white">
                      <Copy className="w-4 h-4 mr-2" />
                      {tCommon('copy')}
                    </Button>
                  </div>
                  <div className="h-[400px] border border-zinc-800 rounded-lg overflow-hidden">
                    <Editor
                      height="400px"
                      language="sql"
                      theme="vs-dark"
                      value={output}
                      options={{ minimap: { enabled: false }, readOnly: true, automaticLayout: true }}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}