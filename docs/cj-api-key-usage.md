# Comment utiliser la Clé API CJ Dropshipping

## Problème

Vous avez une **Clé API** dans votre compte CJ (`CJ4868316@api@2efe4151cca04b34a0861396fc2a72b4`), mais l'authentification OAuth2 échoue avec cette clé.

## Format de la Clé API

Votre clé API suit le format : `CLIENT_ID@api@CLIENT_SECRET`

Exemple : `CJ4868316@api@2efe4151cca04b34a0861396fc2a72b4`
- **Client ID** : `CJ4868316`
- **Client Secret** : `2efe4151cca04b34a0861396fc2a72b4`

## Solutions possibles

### Solution 1 : Utiliser la clé API complète comme client_id

Certaines API utilisent la clé API complète comme `client_id` et un secret vide ou différent.

**Test 1 : Clé API complète comme client_id**
```powershell
# Test avec la clé API complète comme client_id
$clientId = "CJ4868316@api@2efe4151cca04b34a0861396fc2a72b4"
$clientSecret = "2efe4151cca04b34a0861396fc2a72b4"

# Test de l'authentification
$body = "grant_type=client_credentials&client_id=$clientId&client_secret=$clientSecret"
```

**Test 2 : Clé API complète comme client_id, secret vide**
```powershell
$clientId = "CJ4868316@api@2efe4151cca04b34a0861396fc2a72b4"
$clientSecret = ""
```

### Solution 2 : Extraire les parties séparément (déjà testé)

Vous avez déjà testé avec :
- Client ID: `CJ4868316`
- Client Secret: `2efe4151cca04b34a0861396fc2a72b4`

Mais cela a échoué avec "Authentication failed".

### Solution 3 : Contacter le support CJ Dropshipping

**C'est probablement la meilleure solution** car :

1. **La documentation OAuth2 n'est pas claire** sur comment utiliser la clé API
2. **Il n'y a pas de portail développeur visible** pour créer une application OAuth2
3. **Le support peut vous guider** sur la bonne méthode d'authentification

**Comment contacter le support :**

1. **Via le chat dans votre compte CJ** :
   - Allez dans votre compte CJ Dropshipping
   - Ouvrez le chat de support
   - Demandez : "Comment utiliser l'API OAuth2 avec ma clé API ? Je dois utiliser l'endpoint `/api/oauth/token`"

2. **Via email** :
   - Email : support@cjdropshipping.com
   - Sujet : "API OAuth2 Authentication - Comment obtenir client_id et client_secret"

3. **Via le lien "Contacter un agent"** dans votre compte

**Questions à poser au support :**

- "J'ai une clé API dans mon compte (`CJ4868316@api@2efe4151cca04b34a0861396fc2a72b4`). Comment l'utiliser pour l'authentification OAuth2 ?"
- "Quels sont les `client_id` et `client_secret` à utiliser avec l'endpoint `/api/oauth/token` ?"
- "Y a-t-il un portail développeur où je peux créer une application pour obtenir des credentials OAuth2 ?"

### Solution 4 : Vérifier si la clé API doit être activée

Peut-être que la clé API doit être **activée** ou **approuvée** avant de pouvoir l'utiliser.

**Vérifiez dans votre compte :**
1. Allez dans la section "Clé API"
2. Vérifiez s'il y a un bouton "Activer" ou "Approuver"
3. Vérifiez si la clé est "Active" ou "Inactive"

## Script de test amélioré

Voici un script qui teste plusieurs combinaisons possibles :

```powershell
# Script pour tester différentes combinaisons d'authentification
$apiKey = "CJ4868316@api@2efe4151cca04b34a0861396fc2a72b4"
$parts = $apiKey -split '@api@'
$extractedClientId = $parts[0]
$extractedClientSecret = $parts[1]

Write-Host "Test 1: Clé API complète comme client_id" -ForegroundColor Yellow
# Test ici...

Write-Host "Test 2: Parties extraites" -ForegroundColor Yellow
# Test ici...

Write-Host "Test 3: Clé API complète, secret extrait" -ForegroundColor Yellow
# Test ici...
```

## Documentation officielle

Consultez la documentation officielle CJ Dropshipping :

- [Documentation API CJ Dropshipping](https://developers.cjdropshipping.cn/en/api/api2/api/auth.html#_1-1-get-access-token-post)
- [Guide d'authentification](https://developers.cjdropshipping.cn/en/api/api2/api/auth.html)

## Prochaines étapes recommandées

1. ✅ **Contacter le support CJ Dropshipping** (méthode la plus fiable)
2. ✅ **Demander comment utiliser votre clé API** pour l'authentification OAuth2
3. ✅ **Demander si un portail développeur existe** pour créer une application OAuth2
4. ✅ **Une fois les bonnes credentials obtenues**, mettre à jour Supabase et redéployer

## Résumé

**Il n'y a pas de méthode claire pour créer une "application" sur CJ Dropshipping** comme pour d'autres services OAuth2. La clé API que vous avez dans votre compte est probablement ce qu'il faut utiliser, mais la méthode exacte n'est pas documentée publiquement.

**La meilleure solution est de contacter le support CJ Dropshipping** pour obtenir des instructions précises sur l'utilisation de l'API OAuth2.

