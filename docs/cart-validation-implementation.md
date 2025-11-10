# Cart Validation Implementation - Documentation

## Vue d'ensemble

Cette implémentation améliore la robustesse, la sécurité et l'UX du flux d'ajout au panier pour les produits CJ Dropshipping. Elle introduit une validation serveur-side obligatoire avant chaque ajout au panier, empêchant ainsi l'oversell et la manipulation des prix côté client.

**Date d'implémentation** : 2025-11-10

---

## Architecture

### 1. Endpoint de validation serveur

**Fichier** : `app/api/cart/validate/route.ts`

**Route** : `POST /api/cart/validate`

**Responsabilités** :
- Valider la disponibilité du stock en temps réel (source de vérité : Supabase)
- Recalculer le prix serveur-side avec la marge configurée
- Détecter les changements de prix (seuil : 1%)
- Retourner les données validées pour ajout au panier
- Logger les rejets pour analytics

**Request Body** :
```json
{
  "sku": "SKU123",
  "cjVariantId": "CJVID_987", // Optionnel
  "qty": 2,
  "expectedPrice": 29.99 // Optionnel, pour détection changement prix
}
```

**Response Success (200)** :
```json
{
  "ok": true,
  "item": {
    "sku": "SKU123",
    "cjVariantId": "CJVID_987",
    "qty": 2,
    "displayPrice": 29.99,
    "maxQuantity": 12,
    "title": "Robe plissée - Bleu",
    "image": "https://.../image.jpg",
    "cjProductId": "CJ123",
    "variantName": "Bleu"
  }
}
```

**Response Error - Stock insuffisant (409)** :
```json
{
  "ok": false,
  "reason": "stock_insufficient",
  "available": 1,
  "message": "Stock insuffisant : 1 unité disponible."
}
```

**Response Error - Prix changé (409)** :
```json
{
  "ok": false,
  "reason": "price_changed",
  "newPrice": 32.5,
  "message": "Le prix a changé depuis votre dernière visite."
}
```

**Codes HTTP** :
- `200 OK` : Validation réussie
- `400 Bad Request` : Requête invalide (SKU ou qty manquant)
- `404 Not Found` : Produit ou variante introuvable
- `409 Conflict` : Stock insuffisant ou prix changé
- `500 Internal Server Error` : Erreur serveur
- `503 Service Unavailable` : Supabase non configuré

**Logs structurés** :
```javascript
console.log('[Cart Validate] Success:', { sku, cjVariantId, qty, price, stock });
console.warn('[Cart Validate] Stock insufficient:', { sku, requested, available });
console.warn('[Cart Validate] Price changed:', { sku, expected, actual, diff });
console.error('[Cart Validate] Server error:', error);
```

---

### 2. Page produit améliorée

**Fichier** : `app/[locale]/products/[sku]/page.tsx`

#### 2.1 Fetch robuste avec retry

**Fonction** : `fetchWithRetry(url, options, retries=2, backoff=300)`

**Caractéristiques** :
- Retry automatique sur erreurs serveur (5xx) et réseau
- Exponential backoff : 300ms, 600ms, 1200ms
- Pas de retry sur erreurs client (4xx)
- Compatible avec AbortController

**Implémentation** :
```typescript
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries: number = 2,
  backoff: number = 300
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response;
      }

      lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error: any) {
      lastError = error;
    }

    if (attempt < retries) {
      const delay = backoff * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Fetch failed after retries');
}
```

#### 2.2 Gestion des requêtes avec AbortController

**Implémentation** :
```typescript
const abortControllerRef = useRef<AbortController | null>(null);

useEffect(() => {
  loadProduct();

  return () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };
}, [resolvedParams.sku]);

async function loadProduct() {
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }

  abortControllerRef.current = new AbortController();

  const res = await fetchWithRetry(
    `/api/products/cj/${resolvedParams.sku}`,
    { signal: abortControllerRef.current.signal },
    2,
    300
  );
  // ...
}
```

**Avantages** :
- Annule les requêtes en cours lors du changement de SKU
- Évite les race conditions
- Nettoyage automatique au unmount

#### 2.3 Validation pré-ajout au panier

**Flux** :
1. Utilisateur clique "Ajouter au panier"
2. Client appelle `POST /api/cart/validate`
3. Serveur valide stock et prix
4. Si OK → ajout au panier local + redirection `/cart`
5. Si KO → affichage message d'erreur contextuel

