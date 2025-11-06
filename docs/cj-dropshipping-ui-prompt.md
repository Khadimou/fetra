# Prompt pour implémenter l'UI CJ Dropshipping

## Contexte
Le projet FETRA utilise Next.js 16, Prisma, NextAuth, et a déjà une intégration backend CJ Dropshipping fonctionnelle. Il faut créer une interface d'administration pour gérer les produits et commandes CJ Dropshipping.

## Stack technique
- **Frontend**: Next.js 16 avec App Router, React Server Components, TypeScript
- **Styling**: Tailwind CSS (classes existantes: `fetra-olive`, `fetra-pink`, `brand-shadow`)
- **Backend**: API Routes Next.js, Prisma ORM
- **Auth**: NextAuth avec rôle ADMIN
- **Structure**: Pages admin dans `app/[locale]/admin/`

## Fonctionnalités à implémenter

### 1. Page de synchronisation des produits (`/admin/cj/products`)

**Objectifs:**
- Permettre de synchroniser des produits depuis CJ Dropshipping vers la base de données
- Afficher les produits CJ synchronisés
- Mapper les produits CJ aux produits locaux (lier `cj_variant_id` à `Product.sku`)

**Fonctionnalités:**
- **Formulaire de recherche/synchronisation:**
  - Champ de recherche par mot-clé (ex: "Gua Sha", "K-Beauty")
  - Option de catégorie (optionnel)
  - Nombre de pages à synchroniser (1-10)
  - Bouton "Synchroniser"
  - Loading state pendant la synchronisation
  - Affichage des résultats (nombre de produits trouvés, créés, mis à jour)

- **Liste des produits synchronisés:**
  - Tableau avec colonnes: Image, Nom produit CJ, SKU CJ, Prix, Stock, Variant ID, Statut
  - Pagination
  - Filtre par statut (synchronisé, non synchronisé)
  - Action "Lier à un produit local" pour mapper avec un produit existant

- **Modal de mapping produit:**
  - Sélectionner un produit local depuis une liste déroulante
  - Lier le `cj_variant_id` au produit local
  - Sauvegarder le mapping dans la base de données

**Design:**
- Utiliser le même style que les autres pages admin (voir `app/[locale]/admin/products/page.tsx`)
- Cards avec `brand-shadow` pour les sections
- Boutons avec `bg-fetra-olive` pour les actions principales
- Tableaux avec hover effects

**API à créer:**
- `POST /api/admin/cj/sync-products` - Synchroniser les produits
- `GET /api/admin/cj/products` - Lister les produits CJ synchronisés
- `POST /api/admin/cj/products/:id/link` - Lier un produit CJ à un produit local

### 2. Page de configuration produits (`/admin/cj/mapping`)

**Objectifs:**
- Gérer les mappings entre produits locaux et produits CJ
- Configurer les IDs CJ pour chaque produit local

**Fonctionnalités:**
- **Liste des produits locaux:**
  - Tableau avec colonnes: SKU, Nom produit, Prix, CJ Variant ID, Statut mapping
  - Indicateur visuel si le produit est mappé ou non
  - Bouton "Configurer CJ ID" pour chaque produit

- **Modal de configuration:**
  - Rechercher un produit CJ par mot-clé
  - Afficher les résultats de recherche avec images
  - Sélectionner un variant CJ
  - Sauvegarder le mapping (`Product.cjVariantId`)

**Design:**
- Design cohérent avec la page de synchronisation
- Badges pour indiquer le statut (mappé/non mappé)
- Modal plein écran ou large pour la recherche de produits

**API à créer:**
- `GET /api/admin/cj/products/search` - Rechercher des produits CJ
- `PUT /api/admin/products/:id/cj-variant` - Mettre à jour le CJ variant ID d'un produit

### 3. Page de gestion des commandes CJ (`/admin/cj/orders`)

**Objectifs:**
- Visualiser toutes les commandes envoyées à CJ Dropshipping
- Suivre le statut des commandes CJ
- Récupérer le tracking automatiquement

**Fonctionnalités:**
- **Liste des commandes CJ:**
  - Tableau avec colonnes: Numéro commande local, Numéro commande CJ, Date, Montant, Statut CJ, Tracking, Actions
  - Filtres par statut (pending, processing, shipped, delivered, cancelled)
  - Recherche par numéro de commande
  - Pagination

- **Détails d'une commande:**
  - Modal ou page dédiée avec:
    - Informations de la commande (local et CJ)
    - Produits commandés
    - Adresse de livraison
    - Historique de tracking (si disponible)
    - Actions: "Actualiser le statut", "Voir sur CJ Dashboard"

- **Actions:**
  - Bouton "Actualiser le tracking" pour récupérer les dernières infos
  - Badge avec le statut actuel (coloré selon le statut)
  - Lien vers le tracking si disponible

