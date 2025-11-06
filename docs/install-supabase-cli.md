# Installation de Supabase CLI

## Méthode 1 : Via npm (recommandé sur Windows)

Si vous avez Node.js installé :

```bash
npm install -g supabase
```

Vérifiez l'installation :
```bash
supabase --version
```

## Méthode 2 : Téléchargement manuel

### Windows

1. Allez sur [Releases Supabase CLI](https://github.com/supabase/cli/releases)
2. Téléchargez `supabase_X.X.X_windows_amd64.zip`
3. Extrayez l'archive
4. Ajoutez le dossier au PATH système ou placez `supabase.exe` dans un dossier accessible

### Vérifier l'installation

```bash
supabase --version
```

## Après l'installation

Une fois Supabase CLI installé, suivez le guide de déploiement :

[Guide de déploiement des Edge Functions](./deploy-edge-functions.md)

## Commandes de base

```bash
# Se connecter à Supabase
supabase login

# Lier votre projet
supabase link --project-ref votre-project-ref

# Définir les secrets
supabase secrets set CJ_CLIENT_ID=votre_client_id
supabase secrets set CJ_CLIENT_SECRET=votre_client_secret

# Déployer les fonctions
supabase functions deploy sync-cj-products
```

