// =============== INICIO ARCHIVO: src/components/shared/LanguageSwitcher.tsx =============== //
'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Globe, Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { getTranslatedSlug } from '@/app/actions/get-translated-slug'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(false)

  const onSelectChange = async (nextLocale: string) => {
    setIsLoading(true)
    
    // 1. Analizar la ruta actual
    // Ej: /es/products/mi-producto -> ['', 'es', 'products', 'mi-producto']
    const segments = pathname.split('/')
    const collectionSegment = segments[2] // 'products', 'blog', 'tools'
    const slugSegment = segments[3]

    let nextPath = pathname.replace(`/${locale}`, `/${nextLocale}`)

    // 2. Si estamos en una ruta dinámica, buscar el slug traducido
    if (slugSegment && ['products', 'blog', 'tools'].includes(collectionSegment)) {
      const collectionMap: Record<string, 'products' | 'posts' | 'tools'> = {
        'products': 'products',
        'blog': 'posts',
        'tools': 'tools'
      }

      const collection = collectionMap[collectionSegment]
      
      if (collection) {
        try {
          const translatedSlug = await getTranslatedSlug(collection, slugSegment, nextLocale)
          if (translatedSlug) {
            // Reemplazamos el slug antiguo por el nuevo en la ruta
            nextPath = `/${nextLocale}/${collectionSegment}/${translatedSlug}`
          }
        } catch (e) {
          console.error('Error traduciendo slug, usando fallback', e)
        }
      }
    }

    // 3. Navegar
    startTransition(() => {
      router.push(nextPath)
      setIsLoading(false)
    })
  }

  return (
    <Select defaultValue={locale} onValueChange={onSelectChange} disabled={isPending || isLoading}>
      <SelectTrigger className="w-[140px] bg-transparent border-zinc-800 text-zinc-400 hover:text-white focus:ring-0 focus:ring-offset-0">
        <div className="flex items-center gap-2">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
          <SelectValue placeholder="Idioma" />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-black border-zinc-800 text-zinc-400">
        <SelectItem value="es" className="focus:bg-zinc-900 focus:text-white cursor-pointer">
          Español
        </SelectItem>
        <SelectItem value="en" className="focus:bg-zinc-900 focus:text-white cursor-pointer">
          English
        </SelectItem>
        <SelectItem value="fr" className="focus:bg-zinc-900 focus:text-white cursor-pointer">
          Français
        </SelectItem>
        <SelectItem value="de" className="focus:bg-zinc-900 focus:text-white cursor-pointer">
          Deutsch
        </SelectItem>
        <SelectItem value="it" className="focus:bg-zinc-900 focus:text-white cursor-pointer">
          Italiano
        </SelectItem>
        <SelectItem value="pt" className="focus:bg-zinc-900 focus:text-white cursor-pointer">
          Português
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
// =============== FIN ARCHIVO: src/components/shared/LanguageSwitcher.tsx =============== //