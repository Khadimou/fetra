# Script pour corriger le fichier .env.local en supprimant le BOM
# Utilisation: .\scripts\fix-env-local.ps1

$envFile = ".env.local"
$tempFile = ".env.local.tmp"

Write-Host "Lecture du fichier .env.local..." -ForegroundColor Yellow

# Lire le contenu du fichier
$content = Get-Content $envFile -Raw

# Supprimer le BOM (UTF-8 BOM)
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
$bytes = $utf8NoBom.GetBytes($content)
$content = $utf8NoBom.GetString($bytes)

# Écrire dans un fichier temporaire
[System.IO.File]::WriteAllText($tempFile, $content, $utf8NoBom)

Write-Host "Fichier temporaire créé. Fermez .env.local dans votre éditeur, puis appuyez sur Entrée pour continuer..." -ForegroundColor Yellow
Read-Host

# Remplacer l'ancien fichier
if (Test-Path $tempFile) {
    Move-Item -Path $tempFile -Destination $envFile -Force
    Write-Host "Fichier .env.local corrigé avec succès !" -ForegroundColor Green
} else {
    Write-Host "Erreur: Le fichier temporaire n'existe pas." -ForegroundColor Red
}

