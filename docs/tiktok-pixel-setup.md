# TikTok Pixel Integration Guide

## Overview

Le pixel TikTok est intégré dans FETRA avec gestion complète du consentement RGPD. Le pixel ne se charge qu'après consentement marketing de l'utilisateur.

## Configuration

### 1. Variables d'environnement

Ajoutez dans `.env.local` (et dans Vercel) :

```bash
NEXT_PUBLIC_TIKTOK_PIXEL_ID=D4ARHIRC77U8LSGFNHT0
```

### 2. Architecture

L'intégration suit le même pattern que GA4 et GTM :

```
components/
├── TikTokListener.tsx      # Écoute le consentement marketing
├── TikTokConversion.tsx     # Track la conversion sur /success
└── ClientProviders.tsx      # Monte TikTokListener

lib/
└── tiktok/
    └── index.ts             # Helpers d'initialisation et tracking
```

### 3. Événements trackés

#### AddToCart
Déclenché quand l'utilisateur ajoute un produit au panier (dans `ProductCard.tsx`) :

```typescript
ttq.track('AddToCart', {
  content_id: product.sku,
  content_name: product.title,
  content_type: 'product',
  value: product.price * quantity,
  currency: 'EUR',
  quantity: quantity
});
```

#### CompletePayment
Déclenché sur la page `/success` après paiement Stripe réussi :

```typescript
ttq.track('CompletePayment', {
  content_type: 'product',
  value: orderValue,
  currency: 'EUR',
  description: 'Order XXXXXXXX'
});
```

### 4. Consentement RGPD

Le pixel TikTok ne se charge qu'après que l'utilisateur accepte les cookies **marketing** :

1. L'utilisateur voit la bannière de consentement au premier visit
2. S'il accepte "Marketing" → événement `consent-marketing` est dispatché
3. `TikTokListener` écoute cet événement et charge le pixel
4. Les événements `AddToCart` et `CompletePayment` ne sont envoyés que si `window.ttq` existe

### 5. Test de l'intégration

#### En développement local

1. Démarrez le serveur : `npm run dev`
2. Ouvrez en navigation privée : `http://localhost:3000`
3. Ouvrez les DevTools → onglet Network
4. Acceptez les cookies marketing dans la bannière
5. Vérifiez que `events.js` (TikTok) est chargé
6. Ajoutez un produit au panier → vérifiez dans Console : `TikTok Pixel: Event tracked: AddToCart`
7. Complétez un achat test → page `/success` doit logger `TikTok Pixel: CompletePayment tracked`

#### En production (TikTok Events Manager)

1. Connectez-vous à [TikTok Ads Manager](https://ads.tiktok.com/)
2. Allez dans **Assets → Events**
3. Sélectionnez votre pixel `D4ARHIRC77U8LSGFNHT0`
4. Vérifiez que les événements sont reçus en temps réel
5. Test de conversion : complétez un achat sur le site prod et vérifiez l'événement `CompletePayment` dans TikTok Events

### 6. Événements disponibles

Le pixel TikTok supporte de nombreux événements e-commerce. Actuellement intégrés :

- ✅ `AddToCart` - Ajout au panier
- ✅ `CompletePayment` - Achat finalisé
- ⏳ `ViewContent` - Vue produit (à implémenter si besoin)
- ⏳ `InitiateCheckout` - Début checkout (à implémenter si besoin)

Pour ajouter d'autres événements, utilisez la fonction helper :

```typescript
import { tiktokTrack, TikTokEvents } from '@/lib/tiktok';

tiktokTrack(TikTokEvents.ViewContent, {
  content_id: 'FETRA-RIT-001',
  content_name: 'Rituel Visage Liftant',
  value: 49.90,
  currency: 'EUR'
});
```

### 7. Paramètres de conversion TikTok

Pour optimiser les campagnes TikTok Ads, assurez-vous que les paramètres suivants sont bien trackés :

- `content_id` : SKU du produit
- `content_name` : Nom du produit
- `content_type` : Toujours `'product'`
- `value` : Montant total en euros (float)
- `currency` : Toujours `'EUR'`
- `quantity` : Quantité achetée

### 8. Débogage

#### Le pixel ne se charge pas

1. Vérifiez que `NEXT_PUBLIC_TIKTOK_PIXEL_ID` est défini
2. Vérifiez que l'utilisateur a accepté les cookies **marketing**
3. Ouvrez la Console : recherchez `TikTok Pixel: Successfully initialized`
4. Si erreur, vérifiez les bloqueurs de pub (désactivez temporairement)

#### Les événements ne sont pas trackés

1. Vérifiez dans Console : `window.ttq` doit être défini
2. Vérifiez : `window._fetra_tiktok_initialized` doit être `true`
3. Si `undefined`, le pixel n'est pas chargé (problème de consentement ou var d'env manquante)

### 9. Conformité RGPD

✅ **Conforme** : Le pixel TikTok ne se charge qu'après consentement explicite marketing.

- Avant consentement : aucun cookie TikTok, aucun script chargé
- Après consentement : le pixel s'initialise et commence à tracker
- L'utilisateur peut révoquer son consentement via "Gérer les cookies" (le pixel reste chargé jusqu'à refresh, mais c'est acceptable RGPD)

### 10. Ressources

- [TikTok Pixel Documentation](https://ads.tiktok.com/help/article?aid=10000357)
- [TikTok Events API](https://ads.tiktok.com/marketing_api/docs?id=1701890973258754)
- [FETRA Cookie Consent System](../README.md#-cookies--consentement-rgpd)