**Implémentation** :
```typescript
async function handleAddToCart() {
  setAdding(true);
  setValidationError(null);

  try {
    const currentPrice = getCurrentPrice();
    const validateRes = await fetch('/api/cart/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sku: product.sku,
        cjVariantId: selectedVariant?.vid || product.cjVariantId,
        qty: quantity,
        expectedPrice: currentPrice,
      }),
    });

    const validationData = await validateRes.json();

    if (!validationData.ok) {
      // Gérer les erreurs (voir section UI)
      return;
    }

    // Ajout au panier avec données validées
    addToCart({ ...validatedItem }, validatedItem.qty);

    router.push(`/${locale}/cart`);
  } catch (err) {
    setValidationError({ type: 'network_error', message: err.message });
  } finally {
    setAdding(false);
  }
}
```

#### 2.4 Images par variante

**Priorité de sélection** :
1. `selectedVariant.variantImages[]` (tableau)
2. `selectedVariant.variantImage` (string unique)
3. `product.images[]`
4. `product.imageUrl`
5. Fallback : `/main.webp`

**Implémentation** :
```typescript
function getProductImages(): string[] {
  if (selectedVariant?.variantImages && selectedVariant.variantImages.length > 0) {
    return selectedVariant.variantImages;
  }

  if (selectedVariant?.variantImage) {
    return [selectedVariant.variantImage];
  }

  if (product?.images && product.images.length > 0) {
    return product.images;
  }

  if (product?.imageUrl) {
    return [product.imageUrl];
  }

  return ['/main.webp'];
}

// Reset de l'index lors du changement de variante
useEffect(() => {
  setSelectedImageIndex(0);
}, [selectedVariant?.vid]);
```

---

### 3. UI/UX - Messages d'erreur

#### 3.1 Stock insuffisant

**Affichage** : Bannière orange avec icône ⚠️

**Contenu** :
- Titre : "Stock insuffisant"
- Message : "Stock disponible : X unité(s)"
- Action : Bouton "Ajuster la quantité à X" (si stock > 0)

**Implémentation** :
```tsx
{validationError && validationError.type === 'stock_insufficient' && (
  <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
    <div className="flex items-start">
      <div className="text-2xl mr-3">⚠️</div>
      <div>
        <p className="font-bold text-orange-800 mb-1">Stock insuffisant</p>
        <p className="text-orange-700 text-sm">{validationError.message}</p>
        {validationError.available > 0 && (
          <button
            onClick={() => {
              setQuantity(validationError.available);
              setValidationError(null);
            }}
            className="mt-2 text-sm text-orange-800 font-medium underline"
          >
            Ajuster la quantité à {validationError.available}
          </button>
        )}
      </div>
    </div>
  </div>
)}
```

#### 3.2 Prix changé - Modal

**Affichage** : Modal centré avec overlay semi-transparent

**Contenu** :
- Icône : 💰
- Titre : "Prix modifié"
- Comparaison ancien/nouveau prix
- Actions : "Annuler" / "Mettre à jour & ajouter"

**Comportement** :
- "Annuler" : Ferme modal, recharge produit pour afficher nouveau prix
- "Mettre à jour & ajouter" : Recharge produit, puis relance ajout panier automatiquement

**Implémentation** :
```tsx
{showPriceChangeModal && validationError?.type === 'price_changed' && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
      <div className="text-center mb-4">
        <div className="text-5xl mb-3">💰</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Prix modifié</h3>
        <p className="text-gray-600">{validationError.message}</p>
      </div>

      <div className="bg-fetra-olive/5 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Ancien prix :</span>
          <span className="text-gray-400 line-through text-lg">
            {currentPrice.toFixed(2)} €
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-900 font-bold">Nouveau prix :</span>
          <span className="text-fetra-olive font-extrabold text-2xl">
            {validationError.newPrice?.toFixed(2)} €
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={handlePriceChangeCancel}>Annuler</button>
        <button onClick={handlePriceChangeConfirm}>Mettre à jour & ajouter</button>
      </div>
    </div>
  </div>
)}
```

**Animation** : `animate-scale-in` (définie dans `tailwind.config.js`)

```javascript
keyframes: {
  'scale-in': {
    '0%': { transform: 'scale(0.9)', opacity: '0' },
    '100%': { transform: 'scale(1)', opacity: '1' },
  },
},
animation: {
  'scale-in': 'scale-in 0.2s ease-out',
},
```

