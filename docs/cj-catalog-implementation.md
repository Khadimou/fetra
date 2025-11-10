# Catalogue CJ Dropshipping - Documentation d'implémentation

## Vue d'ensemble

Le catalogue CJ Dropshipping est maintenant intégré à la boutique FETRA avec un système de panier multi-produits complet. Les clients peuvent parcourir les produits synchronisés depuis CJ, les ajouter au panier, et passer commande via Stripe. Les commandes sont automatiquement transmises à CJ pour fulfillment.

## Architecture

### 1. Frontend - Pages publiques

#### `/products` - Page catalogue
- **Fichier**: `app/[locale]/products/page.tsx`
- **Fonctionnalités**:
  - Grid responsive avec cartes produits attractives
  - Recherche par mot-clé
  - Filtres par catégorie
  - Pagination
  - Badges de réduction et stock limité
  - Design moderne avec gradients FETRA

#### `/products/[sku]` - Page détail produit
- **Fichier**: `app/[locale]/products/[sku]/page.tsx`
- **Fonctionnalités**:
  - Galerie d'images avec thumbnails
  - Sélection de variantes (taille, couleur, etc.)
  - Gestion de quantité avec respect du stock
  - Affichage du prix avec marge
  - Badges de confiance (livraison gratuite, retours, paiement sécurisé)
  - Ajout au panier avec tracking analytics

### 2. Système de panier multi-produits

#### `lib/cart.ts`
- **Type `CartItem` étendu** avec:
  - `cjProductId`: ID du produit CJ
  - `cjVariantId`: ID de la variante CJ (pour fulfillment)
  - `maxQuantity`: Limite de stock
  - `variantName`: Nom de la variante sélectionnée

- **Logique intelligente**:
  - Matching par `cjVariantId` pour les produits CJ
  - Respect automatique des limites de stock
  - Support du panier mixte (produits FETRA + produits CJ)

### 3. API et pricing

#### `/api/products/cj` - API publique produits
- **Fichier**: `app/api/products/cj/route.ts`
- **Fonctionnalités**:
  - Récupération des produits actifs avec `cj_product_id`
  - **Application de la marge**: coefficient 2.5x par défaut (150% de marge)
  - Filtrage par recherche et catégorie
  - Pagination
  - Liste des catégories disponibles

**Configuration de la marge** (dans `app/api/products/cj/route.ts`):
```typescript
const PRICING_CONFIG = {
  coefficient: 2.5, // Prix CJ × 2.5
  useCoefficient: true,
};
```

Pour changer la marge:
- **Coefficient**: Modifier `coefficient` (ex: 2.0 = 100% de marge)
- **Montant fixe**: Définir `fixedAmount: 10` et `useCoefficient: false`

### 4. Checkout et paiement

#### `/api/checkout` - Création session Stripe
- **Fichier**: `app/api/checkout/route.ts`
- **Sécurité**:
  - Validation des prix côté serveur via Prisma
  - Vérification du stock disponible
  - Comparaison prix client vs prix calculé serveur
  - Métadonnées CJ stockées dans Stripe pour webhook

- **Métadonnées Stripe** (par line item):
  - `sku`: SKU du produit
  - `cjProductId`: ID produit CJ
  - `cjVariantId`: ID variante CJ (crucial pour fulfillment)
  - `variantName`: Nom de la variante

#### `/api/webhooks/stripe` - Traitement post-paiement
- **Fichier**: `app/api/webhooks/stripe/route.ts`
- **Flux**:
  1. Récupération des line items avec métadonnées
  2. Extraction des `cjVariantId` depuis les métadonnées
  3. Création de l'ordre dans Prisma
  4. Décrémentation du stock
  5. **Création automatique de l'ordre CJ** (si `cjVariantId` présent)
  6. Mise à jour de l'ordre avec `cjOrderId` et `cjOrderNum`
  7. Envoi des emails de confirmation

- **Gestion mixte**:
  - Les produits sans `cjVariantId` sont ignorés pour CJ (ex: Rituel FETRA)
  - Les produits avec `cjVariantId` sont envoyés à CJ pour fulfillment
  - Support des commandes mixtes (FETRA + CJ)

### 5. Navigation

#### Header et menu mobile
- **Fichier**: `components/Header.tsx`
- Nouveau lien "Catalogue" vers `/products`
- Présent dans navigation desktop et mobile
- Séparé du lien "Le Rituel" (produit physique FETRA)

