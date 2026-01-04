'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { QrCode, Scan, Download, FileText, Type, Settings, Upload } from 'lucide-react'
import QRCode from 'qrcode.react'
import jsbarcode from 'jsbarcode'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { formatWiFiQR, formatVCardQR, formatWhatsAppQR, validateEAN13, calculateEAN13Checksum, detectBarcodeFormat } from '@/lib/engines/qr-engine'

export function QRFactoryTool() {
  const t = useTranslations('tools.qrFactory')
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
  const [dotStyle, setDotStyle] = useState<'square' | 'rounded' | 'dots'>('square')
  const [logo, setLogo] = useState<string | null>(null)
  const [size, setSize] = useState(1000)
  
  // Barcode state
  const [barcodeType, setBarcodeType] = useState<'CODE128' | 'EAN-13' | 'UPC'>('CODE128')
  const [barcodeData, setBarcodeData] = useState('')
  const [showText, setShowText] = useState(true)
  const [barcodeHeight, setBarcodeHeight] = useState(100)
  const [barcodeMargin, setBarcodeMargin] = useState(10)
  
  // Scanner state
  const [scanResult, setScanResult] = useState('')

  // Refs
  const qrCanvasRef = React.useRef<HTMLDivElement>(null)
  const barcodeCanvasRef = React.useRef<HTMLCanvasElement>(null)
  const logoInputRef = React.useRef<HTMLInputElement>(null)

  const getQRData = () => {
    switch (qrType) {
      case 'url':
        return url
      case 'wifi':
        return formatWiFiQR(wifi)
      case 'vcard':
        return formatVCardQR(vcard)
      case 'whatsapp':
        return formatWhatsAppQR(whatsapp.number, whatsapp.message)
      default:
        return ''
    }
  }

  const downloadQR = (format: 'png' | 'svg') => {
    if (!qrCanvasRef.current) return
    
    try {
      const qrElement = qrCanvasRef.current.querySelector('canvas')
      if (!qrElement) return
      
      let url: string
      let filename: string
      
      if (format === 'svg') {
        const svgElement = qrCanvasRef.current.querySelector('svg')
        if (!svgElement) return
        
        url = 'data:image/svg+xml,' + encodeURIComponent(svgElement.outerHTML)
        filename = 'qrcode.svg'
      } else {
        url = qrElement.toDataURL('image/png', 1.0)
        filename = 'qrcode.png'
      }
      
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      
      toast.success(t('qrGenerated'))
    } catch (error) {
      toast.error(t('scanError'))
    }
  }

  const generateBarcode = () => {
    if (!barcodeData || !barcodeCanvasRef.current) {
      toast.error(t('enterCodeError'))
      return
    }

    try {
      const canvas = barcodeCanvasRef.current
      const format = barcodeType === 'EAN-13' ? 'EAN13' : barcodeType === 'UPC' ? 'UPC' : 'CODE128'
      
      jsbarcode(canvas, barcodeData, {
        format: format as any,
        lineColor: '#000000',
        width: 2,
        height: barcodeHeight,
        displayValue: showText,
        fontSize: 14,
        margin: barcodeMargin,
        background: '#ffffff',
      })
      
      toast.success(t('barcodeGenerated'))
    } catch (error) {
      toast.error(t('enterCodeError'))
    }
  }

  const downloadBarcode = () => {
    if (!barcodeCanvasRef.current) return
    
    const url = barcodeCanvasRef.current.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'barcode.png'
    a.click()
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      setLogo(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
            <QrCode className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold">{t('header')}</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          {t('subtitle')}
        </p>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="generator" className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                {t('generator')}
              </TabsTrigger>
              <TabsTrigger value="barcode" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {t('barcode')}
              </TabsTrigger>
              <TabsTrigger value="scanner" className="flex items-center gap-2">
                <Scan className="w-4 h-4" />
                {t('scanner')}
              </TabsTrigger>
            </TabsList>

            {/* QR Generator Tab */}
            <TabsContent value="generator" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Controls */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('qrType')}</Label>
                    <Select value={qrType} onValueChange={(v: any) => setQrType(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="url">{t('url')}</SelectItem>
                        <SelectItem value="wifi">{t('wifi')}</SelectItem>
                        <SelectItem value="vcard">{t('vcard')}</SelectItem>
                        <SelectItem value="whatsapp">{t('whatsapp')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* URL Input */}
                  {qrType === 'url' && (
                    <div className="space-y-2">
                      <Label>{t('enterUrl')}</Label>
                      <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                  )}

                  {/* WiFi Input */}
                  {qrType === 'wifi' && (
                    <div className="space-y-3">
                      <Input
                        value={wifi.ssid}
                        onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
                        placeholder={t('ssid')}
                      />
                      <Input
                        type="password"
                        value={wifi.password}
                        onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
                        placeholder={t('wifiPassword')}
                      />
                      <Select value={wifi.security} onValueChange={(v: any) => setWifi({ ...wifi, security: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WPA">{t('security.wpa')}</SelectItem>
                          <SelectItem value="WEP">{t('security.wep')}</SelectItem>
                          <SelectItem value="nopass">{t('security.nopass')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-2 mt-2">
                        <Switch
                          checked={wifi.hidden}
                          onCheckedChange={(checked) => setWifi({ ...wifi, hidden: checked })}
                        />
                        <Label className="text-sm">{t('hiddenNetwork')}</Label>
                      </div>
                    </div>
                  )}

                  {/* VCard Input */}
                  {qrType === 'vcard' && (
                    <div className="space-y-2">
                      <Input value={vcard.firstName} onChange={(e) => setVcard({ ...vcard, firstName: e.target.value })} placeholder={t('firstName')} />
                      <Input value={vcard.lastName} onChange={(e) => setVcard({ ...vcard, lastName: e.target.value })} placeholder={t('lastName')} />
                      <Input value={vcard.phone} onChange={(e) => setVcard({ ...vcard, phone: e.target.value })} placeholder={t('phone')} />
                      <Input value={vcard.email} onChange={(e) => setVcard({ ...vcard, email: e.target.value })} placeholder={t('email')} />
                      <Input value={vcard.org} onChange={(e) => setVcard({ ...vcard, org: e.target.value })} placeholder={t('organization')} />
                      <Input value={vcard.website} onChange={(e) => setVcard({ ...vcard, website: e.target.value })} placeholder={t('website')} />
                    </div>
                  )}

                  {/* WhatsApp Input */}
                  {qrType === 'whatsapp' && (
                    <div className="space-y-2">
                      <Input value={whatsapp.number} onChange={(e) => setWhatsapp({ ...whatsapp, number: e.target.value })} placeholder={t('whatsappNumber')} />
                      <Input value={whatsapp.message} onChange={(e) => setWhatsapp({ ...whatsapp, message: e.target.value })} placeholder={t('message')} />
                    </div>
                  )}

                  {/* Design */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <h3 className="font-semibold">{t('design')}</h3>
                    
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Label className="flex-1">{t('foregroundColor')}</Label>
                        <Input
                          type="color"
                          value={foregroundColor}
                          onChange={(e) => setForegroundColor(e.target.value)}
                          className="w-16 h-10"
                        />
                        <Label className="flex-1">{t('backgroundColor')}</Label>
                        <Input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-16 h-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>{t('dotStyle')}</Label>
                      <Select value={dotStyle} onValueChange={(v: any) => setDotStyle(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="square">{t('square')}</SelectItem>
                          <SelectItem value="rounded">{t('rounded')}</SelectItem>
                          <SelectItem value="dots">{t('dots')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="flex-1">{t('logo')}</Label>
                      <Button size="sm" variant="outline" onClick={() => logoInputRef.current?.click()}>
                        <Upload className="w-4 h-4 mr-2" />
                        {t('uploadLogo')}
                      </Button>
                    </div>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Slider
                      value={[size]}
                      onValueChange={([v]) => setSize(v)}
                      min={200}
                      max={2000}
                      step={100}
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>{t('livePreview')}</Label>
                    <div className="flex gap-2">
                      <Button onClick={() => downloadQR('png')} size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        {t('downloadPng')}
                      </Button>
                      <Button onClick={() => downloadQR('svg')} size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        {t('downloadSvg')}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border border-border rounded-lg p-8 bg-white flex items-center justify-center min-h-[400px]">
                    <div ref={qrCanvasRef} className="flex items-center justify-center">
                      <QRCode
                        value={getQRData()}
                        size={size}
                        level="H"
                        includeMargin={true}
                        fgColor={foregroundColor}
                        bgColor={backgroundColor}
                        style={{ display: 'block' }}
                        imageSettings={logo ? {
                          src: logo,
                          width: size * 0.2,
                          height: size * 0.2,
                          excavate: true,
                        } : undefined}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Barcode Tab */}
            <TabsContent value="barcode" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('barcodeType')}</Label>
                    <Select value={barcodeType} onValueChange={(v: any) => setBarcodeType(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CODE128">{t('code128')}</SelectItem>
                        <SelectItem value="EAN-13">{t('ean13')}</SelectItem>
                        <SelectItem value="UPC">{t('upc')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('enterCode')}</Label>
                    <Input
                      value={barcodeData}
                      onChange={(e) => setBarcodeData(e.target.value)}
                      placeholder="1234567890123"
                    />
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border">
                    <Switch checked={showText} onCheckedChange={setShowText} />
                    <Label className="ml-2">{t('showText')}</Label>

                    <div className="space-y-2">
                      <Label>{t('height')}: {barcodeHeight}%</Label>
                      <Slider value={[barcodeHeight]} onValueChange={([v]) => setBarcodeHeight(v)} min={50} max={200} />
                    </div>

                    <div className="space-y-2">
                      <Label>{t('margin')}: {barcodeMargin}%</Label>
                      <Slider value={[barcodeMargin]} onValueChange={([v]) => setBarcodeMargin(v)} min={0} max={50} />
                    </div>
                  </div>

                  <Button onClick={generateBarcode} className="w-full bg-cyan-600 hover:bg-cyan-500">
                    <Settings className="w-4 h-4 mr-2" />
                    {t('generate')}
                  </Button>
                </div>

                {/* Preview */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>{t('livePreview')}</Label>
                    <Button onClick={downloadBarcode} size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      {t('download')}
                    </Button>
                  </div>
                  
                  <div className="border border-border rounded-lg p-8 bg-white flex items-center justify-center min-h-[400px]">
                    <canvas ref={barcodeCanvasRef} />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Scanner Tab */}
            <TabsContent value="scanner" className="space-y-6">
              <div className="border-2 border-dashed rounded-lg p-12 text-center border-border hover:border-cyan-500/50 hover:bg-cyan-500/5 cursor-pointer">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-foreground font-medium">{t('uploadImage')}</p>
              </div>

              {scanResult && (
                <div className="mt-6 space-y-2">
                  <Label>{t('scanResult')}</Label>
                  <div className="p-4 bg-zinc-900/50 rounded-lg border border-border">
                    <p className="text-cyan-400 font-mono break-all">{scanResult}</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
