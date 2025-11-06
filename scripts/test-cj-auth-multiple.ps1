# Script pour tester différentes combinaisons d'authentification CJ Dropshipping
# Utilisation: .\scripts\test-cj-auth-multiple.ps1

$apiKey = "CJ4868316@api@2efe4151cca04b34a0861396fc2a72b4"
$parts = $apiKey -split '@api@'
$extractedClientId = $parts[0]
$extractedClientSecret = $parts[1]

Write-Host "=== Test d'authentification CJ Dropshipping ===" -ForegroundColor Cyan
Write-Host "Clé API: $apiKey" -ForegroundColor Yellow
Write-Host ""

function Test-Auth {
    param(
        [string]$testName,
        [string]$clientId,
        [string]$clientSecret
    )
    
    Write-Host "Test: $testName" -ForegroundColor Yellow
    Write-Host "  Client ID: $clientId" -ForegroundColor Cyan
    Write-Host "  Client Secret: $($clientSecret.Substring(0, [Math]::Min(15, $clientSecret.Length)))..." -ForegroundColor Cyan
    
    $body = "grant_type=client_credentials&client_id=$clientId&client_secret=$clientSecret"
    
    try {
        $response = Invoke-RestMethod -Uri "https://developers.cjdropshipping.com/api/oauth/token" `
            -Method Post `
            -ContentType "application/x-www-form-urlencoded" `
            -Body $body
        
        if ($response.access_token) {
            Write-Host "  ✅ SUCCÈS !" -ForegroundColor Green
            Write-Host "  Token: $($response.access_token.Substring(0, [Math]::Min(30, $response.access_token.Length)))..." -ForegroundColor Green
            Write-Host "  Expire dans: $($response.expires_in) secondes" -ForegroundColor Green
            return $true
        } else {
            Write-Host "  ❌ ÉCHEC" -ForegroundColor Red
            Write-Host "  Réponse: $($response | ConvertTo-Json)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "  ❌ ERREUR" -ForegroundColor Red
        if ($_.ErrorDetails.Message) {
            try {
                $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
                Write-Host "  Message: $($errorDetails.message)" -ForegroundColor Red
            } catch {
                Write-Host "  Message: $($_.ErrorDetails.Message)" -ForegroundColor Red
            }
        } else {
            Write-Host "  Message: $($_.Exception.Message)" -ForegroundColor Red
        }
        return $false
    }
    Write-Host ""
}

# Test 1: Parties extraites (méthode actuelle)
Write-Host "=== Test 1: Parties extraites ===" -ForegroundColor Cyan
$test1 = Test-Auth "Parties extraites" $extractedClientId $extractedClientSecret
Write-Host ""

# Test 2: Clé API complète comme client_id, secret extrait
Write-Host "=== Test 2: Clé API complète comme client_id ===" -ForegroundColor Cyan
$test2 = Test-Auth "Clé API complète comme client_id" $apiKey $extractedClientSecret
Write-Host ""

# Test 3: Clé API complète comme client_id, secret vide
Write-Host "=== Test 3: Clé API complète, secret vide ===" -ForegroundColor Cyan
$test3 = Test-Auth "Clé API complète, secret vide" $apiKey ""
Write-Host ""

# Test 4: Client ID extrait, clé API complète comme secret
Write-Host "=== Test 4: Client ID extrait, clé API complète comme secret ===" -ForegroundColor Cyan
$test4 = Test-Auth "Client ID extrait, clé API complète comme secret" $extractedClientId $apiKey
Write-Host ""

# Résumé
Write-Host "=== RÉSUMÉ ===" -ForegroundColor Cyan
if ($test1 -or $test2 -or $test3 -or $test4) {
    Write-Host "✅ Au moins une méthode a fonctionné !" -ForegroundColor Green
} else {
    Write-Host "❌ Aucune méthode n'a fonctionné." -ForegroundColor Red
    Write-Host "💡 Recommandation: Contactez le support CJ Dropshipping" -ForegroundColor Yellow
    Write-Host "   - Email: support@cjdropshipping.com" -ForegroundColor Yellow
    Write-Host "   - Ou via le chat dans votre compte CJ" -ForegroundColor Yellow
}

