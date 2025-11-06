# Corriger l'erreur BOM dans .env.local

## Problème

L'erreur `unexpected character '»' in variable name` est causée par un **BOM (Byte Order Mark)** au début du fichier `.env.local`. C'est un caractère invisible qui peut causer des problèmes de parsing.

## Solution 1 : Fermer le fichier et utiliser PowerShell

1. **Fermez le fichier `.env.local` dans votre éditeur** (VS Code, etc.)

2. **Exécutez cette commande PowerShell** :
   ```powershell
   $content = Get-Content .env.local -Raw
   $utf8NoBom = New-Object System.Text.UTF8Encoding $false
   [System.IO.File]::WriteAllText(".env.local", $content, $utf8NoBom)
   ```

3. **Relancez la commande** :
   ```bash
   npx supabase link --project-ref tjylxwnvrsopauibqkje
   ```

## Solution 2 : Utiliser le script fourni

1. **Fermez le fichier `.env.local` dans votre éditeur**

2. **Exécutez le script** :
   ```powershell
   .\scripts\fix-env-local.ps1
   ```

3. **Suivez les instructions** à l'écran

## Solution 3 : Ignorer temporairement le fichier

Si vous ne pouvez pas corriger le fichier maintenant, vous pouvez ignorer le fichier `.env.local` lors du link :

```bash
npx supabase link --project-ref tjylxwnvrsopauibqkje --ignore-env-file
```

**Note :** Cette option ignore le fichier `.env.local` mais vous devrez quand même configurer les variables d'environnement plus tard.

## Solution 4 : Recréer le fichier

1. **Fermez le fichier `.env.local` dans votre éditeur**

2. **Renommez le fichier** :
   ```powershell
   Rename-Item .env.local .env.local.backup
   ```

3. **Recréez le fichier** dans VS Code avec **UTF-8 sans BOM** :
   - Ouvrez VS Code
   - Créez un nouveau fichier `.env.local`
   - Copiez le contenu de `.env.local.backup`
   - **Important :** Assurez-vous que l'encodage est **UTF-8** (pas UTF-8 with BOM)
   - Dans VS Code, en bas à droite, cliquez sur l'encodage et sélectionnez **"Save with Encoding"** → **"UTF-8"**

4. **Supprimez le backup** :
   ```powershell
   Remove-Item .env.local.backup
   ```

## Vérifier que c'est corrigé

Après avoir corrigé le fichier, vérifiez que le lien fonctionne :

```bash
npx supabase link --project-ref tjylxwnvrsopauibqkje
```

Si ça fonctionne, vous devriez voir :
```
Linked to project tjylxwnvrsopauibqkje
```

## Pourquoi ça arrive ?

Le BOM (Byte Order Mark) est un caractère invisible ajouté par certains éditeurs pour indiquer l'encodage UTF-8. Certains outils (comme Supabase CLI) ne le supportent pas dans les fichiers `.env`.

**Prévention :** Toujours sauvegarder les fichiers `.env` en **UTF-8 sans BOM**.

