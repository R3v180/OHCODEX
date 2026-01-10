'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { QrCode, Scan, Download, FileText, Type, Upload, Wifi, Link as LinkIcon, User, Phone, Palette, Image as ImageIcon, Barcode, CheckCircle2 } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import jsbarcode from 'jsbarcode'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { formatWiFiQR, formatVCardQR, formatWhatsAppQR } from '@/lib/engines/qr-engine'
import { Html5Qrcode } from 'html5-qrcode'

export function QRFactoryTool() {
  const t = useTranslations('tools.qr-factory')
  
  const [activeTab, setActiveTab] = useState<'generator' | 'barcode' | 'scanner'>('generator')
  
  // QR Generator state
  const [qrType, setQrType] = useState<'url' | 'wifi' | 'vcard' | 'whatsapp'>('url')
  const [url, setUrl] = useState('')
  const [wifi, setWifi] = useState({ ssid: '', password: '', security: 'WPA' as 'WPA' | 'WEP' | 'nopass', hidden: false })
  const [vcard, setVcard] = useState({ firstName: '', lastName: '', phone: '', email: '', org: '', website: '' })
  const [whatsapp, setWhatsapp] = useState({ number: '', message: '' })
  
  // QR Design state
  const [foregroundColor, setForegroundColor] = useState('#000000')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [logo, setLogo] = useState<string | null>(null)
  const [size, setSize] = useState(300)
  
  // Barcode state
  const [barcodeType, setBarcodeType] = useState<'CODE128' | 'EAN13' | 'UPC'>('CODE128')
  const [barcodeData, setBarcodeData] = useState('')
  const [showText, setShowText] = useState(true)
  const [barcodeHeight, setBarcodeHeight] = useState(100)
  
  // Scanner state
  const [scanResult, setScanResult] = useState('')

  // Refs
  const qrRef = useRef<HTMLDivElement>(null)
  const barcodeCanvasRef = useRef<HTMLCanvasElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const getQRData = () => {
    switch (qrType) {
      case 'url': return url || 'https://ohcodex.com'
      case 'wifi': return formatWiFiQR(wifi)
      case 'vcard': return formatVCardQR(vcard)
      case 'whatsapp': return formatWhatsAppQR(whatsapp.number, whatsapp.message)
      default: return ''
    }
  }

  const downloadQR = (format: 'png' | 'svg') => {
    if (!qrRef.current) return
    try {
      const svgElement = qrRef.current.querySelector('svg')
      if (!svgElement) return
      const svgData = new XMLSerializer().serializeToString(svgElement)
      if (format === 'svg') {
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
        triggerDownload(URL.createObjectURL(blob), 'qrcode.svg')
      } else {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(svgBlob)
        img.onload = () => {
          canvas.width = size
          canvas.height = size
          ctx?.drawImage(img, 0, 0)
          triggerDownload(canvas.toDataURL('image/png'), 'qrcode.png')
          URL.revokeObjectURL(url)
        }
        img.src = url
      }
      toast.success(t('qrGenerated'))
    } catch (error) {
      toast.error(t('scanError'))
    }
  }

  const triggerDownload = (url: string, filename: string) => {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
  }

  useEffect(() => {
    if (activeTab === 'barcode' && barcodeData && barcodeCanvasRef.current) {
      try {
        jsbarcode(barcodeCanvasRef.current, barcodeData, {
          format: barcodeType as any,
          lineColor: '#000000',
          width: 2,
          height: barcodeHeight,
          displayValue: showText,
          background: '#ffffff',
          margin: 10
        })
      } catch (e) {}
    }
  }, [activeTab, barcodeData, barcodeType, showText, barcodeHeight])

  const downloadBarcode = () => {
    if (!barcodeCanvasRef.current) return
    triggerDownload(barcodeCanvasRef.current.toDataURL('image/png'), 'barcode.png')
    toast.success(t('barcodeGenerated'))
  }

  const handleScanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const html5QrCode = new Html5Qrcode("reader")
      const result = await html5QrCode.scanFile(file, true)
      setScanResult(result)
      toast.success(t('scanResult'))
    } catch (err) {
      toast.error(t('noCodeFound'))
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => setLogo(event.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-8">
      
      {/* TABS PRINCIPALES */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="generator" className="flex items-center gap-2 data-[state=active]:bg-cyan-950/30 data-[state=active]:text-cyan-400">
              <QrCode className="w-4 h-4" /> QR
            </TabsTrigger>
            <TabsTrigger value="barcode" className="flex items-center gap-2 data-[state=active]:bg-purple-950/30 data-[state=active]:text-purple-400">
              <Barcode className="w-4 h-4" /> Barras
            </TabsTrigger>
            <TabsTrigger value="scanner" className="flex items-center gap-2 data-[state=active]:bg-green-950/30 data-[state=active]:text-green-400">
              <Scan className="w-4 h-4" /> Scan
            </TabsTrigger>
          </TabsList>
        </div>

        {/* --- GENERADOR QR --- */}
        <TabsContent value="generator" className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* COLUMNA IZQUIERDA: CONTROLES */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 1. SELECCIÓN DE TIPO */}
              <Card className="border-zinc-800 bg-zinc-900/50">
                <CardHeader>
                  <CardTitle className="text-base text-zinc-300 flex items-center gap-2">
                    <Type className="w-4 h-4 text-cyan-500" />
                    {t('qrType')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { id: 'url', icon: LinkIcon, label: 'URL' },
                      { id: 'wifi', icon: Wifi, label: 'WiFi' },
                      { id: 'vcard', icon: User, label: 'VCard' },
                      { id: 'whatsapp', icon: Phone, label: 'WhatsApp' }
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setQrType(type.id as any)}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                          qrType === type.id 
                            ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-400' 
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                        }`}
                      >
                        <type.icon className="w-6 h-6 mb-2" />
                        <span className="text-xs font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 2. DATOS (DINÁMICO) */}
              <Card className="border-zinc-800 bg-zinc-900/50">
                <CardContent className="pt-6 space-y-4">
                  {qrType === 'url' && (
                    <div className="space-y-2">
                      <Label>Dirección Web (URL)</Label>
                      <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="bg-zinc-950 border-zinc-700" />
                    </div>
                  )}
                  {qrType === 'wifi' && (
                    <div className="space-y-3">
                      <Input value={wifi.ssid} onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })} placeholder={t('ssid')} className="bg-zinc-950 border-zinc-700" />
                      <Input type="password" value={wifi.password} onChange={(e) => setWifi({ ...wifi, password: e.target.value })} placeholder={t('wifiPassword')} className="bg-zinc-950 border-zinc-700" />
                      <Select value={wifi.security} onValueChange={(v: any) => setWifi({ ...wifi, security: v })}>
                        <SelectTrigger className="bg-zinc-950 border-zinc-700"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-700">
                          <SelectItem value="WPA">WPA/WPA2</SelectItem>
                          <SelectItem value="WEP">WEP</SelectItem>
                          <SelectItem value="nopass">{t('security.nopass')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {qrType === 'vcard' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Input value={vcard.firstName} onChange={(e) => setVcard({ ...vcard, firstName: e.target.value })} placeholder={t('firstName')} className="bg-zinc-950 border-zinc-700" />
                        <Input value={vcard.lastName} onChange={(e) => setVcard({ ...vcard, lastName: e.target.value })} placeholder={t('lastName')} className="bg-zinc-950 border-zinc-700" />
                      </div>
                      <Input value={vcard.phone} onChange={(e) => setVcard({ ...vcard, phone: e.target.value })} placeholder={t('phone')} className="bg-zinc-950 border-zinc-700" />
                      <Input value={vcard.email} onChange={(e) => setVcard({ ...vcard, email: e.target.value })} placeholder={t('email')} className="bg-zinc-950 border-zinc-700" />
                    </div>
                  )}
                  {qrType === 'whatsapp' && (
                    <div className="space-y-3">
                      <Input value={whatsapp.number} onChange={(e) => setWhatsapp({ ...whatsapp, number: e.target.value })} placeholder={t('whatsappNumber')} className="bg-zinc-950 border-zinc-700" />
                      <Input value={whatsapp.message} onChange={(e) => setWhatsapp({ ...whatsapp, message: e.target.value })} placeholder={t('message')} className="bg-zinc-950 border-zinc-700" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 3. DISEÑO (ACORDEÓN) */}
              <Accordion type="single" collapsible className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4">
                <AccordionItem value="colors" className="border-zinc-800">
                  <AccordionTrigger className="text-zinc-300 hover:text-white">
                    <span className="flex items-center gap-2"><Palette className="w-4 h-4" /> {t('design')}</span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div className="flex gap-4">
                      <div className="space-y-2 flex-1">
                        <Label className="text-zinc-400 text-xs">{t('foregroundColor')}</Label>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded border border-zinc-700 overflow-hidden">
                            <input type="color" value={foregroundColor} onChange={(e) => setForegroundColor(e.target.value)} className="w-full h-full cursor-pointer p-0 border-0" />
                          </div>
                          <Input value={foregroundColor} onChange={(e) => setForegroundColor(e.target.value)} className="h-8 bg-zinc-950 font-mono text-xs" />
                        </div>
                      </div>
                      <div className="space-y-2 flex-1">
                        <Label className="text-zinc-400 text-xs">{t('backgroundColor')}</Label>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded border border-zinc-700 overflow-hidden">
                            <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="w-full h-full cursor-pointer p-0 border-0" />
                          </div>
                          <Input value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="h-8 bg-zinc-950 font-mono text-xs" />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="logo" className="border-zinc-800 border-b-0">
                  <AccordionTrigger className="text-zinc-300 hover:text-white">
                    <span className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> {t('logo')}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800" onClick={() => logoInputRef.current?.click()}>
                      <Upload className="w-4 h-4 mr-2" /> {t('uploadLogo')}
                    </Button>
                    <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    {logo && (
                      <div className="mt-4 flex items-center gap-2">
                        <div className="w-10 h-10 rounded border border-zinc-700 bg-white p-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={logo} alt="Logo preview" className="w-full h-full object-contain" />
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => setLogo(null)} className="text-red-400 text-xs h-8">Eliminar</Button>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

            </div>

            {/* COLUMNA DERECHA: PREVIEW (STICKY) */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 space-y-6">
                <Card className="border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
                  <CardHeader className="bg-zinc-900 border-b border-zinc-800 py-3">
                    <CardTitle className="text-sm font-medium text-center text-zinc-400">Vista Previa</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 flex items-center justify-center bg-[url('/grid-pattern.svg')] bg-center">
                    <div className="bg-white p-4 rounded-xl shadow-lg" ref={qrRef}>
                      <QRCodeSVG
                        value={getQRData()}
                        size={220}
                        fgColor={foregroundColor}
                        bgColor={backgroundColor}
                        level="M"
                        includeMargin={true}
                        imageSettings={logo ? { src: logo, height: 40, width: 40, excavate: true } : undefined}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={() => downloadQR('png')} className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20">
                    <Download className="w-4 h-4 mr-2" /> PNG
                  </Button>
                  <Button onClick={() => downloadQR('svg')} variant="outline" className="border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800">
                    <FileText className="w-4 h-4 mr-2" /> SVG
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </TabsContent>

        {/* --- GENERADOR CÓDIGO DE BARRAS --- */}
        <TabsContent value="barcode" className="space-y-6">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-8 grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-zinc-300">{t('barcodeType')}</Label>
                  <Select value={barcodeType} onValueChange={(v: any) => setBarcodeType(v)}>
                    <SelectTrigger className="bg-zinc-950 border-zinc-700 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                      <SelectItem value="CODE128">CODE128 (Estándar)</SelectItem>
                      <SelectItem value="EAN13">EAN-13 (Producto)</SelectItem>
                      <SelectItem value="UPC">UPC (EEUU)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-zinc-300">{t('enterCode')}</Label>
                  <Input value={barcodeData} onChange={(e) => setBarcodeData(e.target.value)} placeholder="Ej: 12345678" className="bg-zinc-950 border-zinc-700" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-zinc-400">{t('showText')}</Label>
                    <Switch checked={showText} onCheckedChange={setShowText} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs">{t('height')}</Label>
                    <Slider value={[barcodeHeight]} onValueChange={([v]) => setBarcodeHeight(v)} min={30} max={150} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-xl min-h-[200px]">
                {barcodeData ? (
                  <canvas ref={barcodeCanvasRef} className="max-w-full" />
                ) : (
                  <p className="text-zinc-400 text-sm">Introduce datos para generar</p>
                )}
                {barcodeData && (
                  <Button onClick={downloadBarcode} size="sm" variant="outline" className="mt-6 text-black border-zinc-300 hover:bg-zinc-100">
                    <Download className="w-3 h-3 mr-2" /> {t('download')} PNG
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- ESCÁNER --- */}
        <TabsContent value="scanner" className="space-y-6">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-12 text-center">
              <div className="border-2 border-dashed border-zinc-700 p-12 relative cursor-pointer rounded-xl hover:border-cyan-500/50 hover:bg-cyan-950/5 transition-all group">
                <input type="file" accept="image/*" onChange={handleScanUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Scan className="w-8 h-8 text-zinc-400 group-hover:text-cyan-400" />
                </div>
                <p className="text-white font-medium mb-1">{t('uploadImage')}</p>
                <p className="text-zinc-500 text-sm">Sube una imagen con un código QR</p>
              </div>
              
              {scanResult && (
                <div className="mt-8 bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-left animate-in zoom-in-95">
                  <Label className="text-green-400 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> {t('scanResult')}
                  </Label>
                  <div className="flex gap-2">
                    <code className="block flex-1 bg-black p-3 rounded text-zinc-300 font-mono text-sm break-all border border-zinc-800">
                      {scanResult}
                    </code>
                    <Button size="icon" variant="outline" onClick={() => { navigator.clipboard.writeText(scanResult); toast.success('Copiado'); }} className="border-zinc-700 text-zinc-400 hover:text-white">
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
              <div id="reader" className="hidden"></div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}