**Design:**
- Utiliser les mêmes composants de table que la page `/admin/orders`
- Badges colorés pour les statuts:
  - `pending`: gris
  - `processing`: bleu
  - `shipped`: vert
  - `delivered`: vert foncé
  - `cancelled`: rouge

**API à créer:**
- `GET /api/admin/cj/orders` - Lister les commandes CJ
- `GET /api/admin/cj/orders/:id` - Détails d'une commande CJ
- `POST /api/admin/cj/orders/:id/refresh` - Actualiser le tracking

### 4. Dashboard de synchronisation (`/admin/cj/dashboard`)

**Objectifs:**
- Afficher les statistiques et logs de synchronisation
- Monitoring de l'intégration CJ

**Fonctionnalités:**
- **Statistiques:**
  - Nombre total de produits synchronisés
  - Nombre de commandes envoyées à CJ
  - Taux de succès des commandes
  - Dernière synchronisation

- **Logs de synchronisation:**
  - Tableau avec les dernières synchronisations
  - Colonnes: Date, Type, Statut, Produits traités, Créés, Mis à jour, Erreurs, Durée
  - Filtres par type (products, orders) et statut
  - Détails des erreurs si échec

- **Actions rapides:**
  - Bouton "Synchroniser maintenant" (produits)
  - Bouton "Vérifier les commandes en attente"

**Design:**
- Cards de statistiques avec icônes
- Graphique simple (optionnel) pour les tendances
- Tableau de logs avec possibilité d'expansion pour voir les détails d'erreur

**API à créer:**
- `GET /api/admin/cj/stats` - Statistiques globales
- `GET /api/admin/cj/sync-logs` - Logs de synchronisation

## Composants réutilisables à créer

### 1. `CjProductCard.tsx`
- Card pour afficher un produit CJ avec image, nom, prix, stock
- Bouton d'action (lier, voir détails)

### 2. `CjOrderStatusBadge.tsx`
- Badge coloré pour afficher le statut d'une commande CJ

### 3. `CjSyncButton.tsx`
- Bouton avec loading state pour déclencher une synchronisation

### 4. `CjTrackingInfo.tsx`
- Composant pour afficher les informations de tracking avec historique

## Modifications du schema Prisma nécessaires

Ajouter dans le modèle `Product`:
```prisma
model Product {
  // ... existing fields
  cjVariantId String? @map("cj_variant_id")  // CJ variant ID
  cjProductId String? @map("cj_product_id")  // CJ product ID (optionnel)
}
```

## Structure des fichiers

```
app/[locale]/admin/cj/
├── page.tsx                    # Dashboard CJ
├── products/
│   ├── page.tsx                # Liste et synchronisation produits
│   └── [id]/
│       └── page.tsx            # Détails produit CJ
├── mapping/
│   └── page.tsx                # Configuration mapping produits
└── orders/
    ├── page.tsx                # Liste commandes CJ
    └── [id]/
        └── page.tsx            # Détails commande CJ

app/api/admin/cj/
├── sync-products/
│   └── route.ts
├── products/
│   ├── route.ts                # GET, POST
│   ├── search/
│   │   └── route.ts
│   └── [id]/
│       └── route.ts            # PUT, DELETE
├── orders/
│   ├── route.ts                # GET
│   ├── [id]/
│   │   ├── route.ts            # GET
│   │   └── refresh/
│   │       └── route.ts
└── stats/
    └── route.ts

components/admin/
├── CjProductCard.tsx
├── CjOrderStatusBadge.tsx
├── CjSyncButton.tsx
└── CjTrackingInfo.tsx
```

## Exemples de code

### Style de page admin existant
Regarder `app/[locale]/admin/products/page.tsx` pour le style et la structure à suivre.

### Utilisation des fonctions CJ existantes
```typescript
import { createCjOrder, getCjOrderTracking } from '@/lib/integrations/cj-dropshipping';
```

### Gestion des erreurs
- Afficher les erreurs dans des alertes toast ou inline
- Logging dans la console pour le debug
- Messages d'erreur utilisateur-friendly

## Priorités d'implémentation

1. **Phase 1 (Essentiel):**
   - Page de synchronisation produits
   - Page de mapping produits
   - Liste des commandes CJ

2. **Phase 2 (Important):**
   - Détails commandes avec tracking
   - Dashboard avec stats

3. **Phase 3 (Nice to have):**
   - Recherche avancée produits
   - Export des données
   - Graphiques de tendances

## Notes importantes

- Toutes les pages doivent être protégées par le rôle ADMIN
- Utiliser les composants de loading existants
- Respecter le design system FETRA (couleurs, ombres, espacements)
- Gérer les cas où CJ n'est pas configuré (afficher un message d'information)
- Tester avec de vraies données CJ (en mode sandbox si possible)

