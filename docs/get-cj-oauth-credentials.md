# Obtenir les credentials OAuth2 CJ Dropshipping

## Problème

La "Clé API" affichée dans votre compte CJ (`CJ4868316@api@2efe4151cca04b34a0861396fc2a72b4`) n'est **pas la même chose** que les credentials OAuth2 (`client_id` et `client_secret`) nécessaires pour l'API OAuth2.

## Solution : Obtenir les credentials OAuth2

### Option 1 : Utiliser le Developer Portal (recommandé)

1. **Allez sur [CJ Dropshipping Developer Portal](https://developers.cjdropshipping.cn/)**
2. **Connectez-vous** avec votre compte CJ Dropshipping
3. **Créez ou configurez une application** :
   - Si vous avez déjà une application, allez dans ses paramètres
   - Si vous n'en avez pas, créez-en une nouvelle
4. **Trouvez la section "OAuth2" ou "API Credentials"** :
   - Vous devriez voir `Client ID` et `Client Secret` séparément
   - Ces valeurs sont différentes de la "Clé API" dans votre compte principal

### Option 2 : Extraire de la clé API (si applicable)

Si la clé API suit le format `CLIENT_ID@api@CLIENT_SECRET`, vous pouvez l'extraire :

```bash
# Format: CJ4868316@api@2efe4151cca04b34a0861396fc2a72b4
# Client ID = CJ4868316
# Client Secret = 2efe4151cca04b34a0861396fc2a72b4
```

**Mais attention :** Cette méthode peut ne pas fonctionner si CJ utilise un format différent pour l'OAuth2.

### Option 3 : Contacter le support CJ

Si vous ne trouvez pas les credentials OAuth2 :

1. **Contactez le support CJ Dropshipping** :
   - Via le chat dans votre compte CJ
   - Ou via email : support@cjdropshipping.com
2. **Demandez** :
   - "Comment obtenir les credentials OAuth2 (client_id et client_secret) pour l'API OAuth2 ?"
   - "Je dois utiliser l'endpoint `/api/oauth/token`, quels sont les credentials nécessaires ?"

## Vérifier les credentials obtenus

Une fois que vous avez les credentials OAuth2, testez-les :

```powershell
# Mettez à jour .env.local avec les nouveaux credentials
# Puis testez :
.\scripts\test-cj-auth.ps1
```

Si l'authentification réussit, vous verrez :
- ✅ Authentification réussie !
- Token obtenu: ...

## Configuration dans Supabase

Une fois que vous avez les bons credentials :

```bash
# Redéfinir les secrets dans Supabase
npx supabase secrets set CJ_CLIENT_ID=votre_vrai_client_id
npx supabase secrets set CJ_CLIENT_SECRET=votre_vrai_client_secret

# Redéployer l'Edge Function
npx supabase functions deploy sync-cj-products
```

## Différence entre "Clé API" et "Credentials OAuth2"

| Type | Format | Usage |
|------|--------|-------|
| **Clé API** | `CJ4868316@api@2efe4151cca04b34a0861396fc2a72b4` | Ancienne méthode d'authentification (peut-être) |
| **Credentials OAuth2** | `client_id` et `client_secret` séparés | Nouvelle API OAuth2 (`/api/oauth/token`) |

**Important :** L'API OAuth2 nécessite des `client_id` et `client_secret` séparés, pas la clé API combinée.

## Prochaines étapes

1. ✅ Trouvez les credentials OAuth2 dans le Developer Portal
2. ✅ Testez-les avec `.\scripts\test-cj-auth.ps1`
3. ✅ Configurez-les dans Supabase
4. ✅ Redéployez l'Edge Function
5. ✅ Testez la synchronisation depuis l'interface admin