#### 3.3 Erreur réseau

**Affichage** : Bannière rouge avec icône ❌

**Contenu** :
- Titre : "Erreur"
- Message : Texte d'erreur technique

**Implémentation** :
```tsx
{validationError && validationError.type === 'network_error' && (
  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
    <div className="flex items-start">
      <div className="text-2xl mr-3">❌</div>
      <div>
        <p className="font-bold text-red-800 mb-1">Erreur</p>
        <p className="text-red-700 text-sm">{validationError.message}</p>
      </div>
    </div>
  </div>
)}
```

#### 3.4 Erreur de chargement produit

**Affichage** : Page centrée avec icône ⚠️

**Contenu** :
- Icône : ⚠️
- Message d'erreur
- Explication : "Le produit est peut-être indisponible ou l'URL est incorrecte."
- Actions : "Retour au catalogue" / "Réessayer"

**Implémentation** :
```tsx
if (error || !product) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-6xl mb-4">⚠️</div>
        <p className="text-red-600 text-lg mb-4 font-medium">{error || t('notFound')}</p>
        <p className="text-gray-600 mb-6">
          Le produit est peut-être indisponible ou l'URL est incorrecte.
        </p>
        <button onClick={() => router.push(`/${locale}/products`)}>
          {t('backToCatalog')}
        </button>
        <button onClick={loadProduct}>Réessayer</button>
      </div>
    </div>
  );
}
```

#### 3.5 Bouton "Ajouter au panier" - États

**États** :
1. **Normal** : Texte "Ajouter au panier • XX,XX €"
2. **Loading** : Spinner + "Ajout en cours..."
3. **Out of stock** : "Rupture de stock" (désactivé)

**Implémentation** :
```tsx
<button
  onClick={handleAddToCart}
  disabled={adding || currentStock === 0}
  className="w-full py-4 ... flex items-center justify-center gap-2"
>
  {adding ? (
    <>
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      <span>{t('adding')}</span>
    </>
  ) : currentStock === 0 ? (
    t('outOfStock')
  ) : (
    t('addToCart', { price: (currentPrice * quantity).toFixed(2) })
  )}
</button>
```

---

## Configuration

### Variables d'environnement

**Nouvelle variable** : `PRICE_MULTIPLIER`

**Fichier** : `.env.local` ou `.env.production`

**Valeur par défaut** : `2.5` (marge de 150%)

**Utilisation** :
```typescript
const PRICE_MULTIPLIER = parseFloat(process.env.PRICE_MULTIPLIER || '2.5');
```

**Exemple `.env.local`** :
```bash
# Pricing configuration
PRICE_MULTIPLIER=2.5  # 2.5x = 150% margin (CJ price €10 → selling price €25)
```

**Important** : Cette variable doit être identique dans :
- `app/api/cart/validate/route.ts`
- `app/api/products/cj/route.ts`
- `app/api/products/cj/[sku]/route.ts`

---

## Sécurité

### Prévention de la manipulation des prix

