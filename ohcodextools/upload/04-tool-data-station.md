# Especificación Técnica: OhCodex Data Station

## 1. Resumen del Producto

Una "Navaja Suiza" para desarrolladores y analistas de datos. Permite formatear, validar, convertir y comparar estructuras de datos (JSON, XML, YAML, CSV, SQL) directamente en el navegador.

**Valor Diferencial:**

1.  **Edición Profesional:** Usa el mismo motor que VS Code (Monaco Editor).
2.  **Privacidad Absoluta:** Los datos (que pueden ser sensibles/empresariales) nunca salen del navegador del usuario.
3.  **Bidireccional:** Convierte en ambas direcciones (ej: JSON a CSV y viceversa).

---

## 2. Stack Tecnológico & Restricciones

- **Framework:** Next.js 15 (App Router).
- **UI Library:** shadcn/ui (Tabs, Select, Button, Resizable Panels).
- **Editor de Código:** `@monaco-editor/react` (Imprescindible para resaltado de sintaxis, autocompletado y detección de errores).
- **Lógica de Datos:**
  - `papaparse` (para CSV).
  - `js-yaml` (para YAML).
  - `sql-formatter` (para SQL).
  - `diff` o `react-diff-viewer` (para el comparador).
- **Restricción:** Client-Side Only. Cero llamadas al backend para procesar datos.

---

## 3. Arquitectura de la Funcionalidad

La aplicación debe estructurarse en **Módulos/Pestañas Independientes** que comparten el mismo layout de "Doble Panel" (Entrada -> Salida).

### A. Módulo JSON (Formatter & Validator)

- **Input:** Editor de texto con soporte para JSON.
- **Acciones:**
  - **Prettify:** Formatear con indentación (2 o 4 espacios).
  - **Minify:** Eliminar espacios y saltos de línea.
  - **Validate:** Si el JSON es inválido, el editor debe mostrar la línea exacta del error (funcionalidad nativa de Monaco).
  - **Fix Common Errors:** (Opcional) Intentar arreglar comillas simples o comas sobrantes.

### B. Módulo Converter (La Matriz de Datos)

- Permite seleccionar **Origen** y **Destino**.
- **Soporte:** JSON, CSV, YAML, XML.
- **Lógica:**
  - JSON <-> CSV (Aplanar objetos si es necesario).
  - JSON <-> YAML.
  - JSON <-> XML.

### C. Módulo SQL (Beautifier)

- **Input:** Queries SQL desordenadas o en una sola línea.
- **Output:** SQL formateado, coloreado y legible.
- **Configuración:** Dialecto (Standard, PostgreSQL, MySQL).

### D. Módulo Diff (Comparador)

- **Layout:** Dos editores lado a lado ("Original" vs "Modificado").
- **Funcionalidad:** Resaltar en rojo/verde las líneas y caracteres que han cambiado.
- **Soporte:** Texto plano y JSON.

---

## 4. Interfaz de Usuario (UI/UX)

**Layout Principal:** Pantalla dividida usando `Resizable Panels` (componente de shadcn/ui) para que el usuario pueda ajustar el ancho del código de entrada y salida.

- **Header de Herramienta:**
  - Selector de Módulo (Tabs: JSON, Converter, SQL, Diff).
  - Toolbar de Acciones (Botones pequeños con iconos: Copiar, Descargar, Limpiar, Cargar Archivo).

- **Área de Trabajo:**
  - **Izquierda (Input):** Editor Monaco. Opción de pegar desde portapapeles o subir archivo.
  - **Derecha (Output):** Editor Monaco (Read-only por defecto, pero editable).

- **Feedback:**
  - Si hay error de sintaxis: Mostrar borde rojo y mensaje de error descriptivo en la parte inferior.
  - Si hay éxito: Pequeño indicador "Valid JSON" en verde.

---

## 5. Rutas y Estructura Sugerida

```text
src/
├── app/
│   └── tools/
│       └── data-station/
│           └── page.tsx
├── components/
│   └── tools/
│       └── data-station/
│           ├── editor-layout.tsx    # Wrapper con Resizable Panels
│           ├── toolbar.tsx          # Botones de acción
│           ├── modules/
│               ├── json-formatter.tsx
│               ├── data-converter.tsx
│               ├── sql-formatter.tsx
│               └── diff-checker.tsx
└── lib/
    ├── formatters.ts                # Lógica pura de formateo
    └── converters.ts                # Lógica de transformación (CSV, YAML...)
```

---

## 6. Requisitos SEO (Metadata)

- **Title:** Formateador JSON, Conversor CSV y SQL Online - OhCodex Data Station
- **Description:** Valida JSON, convierte CSV a JSON, formatea SQL y compara código. Herramientas para desarrolladores gratuitas, privadas y sin servidor.
- **Keywords:** json formatter online, csv to json converter, sql beautifier, diff checker online, yaml validator.

---

## 7. Nota para el Desarrollador

- **Monaco Editor:** Es una librería pesada. Asegúrate de cargarla de forma diferida (Lazy Loading) o usar el loader adecuado para que no bloquee la carga inicial de la página.
- **Performance:** Si el usuario pega un JSON de 10MB, el formateo no debe congelar la UI. Si es necesario, usa `setTimeout` o Web Workers para las operaciones de string pesadas.
- **Theme:** El editor debe respetar el tema de la web (Dark Mode) usando el tema 'vs-dark' de Monaco.

```

```
