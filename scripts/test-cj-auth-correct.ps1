# Script pour tester l'authentification CJ Dropshipping avec la bonne méthode
# Utilisation: .\scripts\test-cj-auth-correct.ps1

Write-Host "=== Test d'authentification CJ Dropshipping (méthode correcte) ===" -ForegroundColor Cyan
Write-Host ""

# Lire la clé API depuis .env.local
$envFile = ".env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "Erreur: Fichier .env.local introuvable" -ForegroundColor Red
    exit 1
}

$apiKey = ""
$clientId = ""
$clientSecret = ""

Get-Content $envFile | ForEach-Object {
    if ($_ -match '^CJ_API_KEY=(.+)$') {
        $apiKey = $matches[1].Trim()
    }
    if ($_ -match '^CJ_CLIENT_ID=(.+)$') {
        $clientId = $matches[1].Trim()
    }
    if ($_ -match '^CJ_CLIENT_SECRET=(.+)$') {
        $clientSecret = $matches[1].Trim()
    }
}

# Si pas de CJ_API_KEY directe, construire depuis CLIENT_ID et CLIENT_SECRET
if ([string]::IsNullOrEmpty($apiKey)) {
    if (-not [string]::IsNullOrEmpty($clientId) -and -not [string]::IsNullOrEmpty($clientSecret)) {
        $apiKey = "$clientId@api@$clientSecret"
        Write-Host "Clé API construite depuis CLIENT_ID et CLIENT_SECRET" -ForegroundColor Yellow
    }
}

if ([string]::IsNullOrEmpty($apiKey)) {
    Write-Host "Erreur: CJ_API_KEY ou (CJ_CLIENT_ID et CJ_CLIENT_SECRET) non trouvés dans .env.local" -ForegroundColor Red
    exit 1
}

Write-Host "Clé API: $apiKey" -ForegroundColor Cyan
Write-Host ""

# Tester l'authentification avec la bonne méthode
Write-Host "Test de l'authentification avec /api2.0/v1/authentication/getAccessToken..." -ForegroundColor Yellow

$body = @{
    apiKey = $apiKey
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body

    # Vérifier la structure de réponse
    if ($response.code -eq 200 -and $response.result -eq $true) {
        $accessToken = $response.data.accessToken
        
        if ($accessToken) {
            Write-Host "`n✅ Authentification réussie !" -ForegroundColor Green
            Write-Host "Token obtenu: $($accessToken.Substring(0, [Math]::Min(50, $accessToken.Length)))..." -ForegroundColor Green
            
            if ($response.data.accessTokenExpiryDate) {
                Write-Host "Expire le: $($response.data.accessTokenExpiryDate)" -ForegroundColor Green
            }
            
            if ($response.data.refreshToken) {
                Write-Host "Refresh Token disponible" -ForegroundColor Green
            }
            
            Write-Host "`n🎉 L'authentification fonctionne ! Vous pouvez maintenant synchroniser les produits." -ForegroundColor Green
            exit 0
        }
    }
    
    # Si on arrive ici, il y a un problème
    Write-Host "`n❌ Authentification échouée" -ForegroundColor Red
    Write-Host "Réponse: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor Red
    exit 1
    
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
        } catch {
            Write-Host "Réponse brute: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    }
    
    exit 1
}

