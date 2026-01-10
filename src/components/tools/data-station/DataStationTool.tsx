'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Code, Copy, FileJson, FileText, Database, Eraser, Play, Wand2, ArrowRight } from 'lucide-react'
import Editor from '@monaco-editor/react'
import { formatJSON, minifyJSON, validateJSON, jsonToCSV, csvToJSON, formatSQL } from '@/lib/engines/data-engine'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

// --- DATOS DE EJEMPLO PARA LA DEMO ---
const SAMPLE_JSON = JSON.stringify([
  { "id": 1, "name": "OHCodex User", "role": "Admin", "active": true },
  { "id": 2, "name": "Guest User", "role": "Viewer", "active": false }
], null, 2)

const SAMPLE_SQL = `SELECT id, email, created_at FROM users WHERE active = 1 AND role = 'admin' ORDER BY created_at DESC;`

const SAMPLE_CSV = `id,name,role
1,OHCodex,Admin
2,Guest,Viewer`

export function DataStationTool() {
  const t = useTranslations('tools.data-station')
  const tCommon = useTranslations('common.buttons')
  
  const [activeTab, setActiveTab] = useState<'json' | 'convert' | 'sql'>('json')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [indent, setIndent] = useState(2)

  // Función para cargar datos de ejemplo según la pestaña
  const loadSample = () => {
    if (activeTab === 'json') {
      setInput(SAMPLE_JSON)
      toast.success("Ejemplo JSON cargado")
    } else if (activeTab === 'sql') {
      setInput(SAMPLE_SQL)
      toast.success("Ejemplo SQL cargado")
    } else {
      setInput(SAMPLE_JSON) // Para convertir usamos JSON como base
      toast.success("Datos de ejemplo cargados")
    }
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
    <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-xl shadow-2xl">
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={(v: any) => { setActiveTab(v); handleClear(); }} className="w-full">
          
          {/* TABS DE NAVEGACIÓN */}
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-zinc-900/50 border border-zinc-800 p-1">
            <TabsTrigger 
              value="json" 
              className="flex items-center gap-2 data-[state=active]:bg-cyan-950/30 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-900/50 transition-all"
            >
              <FileJson className="w-4 h-4" />
              {t('json')}
            </TabsTrigger>
            <TabsTrigger 
              value="convert" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-950/30 data-[state=active]:text-purple-400 transition-all"
            >
              <FileText className="w-4 h-4" />
              {t('converter')}
            </TabsTrigger>
            <TabsTrigger 
              value="sql" 
              className="flex items-center gap-2 data-[state=active]:bg-orange-950/30 data-[state=active]:text-orange-400 transition-all"
            >
              <Database className="w-4 h-4" />
              {t('sql')}
            </TabsTrigger>
          </TabsList>

          {/* ÁREA DE TRABAJO COMÚN */}
          <div className="grid lg:grid-cols-2 gap-6">
            
            {/* COLUMNA IZQUIERDA: INPUT */}
            <div className="space-y-4 flex flex-col h-full">
              <div className="flex items-center justify-between">
                <Label className="text-zinc-400 font-medium flex items-center gap-2">
                  <Play className="w-3 h-3 text-cyan-500" />
                  {activeTab === 'sql' ? t('inputSql') : 'Entrada de Datos'}
                </Label>
                
                <div className="flex gap-2">
                  {/* BOTÓN MÁGICO: CARGAR EJEMPLO */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={loadSample}
                    className="h-7 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                  >
                    <Wand2 className="w-3 h-3 mr-1.5" />
                    Cargar Ejemplo
                  </Button>

                  {activeTab === 'json' && (
                    <Select value={String(indent)} onValueChange={(v: string) => setIndent(Number(v))}>
                      <SelectTrigger className="w-[100px] h-7 text-xs bg-zinc-900 border-zinc-700 text-zinc-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                        <SelectItem value="2">2 {t('spaces')}</SelectItem>
                        <SelectItem value="4">4 {t('spaces')}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              <div className="relative flex-1 min-h-[400px] border border-zinc-800 rounded-xl overflow-hidden shadow-inner bg-[#1e1e1e]">
                <Editor
                  height="100%"
                  language={activeTab === 'sql' ? 'sql' : 'json'}
                  theme="vs-dark"
                  value={input}
                  onChange={(value) => setInput(value || '')}
                  options={{ 
                    minimap: { enabled: false }, 
                    fontSize: 13, 
                    padding: { top: 16 },
                    scrollBeyondLastLine: false,
                    fontFamily: "'Fira Code', monospace",
                  }}
                />
                {!input && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-zinc-600 text-sm">
                      Pega tu código aquí o usa el botón &quot;Cargar Ejemplo&quot;
                    </p>
                  </div>
                )}
              </div>

              {/* BARRA DE HERRAMIENTAS INFERIOR */}
              <div className="flex gap-2 pt-1">
                {activeTab === 'json' && (
                  <>
                    <Button onClick={handleFormatJSON} className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20">
                      {t('format')}
                    </Button>
                    <Button onClick={handleMinifyJSON} variant="secondary" className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white">
                      {t('minify')}
                    </Button>
                    <Button onClick={handleValidateJSON} variant="outline" className="border-zinc-700 text-zinc-400 hover:bg-zinc-800">
                      {t('validate')}
                    </Button>
                  </>
                )}
                {activeTab === 'convert' && (
                  <>
                    <Button onClick={handleConvertJSONtoCSV} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white">
                      JSON <ArrowRight className="w-3 h-3 mx-1" /> CSV
                    </Button>
                    <Button onClick={handleConvertCSVtoJSON} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white">
                      CSV <ArrowRight className="w-3 h-3 mx-1" /> JSON
                    </Button>
                  </>
                )}
                {activeTab === 'sql' && (
                  <Button onClick={handleFormatSQL} className="w-full bg-orange-600 hover:bg-orange-500 text-white">
                    {t('formatSql')}
                  </Button>
                )}
                
                <Button onClick={handleClear} variant="ghost" size="icon" className="text-red-400 hover:bg-red-950/20 hover:text-red-300 ml-auto">
                  <Eraser className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* COLUMNA DERECHA: OUTPUT */}
            <div className="space-y-4 flex flex-col h-full">
              <div className="flex items-center justify-between">
                <Label className="text-zinc-400 font-medium flex items-center gap-2">
                  <Code className="w-3 h-3 text-green-500" />
                  Resultado
                </Label>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={copyOutput} 
                  disabled={!output} 
                  className="h-7 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  <Copy className="w-3 h-3 mr-1.5" />
                  {tCommon('copy')}
                </Button>
              </div>

              <div className="relative flex-1 min-h-[400px] border border-zinc-800 rounded-xl overflow-hidden bg-[#1e1e1e]">
                <Editor
                  height="100%"
                  language={activeTab === 'sql' ? 'sql' : 'json'}
                  theme="vs-dark"
                  value={output}
                  options={{ 
                    minimap: { enabled: false }, 
                    readOnly: true, 
                    fontSize: 13,
                    padding: { top: 16 },
                    fontFamily: "'Fira Code', monospace",
                  }}
                />
                {!output && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-zinc-700 text-sm italic">
                      El resultado aparecerá aquí...
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}