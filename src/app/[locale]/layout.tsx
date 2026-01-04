import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // 1. En Next.js 15, los params son una Promesa que hay que esperar
  const { locale } = await params;

  // 2. Seguridad: Si el idioma no está en nuestra lista, devolvemos 404
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // 3. Cargamos los mensajes de traducción en el servidor
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div className="flex min-h-screen flex-col">
        {/* El Header es Cliente, ahora funcionará porque está dentro del Provider */}
        <Header />
        
        <main className="flex-1">
          {children}
        </main>
        
        {/* El Footer es Servidor, le pasamos el locale explícitamente */}
        <Footer locale={locale} />
      </div>
      
      {/* Toast para notificaciones (ej: "Copiado al portapapeles") */}
      <Toaster />
    </NextIntlClientProvider>
  );
}