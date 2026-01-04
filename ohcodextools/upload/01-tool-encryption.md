# Especificación Técnica: OHCodex Vault (Herramienta de Encriptación Universal)

## 1. Resumen del Producto

Una herramienta de seguridad "Zero-Knowledge" que permite a los usuarios encriptar y desencriptar tanto texto plano como archivos binarios (imágenes, vídeos, PDF, documentos) directamente en su navegador.

**Objetivo Principal:** Garantizar privacidad total. Los datos nunca deben tocar el servidor. Todo el procesamiento ocurre en el cliente usando Web APIs.

---

## 2. Stack Tecnológico & Restricciones

- **Framework:** Next.js 15 (App Router).
- **Lenguaje:** TypeScript (Strict mode).
- **UI Library:** shadcn/ui (Tabs, Input, Textarea, Button, Progress, Alert).
- **Iconos:** Lucide React.
- **Estilos:** Tailwind CSS 4 (Dark mode por defecto, acento Cyan-500).
- **Criptografía:** `window.crypto.subtle` (Web Crypto API). **NO** usar librerías externas pesadas si la API nativa puede hacerlo (mayor rendimiento).

---

## 3. Arquitectura de la Funcionalidad

### A. Lógica de Criptografía (Core)

Se debe implementar una clase o hook utilitario (`useCrypto` o `CryptoEngine`) que maneje:

1.  **Derivación de Clave:** Usar **PBKDF2** para convertir la contraseña del usuario en una clave criptográfica robusta. Se debe generar un _Salt_ aleatorio para cada operación.
2.  **Algoritmo:** Usar **AES-GCM** (Galois/Counter Mode) de 256 bits. Es el estándar actual por seguridad y rendimiento.
3.  **Vector de Inicialización (IV):** Generar un IV único para cada encriptación.

### B. Estructura de Datos (Output de Archivos)

Para poder desencriptar y restaurar el archivo original correctamente, el archivo encriptado resultante (blob) debe contener una cabecera o estructura que combine:

- El _Salt_ usado.
- El _IV_ usado.
- Los datos encriptados.
- (Opcional pero recomendado) Metadatos del archivo original (nombre y tipo MIME) para restaurarlo automáticamente al desencriptar.

El archivo resultante debe descargarse con la extensión `.ohc` (ej: `contrato.pdf.ohc`).

---

## 4. Interfaz de Usuario (UI/UX)

La herramienta debe usar un componente `Tabs` para separar las dos funcionalidades principales:

### Tab 1: Texto

- **Input Area:** Textarea grande para pegar texto sensible.
- **Password Input:** Campo para la clave (con botón para ver/ocultar).
- **Acciones:** Botones "Encriptar" y "Desencriptar".
- **Output Area:** Textarea de solo lectura con el resultado en Base64. Botón de "Copiar al portapapeles".

### Tab 2: Archivos (La joya de la corona)

- **Dropzone:** Área grande y estilizada para arrastrar archivos. Debe aceptar cualquier tipo MIME.
- **Feedback:** Si el archivo es grande (>100MB), mostrar una barra de progreso real o simulada durante el procesamiento.
- **Flujo Encriptar:**
  1. Usuario sube archivo -> Pone clave -> Clic Encriptar.
  2. El navegador procesa el ArrayBuffer.
  3. Se descarga automáticamente el archivo `.ohc`.
- **Flujo Desencriptar:**
  1. Usuario sube archivo `.ohc` -> Pone clave -> Clic Desencriptar.
  2. El sistema intenta reconstruir el archivo original.
  3. Si la clave es incorrecta, capturar el error y mostrar un `toast` de error (Sonner).
  4. Si es correcta, descargar el archivo original con su extensión original recuperada.

---

## 5. Rutas y Estructura de Archivos Sugerida

Queremos mantener el proyecto modular.

```text
src/
├── app/
│   └── tools/
│       └── encrypt/
│           ├── page.tsx        # Layout, SEO y Contenedor principal
│           └── layout.tsx      # (Opcional si necesita layout específico)
├── components/
│   └── tools/
│       └── encrypt/
│           ├── encryption-tabs.tsx   # Componente principal de UI
│           ├── text-encryption.tsx   # Lógica UI Texto
│           ├── file-encryption.tsx   # Lógica UI Archivos
│           └── crypto-worker.ts      # (Opcional) Web Worker si se decide usar para no bloquear UI
└── lib/
    └── crypto-utils.ts         # Funciones puras de Web Crypto API
```

---

## 6. Requisitos SEO (Metadata)

- **Title:** Encriptar Texto y Archivos Online - OHCodex Vault
- **Description:** Herramienta gratuita de encriptación AES-256 en el navegador. Protege tus documentos, fotos y vídeos antes de enviarlos. Privacidad total, sin servidores.
- **Keywords:** encriptar archivos online, aes encryption online, proteger pdf, encriptar texto.

---

## 7. Nota para el Desarrollador (Expert Override)

Esta es la especificación base. Sin embargo, si como experto en Next.js y Web Performance consideras que:

1.  Es mejor usar **Web Workers** para evitar congelar la UI con archivos grandes (>500MB).
2.  Existe una forma más eficiente de manejar el _Stream_ de datos para no saturar la RAM del navegador.
3.  Hay una librería ligera (`tiny-aes` o similar) que garantice mejor compatibilidad que Web Crypto API en navegadores viejos (aunque preferimos nativo).

**Tienes libertad total para mejorar la arquitectura técnica**, siempre y cuando se respete la privacidad (Client-side only) y la estética del proyecto.

```

```
