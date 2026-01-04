# Especificación Técnica: OhCodex PDF Studio

## 1. Resumen del Producto

Una estación de trabajo PDF integral ("All-in-One") que permite a los usuarios gestionar documentos PDF sin necesidad de instalar software. Combina organización visual, edición, firma y compresión en una sola interfaz fluida.

**Filosofía:** "Manipulación en el Navegador, Compresión en la Nube (Controlada)".
La mayoría de operaciones deben ser Client-Side para máxima privacidad y velocidad. Solo la compresión utilizará recursos del servidor bajo límites estrictos.

---

## 2. Stack Tecnológico & Restricciones

- **Framework:** Next.js 15 (App Router).
- **UI Library:** shadcn/ui (Toolbar, Dialog, Slider, Button, ScrollArea).
- **Drag & Drop:** `dnd-kit` (para reordenar páginas visualmente).
- **Motor PDF Cliente:** `pdf-lib` (para unir, separar, rotar y modificar metadatos) y `react-pdf` (para renderizar las miniaturas de las páginas en el navegador).
- **Firma:** `react-signature-canvas` o implementación nativa con Canvas API.
- **Motor Compresión (Server):** `z-ai-web-dev-sdk` (PDF Skill) o `ghostscript` vía Server Action.

---

## 3. Arquitectura de la Funcionalidad

La herramienta funciona como un **Editor de Estado**.

1.  **Carga:** El usuario sube el PDF.
2.  **Desglose:** El navegador renderiza cada página como una miniatura independiente en memoria.
3.  **Edición:** El usuario manipula el array de páginas (reordena, borra, rota).
4.  **Reconstrucción:** Al dar a "Descargar/Guardar", `pdf-lib` reconstruye un nuevo PDF basado en el estado actual.

### Límites de Seguridad (Coste)

- **Manipulación:** Sin límite (ocurre en el PC del usuario).
- **Compresión:** Límite duro de **20MB** por archivo para evitar saturación del servidor. Si el archivo es mayor, mostrar alerta: "Para archivos >20MB, contacta con soporte Enterprise".

---

## 4. Interfaz de Usuario (UI/UX)

**Layout:** Estilo "Aplicación de Escritorio" dentro de la web.

- **Barra Superior (Toolbar):** Botones de acción rápida -> [Subir Archivo] [Unir] [Dividir] [Comprimir] [Firmar].
- **Área Central (Work Area):** Grid de páginas.
- **Barra Lateral (Propiedades):** Opciones específicas según la herramienta seleccionada.

### Funcionalidades Detalladas:

1.  **Organizador Visual (Por defecto):**
    - Grid de thumbnails de todas las páginas.
    - Drag & drop para cambiar el orden.
    - Botones en cada página (hover): Rotar 90º, Eliminar página.

2.  **Firmar (Sign Mode):**
    - Al hacer clic en una página, se abre en "Vista Detalle".
    - Floating Action Button: "Añadir Firma".
    - Modal para dibujar firma o subir imagen (PNG transparente).
    - Permitir arrastrar y redimensionar la firma sobre el documento.

3.  **Comprimir (Compress Mode):**
    - Selector de nivel: Baja (72dpi), Media (150dpi), Alta (300dpi).
    - Botón "Comprimir". Esto envía el archivo al servidor (si pesa <20MB), lo procesa y devuelve el enlace de descarga.

4.  **Unir (Merge Mode):**
    - Permite subir _otro_ PDF adicional que se añade al final del Grid actual.

---

## 5. Rutas y Estructura Sugerida

```text
src/
├── app/
│   └── tools/
│       └── pdf-studio/
│           └── page.tsx
├── components/
│   └── tools/
│       └── pdf-studio/
│           ├── pdf-workspace.tsx    # Contenedor principal y gestión de estado
│           ├── page-grid.tsx        # Grid ordenable (dnd-kit)
│           ├── page-thumbnail.tsx   # Renderizado individual (react-pdf)
│           ├── toolbar.tsx          # Botones de acción
│           ├── sign-modal.tsx       # Canvas para firmar
│           └── actions/
│               └── compress-pdf.ts  # Server Action (Límite 20MB)
└── lib/
    └── pdf-utils.ts                 # Lógica de pdf-lib (rotar, merge, split)
```

---

## 6. Requisitos SEO (Metadata)

- **Title:** Editor PDF Online: Unir, Firmar y Comprimir - OhCodex PDF Studio
- **Description:** Herramienta gratuita para gestionar PDFs. Organiza páginas, firma documentos digitalmente y reduce el tamaño de archivo. Sin registro y seguro.
- **Keywords:** unir pdf online, firmar pdf gratis, organizar paginas pdf, comprimir pdf, rotar pdf.

---

## 7. Nota para el Desarrollador

- **Optimización de Memoria:** Renderizar PDFs en el navegador consume mucha RAM. Usa `react-pdf` con cuidado. Carga solo las miniaturas visibles o de baja resolución para el Grid.
- **Mobile:** En móviles, el Drag & Drop debe ser táctil. Asegúrate de que los botones de acción (Rotar/Borrar) sean suficientemente grandes (min 44px).
- **Compresión:** Si usas el SDK de IA o Ghostscript, asegúrate de limpiar los archivos temporales del servidor inmediatamente después de enviarlos al cliente para no llenar el disco.

```

```
