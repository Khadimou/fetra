# 🛍️ Catalogue CJ Dropshipping - Guide de démarrage

## ✅ Implémentation terminée

Le catalogue CJ Dropshipping est maintenant **100% fonctionnel** avec panier multi-produits et fulfillment automatique !

## 🚀 Accès rapide

### Pages publiques
- **Catalogue** : `/products` - Liste tous les produits CJ synchronisés
- **Détail produit** : `/products/[SKU]` - Page détail avec variantes et ajout au panier
- **Panier** : `/cart` - Panier multi-produits (FETRA + CJ)
- **Checkout** : `/checkout` - Paiement Stripe sécurisé

### Admin
- **Synchronisation** : `/admin/cj/products` - Synchroniser et gérer les produits CJ
- **Commandes** : `/admin/cj/orders` - Voir les commandes CJ

## 💰 Configuration de la marge

Par défaut, la marge est de **150%** (coefficient 2.5x).

Pour modifier la marge, éditer `app/api/products/cj/route.ts` :

```typescript
const PRICING_CONFIG = {
  coefficient: 2.5, // Changer ici (2.0 = 100%, 3.0 = 200%)
  useCoefficient: true,
};
```

**Important** : Modifier aussi dans `app/api/products/cj/[sku]/route.ts` pour garder la cohérence.

## 🔧 Configuration requise

### Variables d'environnement

```env
# Supabase (stockage produits)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Stripe (paiement)
STRIPE_SECRET_KEY=sk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# CJ Dropshipping (fulfillment)
CJ_CLIENT_ID=xxx
CJ_CLIENT_SECRET=xxx
```

### Images CJ Dropshipping

Les images CJ sont hébergées sur `oss-cf.cjdropshipping.com` et sont **déjà configurées** dans `next.config.ts`.

## 📋 Flux utilisateur complet

1. **Admin synchronise** les produits CJ via `/admin/cj/products`
2. **Client visite** le catalogue `/products`
3. **Client sélectionne** un produit et une variante
4. **Client ajoute** au panier (localStorage)
5. **Client passe** commande via `/checkout`
6. **Stripe traite** le paiement
7. **Webhook crée** l'ordre dans Prisma
8. **Webhook envoie** automatiquement l'ordre à CJ
9. **Client reçoit** email de confirmation
10. **CJ expédie** le produit directement au client

## 🎨 Personnalisation

### Modifier les couleurs
Les couleurs FETRA sont définies dans `tailwind.config.js` :
- `fetra-olive` : Vert olive principal
- `fetra-pink` : Rose accent

### Modifier les traductions
Les traductions sont dans `messages/fr.json` :
- `Products.*` : Page catalogue
- `ProductDetail.*` : Page détail produit
- `Header.catalog` : Lien navigation

## 🧪 Tests

### 1. Tester le catalogue
```
https://0fa5d0e0758d.ngrok-free.app//fr/products
```
Vérifier :
- ✅ Affichage des produits synchronisés
- ✅ Filtres par catégorie
- ✅ Recherche
- ✅ Prix avec marge

### 2. Tester la page détail
```
https://0fa5d0e0758d.ngrok-free.app//fr/products/[SKU]
```
Vérifier :
- ✅ Galerie d'images
- ✅ Sélection de variantes
- ✅ Ajout au panier
- ✅ Respect du stock

### 3. Tester le checkout
1. Ajouter plusieurs produits au panier
2. Aller sur `/checkout`
3. Utiliser carte test Stripe : `4242 4242 4242 4242`
4. Vérifier dans les logs :
   - ✅ Création de l'ordre Prisma
   - ✅ Appel à CJ Dropshipping
   - ✅ Email de confirmation

### 4. Tester l'API
```bash
# Liste des produits
curl https://0fa5d0e0758d.ngrok-free.app//api/products/cj

# Produit spécifique
curl https://0fa5d0e0758d.ngrok-free.app//api/products/cj/CJYD2087201
```

## 📁 Structure des fichiers

```
app/
├── api/
│   └── products/
│       └── cj/
│           ├── route.ts              # Liste produits avec filtres
│           └── [sku]/
│               └── route.ts          # Détail produit par SKU
│
├── [locale]/
│   └── products/
│       ├── page.tsx                  # Page catalogue
│       └── [sku]/
│           └── page.tsx              # Page détail produit
│
└── api/
    ├── checkout/route.ts             # Checkout multi-produits
    └── webhooks/
        └── stripe/route.ts           # Webhook + CJ order creation

lib/
├── cart.ts                           # Panier multi-produits
└── db/
    └── products.ts                   # Helpers Prisma

components/
└── Header.tsx                        # Navigation avec lien Catalogue

docs/
└── cj-catalog-implementation.md     # Documentation complète
```

## 🔒 Sécurité

✅ **Prix validés côté serveur** (Prisma)  
✅ **Stock vérifié** avant paiement  
✅ **Métadonnées CJ** dans Stripe (non exposées au client)  
✅ **Images CJ** via domaine configuré  
✅ **Webhook Stripe** avec signature vérifiée  

## 🐛 Dépannage

### Images ne s'affichent pas
Vérifier que `oss-cf.cjdropshipping.com` est dans `next.config.ts` (✅ déjà fait)

### Produit retourne 404
1. Vérifier que le produit est synchronisé dans `/admin/cj/products`
2. Vérifier que `is_active = true`
3. Vérifier que `cj_product_id` n'est pas null

### Commande CJ non créée
1. Vérifier les logs Supabase Edge Functions
2. Vérifier que `CJ_CLIENT_ID` et `CJ_CLIENT_SECRET` sont configurés
3. Vérifier que le produit a un `cj_variant_id`

### Webhook Stripe échoue
1. Vérifier `STRIPE_WEBHOOK_SECRET`
2. Tester avec Stripe CLI : `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

## 📚 Documentation complète

Pour plus de détails, consulter :
- `docs/cj-catalog-implementation.md` - Architecture complète
- `docs/cj-dropshipping-integration.md` - Intégration CJ
- `docs/webhook-troubleshooting.md` - Dépannage webhooks

## 🎯 Prochaines étapes possibles

- [ ] Page de tracking des commandes CJ
- [ ] Admin : gestion des marges par catégorie
- [ ] Wishlist / favoris
- [ ] Recommandations de produits
- [ ] SEO : métadonnées dynamiques
- [ ] Analytics : tracking conversions

## ✨ Fonctionnalités

✅ Catalogue responsive avec design moderne  
✅ Recherche et filtres par catégorie  
✅ Gestion des variantes (taille, couleur, etc.)  
✅ Panier multi-produits (FETRA + CJ)  
✅ Checkout sécurisé Stripe  
✅ Fulfillment automatique CJ  
✅ Gestion du stock en temps réel  
✅ Marge configurable  
✅ Emails de confirmation  
✅ Support multilingue (FR/EN/PT)  

---

**Besoin d'aide ?** Consulter la documentation dans `/docs` ou les logs Supabase/Stripe.


