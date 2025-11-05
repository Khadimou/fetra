# 🧪 Guide de test CJ Dropshipping - FETRA

## ✅ Configuration actuelle

**Variables configurées dans `.env.local` :**
- ✅ `CJ_CLIENT_ID=CJ4868316`
- ✅ `CJ_CLIENT_SECRET=2efe4151cca04b34a0861396fc2a72b4`

**Variables manquantes pour Supabase Edge Functions :**
- ❌ `NEXT_PUBLIC_SUPABASE_URL` (optionnel)
- ❌ `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optionnel)

## 🚀 Démarrage rapide

### 1. Démarrer le serveur
```bash
npm run dev
```

### 2. Tester l'UI Admin

**Page Dashboard CJ :**
- URL: `http://localhost:3000/admin/cj`
- Vérifier l'affichage des statistiques
- Si Supabase n'est pas configuré, tu verras un message d'erreur

**Page Synchronisation produits :**
- URL: `http://localhost:3000/admin/cj/products`
- Fonctionnalités :
  - Recherche de produits par mot-clé
  - Synchronisation depuis CJ Dropshipping
  - Affichage des produits synchronisés

**Page Mapping produits :**
- URL: `http://localhost:3000/admin/cj/mapping`
- Fonctionnalités :
  - Lister les produits locaux
  - Lier un produit local à un produit CJ
  - Configurer le `cjVariantId` pour chaque produit

**Page Commandes CJ :**
- URL: `http://localhost:3000/admin/cj/orders`
- Fonctionnalités :
  - Lister les commandes envoyées à CJ
  - Voir le statut et le tracking
  - Actualiser le tracking

## ⚠️ Important : Configuration Supabase

L'intégration actuelle utilise **Supabase Edge Functions**. Pour que ça fonctionne :

1. **Soit configurer Supabase :**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=ton_anon_key
   SUPABASE_SERVICE_ROLE_KEY=ton_service_role_key
   ```

2. **Soit modifier le code pour utiliser l'API directe** (sans Supabase)

## 🧪 Tests à effectuer

### Test 1 : Accès à l'UI Admin
- [ ] Se connecter en tant qu'admin
- [ ] Accéder à `/admin/cj`
- [ ] Vérifier que les pages s'affichent

### Test 2 : Synchronisation produits (si Supabase configuré)
- [ ] Aller sur `/admin/cj/products`
- [ ] Rechercher des produits (ex: "Gua Sha")
- [ ] Synchroniser quelques produits
- [ ] Vérifier qu'ils apparaissent dans la liste

### Test 3 : Mapping produits
- [ ] Aller sur `/admin/cj/mapping`
- [ ] Voir la liste des produits locaux
- [ ] Lier un produit à un produit CJ
- [ ] Vérifier que `cjVariantId` est sauvegardé dans la base

### Test 4 : Test webhook Stripe
- [ ] Créer une commande test via Stripe Checkout
- [ ] Vérifier dans les logs que la commande est créée dans CJ
- [ ] Vérifier dans la base de données que `cjOrderId` est rempli
- [ ] Vérifier dans `/admin/cj/orders` que la commande apparaît

## 🔧 Si Supabase n'est pas configuré

Si tu veux tester sans Supabase, il faut modifier `lib/integrations/cj-dropshipping.ts` pour utiliser l'API directe quand Supabase n'est pas configuré.

**Option : Créer une version hybride qui :**
- Utilise Supabase Edge Functions si configuré
- Utilise l'API directe sinon (avec `CJ_CLIENT_ID` et `CJ_CLIENT_SECRET`)

## 📝 Notes

- Les variables d'environnement sont chargées automatiquement par Next.js depuis `.env.local`
- Pour tester l'API, il faut être authentifié en tant qu'admin
- Les Edge Functions Supabase doivent être déployées pour que la synchronisation fonctionne

## 🐛 Problèmes courants

**"CJ integration not configured"**
→ Vérifier que Supabase est configuré OU modifier le code pour utiliser l'API directe

**"CJ variant ID not found"**
→ Configurer `CJ_DEFAULT_VARIANT_ID` dans `.env.local` OU mapper un produit via l'UI

**"Edge Function error 404"**
→ Les Edge Functions ne sont pas déployées sur Supabase

