import os

# ==========================================
# CONFIGURACIÓN DEL SCRUBBER (LIMPIADOR)
# ==========================================

# 1. Directorio base (donde está el script)
base_dir = os.path.dirname(os.path.abspath(__file__))

# 2. Archivo de salida
output_filename = "ohcodex-code.txt"
output_file = os.path.join(base_dir, output_filename)

# 3. Carpetas PROHIBIDAS (Se ignoran recursivamente en cualquier lugar)
ignored_dirs = {
    # Dependencias y Build
    'node_modules', '.next', 'build', 'dist', 'out', 'coverage', '.vercel',
    # Sistema e IDEs
    '.git', '.vscode', '.idea', '__MACOSX',
    # Basura específica del Template SecureVault (RUIDO)
    'skills',   # Documentación del SDK, no es código de la app
    'examples', # Ejemplos de uso del SDK, no es código de la app
    'upload',   # Markdown de especificaciones, no es código
    'public',   # Assets binarios (imágenes, fuentes)
}

# 4. Extensiones PERMITIDAS (Solo queremos código fuente y config)
valid_extensions = (
    '.ts', '.tsx',   # TypeScript
    '.js', '.mjs', '.cjs', # JavaScript
    '.css', '.scss', # Estilos
    '.prisma',       # Base de datos
    '.json',         # Configuración (package.json, tsconfig.json)
    '.md'            # Documentación (README)
)

# 5. Archivos ESPECÍFICOS a INCLUIR (Aunque no cumplan extensión o estén ocultos)
# NOTA: Has pedido incluir .env explícitamente.
include_specific_files = {
    '.env',
    '.env.local',
    '.env.example',
    '.gitignore',
    'Dockerfile',
    'next.config.mjs',
    'next.config.ts',
    'tailwind.config.ts',
    'postcss.config.mjs'
}

# 6. Archivos ESPECÍFICOS a IGNORAR (Ruido masivo)
ignore_specific_files = {
    output_filename,       # El propio archivo generado
    os.path.basename(__file__), # Este script
    'package-lock.json',   # Ruido (miles de líneas)
    'pnpm-lock.yaml',      # Ruido
    'yarn.lock',           # Ruido
    'bun.lockb',           # Binario
    'next-env.d.ts',       # Autogenerado por Next.js
    '.DS_Store',           # Basura de Mac
    'README.md',           # A veces queremos el root, pero subcarpetas suelen ser ruido. (Lo dejamos opcional)
}

# ==========================================
# LÓGICA DEL SCRIPT
# ==========================================

def is_valid_file(filename):
    """Determina si un archivo debe ser incluido."""
    if filename in ignore_specific_files:
        return False
    if filename in include_specific_files:
        return True
    return filename.endswith(valid_extensions)

def main():
    print(f"🧹 Iniciando escaneo limpio en: {base_dir}")
    print(f"🚫 Ignorando carpetas basura: {', '.join(ignored_dirs)}")
    
    collected_files = []

    # Recorrer directorio
    for root, dirs, files in os.walk(base_dir, topdown=True):
        # Modificar dirs in-place para evitar entrar en carpetas ignoradas
        # Esto hace que os.walk sea mucho más rápido y no lea basura
        dirs[:] = [d for d in dirs if d not in ignored_dirs]

        for file in files:
            if is_valid_file(file):
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, base_dir).replace(os.path.sep, '/')
                collected_files.append((full_path, rel_path))

    # Ordenar alfabéticamente para mantener contexto ordenado
    collected_files.sort(key=lambda x: x[1])

    print(f"✅ Se encontraron {len(collected_files)} archivos limpios.")
    print("✍️  Generando archivo consolidado...")

    try:
        with open(output_file, "w", encoding="utf-8") as f:
            # 1. CABECERA E ÍNDICE
            f.write("==============================\n")
            f.write("ÍNDICE DE ARCHIVOS DEL PROYECTO\n")
            f.write("==============================\n\n")
            
            for idx, (_, rel_path) in enumerate(collected_files, 1):
                f.write(f"{idx}. {rel_path}\n")
            
            f.write("\n==================================================\n")
            f.write("\nINICIO DEL CONTENIDO\n")
            f.write("==================================================\n\n")

            # 2. CONTENIDO DE LOS ARCHIVOS
            for idx, (full_path, rel_path) in enumerate(collected_files, 1):
                try:
                    with open(full_path, "r", encoding="utf-8", errors='ignore') as infile:
                        content = infile.read()
                        
                    f.write(f"// =============== INICIO ARCHIVO [{idx}]: {rel_path} =============== //\n")
                    f.write(content)
                    # Asegurar un salto de línea al final si no lo tiene
                    if content and not content.endswith('\n'):
                        f.write('\n')
                    f.write(f"\n// =============== FIN ARCHIVO [{idx}]: {rel_path} =============== //\n\n")
                    
                except Exception as e:
                    print(f"⚠️ Error leyendo {rel_path}: {e}")
                    f.write(f"// ERROR LECTURA: {rel_path}\n\n")

        print(f"🎉 ¡Listo! Archivo generado: {output_filename}")
        print("   -> Súbelo al chat para comenzar a trabajar.")

    except Exception as e:
        print(f"❌ Error fatal escribiendo el archivo: {e}")

if __name__ == "__main__":
    main()