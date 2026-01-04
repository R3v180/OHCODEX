import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AnalyticsTracker } from '@/components/AnalyticsTracker'
import { Suspense } from 'react'
import '../globals.css'

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validar idioma usando la configuración centralizada
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Cargar traducciones para el cliente (Client Components)
  const messages = await getMessages()

  return (
    <html lang={locale} className="dark scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen bg-black font-sans antialiased text-foreground selection:bg-cyan-500/30 flex flex-col">
        
        <NextIntlClientProvider messages={messages}>
          
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>

          <Header />
          
          <main className="flex-1">
            {children}
          </main>
          
          {/* Pasamos el locale al Footer para que cargue los datos correctos de la BD */}
          <Footer locale={locale} />

        </NextIntlClientProvider>
        
      </body>
    </html>
  )
}