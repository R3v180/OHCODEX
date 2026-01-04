'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Code, CheckCircle2, Copy, FileJson, FileText, Database } from 'lucide-react'
import Editor, { Monaco } from '@monaco-editor/react'
import { formatJSON, minifyJSON, validateJSON, jsonToCSV, csvToJSON, formatSQL } from '@/lib/engines/data-engine'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

export function DataStationTool() {
  const t = useTranslations('tools.dataStation')
  const tCommon = useTranslations('common')
  const [activeTab, setActiveTab] = useState<'json' | 'convert' | 'sql'>('json')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [indent, setIndent] = useState(2)
  const editorRef = useRef<Editor>(null)

  // Monaco editor configuration
  const monaco: Monaco = {
    '@vscode/vs-dark-theme': {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { background: '1e1e1e', foreground: 'd4d4d4' },
        { token: 'comment', foreground: '6a9955' },
        { token: 'keyword', foreground: '569cd6' },
        { token: 'string', foreground: 'ce9178' },
        { token: 'number', foreground: 'b5cea8' },
      ],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editor.lineHighlightBackground': '#2d2d2d',
        'editorCursor.foreground': '#d4d4d4',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#3a3d41',
      }
    }
  }

  const handleFormatJSON = () => {
    try {
      const formatted = formatJSON(input, indent)
      setOutput(formatted)
      toast.success(t('jsonFormatted'))
    } catch (error) {
      toast.error(t('invalidJson'))
    }
  }

  const handleMinifyJSON = () => {
    try {
      const minified = minifyJSON(input)
      setOutput(minified)
      toast.success(t('jsonMinified'))
    } catch (error) {
      toast.error(t('invalidJson'))
    }
  }

  const handleValidateJSON = () => {
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
    const result = jsonToCSV(input)
    if (result.success) {
      setOutput(result.data || '')
      toast.success(t('convertedToCsv'))
    } else {
      toast.error(result.error || t('conversionError'))
    }
  }

  const handleConvertCSVtoJSON = () => {
    const result = csvToJSON(input)
    if (result.success) {
      setOutput(result.data || '')
      toast.success(t('convertedToJson'))
    } else {
      toast.error(result.error || t('conversionError'))
    }
  }

  const handleFormatSQL = () => {
    try {
      const formatted = formatSQL(input, 'standard')
      setOutput(formatted)
      toast.success(t('sqlFormatted'))
    } catch (error) {
      toast.error(t('formatError'))
    }
  }

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output)
    toast.success(t('copied'))
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-green-500/10 text-green-400">
            <Database className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold">{t('title')}</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          {t('subtitle')}
        </p>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="json" className="flex items-center gap-2">
                <FileJson className="w-4 h-4" />
                {t('json')}
              </TabsTrigger>
              <TabsTrigger value="convert" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {t('converter')}
              </TabsTrigger>
              <TabsTrigger value="sql" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                {t('sql')}
              </TabsTrigger>
            </TabsList>

            {/* JSON Tab */}
            <TabsContent value="json" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>{t('inputJson')}</Label>
                    <Select value={String(indent)} onValueChange={(v: string) => setIndent(Number(v))}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 {t('spaces')}</SelectItem>
                        <SelectItem value="4">4 {t('spaces')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="h-[400px] border border-border rounded-lg overflow-hidden">
                    <Editor
                      height="400px"
                      language="json"
                      theme="vs-dark"
                      value={input}
                      onChange={(value) => setInput(value)}
                      options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        lineNumbers: 'on',
                        wordWrap: 'on',
                        automaticLayout: true,
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleFormatJSON} className="flex-1 bg-green-600 hover:bg-green-500">
                      {t('format')}
                    </Button>
                    <Button onClick={handleMinifyJSON} variant="outline">
                      {t('minify')}
                    </Button>
                    <Button onClick={handleValidateJSON} variant="outline">
                      {t('validate')}
                    </Button>
                    <Button onClick={handleClear} variant="outline">
                      {tCommon('buttons.clear')}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>{t('output')}</Label>
                    <Button size="sm" variant="ghost" onClick={copyOutput} disabled={!output}>
                      <Copy className="w-4 h-4 mr-2" />
                      {tCommon('buttons.copy')}
                    </Button>
                  </div>
                  <div className="h-[400px] border border-border rounded-lg overflow-hidden">
                    <Editor
                      height="400px"
                      language="json"
                      theme="vs-dark"
                      value={output}
                      options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        lineNumbers: 'on',
                        wordWrap: 'on',
                        readOnly: true,
                        automaticLayout: true,
                      }}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Converter Tab */}
            <TabsContent value="convert" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>{t('inputData')}</Label>
                  <div className="h-[400px] border border-border rounded-lg overflow-hidden">
                    <Editor
                      height="400px"
                      language="json"
                      theme="vs-dark"
                      value={input}
                      onChange={(value) => setInput(value)}
                      options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        lineNumbers: 'on',
                        wordWrap: 'on',
                        automaticLayout: true,
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleConvertJSONtoCSV} className="flex-1">
                      {t('jsonToCsv')}
                    </Button>
                    <Button onClick={handleConvertCSVtoJSON} variant="outline" className="flex-1">
                      {t('csvToJson')}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>{t('output')}</Label>
                  <div className="h-[400px] border border-border rounded-lg overflow-hidden">
                    <Editor
                      height="400px"
                      language="json"
                      theme="vs-dark"
                      value={output}
                      options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        lineNumbers: 'on',
                        wordWrap: 'on',
                        readOnly: true,
                        automaticLayout: true,
                      }}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* SQL Tab */}
            <TabsContent value="sql" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>{t('inputSql')}</Label>
                  <div className="h-[400px] border border-border rounded-lg overflow-hidden">
                    <Editor
                      height="400px"
                      language="sql"
                      theme="vs-dark"
                      value={input}
                      onChange={(value) => setInput(value)}
                      options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        lineNumbers: 'on',
                        wordWrap: 'on',
                        automaticLayout: true,
                      }}
                    />
                  </div>
                  <Button onClick={handleFormatSQL} className="w-full bg-green-600 hover:bg-green-500">
                    {t('formatSql')}
                  </Button>
                </div>

                <div className="space-y-4">
                  <Label>{t('formattedSql')}</Label>
                  <div className="h-[400px] border border-border rounded-lg overflow-hidden">
                    <Editor
                      height="400px"
                      language="sql"
                      theme="vs-dark"
                      value={output}
                      options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        lineNumbers: 'on',
                        wordWrap: 'on',
                        readOnly: true,
                        automaticLayout: true,
                      }}
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
