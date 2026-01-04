````markdown
# 🗺️ ROADMAP TÉCNICO: FUSIÓN OHCODEX + TOOLS

**Objetivo:** Integrar la suite de herramientas SEO (Client-Side) en la arquitectura Next.js + Payload existente, migrando a una estructura internacionalizada (i18n).

---

## 🟢 FASE 0: PREPARACIÓN Y DEPENDENCIAS

_Objetivo: Preparar el terreno para que el código de las herramientas no falle al ser copiado._

### 0.1. Unificación de Dependencias

Instalar en el `package.json` raíz las librerías necesarias para las herramientas que actualmente solo existen en `ohcodextools`.

**Acción:** Ejecutar en la raíz:

```bash
npm install next-intl pdf-lib qrcode.react jsbarcode jszip @monaco-editor/react react-signature-canvas html5-qrcode papaparse framer-motion sonner
```
````

### 0.2. Estandarización UI (Shadcn)

Asegurar que el proyecto principal tiene todos los componentes UI que usan las herramientas.

- **Instalar/Verificar componentes:** `Tabs`, `Select`, `Slider`, `Switch`, `Dialog`, `Sonner` (Toast), `Progress`.
- _Nota:_ Usaremos la carpeta `src/components/ui` actual como fuente única de verdad.

---

## 🟡 FASE 1: BACKEND I18N (PAYLOAD CMS)

_Objetivo: Que la base de datos soporte múltiples idiomas antes de cambiar el frontend._

### 1.1. Configuración de Payload

- Modificar `src/payload.config.ts`.
- Añadir configuración de localización:
  ```typescript
  localization: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    fallback: true,
  },
  ```

### 1.2. Migración de Colecciones

- Editar `src/collections/Posts.ts`, `Products.ts`, `Legal.ts`.
- Añadir `localized: true` a los campos de texto (título, contenido, slug, extracto).
- **Script de Migración (Opcional):** Si hay mucho contenido, crear un script para copiar el contenido "sin idioma" al campo `es`. Si es poco, se puede hacer manual tras el despliegue.

---

## 🟠 FASE 2: ARQUITECTURA FRONTEND (ROUTING)

_Objetivo: Implementar la estructura de carpetas `[locale]` sin romper el Admin._

### 2.1. Configuración Next-Intl

- Crear `src/i18n.ts` (Configuración de solicitud).
- Crear `src/messages/es.json` y `src/messages/en.json`.
  - _Acción:_ Copiar los textos de `ohcodextools/src/messages/*.json` a estos archivos.

### 2.2. Middleware Inteligente

- Crear `src/middleware.ts`.
- **CRÍTICO:** Configurar el `matcher` para **EXCLUIR** las rutas de Payload.
  ```typescript
  export const config = {
    matcher: [
      '/((?!api|admin|_next|static|.*\\..*).*)', // Ignorar admin y api
    ],
  }
  ```

### 2.3. Migración de Rutas

1.  Crear carpeta `src/app/[locale]`.
2.  Mover todo el contenido de `src/app/(frontend)/*` adentro de `src/app/[locale]/`.
3.  Actualizar `src/app/[locale]/layout.tsx` para envolver la app en `NextIntlClientProvider`.

### 2.4. Refactorización de Enlaces

- Revisar `Header.tsx`, `Footer.tsx` y componentes internos.
- Cambiar `<Link href="/blog">` por uso de `Link` de `next-intl` o prefijar manualmente según el idioma actual.

---

## 🔵 FASE 3: INYECCIÓN DE HERRAMIENTAS (THE MERGE)

_Objetivo: Mover el código de las herramientas y adaptarlo al entorno principal._

### 3.1. Migración de Motores Lógicos

- Copiar carpeta `ohcodextools/src/lib/engines` -> `src/lib/engines`.
- Estos archivos son JS/TS puro, no deberían dar problemas.

### 3.2. Migración de Componentes de Herramientas

- Copiar `ohcodextools/src/components/tools` -> `src/components/tools`.
- **REFACTORIZACIÓN OBLIGATORIA:**
  - Abrir cada archivo de herramienta (ej: `VaultTool.tsx`).
  - Cambiar los imports de UI.
  - _De:_ `import { Button } from '@/components/ui/button'` (que apuntaba al otro proyecto).
  - _A:_ Asegurarse que apunta correctamente a la UI del proyecto principal.
  - Verificar que los estilos (Tailwind) sean coherentes con el modo oscuro de OHCodex (Negro puro vs Zinc gris).

### 3.3. Creación de Páginas

- Crear estructura de rutas en `src/app/[locale]/tools/`:
  - `/page.tsx` (Índice de herramientas)
  - `/vault/page.tsx`
  - `/pdf-studio/page.tsx`
  - Etc.
- Importar los componentes migrados en el paso 3.2.

---

## 🟣 FASE 4: LIMPIEZA Y SEO

_Objetivo: Pulir la fusión y asegurar indexación._

### 4.1. Generación de Metadatos

- Actualizar `generateMetadata` en las nuevas páginas de tools para usar `getTranslations` de `next-intl` (títulos dinámicos según idioma).

### 4.2. Sitemap Dinámico

- Actualizar `src/app/sitemap.ts`.
- Añadir lógica para generar URLs dobles (ES y EN) para cada ruta existente.

### 4.3. Limpieza

- Eliminar carpeta `ohcodextools`.
- Eliminar archivos de configuración duplicados (`tailwind.config` viejo, etc).

---

## 🛡️ ESTRATEGIA DE ROLLBACK

Si algo sale mal en producción:

1.  Mantener un backup de la base de datos de Production antes de desplegar la FASE 1.
2.  El código está versionado en Git: hacer revert al commit previo a la fusión de carpetas.

```

---

```
