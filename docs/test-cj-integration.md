# Guide de test CJ Dropshipping

## Configuration actuelle

✅ **Variables configurées :**
- `CJ_CLIENT_ID` ✅
- `CJ_CLIENT_SECRET` ✅

⚠️ **Variables manquantes pour Supabase Edge Functions :**
- `NEXT_PUBLIC_SUPABASE_URL` ❌
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ❌

## Options de test

### Option 1 : Utiliser Supabase Edge Functions (recommandé)

1. **Configurer Supabase :**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=ton_anon_key
   ```

2. **Déployer les Edge Functions :**
   ```bash
   cd supabase
   supabase functions deploy sync-cj-products
   supabase functions deploy create-cj-order
   supabase functions deploy get-cj-tracking
   ```

3. **Tester via l'UI admin :**
   - Aller sur `https://0fa5d0e0758d.ngrok-free.app//admin/cj/products`
   - Cliquer sur "Synchroniser des produits"
   - Rechercher par mot-clé (ex: "Gua Sha")

### Option 2 : Utiliser l'API directe (sans Supabase)

Si tu veux tester sans Supabase, il faut modifier `lib/integrations/cj-dropshipping.ts` pour utiliser l'API directe quand Supabase n'est pas configuré.

## Tests à effectuer

### 1. Test de l'UI Admin

**Dashboard CJ :**
- URL: `https://0fa5d0e0758d.ngrok-free.app//admin/cj`
- Vérifier l'affichage des statistiques
- Vérifier les logs de synchronisation

**Synchronisation produits :**
- URL: `https://0fa5d0e0758d.ngrok-free.app//admin/cj/products`
- Tester la recherche de produits
- Synchroniser quelques produits
- Vérifier qu'ils apparaissent dans la liste

**Mapping produits :**
- URL: `https://0fa5d0e0758d.ngrok-free.app//admin/cj/mapping`
- Lier un produit local à un produit CJ
- Vérifier que le `cjVariantId` est sauvegardé

**Commandes CJ :**
- URL: `https://0fa5d0e0758d.ngrok-free.app//admin/cj/orders`
- Vérifier l'affichage des commandes
- Tester le refresh du tracking

### 2. Test de l'intégration webhook Stripe

**Prérequis :**
- Avoir un produit avec `cjVariantId` configuré
- OU avoir `CJ_DEFAULT_VARIANT_ID` dans `.env.local`

**Test :**
1. Créer une commande test via Stripe Checkout
2. Vérifier dans les logs que la commande est créée dans CJ
3. Vérifier dans la base de données que `cjOrderId` est rempli
4. Vérifier dans l'UI admin que la commande apparaît

### 3. Test via l'API

**Test de synchronisation :**
```bash
curl -X POST https://0fa5d0e0758d.ngrok-free.app//api/admin/cj/sync-products \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "keyWord": "Gua Sha",
    "pageSize": 10,
    "maxPages": 1
  }'
```

**Test de stats :**
```bash
curl https://0fa5d0e0758d.ngrok-free.app//api/admin/cj/stats \
  -H "Cookie: next-auth.session-token=..."
```

## Problèmes courants

### 1. "CJ integration not configured"
- Vérifier que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont configurés
- OU modifier le code pour utiliser l'API directe

### 2. "CJ variant ID not found"
- Configurer `CJ_DEFAULT_VARIANT_ID` dans `.env.local`
- OU mapper un produit via l'UI admin (`/admin/cj/mapping`)

### 3. "Edge Function error"
- Vérifier que les Edge Functions sont déployées sur Supabase
- Vérifier les logs Supabase pour plus de détails

## Checklist de test

- [ ] Configuration Supabase ou API directe
- [ ] Test de synchronisation produits
- [ ] Test de mapping produits
- [ ] Test de création commande via webhook
- [ ] Test de tracking commande
- [ ] Test de l'UI admin complète

