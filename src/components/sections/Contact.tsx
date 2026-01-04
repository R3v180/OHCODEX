'use client'

import React, { useActionState } from 'react'
import { submitContactForm } from '@/app/(frontend)/actions'
import { Button } from '@/components/ui/button'
import { Mail, MapPin, Loader2, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'

const initialState = {
  success: false,
  message: '',
}

export function ContactSection({ email }: { email: string }) {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)
  
  // 1. Hook de traducción cargando el namespace 'contactSection'
  const t = useTranslations('contactSection')
  
  const displayEmail = email || 'info@ohcodex.com'

  return (
    <section id="contacto" className="relative bg-black py-24 overflow-hidden border-t border-white/10">
      
      <div className="absolute right-0 bottom-0 -z-10 h-[600px] w-[600px] rounded-full bg-cyan-900/10 blur-[120px] opacity-50" />

      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* COLUMNA IZQUIERDA: Info */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
              {/* Título dinámico con estilo bicolor */}
              {t('title').split(' ').slice(0, 2).join(' ')} <br />
              <span className="text-cyan-500">{t('title').split(' ').slice(2).join(' ')}</span>
            </h2>
            <p className="text-lg text-zinc-400 mb-10 leading-relaxed">
              {t('subtitle')}
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-cyan-500 shadow-sm">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{t('directContact')}</h3>
                  <a href={`mailto:${displayEmail}`} className="text-zinc-500 mt-1 hover:text-cyan-400 transition-colors block">
                    {displayEmail}
                  </a>
                  <p className="text-zinc-600 text-sm mt-1">{t('response')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-cyan-500 shadow-sm">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{t('operations')}</h3>
                  <p className="text-zinc-500 mt-1">{t('location')}</p>
                  <p className="text-zinc-600 text-sm mt-1">{t('global')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Formulario */}
          <div className="bg-zinc-900/30 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
            {state.success ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                <div className="h-20 w-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                  <Send className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{t('form.sentTitle')}</h3>
                <p className="text-zinc-400 max-w-xs mx-auto">
                  {t('form.sentDesc')}
                </p>
              </div>
            ) : (
              <form action={formAction} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-zinc-300">{t('form.name')}</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder={t('form.namePlaceholder')}
                      className="w-full rounded-lg border border-zinc-800 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-zinc-300">{t('form.email')}</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder={t('form.emailPlaceholder')}
                      className="w-full rounded-lg border border-zinc-800 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="serviceType" className="text-sm font-medium text-zinc-300">{t('form.type')}</label>
                  <div className="relative">
                    <select
                      id="serviceType"
                      name="serviceType"
                      className="w-full rounded-lg border border-zinc-800 bg-black/40 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 appearance-none transition-all cursor-pointer"
                    >
                      <option value="pwa">{t('form.types.pwa')}</option>
                      <option value="saas">{t('form.types.saas')}</option>
                      <option value="api">{t('form.types.api')}</option>
                      <option value="other">{t('form.types.other')}</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                      <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-zinc-300">{t('form.details')}</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    placeholder={t('form.detailsPlaceholder')}
                    className="w-full rounded-lg border border-zinc-800 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 resize-none transition-all"
                  />
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <div className="flex items-center h-5">
                    <input
                      id="privacyAccepted"
                      name="privacyAccepted"
                      type="checkbox"
                      required
                      className="h-4 w-4 rounded border-zinc-700 bg-zinc-900/50 text-cyan-600 focus:ring-cyan-500/20 focus:ring-offset-0 cursor-pointer"
                    />
                  </div>
                  <label htmlFor="privacyAccepted" className="text-xs text-zinc-500 leading-relaxed cursor-pointer select-none">
                    {t('form.privacy')}
                  </label>
                </div>

                {state.message && !state.success && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center animate-in fade-in slide-in-from-top-1">
                    <span className="mr-2">⚠️</span> {state.message}
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full h-12 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-base shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)] transition-all hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.5)]"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t('form.processing')}
                    </>
                  ) : (
                    t('form.submit')
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}