**Problème** : Avant cette implémentation, le prix était calculé côté client (ligne 90-92 de l'ancienne version) et envoyé directement au panier sans validation.

**Solution** :
1. Le client n'envoie que `sku`, `cjVariantId`, et `qty`
2. Le serveur recalcule le prix à partir de Supabase + `PRICE_MULTIPLIER`
3. Le prix validé est retourné et utilisé pour l'ajout au panier
4. **Le client ne fait plus confiance à ses propres calculs de prix**

**Code critique dans `/api/cart/validate/route.ts`** :
```typescript
// Récupère le prix depuis Supabase (source de vérité)
let basePrice = parseFloat(product.price);

if (cjVariantId) {
  const variant = product.variants.find(v => v.vid === cjVariantId);
  basePrice = variant.variantSellPrice || basePrice;
}

// Applique la marge serveur-side
const displayPrice = applyMargin(basePrice);

// Le client reçoit ce prix validé
return NextResponse.json({
  ok: true,
  item: { ...item, displayPrice },
});
```

### Prévention de l'oversell

**Problème** : Avant, le stock était vérifié uniquement côté client, permettant des achats en cas de désynchronisation.

**Solution** :
1. Stock vérifié contre Supabase en temps réel lors de la validation
2. Comparaison `qty <= currentStock`
3. Retour 409 si stock insuffisant
4. Message clair à l'utilisateur avec stock disponible

**Code critique dans `/api/cart/validate/route.ts`** :
```typescript
if (qty > currentStock) {
  console.warn('[Cart Validate] Stock insufficient:', {
    sku,
    cjVariantId,
    requested: qty,
    available: currentStock,
  });

  return NextResponse.json(
    {
      ok: false,
      reason: 'stock_insufficient',
      available: currentStock,
      message: `Stock insuffisant : ${currentStock} unité(s) disponible(s).`,
    },
    { status: 409 }
  );
}
```

---

## Monitoring et analytics

### Logs structurés

Tous les logs utilisent le préfixe `[Cart Validate]` pour faciliter le grep/search.

**Événements loggés** :
```javascript
// Success
console.log('[Cart Validate] Success:', { sku, cjVariantId, qty, price, stock });

// Stock insuffisant
console.warn('[Cart Validate] Stock insufficient:', { sku, requested, available });

// Prix changé
console.warn('[Cart Validate] Price changed:', { sku, expected, actual, diff });

// Produit introuvable
console.error('[Cart Validate] Product not found:', sku, error);

// Variante introuvable
console.error('[Cart Validate] Variant not found:', cjVariantId);

// Erreur serveur
console.error('[Cart Validate] Server error:', error);

// Supabase non configuré
console.error('[Cart Validate] Supabase not configured');
```

### Métriques à suivre

**Via logs serveur** :
- Taux de rejet (409 / total requêtes)
- Raison de rejet (stock vs prix)
- SKUs les plus rejetés (indicateur de problème sync)
- Fréquence des changements de prix détectés

**Via analytics client (Google Analytics déjà intégré)** :
- Événement `add_to_cart` tracké après validation réussie
- Données : SKU, nom, variante, prix validé, quantité

**Exemple d'extraction des logs** :
```bash
# Compter les rejets stock
grep '[Cart Validate] Stock insufficient' logs.txt | wc -l

# Compter les rejets prix
grep '[Cart Validate] Price changed' logs.txt | wc -l

# SKUs les plus rejetés
grep '[Cart Validate] Stock insufficient' logs.txt | grep -o '"sku":"[^"]*"' | sort | uniq -c | sort -rn
```

---

## Tests

### Tests manuels recommandés

#### Test 1 : Validation stock insuffisant

1. Naviguer vers un produit CJ avec stock faible (ex: 2 unités)
2. Sélectionner quantité = 5
3. Cliquer "Ajouter au panier"
4. **Résultat attendu** : Bannière orange "Stock disponible : 2 unités" + bouton "Ajuster la quantité à 2"
5. Cliquer "Ajuster la quantité"
6. **Résultat attendu** : Quantité mise à jour à 2, bannière disparaît
7. Cliquer "Ajouter au panier"
8. **Résultat attendu** : Ajout réussi, redirection vers `/cart`

#### Test 2 : Validation changement de prix

1. Modifier manuellement `PRICE_MULTIPLIER` dans `.env.local` (ex: 2.5 → 3.0)
2. Redémarrer le serveur Next.js
3. Ouvrir une page produit dans un onglet (garde l'ancien prix en cache client)
4. Cliquer "Ajouter au panier"
5. **Résultat attendu** : Modal "Prix modifié" avec comparaison ancien/nouveau
6. Cliquer "Annuler"
7. **Résultat attendu** : Modal fermé, prix affiché mis à jour
8. Cliquer à nouveau "Ajouter au panier"
9. Cliquer "Mettre à jour & ajouter"
10. **Résultat attendu** : Produit ajouté avec nouveau prix, redirection `/cart`

#### Test 3 : Fetch avec retry

1. Simuler une erreur réseau (ex: éteindre WiFi pendant 2 secondes)
2. Naviguer vers une page produit
3. **Résultat attendu** :
   - Loader affiché
   - Retry automatique après 300ms, 600ms
   - Si réseau revient : produit chargé
   - Si réseau absent : message d'erreur avec bouton "Réessayer"

#### Test 4 : AbortController

1. Naviguer rapidement entre plusieurs produits (cliquer sur 3-4 produits en 1 seconde)
2. **Résultat attendu** : Pas de race condition, seul le dernier produit cliqué est affiché

#### Test 5 : Images par variante

1. Ouvrir un produit CJ avec variants ayant des images différentes
2. Sélectionner variante 1
3. **Résultat attendu** : Galerie montre images de variante 1
4. Sélectionner variante 2
5. **Résultat attendu** : Galerie change pour images de variante 2, index reset à 0

### Tests E2E automatisés (à implémenter)

**Framework recommandé** : Playwright ou Cypress

**Scénarios à couvrir** :

```typescript
// test: validation-success.spec.ts
test('should add product to cart after successful validation', async ({ page }) => {
  await page.goto('/fr/products/TEST_SKU');
  await page.click('[data-testid="add-to-cart"]');
  await expect(page).toHaveURL(/\/fr\/cart/);
  await expect(page.locator('.cart-item')).toContainText('TEST_PRODUCT');
});

// test: validation-stock-insufficient.spec.ts
test('should show stock warning when quantity exceeds availability', async ({ page, request }) => {
  // Mock API response avec stock = 2
  await page.route('**/api/cart/validate', route => {
    route.fulfill({
      status: 409,
      body: JSON.stringify({
        ok: false,
        reason: 'stock_insufficient',
        available: 2,
        message: 'Stock insuffisant : 2 unités disponibles.'
      })
    });
  });

  await page.goto('/fr/products/TEST_SKU');
  await page.fill('[data-testid="quantity"]', '5');
  await page.click('[data-testid="add-to-cart"]');

  await expect(page.locator('.validation-error')).toContainText('Stock insuffisant');
  await expect(page.locator('[data-testid="adjust-quantity"]')).toBeVisible();
});

// test: validation-price-changed.spec.ts
test('should show price change modal when price differs', async ({ page }) => {
  // Mock API response avec nouveau prix
  await page.route('**/api/cart/validate', route => {
    route.fulfill({
      status: 409,
      body: JSON.stringify({
        ok: false,
        reason: 'price_changed',
        newPrice: 35.00,
        message: 'Le prix a changé depuis votre dernière visite.'
      })
    });
  });

  await page.goto('/fr/products/TEST_SKU');
  await page.click('[data-testid="add-to-cart"]');

  await expect(page.locator('[data-testid="price-change-modal"]')).toBeVisible();
  await expect(page.locator('.new-price')).toContainText('35.00 €');

  await page.click('[data-testid="cancel-price-change"]');
  await expect(page.locator('[data-testid="price-change-modal"]')).not.toBeVisible();
});

// test: fetch-retry.spec.ts
test('should retry fetch on network error', async ({ page }) => {
  let attempts = 0;

  await page.route('**/api/products/cj/*', route => {
    attempts++;
    if (attempts < 3) {
      route.abort('failed');
    } else {
      route.continue();
    }
  });

  await page.goto('/fr/products/TEST_SKU');
  await expect(page.locator('.product-title')).toBeVisible();
  expect(attempts).toBe(3); // Initial + 2 retries
});
```

---

## Dépendances

### Packages NPM

Aucune nouvelle dépendance ajoutée. Utilise uniquement :
- `next` (déjà installé)
- `react` (déjà installé)
- `@supabase/supabase-js` (déjà installé)
- `next-intl` (déjà installé)

### Services externes

- **Supabase** : Base de données pour produits CJ
  - Tables : `products`
  - Env vars : `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

### Fichiers modifiés

1. **Nouveaux fichiers** :
   - `app/api/cart/validate/route.ts` (endpoint validation)
   - `docs/cart-validation-implementation.md` (cette doc)

2. **Fichiers modifiés** :
   - `app/[locale]/products/[sku]/page.tsx` (page produit)
   - `tailwind.config.js` (animation scale-in)

3. **Fichiers inchangés mais pertinents** :
   - `lib/cart.ts` (logique panier)
   - `messages/fr.json` (traductions)
   - `app/api/products/cj/[sku]/route.ts` (API produit)

---

## Checklist de déploiement

Avant de déployer en production :

- [ ] Ajouter `PRICE_MULTIPLIER=2.5` dans les variables d'environnement Vercel
- [ ] Vérifier que `NEXT_PUBLIC_SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont configurés
- [ ] Tester le flux complet en staging avec produits réels
- [ ] Vérifier les logs Vercel Functions pour absence d'erreurs
- [ ] Tester sur mobile (modal responsive)
- [ ] Vérifier que la table `products` Supabase a des données à jour
- [ ] Documenter `PRICE_MULTIPLIER` dans le README principal
- [ ] (Optionnel) Configurer Sentry pour traquer les erreurs de validation
- [ ] (Optionnel) Créer un dashboard pour monitorer le taux de rejet

---

## Maintenance future

### Ajout d'une nouvelle variante de produit

1. Sync CJ via `/admin/cj/products` ou Edge Function
2. Vérifier que les `variantImages` sont présentes dans Supabase
3. Tester le produit sur la page produit
4. Aucune modification de code nécessaire (tout est dynamique)

### Changement de marge

1. Modifier `PRICE_MULTIPLIER` dans `.env.local` et `.env.production`
2. Redéployer l'application (Vercel)
3. Les prix seront recalculés automatiquement
4. **Important** : Les paniers existants côté client auront l'ancien prix → seront validés au checkout avec nouveau prix

### Modification de la logique de validation

**Fichier à modifier** : `app/api/cart/validate/route.ts`

**Exemples de modifications possibles** :
- Ajouter une vérification de limite de quantité par commande
- Ajouter une vérification de disponibilité géographique
- Intégrer un appel API CJ en temps réel (au lieu de se fier à Supabase)
- Ajouter des règles de promotion (prix réduit si qty > X)

**Template d'ajout de validation** :
```typescript
// VALIDATION 3: Custom rule
if (customCondition) {
  console.warn('[Cart Validate] Custom rule failed:', { sku, reason });

  return NextResponse.json(
    {
      ok: false,
      reason: 'custom_reason',
      message: 'Message utilisateur',
    },
    { status: 409 }
  );
}
```

### Extension vers d'autres types de produits

Actuellement, cette validation ne s'applique qu'aux produits CJ (ceux dans Supabase).

Pour étendre au produit FETRA original (`lib/product.ts`) :

1. Modifier `/api/cart/validate` pour gérer les SKUs FETRA
2. Récupérer le produit depuis `lib/product.ts` au lieu de Supabase
3. Valider le stock hardcodé
4. Retourner les données dans le même format

**Exemple** :
```typescript
// Dans /api/cart/validate/route.ts
import { getProduct } from '@/lib/product';

// ...

// Check if it's a FETRA product
if (sku === 'FETRA_RITUAL_001') {
  const fetraProduct = getProduct();

  if (qty > fetraProduct.stock) {
    return NextResponse.json({
      ok: false,
      reason: 'stock_insufficient',
      available: fetraProduct.stock,
    }, { status: 409 });
  }

  return NextResponse.json({
    ok: true,
    item: {
      sku,
      qty,
      displayPrice: fetraProduct.price,
      maxQuantity: fetraProduct.stock,
      title: fetraProduct.title,
      image: fetraProduct.images[0],
    },
  });
}
```

---

## FAQ

### Q1 : Pourquoi ne pas valider directement dans le checkout ?

**R** : La validation pré-ajout améliore l'UX en détectant les problèmes immédiatement, évitant une frustration au moment du paiement. De plus, cela évite d'avoir des articles invalides dans le panier.

### Q2 : Que se passe-t-il si un utilisateur a un vieux panier avec un prix obsolète ?

**R** : Au moment du checkout (`/api/checkout/route.ts`), les prix sont revalidés serveur-side contre Supabase. Si le prix a changé, le checkout échouera et l'utilisateur devra revenir au panier. **Considération future** : Ajouter une validation du panier entier avant le checkout.

### Q3 : Peut-on bypasser la validation en appelant directement `addToCart()` ?

**R** : Oui, côté client uniquement. Mais au moment du checkout, le serveur revalide tout. Donc un attaquant pourrait polluer son propre panier local, mais pas compléter l'achat.

### Q4 : Quelle est la latence ajoutée par la validation ?

**R** : Environ 100-300ms pour un appel API Supabase. C'est acceptable pour la sécurité ajoutée. Le spinner sur le bouton masque cette latence.

### Q5 : Que faire si Supabase est down ?

**R** : L'endpoint retourne 503 "Service temporarily unavailable". L'utilisateur voit un message d'erreur réseau. **Considération future** : Ajouter un fallback ou une file d'attente.

### Q6 : Pourquoi ne pas utiliser React Query ou SWR ?

**R** : Bonne idée pour les versions futures ! Cela permettrait de cacher le produit et de revalider en background. Actuellement, on privilégie la simplicité.

---

## Liens utiles

- [Documentation Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Next.js App Router - Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Playwright Testing](https://playwright.dev/docs/intro)
- [Tailwind CSS Animations](https://tailwindcss.com/docs/animation)

---

**Auteur** : Claude Code
**Version** : 1.0
**Dernière mise à jour** : 2025-11-10
