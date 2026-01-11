// src/components/shared/LanguageSwitcher.tsx
'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Globe, Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { getTranslatedSlug } from '@/app/actions/get-translated-slug'
import { routing } from '@/i18n/routing'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(false)

  const onSelectChange = async (nextLocale: string) => {
    setIsLoading(true)
    
    // 1. Analizar la ruta actual
    // Segmentos: ['', 'es', 'blog', 'categoria', 'ingenieria-software']
    const segments = pathname.split('/')
    const collectionSegment = segments[2] // 'products', 'blog', 'tools'
    const subSegment = segments[3]       // 'categoria', 'pagina', o el [slug] del post
    const lastSegment = segments[4]      // el [slug] si hay subsegmento

    let nextPath = pathname.replace(`/${locale}`, `/${nextLocale}`)

    try {
      // 2. LÓGICA PARA BLOG (NUEVA)
      if (collectionSegment === 'blog') {
        
        // Caso A: Paginación general (/blog/pagina/2 -> /blog/page/2)
        if (subSegment === 'pagina' || subSegment === 'page' || subSegment === 'seite') {
          const pageNum = lastSegment
          // @ts-ignore
          const translatedPageSegment = routing.pathnames['/blog/page/[pageNumber]'][nextLocale]
            .replace('/blog/', '')
            .replace('/[pageNumber]', '')
          
          nextPath = `/${nextLocale}/blog/${translatedPageSegment}/${pageNum}`
        }

        // Caso B: Categorías (/blog/categoria/slug -> /blog/category/slug)
        else if (subSegment === 'categoria' || subSegment === 'category' || subSegment === 'categorie' || subSegment === 'kategorie') {
          const catSlug = lastSegment || segments[3] // Maneja /categoria/slug y /categoria/slug/2
          const pageNum = segments[5]
          
          // @ts-ignore
          const translatedCatSegment = routing.pathnames['/blog/category/[category]'][nextLocale]
            .replace('/blog/', '')
            .replace('/[category]', '')
          
          nextPath = `/${nextLocale}/blog/${translatedCatSegment}/${catSlug}`
          if (pageNum) nextPath += `/${pageNum}`
        }

        // Caso C: Post Individual (/blog/mi-post -> /blog/my-post)
        else if (subSegment && !lastSegment) {
          const translatedSlug = await getTranslatedSlug('posts', subSegment, nextLocale)
          if (translatedSlug) {
            nextPath = `/${nextLocale}/blog/${translatedSlug}`
          }
        }
      } 
      
      // 3. LÓGICA PARA PRODUCTOS Y HERRAMIENTAS (Existente)
      else if (subSegment && ['products', 'tools'].includes(collectionSegment)) {
        const collectionMap: Record<string, 'products' | 'tools'> = {
          'products': 'products',
          'tools': 'tools'
        }
        const collection = collectionMap[collectionSegment]
        const translatedSlug = await getTranslatedSlug(collection, subSegment, nextLocale)
        if (translatedSlug) {
          nextPath = `/${nextLocale}/${collectionSegment}/${translatedSlug}`
        }
      }
    } catch (e) {
      console.error('Error traduciendo ruta, usando fallback por defecto', e)
    }

    // 4. Navegar
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
        <SelectItem value="es" className="focus:bg-zinc-900 focus:text-white cursor-pointer">Español</SelectItem>
        <SelectItem value="en" className="focus:bg-zinc-900 focus:text-white cursor-pointer">English</SelectItem>
        <SelectItem value="fr" className="focus:bg-zinc-900 focus:text-white cursor-pointer">Français</SelectItem>
        <SelectItem value="de" className="focus:bg-zinc-900 focus:text-white cursor-pointer">Deutsch</SelectItem>
        <SelectItem value="it" className="focus:bg-zinc-900 focus:text-white cursor-pointer">Italiano</SelectItem>
        <SelectItem value="pt" className="focus:bg-zinc-900 focus:text-white cursor-pointer">Português</SelectItem>
      </SelectContent>
    </Select>
  )
}