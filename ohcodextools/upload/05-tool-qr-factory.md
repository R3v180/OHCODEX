# Especificación Técnica: OhCodex QR & Barcode Factory

## 1. Resumen del Producto

Una suite de generación y escaneo de códigos de identificación visual (QR y Códigos de Barras) diseñada para uso profesional y comercial. Permite crear códigos personalizados con marca (logos, colores) y generar etiquetas de inventario estándar (EAN, UPC) con calidad vectorial para imprenta.

**Propuesta de Valor:** "Diseño profesional, descarga vectorial (SVG) y privacidad total. Sin marcas de agua de terceros."

---

## 2. Stack Tecnológico & Restricciones

- **Framework:** Next.js 15 (App Router).
- **UI Library:** shadcn/ui (Tabs, Select, Input, Slider, Color Picker, Card).
- **QR Engine:** `qrcode.react` (para renderizado React) o `qrcode` (librería base para más control sobre Canvas/SVG).
- **Barcode Engine:** `jsbarcode` (Estándar para EAN, UPC, Code128 en navegador).
- **Scanner Engine:** `html5-qrcode` (Para leer códigos desde archivos locales).
- **Descarga:** Funciones nativas para exportar Canvas a PNG/JPG y Nodos DOM a SVG.
- **Restricción:** Todo el renderizado ocurre en el Client-Side. Cero llamadas a APIs externas para generar los códigos.

---

## 3. Arquitectura de la Funcionalidad

La herramienta se divide en tres modos principales mediante pestañas:

### A. Generador QR "Pro"

Debe soportar tipos de datos estructurados:

1.  **Link/URL:** (Con opción interna de acortar visualmente si el texto es muy largo, aumentando el nivel de corrección de error).
2.  **WiFi:** Genera el string de conexión (SSID, Contraseña, Tipo de cifrado).
3.  **VCard:** Datos de contacto para escanear y guardar en el móvil.
4.  **WhatsApp:** Mensaje predefinido a un número.

**Personalización Visual (The Customizer):**

- **Colores:** Primer plano (Dots) y Fondo.
- **Estilo de Puntos:** Cuadrados, Redondeados, Puntos.
- **Logo:** Permitir subir imagen (PNG/JPG) y colocarla en el centro. _Nota: Al usar logo, forzar el "Error Correction Level" a High (H)._

### B. Generador de Códigos de Barras (Industria/Retail)

Enfoque funcional para inventarios y producto.

- **Formatos Soportados:**
  - **CODE128:** (Genérico, alfanumérico).
  - **EAN-13:** (Productos Europa).
  - **UPC:** (Productos USA).
- **Opciones:** Mostrar/Ocultar el texto numérico debajo, altura de barras, márgenes.

### C. Escáner / Lector (Utilidad)

- **Input:** Subir archivo de imagen (Drag & Drop).
- **Proceso:** Detectar si hay un QR o Barcode en la imagen y extraer el texto/datos raw.

---

## 4. Interfaz de Usuario (UI/UX)

**Layout de Pantalla Partida (Split Screen):**

- **Panel Izquierdo (Controles):**
  - Tabs principales: [Generador QR] | [Código Barras] | [Escanear].
  - Formularios dinámicos según el tipo seleccionado (ej: si es WiFi, mostrar campos de Red y Clave).
  - Acordeones para "Diseño y Colores" y "Logo".

- **Panel Derecho (Live Preview):**
  - Lienzo grande centrado donde se renderiza el código en tiempo real.
  - Si es Código de Barras, fondo blanco obligatorio para asegurar contraste.
  - **Barra de Herramientas de Exportación:**
    - Botón "Descargar PNG" (Alta resolución).
    - Botón "Descargar SVG" (Vectorial para imprenta - Característica Premium gratuita aquí).

---

## 5. Rutas y Estructura Sugerida

```text
src/
├── app/
│   └── tools/
│       └── qr-factory/
│           └── page.tsx
├── components/
│   └── tools/
│       └── qr-factory/
│           ├── qr-generator.tsx     # Lógica QR + Customizer
│           ├── barcode-generator.tsx # Lógica JsBarcode
│           ├── scanner-tab.tsx      # Lógica de lectura
│           ├── live-preview.tsx     # Lienzo de renderizado y descarga
│           └── controls/            # Inputs específicos (WiFiForm, VCardForm...)
└── lib/
    └── qr-utils.ts              # Helpers para formatear strings (VCard, WiFi)
```

---

## 6. Requisitos SEO (Metadata)

- **Title:** Generador de Códigos QR y Barras con Logo (SVG/PNG) - OhCodex
- **Description:** Crea QRs personalizados para WiFi, VCard y WhatsApp. Generador de códigos de barras EAN-13 y Code-128 para inventario. Descarga vectorial gratuita.
- **Keywords:** generador qr con logo, wifi qr code, codigo barras ean13, barcode generator svg, vcard qr online.

---

## 7. Nota para el Desarrollador

- **Reactividad:** El código debe regenerarse instantáneamente mientras el usuario escribe (Live Preview).
- **Calidad:** Al descargar en PNG, asegúrate de renderizar el canvas a un tamaño grande (mínimo 1000x1000px) para que no se pixele al imprimir.
- **Logo en QR:** Utiliza la propiedad `imageSettings` de `qrcode.react` para manejar la incrustación del logo correctamente sin romper la legibilidad del código.

```

```
