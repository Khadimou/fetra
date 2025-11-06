# Script pour tester l'authentification CJ Dropshipping
# Utilisation: .\scripts\test-cj-auth.ps1

Write-Host "Test d'authentification CJ Dropshipping" -ForegroundColor Yellow
Write-Host ""

# Lire les identifiants depuis .env.local
$envFile = ".env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "Erreur: Fichier .env.local introuvable" -ForegroundColor Red
    exit 1
}

$clientId = ""
$clientSecret = ""

Get-Content $envFile | ForEach-Object {
    if ($_ -match '^CJ_CLIENT_ID=(.+)$') {
        $clientId = $matches[1].Trim()
    }
    if ($_ -match '^CJ_CLIENT_SECRET=(.+)$') {
        $clientSecret = $matches[1].Trim()
    }
}

if ([string]::IsNullOrEmpty($clientId) -or [string]::IsNullOrEmpty($clientSecret)) {
    Write-Host "Erreur: CJ_CLIENT_ID ou CJ_CLIENT_SECRET non trouvés dans .env.local" -ForegroundColor Red
    exit 1
}

Write-Host "Client ID: $clientId" -ForegroundColor Cyan
Write-Host "Client Secret: $($clientSecret.Substring(0, [Math]::Min(10, $clientSecret.Length)))..." -ForegroundColor Cyan
Write-Host ""

# Tester l'authentification
Write-Host "Test de l'authentification..." -ForegroundColor Yellow

# Utiliser form-urlencoded comme dans la doc CJ
$body = "grant_type=client_credentials&client_id=$clientId&client_secret=$clientSecret"

try {
    $response = Invoke-RestMethod -Uri "https://developers.cjdropshipping.com/api/oauth/token" `
        -Method Post `
        -ContentType "application/x-www-form-urlencoded" `
        -Body $body

    if ($response.access_token) {
        Write-Host "`n✅ Authentification réussie !" -ForegroundColor Green
        Write-Host "Token obtenu: $($response.access_token.Substring(0, [Math]::Min(30, $response.access_token.Length)))..." -ForegroundColor Green
        Write-Host "Expire dans: $($response.expires_in) secondes" -ForegroundColor Green
        Write-Host "Type: $($response.token_type)" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Authentification échouée" -ForegroundColor Red
        Write-Host "Réponse: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor Red
    }
} catch {
    Write-Host "`n❌ Erreur lors de l'authentification" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        try {
            $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
            Write-Host "`nDétails de l'erreur:" -ForegroundColor Yellow
            Write-Host "  Code: $($errorDetails.code)" -ForegroundColor Red
            Write-Host "  Message: $($errorDetails.message)" -ForegroundColor Red
            Write-Host "  Result: $($errorDetails.result)" -ForegroundColor Red
            
            if ($errorDetails.message -match "Invalid API key") {
                Write-Host "`n⚠️  SOLUTION:" -ForegroundColor Yellow
                Write-Host "  Vos identifiants CJ sont incorrects ou invalides." -ForegroundColor Yellow
                Write-Host "  1. Vérifiez vos identifiants sur https://developers.cjdropshipping.cn/" -ForegroundColor Yellow
                Write-Host "  2. Assurez-vous que votre application est active" -ForegroundColor Yellow
                Write-Host "  3. Vérifiez qu'il n'y a pas d'espaces dans les valeurs" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "Réponse brute: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host "`nValeurs utilisées:" -ForegroundColor Yellow
    Write-Host "  Client ID: $clientId" -ForegroundColor Cyan
    Write-Host "  Client Secret: $($clientSecret.Substring(0, [Math]::Min(15, $clientSecret.Length)))..." -ForegroundColor Cyan
}

