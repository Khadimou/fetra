# Corriger l'erreur 401 "Invalid API key or access token"

## Problème

L'API CJ Dropshipping retourne une erreur **401** avec le message "Invalid API key or access token". Cela signifie que :

1. ✅ Les secrets sont bien configurés dans Supabase (on peut le voir avec `supabase secrets list`)
2. ❌ Mais les valeurs des secrets sont incorrectes ou contiennent des espaces

## Solution : Vérifier et corriger les secrets

### Étape 1 : Vérifier vos identifiants CJ

Assurez-vous d'avoir les **bons identifiants** depuis votre compte CJ Dropshipping :

1. Allez sur [CJ Dropshipping Developer Portal](https://developers.cjdropshipping.cn/)
2. Connectez-vous à votre compte
3. Allez dans votre application
4. Copiez le **Client ID** et le **Client Secret** (sans espaces)

### Étape 2 : Vérifier les valeurs actuelles

**Option A : Vérifier dans .env.local**

Ouvrez `.env.local` et vérifiez :

```env
CJ_CLIENT_ID=CJ4868316
CJ_CLIENT_SECRET=2efe4151cca04b34a0861396fc2a72b4
```

**⚠️ Important :**
- **Pas d'espaces** avant ou après le `=`
- **Pas d'espaces** à la fin de la valeur
- **Pas de guillemets** autour de la valeur

**Option B : Tester l'authentification directement**

Utilisez le script de test :

```powershell
.\scripts\test-cj-auth.ps1
```

Ou testez manuellement avec curl :

```bash
curl -X POST https://developers.cjdropshipping.com/api/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "client_credentials",
    "client_id": "VOTRE_CLIENT_ID",
    "client_secret": "VOTRE_CLIENT_SECRET"
  }'
```

Si ça retourne une erreur 401, vos identifiants sont incorrects.

### Étape 3 : Corriger les secrets dans Supabase

Si les identifiants dans `.env.local` sont corrects, **redéfinissez les secrets dans Supabase** en supprimant tous les espaces :

```bash
# Redéfinir CJ_CLIENT_ID (sans espaces)
supabase secrets set CJ_CLIENT_ID=CJ4868316

# Redéfinir CJ_CLIENT_SECRET (sans espaces)
supabase secrets set CJ_CLIENT_SECRET=2efe4151cca04b34a0861396fc2a72b4

# Vérifier les secrets
supabase secrets list
```

**⚠️ Important :** 
- Utilisez les valeurs **exactes** sans espaces
- Remplacez `CJ4868316` et `2efe4151cca04b34a0861396fc2a72b4` par vos **vraies valeurs**

### Étape 4 : Redéployer l'Edge Function

Après avoir corrigé les secrets, **redéployez** l'Edge Function :

```bash
npx supabase functions deploy sync-cj-products
```

### Étape 5 : Tester à nouveau

1. Allez sur `/admin/cj/products`
2. Entrez un mot-clé (ex: "Gua Sha")
3. Cliquez sur "Synchroniser"
4. Vérifiez les logs si l'erreur persiste

## Problèmes courants

### Problème 1 : Espaces dans les valeurs

**Symptôme :** Les secrets sont configurés mais l'API retourne 401

**Solution :**
```bash
# Lire les valeurs depuis .env.local (sans espaces)
$clientId = (Get-Content .env.local | Select-String "CJ_CLIENT_ID").ToString().Split('=')[1].Trim()
$clientSecret = (Get-Content .env.local | Select-String "CJ_CLIENT_SECRET").ToString().Split('=')[1].Trim()

# Afficher pour vérifier
Write-Host "Client ID: '$clientId'"
Write-Host "Client Secret: '$clientSecret'"

# Redéfinir dans Supabase (sans espaces)
npx supabase secrets set CJ_CLIENT_ID=$clientId
npx supabase secrets set CJ_CLIENT_SECRET=$clientSecret
```

### Problème 2 : Identifiants incorrects

**Symptôme :** Même après avoir redéfini les secrets, l'erreur 401 persiste

**Solution :**
1. Vérifiez que vous utilisez les **bons identifiants** depuis votre compte CJ Dropshipping
2. Vérifiez que l'application est **active** dans le Developer Portal
3. Testez l'authentification directement avec curl (voir Étape 2)

### Problème 3 : Secrets non synchronisés

**Symptôme :** Les secrets sont dans `.env.local` mais pas dans Supabase

**Solution :**
```bash
# Vérifier les secrets dans Supabase
npx supabase secrets list

# Si les secrets ne sont pas listés, les ajouter :
npx supabase secrets set CJ_CLIENT_ID=votre_client_id
npx supabase secrets set CJ_CLIENT_SECRET=votre_client_secret
```

## Vérification finale

Pour vérifier que tout fonctionne :

1. **Vérifiez les secrets** :
   ```bash
   npx supabase secrets list
   ```

2. **Testez l'authentification** :
   ```powershell
   .\scripts\test-cj-auth.ps1
   ```

3. **Vérifiez les logs de l'Edge Function** :
   ```bash
   npx supabase functions logs sync-cj-products --follow
   ```

4. **Testez la synchronisation** depuis l'interface admin

Si tout fonctionne, vous devriez voir :
- ✅ `CJ access token obtained`
- ✅ `Fetching page 1...`
- ✅ `Found X products`

## Commandes utiles

```bash
# Lister tous les secrets
npx supabase secrets list

# Redéfinir un secret
npx supabase secrets set CJ_CLIENT_ID=nouvelle_valeur

# Supprimer un secret (si besoin)
npx supabase secrets unset CJ_CLIENT_ID

# Redéployer l'Edge Function
npx supabase functions deploy sync-cj-products

# Voir les logs
npx supabase functions logs sync-cj-products --follow
```