## Traductions

### `messages/fr.json`
Nouvelles clés ajoutées:
- `Header.catalog`: "Catalogue"
- `Products.*`: Toutes les traductions pour la page catalogue
- `ProductDetail.*`: Toutes les traductions pour la page détail

## Configuration requise

### Variables d'environnement

```env
# Supabase (pour récupération des produits)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Stripe (paiement)
STRIPE_SECRET_KEY=sk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# CJ Dropshipping (fulfillment)
CJ_CLIENT_ID=xxx
CJ_CLIENT_SECRET=xxx
CJ_DEFAULT_VARIANT_ID=xxx (optionnel, fallback)
```

### Base de données Prisma

Le schéma `Product` doit inclure:
- `cjProductId`: String? (ID du produit CJ)
- `cjVariantId`: String? (ID de la variante CJ)
- `isActive`: Boolean (pour affichage public)

## Flux utilisateur complet

1. **Découverte**: Client visite `/products`
2. **Sélection**: Clique sur un produit → `/products/[sku]`
3. **Variante**: Sélectionne une variante (si applicable)
4. **Panier**: Ajoute au panier (localStorage)
5. **Checkout**: Remplit formulaire → `/checkout`
6. **Paiement**: Redirigé vers Stripe Checkout
7. **Webhook**: Stripe notifie `/api/webhooks/stripe`
8. **Fulfillment**: Ordre créé automatiquement dans CJ
9. **Confirmation**: Email envoyé via Brevo

## Avantages de l'architecture

### Transparence pour le client
- Le client ne voit jamais "CJ Dropshipping"
- Prix affichés incluent la marge
- Expérience unifiée FETRA

### Sécurité
- Prix validés côté serveur
- Stock vérifié avant paiement
- Métadonnées CJ dans Stripe (pas exposées au client)

### Flexibilité
- Marge configurable facilement
- Support produits mixtes (FETRA + CJ)
- Gestion gracieuse des erreurs CJ (non-bloquante)

### Scalabilité
- Pagination sur catalogue
- Filtres performants
- Caching possible via Supabase

## Tests recommandés

### 1. Test du catalogue
```bash
# Visiter la page
http://localhost:3000/fr/products

# Vérifier:
- Affichage des produits synchronisés
- Filtres par catégorie
- Recherche
- Prix avec marge correcte
```

### 2. Test de la page détail
```bash
# Visiter un produit
http://localhost:3000/fr/products/[SKU]

# Vérifier:
- Galerie d'images
- Sélection de variantes
- Ajout au panier
- Respect du stock
```

### 3. Test du checkout
```bash
# Ajouter plusieurs produits au panier
# Aller sur /checkout
# Utiliser carte test Stripe: 4242 4242 4242 4242

# Vérifier dans logs:
- Validation des prix ✓
- Création de l'ordre Prisma ✓
- Appel à CJ Dropshipping ✓
- Email de confirmation ✓
```

### 4. Test du webhook Stripe
```bash
# Utiliser Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Déclencher un paiement test
# Vérifier dans logs:
- Extraction des métadonnées CJ ✓
- Création de l'ordre CJ ✓
- Mise à jour avec cjOrderId ✓
```

## Maintenance

### Ajuster la marge
Modifier `app/api/products/cj/route.ts`:
```typescript
const PRICING_CONFIG = {
  coefficient: 3.0, // Nouvelle marge
  useCoefficient: true,
};
```

### Ajouter des catégories
Les catégories sont automatiquement extraites des produits synchronisés.

### Gérer les erreurs CJ
Les erreurs CJ sont loggées mais non-bloquantes. L'ordre est créé dans Prisma même si CJ échoue, permettant un retry manuel depuis l'admin.

## Prochaines étapes possibles

1. **Page de tracking**: Afficher le statut de livraison CJ
2. **Admin**: Interface pour gérer les marges par catégorie
3. **Analytics**: Tracking des conversions par produit CJ
4. **SEO**: Métadonnées dynamiques par produit
5. **Wishlist**: Sauvegarde des produits favoris

## Support

Pour toute question sur l'implémentation:
- Consulter `docs/cj-dropshipping-integration.md` pour l'intégration CJ
- Consulter les logs Supabase pour les Edge Functions
- Utiliser Stripe Dashboard pour déboguer les webhooks


