# Guide de déploiement des Edge Functions Supabase

## Étape 1 : Installer Supabase CLI

### Sur Windows (PowerShell)

**⚠️ Important :** Supabase CLI ne peut PAS être installé via `npm install -g`. Utilisez une des méthodes suivantes :

#### Option 1 : Via Scoop (recommandé)

1. **Installer Scoop** (si pas déjà installé) :
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   irm get.scoop.sh | iex
   ```

2. **Ajouter le bucket Supabase** :
   ```powershell
   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
   ```

3. **Installer Supabase CLI** :
   ```powershell
   scoop install supabase
   ```

#### Option 2 : Téléchargement manuel

1. Allez sur [Releases Supabase CLI](https://github.com/supabase/cli/releases/latest)
2. Téléchargez `supabase_X.X.X_windows_amd64.zip`
3. Extrayez l'archive
4. Ajoutez le dossier au PATH ou placez `supabase.exe` dans un dossier accessible (ex: `C:\Program Files\Supabase\`)
5. Ajoutez le dossier au PATH système :
   - Ouvrez **Paramètres système** → **Variables d'environnement**
   - Ajoutez le chemin du dossier au PATH utilisateur

### Vérifier l'installation

```bash
supabase --version
```

## Étape 2 : Se connecter à Supabase

```bash
# Se connecter à votre compte Supabase
supabase login
```

Cela va ouvrir votre navigateur pour vous authentifier. Une fois connecté, vous pouvez lier votre projet.

## Étape 3 : Lier votre projet Supabase

```bash
# Initialiser Supabase (si pas déjà fait)
supabase init

# Lier votre projet Supabase
supabase link --project-ref votre-project-ref
```

**Comment trouver votre project-ref :**
1. Allez sur [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **General**
4. Copiez le **Reference ID** (ex: `abcdefghijklmnop`)

Ou utilisez directement l'URL de votre projet :

```bash
supabase link --project-ref votre-project-ref
```

## Étape 4 : Configurer les secrets (CJ_CLIENT_ID et CJ_CLIENT_SECRET)

### Option 1 : Via Supabase CLI (recommandé)

```bash
# Définir CJ_CLIENT_ID
supabase secrets set CJ_CLIENT_ID=votre_client_id

# Définir CJ_CLIENT_SECRET
supabase secrets set CJ_CLIENT_SECRET=votre_client_secret

# Vérifier les secrets définis
supabase secrets list
```

**Important :** Les secrets sont automatiquement disponibles dans les Edge Functions via `Deno.env.get()`.

### Option 2 : Via Supabase Dashboard

1. Allez sur [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **Edge Functions** → **Secrets**
4. Ajoutez les secrets :
   - **Name:** `CJ_CLIENT_ID`
   - **Value:** `votre_client_id`
5. Cliquez sur **Add Secret**
6. Répétez pour `CJ_CLIENT_SECRET`

### Secrets requis

Les Edge Functions ont besoin de ces secrets :

- `CJ_CLIENT_ID` - Votre Client ID CJ Dropshipping
- `CJ_CLIENT_SECRET` - Votre Client Secret CJ Dropshipping
- `SUPABASE_URL` - Automatiquement disponible (URL de votre projet)
- `SUPABASE_SERVICE_ROLE_KEY` - Automatiquement disponible

**Note :** `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont automatiquement injectés par Supabase, vous n'avez pas besoin de les définir manuellement.

## Étape 5 : Déployer les Edge Functions

### Déployer la fonction sync-cj-products

```bash
# Depuis la racine du projet
cd supabase

# Déployer la fonction
supabase functions deploy sync-cj-products

# Ou depuis la racine du projet
supabase functions deploy sync-cj-products --project-ref votre-project-ref
```

### Déployer toutes les fonctions

```bash
# Déployer toutes les fonctions
supabase functions deploy
```

### Fonctions disponibles

- `sync-cj-products` - Synchronise les produits depuis CJ Dropshipping
- `create-cj-order` - Crée une commande dans CJ Dropshipping
- `get-cj-tracking` - Récupère le suivi d'une commande

## Étape 6 : Vérifier le déploiement

### Tester la fonction

```bash
# Tester la fonction sync-cj-products
curl -X POST https://votre-projet.supabase.co/functions/v1/sync-cj-products \
  -H "Authorization: Bearer votre_anon_key" \
  -H "apikey: votre_anon_key" \
  -H "Content-Type: application/json" \
  -d '{"keyWord": "test", "maxPages": 1}'
```

### Voir les logs

```bash
# Voir les logs en temps réel
supabase functions logs sync-cj-products

# Voir les logs avec filtres
supabase functions logs sync-cj-products --follow
```

### Via Supabase Dashboard

1. Allez dans **Edge Functions**
2. Sélectionnez `sync-cj-products`
3. Vérifiez les logs et les métriques

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

### Erreur : "Unauthorized" ou "403"

**Solution :**
1. Vérifiez que vous utilisez la bonne clé API (`anon` key, pas `service_role`)
2. Vérifiez que l'URL de la fonction est correcte
3. Vérifiez que les headers sont bien envoyés :
   ```bash
   Authorization: Bearer votre_anon_key
   apikey: votre_anon_key
   ```

## Commandes utiles

```bash
# Lister toutes les fonctions déployées
supabase functions list

# Voir les détails d'une fonction
supabase functions describe sync-cj-products

# Supprimer une fonction
supabase functions delete sync-cj-products

# Voir les logs d'une fonction
supabase functions logs sync-cj-products

# Voir les secrets
supabase secrets list

# Supprimer un secret
supabase secrets unset CJ_CLIENT_ID
```

## Structure du projet

```
supabase/
├── functions/
│   ├── sync-cj-products/
│   │   └── index.ts
│   ├── create-cj-order/
│   │   └── index.ts
│   ├── get-cj-tracking/
│   │   └── index.ts
│   └── _shared/
│       └── cj-api/
│           ├── auth.ts
│           ├── client.ts
│           ├── index.ts
│           └── types.ts
└── config.toml
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

