import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Code, Zap, Shield } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function CrossSellBanner() {
  const t = useTranslations('crossSell')

  return (
    <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/20 overflow-hidden">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              {t('title')}
            </h3>
            <p className="text-muted-foreground text-lg mb-6">
              {t('description')}
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-6">
              <div className="flex items-center gap-2 text-sm text-cyan-400">
                <Zap className="w-4 h-4" />
                <span>{t('common.ultraFast')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-cyan-400">
                <Shield className="w-4 h-4" />
                <span>{t('common.secure')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-cyan-400">
                <Code className="w-4 h-4" />
                <span>{t('common.scalable')}</span>
              </div>
            </div>

            <Button
              size="lg"
              className="bg-cyan-600 hover:bg-cyan-500 text-white"
              asChild
            >
              <a href="https://ohcodex.com" target="_blank" rel="noopener noreferrer">
                {t('requestQuote')} <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
          </div>

          {/* Visual Element */}
          <div className="hidden lg:block w-64 h-48 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-cyan-400">OHC</div>
                <div className="text-sm text-muted-foreground">ODEX</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
