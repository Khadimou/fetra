# Guide rapide : Déployer les Edge Functions et configurer CJ_CLIENT_ID

## Étape 1 : Installer Supabase CLI

### Option A : Via Scoop (recommandé pour Windows)

1. **Installer Scoop** (si pas déjà installé) :
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   irm get.scoop.sh | iex
   ```

2. **Installer Supabase CLI** :
   ```powershell
   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
   scoop install supabase
   ```

### Option B : Téléchargement manuel

1. Allez sur [Releases Supabase CLI](https://github.com/supabase/cli/releases/latest)
2. Téléchargez `supabase_X.X.X_windows_amd64.zip`
3. Extrayez l'archive
4. Ajoutez le dossier au PATH ou placez `supabase.exe` dans un dossier accessible

### Vérifier l'installation

```bash
supabase --version
```

## Étape 2 : Se connecter à Supabase

```bash
# Se connecter à votre compte Supabase
supabase login
```

Cela va ouvrir votre navigateur pour vous authentifier.

## Étape 3 : Lier votre projet Supabase

```bash
# Lier votre projet (remplacez par votre project-ref)
supabase link --project-ref votre-project-ref
```

**Comment trouver votre project-ref :**
1. Allez sur [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **General**
4. Copiez le **Reference ID** (ex: `abcdefghijklmnop`)

## Étape 4 : Configurer les secrets CJ_CLIENT_ID et CJ_CLIENT_SECRET

### Méthode 1 : Via Supabase CLI (recommandé)

```bash
# Définir CJ_CLIENT_ID
supabase secrets set CJ_CLIENT_ID=votre_client_id

# Définir CJ_CLIENT_SECRET
supabase secrets set CJ_CLIENT_SECRET=votre_client_secret

# Vérifier les secrets définis
supabase secrets list
```

**Important :** Remplacez `votre_client_id` et `votre_client_secret` par vos vraies valeurs.

### Méthode 2 : Via Supabase Dashboard

1. Allez sur [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **Edge Functions** → **Secrets**
4. Cliquez sur **Add Secret**
5. Ajoutez :
   - **Name:** `CJ_CLIENT_ID`
   - **Value:** `votre_client_id`
6. Cliquez sur **Add Secret**
7. Répétez pour `CJ_CLIENT_SECRET`

**Note :** Les secrets sont automatiquement disponibles dans les Edge Functions via `Deno.env.get('CJ_CLIENT_ID')` et `Deno.env.get('CJ_CLIENT_SECRET')`.

## Étape 5 : Déployer l'Edge Function

```bash
# Depuis la racine du projet
cd supabase

# Déployer la fonction sync-cj-products
supabase functions deploy sync-cj-products

# Ou depuis la racine du projet
supabase functions deploy sync-cj-products --project-ref votre-project-ref
```

### Déployer toutes les fonctions

```bash
# Déployer toutes les fonctions
supabase functions deploy
```

## Étape 6 : Vérifier le déploiement

### Voir les logs

```bash
# Voir les logs en temps réel
supabase functions logs sync-cj-products --follow
```

### Tester la fonction

```bash
# Tester avec curl (remplacez par vos valeurs)
curl -X POST https://votre-projet.supabase.co/functions/v1/sync-cj-products \
  -H "Authorization: Bearer votre_anon_key" \
  -H "apikey: votre_anon_key" \
  -H "Content-Type: application/json" \
  -d '{"keyWord": "test", "maxPages": 1}'
```

**Comment obtenir votre anon key :**
1. Allez sur [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **API**
4. Copiez la clé **anon public**

## Secrets requis

Les Edge Functions ont besoin de ces secrets :

- ✅ `CJ_CLIENT_ID` - Votre Client ID CJ Dropshipping
- ✅ `CJ_CLIENT_SECRET` - Votre Client Secret CJ Dropshipping
- ✅ `SUPABASE_URL` - Automatiquement disponible (injecté par Supabase)
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Automatiquement disponible (injecté par Supabase)

**Note :** `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont automatiquement injectés par Supabase, vous n'avez pas besoin de les définir manuellement.

## Commandes utiles

```bash
# Lister toutes les fonctions déployées
supabase functions list

# Voir les détails d'une fonction
supabase functions describe sync-cj-products

# Voir les logs d'une fonction
supabase functions logs sync-cj-products

# Voir les secrets
supabase secrets list

# Supprimer un secret
supabase secrets unset CJ_CLIENT_ID
```

## Résolution de problèmes

### Erreur : "CJ_CLIENT_ID and CJ_CLIENT_SECRET must be set"

**Solution :**
1. Vérifiez que les secrets sont bien définis :
   ```bash
   supabase secrets list
   ```
2. Si les secrets ne sont pas listés, redéployez la fonction après avoir défini les secrets :
   ```bash
   supabase secrets set CJ_CLIENT_ID=votre_client_id
   supabase secrets set CJ_CLIENT_SECRET=votre_client_secret
   supabase functions deploy sync-cj-products
   ```

### Erreur : "Function not found"

**Solution :**
1. Vérifiez que la fonction est bien déployée :
   ```bash
   supabase functions list
   ```
2. Si la fonction n'est pas listée, déployez-la :
   ```bash
   supabase functions deploy sync-cj-products
   ```

## Prochaines étapes

Une fois les Edge Functions déployées :

1. **Tester la synchronisation** depuis l'interface admin (`/admin/cj/products`)
2. **Vérifier les logs** pour s'assurer que tout fonctionne
3. **Configurer les variables d'environnement** dans votre projet Next.js :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
   ```

## Ressources

- [Documentation Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Documentation Supabase CLI](https://supabase.com/docs/reference/cli/introduction)
- [Guide CJ Dropshipping API](../docs/cj-list-products-api.md)

