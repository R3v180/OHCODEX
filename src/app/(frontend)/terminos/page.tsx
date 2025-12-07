// ========== src/app/(frontend)/terminos/page.tsx ========== //

// -----------------------------------------------------------------------------
// Archivo: src/app/(frontend)/terminos/page.tsx
// Versión: 1.0.0
// Descripción: Términos y Condiciones de Uso. Vital para proyectos en Beta.
// Establece las reglas del juego y limita la responsabilidad civil.
// -----------------------------------------------------------------------------

import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: 'Condiciones de uso de los servicios y software de OHCodex.',
}

export default function TerminosPage() {
  return (
    <div className="bg-black min-h-screen py-24">
      <div className="container px-4 mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-8">Términos y Condiciones</h1>
        
        <div className="prose prose-invert prose-zinc max-w-none">
          <p className="text-zinc-400 leading-relaxed mb-6">
            Bienvenido a OHCodex. Al acceder a nuestro sitio web o utilizar nuestros servicios de software (incluyendo versiones Beta), aceptas cumplir y estar sujeto a los siguientes términos y condiciones.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">1. Objeto y Aceptación</h3>
          <p className="text-zinc-400 mb-4">
            Estos términos regulan el uso del sitio web <strong>ohcodex.com</strong> y el acceso a los productos de software desarrollados por OHCodex (como AquaClean, LoyalPyME o Pool-Control). El uso de estos servicios implica la aceptación plena de estas condiciones.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">2. Software en Fase "Beta"</h3>
          <p className="text-zinc-400 mb-4">
            Algunos de nuestros productos se ofrecen en modalidad "Beta" o "En Desarrollo". Al utilizar estos servicios, reconoces y aceptas que:
          </p>
          <ul className="list-disc pl-6 text-zinc-400 space-y-2 mb-4">
            <li>El software puede contener errores (bugs), fallos de funcionamiento o características incompletas.</li>
            <li>El software se proporciona <strong>"TAL CUAL" (AS IS)</strong> y <strong>"SEGÚN DISPONIBILIDAD"</strong>, sin garantías de ningún tipo, expresas o implícitas.</li>
            <li>OHCodex no garantiza que el servicio sea ininterrumpido o esté libre de errores.</li>
            <li>Se recomienda no utilizar el software Beta con datos críticos sin realizar copias de seguridad externas.</li>
          </ul>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">3. Propiedad Intelectual</h3>
          <p className="text-zinc-400 mb-4">
            Todo el código fuente, bases de datos, diseño gráfico, interfaces de usuario y documentación de nuestros productos son propiedad exclusiva de OHCodex (Olivier Hottelet). No se permite la ingeniería inversa, descompilación o redistribución del software sin autorización expresa.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">4. Limitación de Responsabilidad</h3>
          <p className="text-zinc-400 mb-4">
            En la máxima medida permitida por la ley aplicable, OHCodex no será responsable por daños directos, indirectos, incidentales, especiales o consecuentes (incluyendo, sin limitación, daños por pérdida de beneficios, pérdida de datos o interrupción de negocio) que surjan del uso o la imposibilidad de uso de nuestro software o sitio web.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">5. Modificaciones</h3>
          <p className="text-zinc-400 mb-4">
            OHCodex se reserva el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en este sitio web. Asimismo, nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto del servicio en cualquier momento.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">6. Legislación Aplicable</h3>
          <p className="text-zinc-400 mb-4">
            Estos términos se regirán e interpretarán de acuerdo con la legislación española. Para cualquier controversia que pudiera derivarse del acceso o uso del sitio, ambas partes se someten a los juzgados y tribunales de Dénia/Alicante (España).
          </p>

          <p className="text-zinc-500 text-sm mt-12 pt-8 border-t border-zinc-800">
            Última actualización: Diciembre 2025
          </p>
        </div>
      </div>
    </div>
  )
}

// ========== Fin de src/app/(frontend)/terminos/page.tsx ========== //