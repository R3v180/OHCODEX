// ========== src/app/(frontend)/privacidad/page.tsx ========== //

// -----------------------------------------------------------------------------
// Archivo: src/app/(frontend)/privacidad/page.tsx
// Versión: 1.0.0
// Descripción: Política de Privacidad (RGPD). Explica qué datos recogemos
// (del formulario de contacto), para qué y qué derechos tiene el usuario.
// -----------------------------------------------------------------------------

import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de tratamiento de datos personales de OHCodex.',
}

export default function PrivacidadPage() {
  return (
    <div className="bg-black min-h-screen py-24">
      <div className="container px-4 mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-8">Política de Privacidad</h1>
        
        <div className="prose prose-invert prose-zinc max-w-none">
          <p className="text-zinc-400 leading-relaxed mb-6">
            En OHCodex nos tomamos muy en serio la privacidad de tus datos. Esta Política de Privacidad describe cómo recogemos, utilizamos y protegemos la información personal que nos proporcionas a través de nuestro sitio web y servicios en fase Beta.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">1. Responsable del Tratamiento</h3>
          <p className="text-zinc-400 mb-4">
            <strong>Identidad:</strong> OHCodex (Proyecto tecnológico en Jávea, Alicante).<br />
            <strong>Email de contacto:</strong> info@ohcodex.com<br />
            <strong>Sitio Web:</strong> www.ohcodex.com
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">2. Finalidad del Tratamiento</h3>
          <p className="text-zinc-400 mb-4">
            En OHCodex tratamos la información que nos facilitan las personas interesadas con las siguientes finalidades:
          </p>
          <ul className="list-disc pl-6 text-zinc-400 space-y-2 mb-4">
            <li><strong>Gestión de Consultas:</strong> Atender las solicitudes de información recibidas a través del formulario de contacto (Presupuestos, dudas sobre PWAs, SaaS, etc.).</li>
            <li><strong>Acceso a Beta:</strong> Gestionar el acceso a las versiones de prueba de nuestros productos (como AquaClean o LoyalPyME) si solicitas acceso.</li>
            <li><strong>Comunicaciones:</strong> Enviar comunicaciones electrónicas relacionadas con nuestros servicios, siempre que hayas dado tu consentimiento expreso.</li>
          </ul>
          <p className="text-zinc-400 mb-4">
            No se tomarán decisiones automatizadas en base a dicho perfil (no usamos algoritmos para decidir si te respondemos o no).
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">3. Legitimación</h3>
          <p className="text-zinc-400 mb-4">
            La base legal para el tratamiento de tus datos es el <strong>consentimiento</strong>. Al rellenar el formulario de contacto y marcar la casilla "Acepto la política de privacidad", nos estás dando permiso explícito para tratar tus datos con el fin de responderte.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">4. Destinatarios de los datos</h3>
          <p className="text-zinc-400 mb-4">
            Tus datos no se cederán a terceros, salvo obligación legal. Sin embargo, para poder prestar nuestros servicios, utilizamos proveedores de infraestructura tecnológica (Encargados de Tratamiento) que pueden alojar datos:
          </p>
          <ul className="list-disc pl-6 text-zinc-400 space-y-2 mb-4">
            <li><strong>Hosting y Base de Datos:</strong> Render y Neon Tech (Proveedores de infraestructura en la nube).</li>
            <li><strong>Email:</strong> Proveedor de servicios de correo electrónico para gestionar las comunicaciones.</li>
          </ul>
          <p className="text-zinc-400 mb-4">
            Todos nuestros proveedores cumplen con las normativas de seguridad estándar del sector.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">5. Derechos del Usuario</h3>
          <p className="text-zinc-400 mb-4">
            Cualquier persona tiene derecho a obtener confirmación sobre si en OHCodex estamos tratando datos personales que les conciernan o no. Las personas interesadas tienen derecho a:
          </p>
          <ul className="list-disc pl-6 text-zinc-400 space-y-2 mb-4">
            <li>Acceder a sus datos personales.</li>
            <li>Solicitar la rectificación de los datos inexactos.</li>
            <li>Solicitar su supresión cuando, entre otros motivos, los datos ya no sean necesarios para los fines que fueron recogidos.</li>
            <li>Solicitar la limitación del tratamiento de sus datos.</li>
            <li>Oponerse al tratamiento.</li>
          </ul>
          <p className="text-zinc-400 mb-4">
            Para ejercer estos derechos, puedes enviar un email a <strong>info@ohcodex.com</strong>.
          </p>

          <p className="text-zinc-500 text-sm mt-12 pt-8 border-t border-zinc-800">
            Última actualización: Diciembre 2025
          </p>
        </div>
      </div>
    </div>
  )
}

// ========== Fin de src/app/(frontend)/privacidad/page.tsx ========== //