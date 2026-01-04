// =============== INICIO ARCHIVO: src/app/(frontend)/not-found.tsx =============== //
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion, Home } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export default async function NotFound() {
  // 1. Cargar traducciones
  // Nota: Al estar en la raíz, intentará detectar el idioma por headers/cookies.
  // Si falla, next-intl usará el default (es).
  const t = await getTranslations('notFound')
  const tCommon = await getTranslations('common.buttons')

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-black px-4 text-center">
      
      {/* Icono animado */}
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-zinc-900/50 border border-zinc-800 shadow-[0_0_40px_-10px_rgba(6,182,212,0.15)]">
        <FileQuestion className="h-12 w-12 text-cyan-500 animate-pulse" />
      </div>

      {/* Texto */}
      <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl mb-4">
        {/* 👇 Título (404) */}
        {t('title')}
      </h1>
      <h2 className="text-2xl font-semibold text-white mb-4">
        {/* 👇 Subtítulo (Page not found) */}
        {t('subtitle')}
      </h2>
      <p className="max-w-md text-lg text-zinc-400 mb-8 leading-relaxed">
        {/* 👇 Descripción detallada */}
        {t('description')}
      </p>

      {/* Botón de retorno */}
      <Button asChild size="lg" className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold">
        {/* Enlazamos a la raíz '/' y dejamos que el Middleware redirija al idioma correcto */}
        <Link href="/">
          <Home className="mr-2 h-4 w-4" /> {tCommon('backToHome')}
        </Link>
      </Button>

      {/* Decoración de fondo */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-cyan-900/5 blur-[100px]" />
      </div>
    </div>
  )
}
// =============== FIN ARCHIVO: src/app/(frontend)/not-found.tsx =============== //