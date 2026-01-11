// =============== INICIO ARCHIVO: src/components/shared/LanguageSwitcher.tsx =============== //
'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Globe } from 'lucide-react'
import { useTransition } from 'react'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const onSelectChange = (nextLocale: string) => {
    startTransition(() => {
      // 🛠️ FIX: Actualizamos el casting para incluir los 6 idiomas
      router.replace(pathname, { locale: nextLocale as "es" | "en" | "fr" | "de" | "it" | "pt" })
    })
  }

  return (
    <Select defaultValue={locale} onValueChange={onSelectChange} disabled={isPending}>
      <SelectTrigger className="w-[140px] bg-transparent border-zinc-800 text-zinc-400 hover:text-white focus:ring-0 focus:ring-offset-0">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
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