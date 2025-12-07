# exportar_codigo.py
import os

# --- CONFIGURACIÓN PARA FICHAFACIL ---

# Obtiene la ruta del directorio donde se encuentra este script.
# Esto hace que el script sea totalmente portable.
# <-- MODIFICADO (AHORA ES DINÁMICO)
base_dir = os.path.dirname(os.path.abspath(__file__))

# Nombre del archivo de salida. Se creará en la misma raíz del proyecto.
output_filename = "ohcodex-code.txt"
output_file = os.path.join(base_dir, output_filename)

# Nombre de este propio script para que se ignore a sí mismo.
# <-- AÑADIDO
script_name = os.path.basename(__file__)

# Extensiones de archivo a incluir.
valid_extensions = (
    ".ts", ".tsx", ".js", ".md", ".json", 
    ".html", ".css", ".prisma", ".svg"
)

# Archivos específicos a incluir por su nombre exacto.
specific_files_to_include = {
    '.env', 
    '.env.example', 
    '.gitignore', 
    'pnpm-workspace.yaml'
}

# Carpetas a ignorar.
ignored_dirs = {
    'node_modules', 
    '.git', 
    '.vscode', 
    'dist', 
    'build',
    '.next'
}
# --- FIN CONFIGURACIÓN ---

def main():
    """
    Función principal que escanea, recolecta y escribe el contenido
    de los archivos del proyecto en un único archivo de texto.
    """
    print(f"Iniciando escaneo de archivos en: {base_dir}")
    all_files = []
    
    for root, dirs, files in os.walk(base_dir, topdown=True):
        # Evita que os.walk entre en las carpetas ignoradas.
        dirs[:] = [d for d in dirs if d not in ignored_dirs]
        
        for file in files:
            # Ignora el propio script de exportación.
            # <-- AÑADIDO
            if file == script_name:
                continue
            
            # Incluye un archivo si su extensión es válida O si su nombre está en la lista específica.
            if file.endswith(valid_extensions) or file in specific_files_to_include:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, base_dir).replace(os.path.sep, '/')
                all_files.append((full_path, rel_path))

    # Ordena los archivos alfabéticamente.
    all_files.sort(key=lambda x: x[1])

    print(f"Se encontraron {len(all_files)} archivos válidos. Escribiendo en {output_file}...")
    
    try:
        with open(output_file, "w", encoding="utf-8") as outfile:
            # Escribe el índice de archivos.
            outfile.write("=" * 20 + "\n")
            outfile.write("ÍNDICE DE ARCHIVOS\n")
            outfile.write("=" * 20 + "\n\n")
            for idx, (_, rel_path) in enumerate(all_files, start=1):
                outfile.write(f"{idx}. {rel_path}\n")
            outfile.write("\n\n" + "=" * 50 + "\n\n")
            
            # Escribe el contenido de cada archivo.
            outfile.write("=" * 20 + "\n")
            outfile.write("CONTENIDO DE ARCHIVOS\n")
            outfile.write("=" * 20 + "\n\n")
            for idx, (full_path, rel_path) in enumerate(all_files, start=1):
                try:
                    with open(full_path, "r", encoding="utf-8", errors='ignore') as infile:
                        content = infile.read()
                    outfile.write(f"// {'='*10} [{idx}] {rel_path} {'='*10} //\n\n")
                    outfile.write(content)
                    outfile.write(f"\n\n// {'='*10} Fin de {rel_path} {'='*10} //\n\n")
                except Exception as e:
                    print(f"  ADVERTENCIA: No se pudo leer el archivo {full_path}: {e}")
                    outfile.write(f"// {'='*10} [{idx}] {rel_path} (ERROR DE LECTURA) {'='*10} //\n")
                    outfile.write(f"// No se pudo leer el archivo. Error: {e}\n\n")
                    
        print(f"¡Éxito! El archivo '{output_filename}' ha sido creado en la raíz del proyecto.")
    except Exception as e:
        print(f"ERROR FATAL al escribir el archivo de salida: {e}")

if __name__ == "__main__":
    main()