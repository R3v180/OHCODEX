# 🗺️ ROADMAP OHCODEX v3.0: LA GUÍA MAESTRA (2026)

## 🏗️ CONTEXTO TÉCNICO ACTUAL

- **Frontend:** Next.js 15 (App Router) + React 19 (Stable target).
- **Estilos:** Tailwind CSS + Shadcn/UI + Framer Motion.
- **Backend/CMS:** Payload CMS 3.0 (Estructura Next.js nativa).
- **Base de Datos:** PostgreSQL alojado en Neon.tech (Serverless).
- **Internacionalización (i18n):** `next-intl` con rutas `/[locale]/` y diccionarios en `src/messages/*.json`.
- **Procesamiento:** Motores lógicos en el cliente (`src/lib/engines`) para garantizar privacidad total.

---

## 🔴 FASE 1: ESTABILIDAD DE CORE Y RENDIMIENTO CRÍTICO

_Objetivo: Eliminar errores de compilación y asegurar que la web cargue en menos de 1 segundo._

### 1.1. Lazy Loading de Componentes Pesados (Monaco Editor)

- **Qué:** Implementar `next/dynamic` en `DataStationTool.tsx`.
- **Por qué:** El editor de código Monaco pesa más de 1MB. Sin carga diferida, penaliza el SEO de la página de herramientas porque Google detecta una carga inicial lenta.
- **Cómo:**
  ```tsx
  const Editor = dynamic(() => import('@monaco-editor/react'), {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full" />,
  })
  ```

### 1.2. Saneamiento de Dependencias

- **Qué:** Actualizar `package.json` de versiones `beta` y `rc` a versiones estables (React 19, Payload 3.0).
- **Por qué:** Las versiones candidatas (RC) pueden tener fugas de memoria en entornos de producción como Heroku.

### 1.3. Optimización de i18n (Kebab-Case Strict)

- **Qué:** Auditar todos los archivos `es.json` y `en.json`.
- **Por qué:** Hemos detectado errores donde el código busca `pdfStudio` (camelCase) pero el JSON tiene `pdf-studio` (kebab-case).
- **Regla de Oro:** Todo namespace de herramienta en el JSON DEBE ser kebab-case.

---

## 🟠 FASE 2: UX TRANSFORMATION (DE "SOSO" A "PRO")

_Objetivo: Que un usuario sin conocimientos técnicos pueda usar las herramientas sin miedo._

### 2.1. El fin de la Pantalla Vacía (Placeholders e Inyección de Ejemplos)

- **Qué:** Añadir placeholders realistas en todos los `Textarea` y un botón de "Cargar ejemplo" (Load Sample).
- **Por qué:** Un usuario no siempre tiene un JSON a mano para probar **Data Station**. Si le das un botón de "Cargar ejemplo", verá la magia instantáneamente.
- **Implementación:** Añadir un objeto `const SAMPLES` en cada herramienta con datos de prueba.

### 2.2. Sistema de Guía Visual "3-Steps"

- **Qué:** Añadir un componente de cabecera en cada herramienta que resuma el proceso en 3 pasos.
- **Ejemplo (Vault):**
  1. Escribe o pega tu texto.
  2. Elige una contraseña fuerte.
  3. Copia tu código encriptado.
- **Por qué:** Reduce la carga cognitiva y hace que la herramienta parezca un flujo guiado.

### 2.3. Micro-interacciones de Confianza

- **Qué:** Añadir animaciones de "Éxito" (checkmarks verdes con Framer Motion) y feedback visual al arrastrar archivos (Dropzone borders que brillan en cian).
- **Por qué:** El usuario necesita sentir que la web "está viva" y que su acción ha tenido éxito.

---

## 🟡 FASE 3: MONETIZACIÓN Y GESTIÓN DE ANUNCIOS (ADMIN CONTROL)

_Objetivo: Controlar los ingresos desde el panel de administración sin tocar código._

### 3.1. Creación de la Global `AdvertisingSettings` en Payload

- **Qué:** Crear un panel en el Admin con los siguientes campos:
  - `enableAds` (Toggle): Activar/Desactivar todo.
  - `provider` (Select): Google AdSense / Carbon Ads / EthicalAds.
  - `headerScript` (Code): Para el script de carga de la red.
  - `slots` (Array): Lista de IDs de bloques publicitarios para Superior, Lateral e Inferior.
