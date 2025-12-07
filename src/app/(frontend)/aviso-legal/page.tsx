// ========== src/app/(frontend)/aviso-legal/page.tsx ========== //

// -----------------------------------------------------------------------------
// Archivo: src/app/(frontend)/aviso-legal/page.tsx
// Versión: 1.0.0
// Descripción: Aviso Legal LSSI. Identifica al titular de la web.
// Adaptado para proyecto en fase de constitución / Beta.
// -----------------------------------------------------------------------------

import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aviso Legal',
  description: 'Información legal y titularidad del sitio web OHCodex.',
}

export default function AvisoLegalPage() {
  return (
    <div className="bg-black min-h-screen py-24">
      <div className="container px-4 mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-8">Aviso Legal</h1>
        
        <div className="prose prose-invert prose-zinc max-w-none">
          <p className="text-zinc-400 leading-relaxed mb-6">
            En cumplimiento con el deber de información recogido en artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI), a continuación se reflejan los siguientes datos:
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">1. Datos Identificativos</h3>
          <p className="text-zinc-400 mb-4">
            El titular de este sitio web (ohcodex.com) es el proyecto tecnológico denominado comercialmente <strong>OHCodex</strong>.
          </p>
          <ul className="list-none pl-0 text-zinc-400 space-y-2">
            <li><strong>Denominación:</strong> OHCodex (En proceso de constitución)</li>
            <li><strong>Domicilio:</strong> [Javea/Alicante], España</li>
            <li><strong>Correo electrónico de contacto:</strong> info@ohcodex.com</li>
            <li><strong>Actividad:</strong> Desarrollo de software y consultoría tecnológica.</li>
          </ul>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">2. Usuarios</h3>
          <p className="text-zinc-400 mb-4">
            El acceso y/o uso de este portal atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas. Las citadas Condiciones serán de aplicación independientemente de las Condiciones Generales de Contratación que en su caso resulten de obligado cumplimiento.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">3. Uso del Portal</h3>
          <p className="text-zinc-400 mb-4">
            OHCodex proporciona el acceso a multitud de informaciones, servicios, programas o datos (en adelante, "los contenidos") en Internet pertenecientes a OHCodex o a sus licenciantes a los que el USUARIO pueda tener acceso. El USUARIO asume la responsabilidad del uso del portal. Dicha responsabilidad se extiende al registro que fuese necesario para acceder a determinados servicios o contenidos.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">4. Propiedad Intelectual e Industrial</h3>
          <p className="text-zinc-400 mb-4">
            OHCodex es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma (a título enunciativo, imágenes, sonido, audio, vídeo, software o textos; marcas o logotipos, combinaciones de colores, estructura y diseño, selección de materiales usados, programas de ordenador necesarios para su funcionamiento, acceso y uso, etc.).
          </p>
          <p className="text-zinc-400 mb-4">
            Todos los derechos reservados. Quedan expresamente prohibidas la reproducción, la distribución y la comunicación pública, incluida su modalidad de puesta a disposición, de la totalidad o parte de los contenidos de esta página web, con fines comerciales, en cualquier soporte y por cualquier medio técnico, sin la autorización de OHCodex.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">5. Exclusión de Garantías y Responsabilidad</h3>
          <p className="text-zinc-400 mb-4">
            OHCodex no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos o lesivos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.
          </p>
          
          <p className="text-zinc-500 text-sm mt-12 pt-8 border-t border-zinc-800">
            Última actualización: Diciembre 2025
          </p>
        </div>
      </div>
    </div>
  )
}

// ========== Fin de src/app/(frontend)/aviso-legal/page.tsx ========== //