# CJ Dropshipping × Supabase Integration

Intégration complète de l'API CJ Dropshipping avec Supabase pour la synchronisation de produits K-Beauty, le passage de commandes et le suivi des livraisons.

## 📋 Table des matières

- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Configuration](#configuration)
- [Migrations de base de données](#migrations-de-base-de-données)
- [Edge Functions](#edge-functions)
- [Utilisation](#utilisation)
- [Tests](#tests)
- [Dépannage](#dépannage)

## 🏗 Architecture

### Structure des dossiers

```
supabase/
├── functions/
│   ├── _shared/
│   │   └── cj-api/              # Modules partagés pour l'API CJ
│   │       ├── types.ts         # Types TypeScript
│   │       ├── auth.ts          # Gestion OAuth2
│   │       ├── client.ts        # Client API avec retry logic
│   │       └── index.ts         # Export principal
│   ├── sync-cj-products/        # Sync produits CJ → Supabase
│   │   └── index.ts
│   ├── create-cj-order/         # Création commande dans CJ
│   │   └── index.ts
│   └── get-cj-tracking/         # Récupération tracking CJ
│       └── index.ts
└── migrations/
    ├── 20250105000001_create_cj_products_table.sql
    ├── 20250105000002_create_cj_orders_table.sql
    └── 20250105000003_create_sync_logs_table.sql
```

### Composants principaux

1. **API Client** (`_shared/cj-api/`)
   - Authentification OAuth2 avec gestion automatique du token
   - Retry logic avec backoff exponentiel (3 tentatives)
   - Support complet de l'API CJ Dropshipping v2.0

2. **Edge Functions** (Deno runtime)
   - `sync-cj-products`: Synchronisation des produits K-Beauty
   - `create-cj-order`: Passage de commandes vers CJ
   - `get-cj-tracking`: Récupération du statut de livraison

3. **Base de données**
   - `products`: Catalogue de produits CJ synchronisés
   - `orders`: Commandes avec statut et tracking
   - `cj_sync_logs`: Historique des synchronisations

## 📦 Prérequis

### 1. Compte CJ Dropshipping

1. Créer un compte sur [CJ Dropshipping](https://www.cjdropshipping.com/)
2. Obtenir vos credentials OAuth2 :
   - `client_id`
   - `client_secret`

**📌 Note**: Pour obtenir vos credentials, contactez le support CJ Dropshipping ou vérifiez la section API de votre compte.

### 2. Projet Supabase

1. Créer un projet sur [Supabase](https://supabase.com/)
2. Noter votre `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`

### 3. Supabase CLI

Installer le CLI Supabase pour déployer les Edge Functions :

```bash
npm install -g supabase
# ou
brew install supabase/tap/supabase
```

## ⚙️ Configuration

### Variables d'environnement

Créer un fichier `.env.local` pour le développement local :

```bash
# CJ Dropshipping API
CJ_CLIENT_ID=votre_client_id
CJ_CLIENT_SECRET=votre_client_secret

# Supabase
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
SUPABASE_ANON_KEY=votre_anon_key
```

### Configurer les secrets Supabase

Pour déployer en production, configurer les secrets Supabase :

```bash
# Authentification Supabase
supabase login

# Lier votre projet
supabase link --project-ref votre-project-ref

# Configurer les secrets
supabase secrets set CJ_CLIENT_ID=votre_client_id
supabase secrets set CJ_CLIENT_SECRET=votre_client_secret
supabase secrets set SUPABASE_URL=https://votre-projet.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```

## 🗄 Migrations de base de données

### Appliquer les migrations

```bash
# Migration 1: Table products
supabase db push --file supabase/migrations/20250105000001_create_cj_products_table.sql

# Migration 2: Table orders
supabase db push --file supabase/migrations/20250105000002_create_cj_orders_table.sql

# Migration 3: Table cj_sync_logs
supabase db push --file supabase/migrations/20250105000003_create_sync_logs_table.sql

# Ou appliquer toutes les migrations d'un coup
supabase db push
```

### Schéma des tables

#### Table `products`

```sql
- id (UUID)
- cj_product_id (TEXT, UNIQUE) -- PID de CJ
- cj_variant_id (TEXT) -- VID de CJ si applicable
- name (TEXT)
- description (TEXT)
- price (NUMERIC)
- stock (INTEGER)
- images (JSONB) -- Array d'URLs
- variants (JSONB) -- Variantes (couleur, taille)
- category (TEXT)
- category_id (TEXT)
- sku (TEXT)
- weight (NUMERIC)
- dimensions (JSONB)
- shipping_info (JSONB)
- created_at, updated_at (TIMESTAMPTZ)
```

#### Table `orders`

```sql
- id (UUID)
- user_id (UUID) -- Référence auth.users
- cj_order_id (TEXT, UNIQUE) -- ID de commande CJ
- order_number (TEXT, UNIQUE) -- Numéro de commande interne
- status (TEXT) -- pending, processing, shipped, delivered, cancelled, failed
- total_amount (NUMERIC)
- currency (TEXT)
- shipping_address (JSONB)
- items (JSONB) -- Array de produits
- tracking_number, tracking_url, logistic_name (TEXT)
- cj_order_created_at, cj_shipped_at, cj_delivered_at (TIMESTAMPTZ)
- notes, metadata (TEXT, JSONB)
- created_at, updated_at (TIMESTAMPTZ)
```

#### Table `cj_sync_logs`

```sql
- id (UUID)
- sync_type (TEXT) -- products, orders, tracking
- status (TEXT) -- started, success, failed, partial
- items_processed, items_created, items_updated, items_failed (INTEGER)
- error_message (TEXT)
- metadata (JSONB)
- started_at, completed_at (TIMESTAMPTZ)
- duration_ms (INTEGER)
```

## 🚀 Edge Functions

### Déployer les Edge Functions

```bash
# Déployer toutes les fonctions
supabase functions deploy sync-cj-products
supabase functions deploy create-cj-order
supabase functions deploy get-cj-tracking

# Déployer une fonction spécifique
supabase functions deploy sync-cj-products --no-verify-jwt
```

### Tester localement

```bash
# Démarrer Supabase localement
supabase start

# Servir une fonction en local
supabase functions serve sync-cj-products --env-file .env.local
```

## 📘 Utilisation

### 1. Synchroniser les produits K-Beauty

```bash
# Avec curl
curl -X POST 'https://votre-projet.supabase.co/functions/v1/sync-cj-products' \
  -H "Authorization: Bearer SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "keyWord": "K-Beauty",
    "page": 1,
    "pageSize": 20,
    "maxPages": 5
  }'
```

```javascript
// Avec JavaScript/TypeScript
const { data, error } = await supabase.functions.invoke('sync-cj-products', {
  body: {
    keyWord: 'K-Beauty',
    page: 1,
    pageSize: 20,
    maxPages: 5
  }
});

console.log(data);
// {
//   success: true,
//   stats: { processed: 100, created: 80, updated: 20, failed: 0 },
//   syncId: "uuid",
//   duration: "15000ms"
// }
```

**Paramètres disponibles :**

- `keyWord` (string, optionnel) : Mot-clé de recherche (défaut: "K-Beauty")
- `categoryId` (string, optionnel) : ID de catégorie CJ
- `page` (number, optionnel) : Page de départ (défaut: 1)
- `pageSize` (number, optionnel) : Produits par page (défaut: 20)
- `maxPages` (number, optionnel) : Nombre max de pages à synchroniser (défaut: 5)

### 2. Créer une commande dans CJ

```bash
# Avec curl
curl -X POST 'https://votre-projet.supabase.co/functions/v1/create-cj-order' \
  -H "Authorization: Bearer SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "uuid-de-votre-commande"
  }'
```

```javascript
// Avec JavaScript/TypeScript
const { data, error } = await supabase.functions.invoke('create-cj-order', {
  body: {
    orderId: 'uuid-de-votre-commande'
  }
});

console.log(data);
// {
//   success: true,
//   orderId: "uuid",
//   cjOrderId: "CJ123456789",
//   cjOrderNum: "CJ123456789"
// }
```

**Prérequis :**

- La commande doit exister dans la table `orders`
- La commande ne doit pas déjà avoir un `cj_order_id`
- Les items doivent avoir des `cj_variant_id` ou `cj_product_id` valides

### 3. Récupérer le tracking d'une commande

```bash
# Avec curl (par orderId)
curl -X POST 'https://votre-projet.supabase.co/functions/v1/get-cj-tracking' \
  -H "Authorization: Bearer SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "uuid-de-votre-commande"
  }'

# Ou par cjOrderId
curl -X POST 'https://votre-projet.supabase.co/functions/v1/get-cj-tracking' \
  -H "Authorization: Bearer SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "cjOrderId": "CJ123456789"
  }'
```

```javascript
// Avec JavaScript/TypeScript
const { data, error } = await supabase.functions.invoke('get-cj-tracking', {
  body: {
    orderId: 'uuid-de-votre-commande'
    // OU
    // cjOrderId: 'CJ123456789'
    // OU
    // orderNumber: 'ORDER-2025-001'
  }
});

console.log(data);
// {
//   success: true,
//   tracking: {
//     orderId: "CJ123456789",
//     orderStatus: "shipped",
//     trackingNumber: "ABC123456789",
//     logisticName: "DHL",
//     trackingEvents: [...]
//   },
//   orderStatus: "shipped"
// }
```

## 🔄 Automatisation avec cron

Pour synchroniser les produits automatiquement, créer un cron job :

### Option 1: Supabase pg_cron

```sql
-- Synchroniser les produits K-Beauty tous les jours à 2h du matin
SELECT cron.schedule(
  'sync-cj-products-daily',
  '0 2 * * *',
  $$
  SELECT net.http_post(
    url := 'https://votre-projet.supabase.co/functions/v1/sync-cj-products',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.service_role_key') || '"}'::jsonb,
    body := '{"keyWord": "K-Beauty", "maxPages": 10}'::jsonb
  );
  $$
);
```

### Option 2: GitHub Actions

Créer `.github/workflows/sync-cj-products.yml` :

```yaml
name: Sync CJ Products
on:
  schedule:
    - cron: '0 2 * * *' # Tous les jours à 2h UTC
  workflow_dispatch: # Permettre déclenchement manuel

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Call Supabase Edge Function
        run: |
          curl -X POST '${{ secrets.SUPABASE_URL }}/functions/v1/sync-cj-products' \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{"keyWord": "K-Beauty", "maxPages": 10}'
```

### Option 3: Vercel Cron Jobs

Dans votre projet Next.js, créer `app/api/cron/sync-products/route.ts` :

```typescript
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Vérifier l'authorization (Vercel cron secret)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Appeler l'Edge Function Supabase
  const response = await fetch(
    `${process.env.SUPABASE_URL}/functions/v1/sync-cj-products`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keyWord: 'K-Beauty',
        maxPages: 10,
      }),
    }
  );

  const data = await response.json();
  return Response.json(data);
}
```

Puis configurer dans `vercel.json` :

```json
{
  "crons": [{
    "path": "/api/cron/sync-products",
    "schedule": "0 2 * * *"
  }]
}
```

## 🧪 Tests

### Tester l'authentification

```typescript
import { getCjAccessToken } from './supabase/functions/_shared/cj-api/auth.ts';

const token = await getCjAccessToken();
console.log('Token obtenu:', token);
```

### Tester la récupération de produits

```typescript
import { getProductList } from './supabase/functions/_shared/cj-api/client.ts';

const products = await getProductList({
  keyWord: 'Gua Sha',
  pageSize: 5,
});

console.log(`${products.total} produits trouvés`);
console.log(products.list[0]);
```

## 🔧 Dépannage

### Erreur d'authentification

```
Error: Failed to get CJ access token: 401 Unauthorized
```

**Solution :** Vérifier que `CJ_CLIENT_ID` et `CJ_CLIENT_SECRET` sont correctement configurés.

### Token expiré

```
Error: CJ API returned error: Token expired (code: 401)
```

**Solution :** Le système gère automatiquement le refresh. Si l'erreur persiste, appeler `clearTokenCache()`.

### Erreur de rate limit

```
Error: CJ API error: 429 Too Many Requests
```

**Solution :** Réduire la fréquence des requêtes. L'API CJ a des limites (ex: 1 appel toutes les 5 minutes pour le token).

### Produit non trouvé lors de la création de commande

```
Error: Invalid variant ID
```

**Solution :** S'assurer que les produits sont synchronisés et que les `cj_variant_id` sont corrects dans les items de commande.

## 📚 Ressources

- [Documentation CJ Dropshipping API](https://developers.cjdropshipping.com/)
- [Documentation Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Documentation Deno](https://deno.land/manual)

## 🤝 Support

Pour toute question ou problème :

1. Vérifier les logs Supabase : Dashboard → Edge Functions → Logs
2. Vérifier les sync logs : `SELECT * FROM cj_sync_logs ORDER BY started_at DESC LIMIT 10`
3. Consulter la documentation CJ Dropshipping

## 📄 Licence

Ce code est fourni à titre d'exemple pour l'intégration avec CJ Dropshipping.
