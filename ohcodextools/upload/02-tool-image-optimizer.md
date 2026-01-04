### 📝 Resumen de la Herramienta 2: "OhCodex Pixel Optimizer"

Vamos a pedirle una suite que procese en cadena:

1.  **Input:** Lotes de imágenes.
2.  **Proceso 1 (Resize):** Redimensionar por píxeles o porcentaje.
3.  **Proceso 2 (Watermark):** Estampar logo/texto (opcional).
4.  **Proceso 3 (Privacidad):** Borrar metadatos EXIF (GPS, cámara, etc.).
5.  **Proceso 4 (Optimización):** Compresión y conversión a WebP/JPG/PNG.
6.  **Output:** Descarga individual o ZIP.

Todo en el cliente. Coste 0€.

Aquí tienes la especificación técnica lista para pasar a la IA.

---

Nombre del archivo: `02-tool-image-optimizer.md`

````markdown
# Especificación Técnica: OhCodex Pixel Optimizer

## 1. Resumen del Producto

Una suite completa de manipulación y optimización de imágenes que se ejecuta 100% en el navegador del usuario (Client-Side). Permite procesar lotes de imágenes (Batch processing) para reducir peso, cambiar formato, redimensionar, limpiar metadatos y añadir marcas de agua sin subir los archivos a ningún servidor.

**Objetivo:** Ofrecer la herramienta gratuita más rápida y privada del mercado, eliminando costes de servidor y tiempos de espera.

---

## 2. Stack Tecnológico & Restricciones

- **Framework:** Next.js 15 (App Router).
- **UI Library:** shadcn/ui (Sliders, Selects, Switch, Dialog, Progress).
- **Motor de Imagen:** **Canvas API** nativa de HTML5 o librerías ligeras como `browser-image-compression` y `react-image-file-resizer`.
- **Batching:** `jszip` para empaquetar múltiples descargas.
- **Restricción Crítica:** NO usar `sharp` ni API Routes del backend. Todo el procesamiento computacional debe ocurrir en el Thread principal o Web Workers del navegador.

---

## 3. Arquitectura de la Funcionalidad (El Pipeline)

La herramienta debe funcionar como una tubería de procesamiento. Cada imagen cargada pasa por estas fases configurables por el usuario:

1.  **Fase de Limpieza (Privacy):**
    - Eliminar automáticamente metadatos EXIF (GPS, Modelo de cámara, Fecha) al regenerar el Canvas.

2.  **Fase de Transformación (Edit):**
    - **Resize:** Permitir fijar un ancho/alto máximo (ej: 1920px) manteniendo el aspecto, o escalar por porcentaje (50%, 75%).
    - **Watermark (Marca de Agua):** Permitir subir una segunda imagen (logo) o escribir texto.
      - Controles: Opacidad, Posición (Esquinas/Centro) y Tamaño relativo.

3.  **Fase de Optimización (Compress):**
    - **Formato de Salida:** Selección de JPG, PNG o **WebP** (recomendado por defecto).
    - **Calidad:** Slider de 1 a 100.

---

## 4. Interfaz de Usuario (UI/UX)

La pantalla se divide en dos áreas: **Panel de Configuración** (Izquierda/Arriba) y **Zona de Trabajo** (Derecha/Abajo).

### A. Zona de Trabajo (Dropzone & Grid)

- Dropzone grande para arrastrar múltiples imágenes.
- **Lista de Imágenes:** Tarjetas pequeñas que muestran:
  - Thumbnail.
  - Nombre original.
  - Peso Original vs. Peso Estimado.
  - Estado (Pendiente, Procesando, Hecho).
- **Comparador (Visual):** Al hacer clic en una imagen procesada, abrir un modal con un slider "Antes / Después" para verificar la pérdida de calidad visual.

### B. Panel de Configuración (Global)

Los ajustes afectan a _todas_ las imágenes subidas (procesamiento por lotes).

- **Acordeón "Ajustes de Salida":** Formato (WebP/JPG/PNG) y Calidad (Slider).
- **Acordeón "Redimensionar":** Switch para activar. Inputs para Ancho/Alto.
- **Acordeón "Marca de Agua":** Switch para activar. Input File para logo o Input Text. Slider de opacidad.

### C. Acciones

- Botón "Procesar Todo".
- Botón "Descargar Todo (ZIP)" (aparece al finalizar).

---

## 5. Rutas y Estructura Sugerida

```text
src/
├── app/
│   └── tools/
│       └── image-compressor/
│           └── page.tsx
├── components/
│   └── tools/
│       └── image-compressor/
│           ├── dropzone.tsx
│           ├── settings-panel.tsx
│           ├── image-card.tsx
│           ├── comparison-modal.tsx
│           └── worker/          # Lógica intensiva
│               └── image-processor.ts
└── lib/
    └── image-utils.ts           # Helpers para Canvas y blobs
```
````

---

## 6. Requisitos SEO (Metadata)

- **Title:** Comprimir y Optimizar Imágenes Online (WebP, JPG) - OhCodex
- **Description:** Reducir peso de fotos, añadir marca de agua y convertir a WebP gratis. Procesamiento por lotes en tu navegador. Privado y sin límites.
- **Keywords:** comprimir imagen online, convertir a webp, marca de agua fotos, optimizar imagenes seo.

---

## 7. Nota para el Desarrollador

- **Performance:** Si el usuario sube 50 fotos, no bloquees el navegador. Procesa una a una (o en paralelo limitado) y muestra una barra de progreso general.
- **Watermark:** Asegúrate de que la marca de agua se escale proporcionalmente al tamaño de la imagen base (no queremos un logo gigante en una foto pequeña).
- **Calidad:** Para la compresión WebP, usa por defecto calidad 0.8 (80%), es el mejor balance peso/visual.

```

```
