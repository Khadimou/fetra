# Configurer les secrets CJ Dropshipping dans Supabase

## Problème : Erreur 401 "Invalid API key or access token"

Cette erreur signifie que l'Edge Function Supabase ne peut pas accéder aux identifiants CJ Dropshipping ou que les identifiants sont incorrects.

## Étape 1 : Vérifier vos identifiants CJ

Assurez-vous d'avoir :
- **CJ_CLIENT_ID** : Votre Client ID CJ Dropshipping
- **CJ_CLIENT_SECRET** : Votre Client Secret CJ Dropshipping

**Où les trouver :**
1. Connectez-vous à [CJ Dropshipping Developer Portal](https://developers.cjdropshipping.cn/)
2. Allez dans votre application
3. Copiez le **Client ID** et le **Client Secret**

## Étape 2 : Vérifier les secrets dans .env.local

Vérifiez que votre fichier `.env.local` contient bien :

```env
CJ_CLIENT_ID=votre_client_id
CJ_CLIENT_SECRET=votre_client_secret
```

**⚠️ Important :**
- **Pas d'espaces** avant ou après le `=` 
- **Pas d'espaces** à la fin de la valeur
- **Pas de guillemets** autour de la valeur

**Exemple incorrect :**
```env
CJ_CLIENT_ID= CJ4868316        # ❌ Espace après =
CJ_CLIENT_ID="CJ4868316"       # ❌ Guillemets
CJ_CLIENT_ID=CJ4868316         # ⚠️ Espace à la fin (invisible)
```

**Exemple correct :**
```env
CJ_CLIENT_ID=CJ4868316
CJ_CLIENT_SECRET=2efe4151cca04b34a0861396fc2a72b4
```

## Étape 3 : Configurer les secrets dans Supabase

Les secrets doivent être configurés dans **Supabase**, pas seulement dans `.env.local`.

### Option A : Via Supabase CLI (recommandé)

```bash
# Vérifier que vous êtes lié au projet
supabase link --project-ref tjylxwnvrsopauibqkje

# Définir les secrets (remplacez par vos vraies valeurs)
supabase secrets set CJ_CLIENT_ID=CJ4868316
supabase secrets set CJ_CLIENT_SECRET=2efe4151cca04b34a0861396fc2a72b4

# Vérifier les secrets
supabase secrets list
```

**⚠️ Important :** 
- Supprimez **tous les espaces** avant de définir les secrets
- Utilisez les valeurs **exactes** de votre compte CJ Dropshipping

### Option B : Via Supabase Dashboard

1. Allez sur [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet (`tjylxwnvrsopauibqkje`)
3. Allez dans **Settings** → **Edge Functions** → **Secrets**
4. Cliquez sur **Add Secret**
5. Ajoutez :
   - **Name:** `CJ_CLIENT_ID`
   - **Value:** `CJ4868316` (votre vraie valeur, sans espaces)
6. Cliquez sur **Add Secret**
7. Répétez pour `CJ_CLIENT_SECRET`

## Étape 4 : Redéployer l'Edge Function

Après avoir configuré les secrets, **redéployez** l'Edge Function :

```bash
supabase functions deploy sync-cj-products
```

## Étape 5 : Vérifier les logs

Vérifiez que les secrets sont bien accessibles :

```bash
# Voir les logs en temps réel
supabase functions logs sync-cj-products --follow
```

Vous devriez voir :
- `Requesting new CJ access token` (pas d'erreur sur les secrets)
- `CJ access token obtained, expires in X seconds`

Si vous voyez :
- `CJ_CLIENT_ID and CJ_CLIENT_SECRET must be set` → Les secrets ne sont pas configurés
- `Failed to get CJ access token: 401` → Les identifiants sont incorrects

## Résolution de problèmes

### Erreur : "CJ_CLIENT_ID and CJ_CLIENT_SECRET must be set"

**Solution :**
1. Vérifiez que les secrets sont bien définis :
   ```bash
   supabase secrets list
   ```
2. Si les secrets ne sont pas listés, ajoutez-les :
   ```bash
   supabase secrets set CJ_CLIENT_ID=votre_client_id
   supabase secrets set CJ_CLIENT_SECRET=votre_client_secret
   ```
3. Redéployez la fonction :
   ```bash
   supabase functions deploy sync-cj-products
   ```

### Erreur : "Invalid API key or access token" (401)

**Solution :**
1. **Vérifiez que les identifiants sont corrects** :
   - Connectez-vous à [CJ Dropshipping Developer Portal](https://developers.cjdropshipping.cn/)
   - Vérifiez que le Client ID et Client Secret correspondent
   - Assurez-vous qu'il n'y a pas d'espaces dans les valeurs

2. **Vérifiez les secrets dans Supabase** :
   ```bash
   supabase secrets list
   ```
   - Vérifiez qu'il n'y a pas d'espaces avant/après les valeurs
   - Vérifiez que les valeurs correspondent exactement

3. **Testez l'authentification manuellement** :
   ```bash
   curl -X POST https://developers.cjdropshipping.com/api/oauth/token \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=client_credentials&client_id=VOTRE_CLIENT_ID&client_secret=VOTRE_CLIENT_SECRET"
   ```
   
   Si ça retourne une erreur, vos identifiants sont incorrects.

4. **Redéployez la fonction** après avoir corrigé les secrets :
   ```bash
   supabase functions deploy sync-cj-products
   ```

### Vérifier les espaces dans les valeurs

**Problème courant :** Espaces invisibles à la fin des valeurs.

**Solution :** Utilisez cette commande PowerShell pour nettoyer :

```powershell
# Lire les valeurs actuelles
$clientId = (Get-Content .env.local | Select-String "CJ_CLIENT_ID").ToString().Split('=')[1].Trim()
$clientSecret = (Get-Content .env.local | Select-String "CJ_CLIENT_SECRET").ToString().Split('=')[1].Trim()

# Afficher les valeurs (pour vérifier)
Write-Host "Client ID: '$clientId'" -ForegroundColor Yellow
Write-Host "Client Secret: '$clientSecret'" -ForegroundColor Yellow

# Redéfinir les secrets dans Supabase (sans espaces)
supabase secrets set CJ_CLIENT_ID=$clientId
supabase secrets set CJ_CLIENT_SECRET=$clientSecret
```

## Commandes utiles

```bash
# Lister tous les secrets
supabase secrets list

# Voir un secret spécifique (ne fonctionne pas, mais on peut vérifier avec list)
supabase secrets list | grep CJ_CLIENT

# Supprimer un secret (si besoin de le recréer)
supabase secrets unset CJ_CLIENT_ID
supabase secrets unset CJ_CLIENT_SECRET

# Redéployer toutes les fonctions
supabase functions deploy
```

## Vérification finale

Une fois tout configuré :

1. **Vérifiez les secrets** :
   ```bash
   supabase secrets list
   ```

2. **Testez la synchronisation** depuis l'interface admin (`/admin/cj/products`)

3. **Vérifiez les logs** :
   ```bash
   supabase functions logs sync-cj-products --follow
   ```

Si tout fonctionne, vous devriez voir :
- ✅ `CJ access token obtained`
- ✅ `Fetching page 1...`
- ✅ `Found X products`

