# ==========================================
# SCRIPT DE MIGRACIÓN: OHCODEX TOOLS -> MAIN
# ==========================================

$Root = Get-Location
$SourceBase = "$Root\ohcodextools\src"
$DestBase = "$Root\src"

Write-Host "🚀 Iniciando migración de archivos..." -ForegroundColor Cyan
Write-Host "📂 Origen: $SourceBase"
Write-Host "📂 Destino: $DestBase"
Write-Host "--------------------------------"

# Lista de carpetas clave que hemos modificado/creado
$FoldersToMigrate = @(
    "lib\engines",              # Motores lógicos (Crypto, PDF, Image...)
    "components\tools",         # UI de las Herramientas (Vault, PDF Studio...)
    "components\sections",      # Secciones de la Home (Hero, Features...)
    "components\layout",        # Header y Footer arreglados
    "app\[locale]",             # Páginas traducidas (Blog, Home, Legales)
    "messages",                 # Archivos JSON de traducción
    "app\(frontend)"            # Actions y Not-found
)

foreach ($Folder in $FoldersToMigrate) {
    $SrcPath = Join-Path $SourceBase $Folder
    $DestPath = Join-Path $DestBase $Folder

    # 1. Verificar si el origen existe (por si acaso no guardaste alguno)
    if (Test-Path $SrcPath) {
        # 2. Crear destino si no existe
        if (-not (Test-Path $DestPath)) {
            New-Item -ItemType Directory -Force -Path $DestPath | Out-Null
            Write-Host "✨ Creada carpeta: $Folder" -ForegroundColor Yellow
        }

        # 3. Copiar recursivamente y forzar sobrescritura
        # Copiamos el *contenido* de la carpeta origen a la carpeta destino
        Copy-Item -Path "$SrcPath\*" -Destination $DestPath -Recurse -Force
        
        Write-Host "✅ Sincronizado: $Folder" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Saltado (No encontrado en origen): $Folder" -ForegroundColor DarkGray
    }
}

Write-Host "--------------------------------"
Write-Host "🎉 ¡Migración Completada! Todos los archivos están en /src" -ForegroundColor Cyan