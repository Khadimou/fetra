# Dépannage - Synchronisation CJ Dropshipping

## Erreur 500 lors de la synchronisation

Si vous obtenez une erreur 500 lors de la synchronisation des produits, voici les étapes de dépannage :

### 1. Vérifier les variables d'environnement

Assurez-vous d'avoir ces variables dans votre fichier `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```

**Comment obtenir ces valeurs :**
1. Allez sur [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **API**
4. Copiez :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Vérifier que l'Edge Function est déployée

L'Edge Function `sync-cj-products` doit être déployée sur Supabase.

**Pour déployer :**
```bash
cd supabase
supabase functions deploy sync-cj-products
```

**Vérifier les variables d'environnement de l'Edge Function :**
```bash
supabase secrets list
```

Assurez-vous d'avoir :
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CJ_CLIENT_ID`
- `CJ_CLIENT_SECRET`

**Pour définir les secrets :**
```bash
supabase secrets set CJ_CLIENT_ID=votre_client_id
supabase secrets set CJ_CLIENT_SECRET=votre_client_secret
```

### 3. Vérifier les logs

**Dans le terminal Next.js :**
- Regardez les logs pour voir l'erreur exacte
- Cherchez les messages commençant par "Error syncing CJ products:"

**Dans Supabase Dashboard :**
1. Allez dans **Edge Functions** → **Logs**
2. Sélectionnez `sync-cj-products`
3. Vérifiez les erreurs récentes

### 4. Tester la connexion Supabase

Vous pouvez tester si Supabase est accessible depuis votre API :

```bash
curl -X POST https://votre-projet.supabase.co/functions/v1/sync-cj-products \
  -H "Authorization: Bearer votre_anon_key" \
  -H "apikey: votre_anon_key" \
  -H "Content-Type: application/json" \
  -d '{"keyWord": "test", "maxPages": 1}'
```

### 5. Erreurs courantes

#### "CJ Dropshipping integration not configured"
- **Cause** : Variables d'environnement manquantes
- **Solution** : Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont définies

#### "Edge Function error (404)"
- **Cause** : L'Edge Function n'est pas déployée
- **Solution** : Déployez l'Edge Function avec `supabase functions deploy sync-cj-products`

#### "Edge Function error (500)"
- **Cause** : Erreur dans l'Edge Function (probablement variables d'environnement manquantes côté Supabase)
- **Solution** : Vérifiez les secrets Supabase (CJ_CLIENT_ID, CJ_CLIENT_SECRET)

#### "Failed to connect to Supabase Edge Function"
- **Cause** : URL Supabase incorrecte ou problème réseau
- **Solution** : Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` est correcte et accessible

### 6. Redémarrer le serveur

Après avoir modifié les variables d'environnement, **redémarrez le serveur Next.js** :

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez :
npm run dev
```

### 7. Vérifier l'authentification admin

Assurez-vous d'être connecté en tant qu'admin :
- La session doit avoir `role: 'ADMIN'` ou `role: 'SUPER_ADMIN'`
- Vérifiez dans `/api/admin/me`

## Messages d'erreur améliorés

Les messages d'erreur sont maintenant plus détaillés :
- **En développement** : Affiche la stack trace complète
- **En production** : Affiche uniquement le message d'erreur

Si vous voyez une erreur dans l'interface, cliquez sur "Détails de l'erreur (développement)" pour voir plus d'informations.

## Besoin d'aide ?

Si le problème persiste :
1. Vérifiez les logs du serveur Next.js
2. Vérifiez les logs Supabase Edge Functions
3. Vérifiez que toutes les variables d'environnement sont définies
4. Vérifiez que l'Edge Function est bien déployée