- **Por qué:** Permite cambiar de red publicitaria o apagar anuncios en segundos si detectas un problema de rendimiento.

### 3.2. Integración de Redes Publicitarias (Recomendación 2026)

- **Prioridad 1: Carbon Ads.** Por estética y relevancia (público tech).
- **Prioridad 2: EthicalAds.** Por respeto a la privacidad (encaja con los valores de OHCodex).
- **Prioridad 3: Google AdSense.** Como fallback si las anteriores no aceptan el sitio inicialmente.

### 3.3. Componente `AdSlot.tsx` Inteligente

- **Qué:** Modificar el componente actual para que lea la configuración de la Global del CMS.
- **Por qué:** Evita cargar contenedores vacíos y previene el "layout shift" (saltos en la página) reservando el espacio exacto del anuncio.

---

## 🟢 FASE 4: SEO DE AUTORIDAD Y "AI SEARCH OPTIMIZATION"

_Objetivo: Que Google nos dé estrellas y las IAs nos recomienden como "Mejor herramienta de 2026"._

### 4.1. Esquemas JSON-LD de Aplicación (Schema.org)

- **Qué:** Implementar el esquema `SoftwareApplication` en cada página de herramienta.
- **Por qué:** Para que en los resultados de búsqueda aparezca la categoría (Utilities), el precio (Free) y el sistema operativo (Web Browser).
- **Cómo:** Inyectar en el `<head>` mediante el objeto `metadata` de Next.js.

### 4.2. Estrategia de Contenido Semántico (SEO Long-Tail)

- **Qué:** Añadir 500+ palabras de texto útil DEBAJO de cada herramienta.
  - **Sección 1:** ¿Qué es [Nombre Herramienta] y para qué sirve?
  - **Sección 2:** Diferencias entre procesamiento local vs servidor (Vender privacidad).
  - **Sección 3:** FAQ (Preguntas Frecuentes) usando el componente `Accordion`.
- **Por qué:** Google no puede "leer" la lógica de JavaScript. Necesita texto HTML para indexar palabras clave como "encriptar archivos gratis online".

### 4.3. Marketing de Privacidad (Zero-Knowledge)

- **Qué:** Destacar en toda la web el sello: **"Privacy by Design: Tus archivos nunca tocan nuestro servidor"**.
- **Por qué:** Es el factor diferencial de OHCodex frente a herramientas que roban datos.

---

## 🔵 FASE 5: CONVERSIÓN (LEADS DE SOFTWARE A MEDIDA)

_Objetivo: Convertir al usuario de las herramientas gratuitas en cliente de consultoría._

### 5.1. Cross-Selling Dinámico

- **Qué:** Activar el `CrossSellBanner` al final de cada herramienta.
- **Contenido:** "¿Necesitas una arquitectura escalable como esta para tu empresa? Hablemos."
- **Por qué:** El usuario ya está validando tu capacidad técnica al usar la herramienta; es el momento perfecto para ofrecer tus servicios de desarrollo.

### 5.2. Seguridad en Captación (Captcha Turnstile)

- **Qué:** Integrar Cloudflare Turnstile en el `ContactSection`.
- **Por qué:** Es invisible (mejor UX que Google Captcha) y protege tu base de datos Neon de ataques de spam que podrían inflar tu factura cloud.

---

## 🟣 FASE 6: MANTENIMIENTO Y ESCALABILIDAD

### 6.1. Automatización de Backups

- **Qué:** Programar el script `src/scripts/local-backup.ts` mediante una GitHub Action o un CRON externo.
- **Por qué:** Seguridad ante desastres en Neon o errores humanos.

### 6.2. Monitoreo de Errores (Sentry)

- **Qué:** Instalar Sentry para capturar errores de los motores de procesamiento en los navegadores de los usuarios.

---

## 💡 NOTAS PARA LA IA (REGLAS DE DESARROLLO)

1.  **Archivos de Idioma:** No añadir textos directamente en los componentes. Siempre usar `t('clave')` y actualizar `es.json` y `en.json`.
2.  **Naming Convention:** Usar **kebab-case** para los archivos y las claves de traducción de herramientas (`image-optimizer`, `pdf-studio`).
3.  **Client-Side Priority:** Si una función puede ejecutarse en el navegador (crypto, resize, format), **debe** hacerse ahí. El servidor de Heroku solo debe servir el HTML inicial y la API de Payload.

---
