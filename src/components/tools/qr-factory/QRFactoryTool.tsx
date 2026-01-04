'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { QrCode, Scan, Download, FileText, Type, Settings, Upload, Wifi, Link as LinkIcon, User, Phone } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import jsbarcode from 'jsbarcode'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { formatWiFiQR, formatVCardQR, formatWhatsAppQR } from '@/lib/engines/qr-engine'
import { Html5Qrcode } from 'html5-qrcode'

export function QRFactoryTool() {
  // CORRECCIÓN: 'qr-factory' con guion
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
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
            <QrCode className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-white">{t('header')}</h1>
        </div>
        <p className="text-zinc-400 text-lg">{t('subtitle')}</p>
      </div>

      <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-zinc-900 border border-zinc-800">
              <TabsTrigger value="generator" className="flex items-center gap-2">
                <Type className="w-4 h-4" /> {t('generator')}
              </TabsTrigger>
              <TabsTrigger value="barcode" className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> {t('barcode')}
              </TabsTrigger>
              <TabsTrigger value="scanner" className="flex items-center gap-2">
                <Scan className="w-4 h-4" /> {t('scanner')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generator" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-zinc-300">{t('qrType')}</Label>
                    <div className="grid grid-cols-4 gap-2">
                      <Button variant={qrType === 'url' ? 'default' : 'outline'} onClick={() => setQrType('url')} size="sm"><LinkIcon className="w-4 h-4" /></Button>
                      <Button variant={qrType === 'wifi' ? 'default' : 'outline'} onClick={() => setQrType('wifi')} size="sm"><Wifi className="w-4 h-4" /></Button>
                      <Button variant={qrType === 'vcard' ? 'default' : 'outline'} onClick={() => setQrType('vcard')} size="sm"><User className="w-4 h-4" /></Button>
                      <Button variant={qrType === 'whatsapp' ? 'default' : 'outline'} onClick={() => setQrType('whatsapp')} size="sm"><Phone className="w-4 h-4" /></Button>
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 space-y-4">
                    {qrType === 'url' && (
                      <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="bg-zinc-950 border-zinc-700" />
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
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Input value={vcard.firstName} onChange={(e) => setVcard({ ...vcard, firstName: e.target.value })} placeholder={t('firstName')} className="bg-zinc-950 border-zinc-700" />
                          <Input value={vcard.lastName} onChange={(e) => setVcard({ ...vcard, lastName: e.target.value })} placeholder={t('lastName')} className="bg-zinc-950 border-zinc-700" />
                        </div>
                        <Input value={vcard.phone} onChange={(e) => setVcard({ ...vcard, phone: e.target.value })} placeholder={t('phone')} className="bg-zinc-950 border-zinc-700" />
                        <Input value={vcard.email} onChange={(e) => setVcard({ ...vcard, email: e.target.value })} placeholder={t('email')} className="bg-zinc-950 border-zinc-700" />
                      </div>
                    )}
                    {qrType === 'whatsapp' && (
                      <div className="space-y-2">
                        <Input value={whatsapp.number} onChange={(e) => setWhatsapp({ ...whatsapp, number: e.target.value })} placeholder={t('whatsappNumber')} className="bg-zinc-950 border-zinc-700" />
                        <Input value={whatsapp.message} onChange={(e) => setWhatsapp({ ...whatsapp, message: e.target.value })} placeholder={t('message')} className="bg-zinc-950 border-zinc-700" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-zinc-800">
                    <h3 className="font-semibold text-white">{t('design')}</h3>
                    <div className="flex gap-4">
                      <div className="space-y-2 flex-1">
                        <Label className="text-zinc-400 text-xs">{t('foregroundColor')}</Label>
                        <input type="color" value={foregroundColor} onChange={(e) => setForegroundColor(e.target.value)} className="h-8 w-full rounded cursor-pointer bg-transparent border-0" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <Label className="text-zinc-400 text-xs">{t('backgroundColor')}</Label>
                        <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="h-8 w-full rounded cursor-pointer bg-transparent border-0" />
                      </div>
                    </div>
                    <Button variant="outline" className="w-full border-zinc-700 text-zinc-300" onClick={() => logoInputRef.current?.click()}>
                      <Upload className="w-4 h-4 mr-2" /> {t('uploadLogo')}
                    </Button>
                    <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-8 bg-zinc-900/50 rounded-xl border border-zinc-800">
                  <div className="bg-white p-4 rounded-lg shadow-xl" ref={qrRef}>
                    <QRCodeSVG
                      value={getQRData()}
                      size={250}
                      fgColor={foregroundColor}
                      bgColor={backgroundColor}
                      level="M"
                      includeMargin={true}
                      imageSettings={logo ? { src: logo, height: 50, width: 50, excavate: true } : undefined}
                    />
                  </div>
                  <div className="flex gap-3 mt-8">
                    <Button onClick={() => downloadQR('png')} className="bg-cyan-600">Download PNG</Button>
                    <Button onClick={() => downloadQR('svg')} variant="outline">Download SVG</Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="barcode" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-zinc-300">{t('barcodeType')}</Label>
                  <Select value={barcodeType} onValueChange={(v: any) => setBarcodeType(v)}>
                    <SelectTrigger className="bg-zinc-900 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      <SelectItem value="CODE128">CODE128</SelectItem>
                      <SelectItem value="EAN13">EAN-13</SelectItem>
                      <SelectItem value="UPC">UPC</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input value={barcodeData} onChange={(e) => setBarcodeData(e.target.value)} placeholder={t('enterCode')} className="bg-zinc-950 border-zinc-700" />
                  <div className="flex items-center justify-between pt-4">
                    <Label className="text-zinc-300">{t('showText')}</Label>
                    <Switch checked={showText} onCheckedChange={setShowText} />
                  </div>
                  <Slider value={[barcodeHeight]} onValueChange={([v]) => setBarcodeHeight(v)} min={50} max={150} />
                </div>
                <div className="flex flex-col items-center justify-center p-8 bg-zinc-900/50 rounded-xl border border-zinc-800">
                  {barcodeData ? <div className="bg-white p-4 rounded"><canvas ref={barcodeCanvasRef} /></div> : <p className="text-zinc-500">{t('enterCode')}</p>}
                  {barcodeData && <Button onClick={downloadBarcode} variant="outline" className="mt-6">{t('download')}</Button>}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scanner" className="space-y-6">
              <div className="max-w-xl mx-auto text-center space-y-6">
                <div className="border-2 border-dashed border-zinc-700 p-12 relative cursor-pointer rounded-xl">
                  <input type="file" accept="image/*" onChange={handleScanUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <Scan className="w-12 h-12 mx-auto text-zinc-500 mb-4" />
                  <p className="text-white">{t('uploadImage')}</p>
                </div>
                {scanResult && (
                  <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 text-left">
                    <Label className="text-zinc-400 mb-2 block">{t('scanResult')}</Label>
                    <code className="block bg-black p-3 rounded text-cyan-400 break-all">{scanResult}</code>
                  </div>
                )}
                <div id="reader" className="hidden"></div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}