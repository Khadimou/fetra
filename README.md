# FETRA - E-commerce Next.js

Application e-commerce moderne construite avec Next.js 16 (App Router), TypeScript, Tailwind CSS et Stripe pour les paiements.

## 🎨 Design Tokens

### Couleurs de marque

Le projet utilise une palette de couleurs cohérente définie dans `tailwind.config.js` et `app/globals.css` :

- **Fetra Olive** (`#6B8E23`) : Couleur principale utilisée pour les boutons CTA et les accents
  - Variantes : `fetra-olive/50`, `fetra-olive/100`
- **Fetra Pink** (`#F472B6`) : Couleur d'accent pour les badges et éléments secondaires
  - Variantes : `fetra-pink/50`, `fetra-pink/100`

### Variables CSS

Les couleurs sont également disponibles via des variables CSS dans `:root` :

```css
--fetra-olive: #6B8E23;
--fetra-pink: #F472B6;
--fetra-surface: #FFFFFF;
--fetra-muted: #6B7280;
```

### Modifier les couleurs

Pour changer les couleurs de marque :

1. Modifiez les valeurs dans `tailwind.config.js` (section `theme.extend.colors`)
2. Mettez à jour les variables CSS dans `app/globals.css`
3. Les classes Tailwind seront automatiquement disponibles (ex: `bg-fetra-olive`, `text-fetra-pink`)

## 🚀 Démarrage

### Installation

```bash
npm install
```

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# URL de base de l'application
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Clés Stripe (obtenez-les sur https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) pour voir l'application.

### Build de production

```bash
npm run build
npm start
```

## 🧪 Tests

Le projet utilise Vitest pour les tests unitaires :

```bash
npm run test
```

Les tests sont situés dans le dossier `__tests__/`.

## 📦 Déploiement sur Vercel

### Méthode recommandée

1. **Connectez votre dépôt GitHub** à Vercel :
   - Allez sur [vercel.com](https://vercel.com)
   - Importez votre dépôt GitHub
   - Vercel détectera automatiquement Next.js

2. **Configurez les variables d'environnement** dans le dashboard Vercel :
   - `NEXT_PUBLIC_BASE_URL` : URL de production (ex: `https://votre-domaine.vercel.app`)
   - `STRIPE_SECRET_KEY` : Clé secrète Stripe (mode production)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` : Clé publique Stripe (mode production)

3. **Déployez** : Vercel déploiera automatiquement à chaque push sur `main`

### Variables d'environnement Vercel

Dans le dashboard Vercel :
1. Allez dans **Settings** → **Environment Variables**
2. Ajoutez toutes les variables nécessaires
3. Sélectionnez les environnements concernés (Production, Preview, Development)

## 💳 Configuration Stripe

### Test de paiement

Le projet utilise Stripe pour gérer les paiements. Pour tester en mode développement :

1. **Créez un compte Stripe** sur [stripe.com](https://stripe.com)
2. **Obtenez vos clés API** dans le dashboard Stripe (mode test)
3. **Configurez les variables d'environnement** (voir section ci-dessus)

### Cartes de test Stripe

Utilisez ces cartes pour tester les paiements :

| Numéro de carte | Scénario | CVV |
|----------------|----------|-----|
| `4242 4242 4242 4242` | Paiement réussi | N'importe quel CVV (ex: 123) |
| `4000 0000 0000 0002` | Paiement refusé | N'importe quel CVV |
| `4000 0000 0000 9995` | Carte refusée (insuffisant) | N'importe quel CVV |

**Date d'expiration** : N'importe quelle date future (ex: 12/25)

**Code postal** : N'importe quel code postal valide (ex: 12345)

### Production

Pour passer en production :

1. **Basculez vers les clés API de production** dans le dashboard Stripe
2. **Mettez à jour les variables d'environnement** sur Vercel
3. **Testez** avec une vraie carte en mode test avant de passer en production

## 📁 Structure du projet

```
fetra/
├── app/                    # App Router (Next.js 16)
│   ├── api/               # Routes API
│   │   ├── checkout/      # Endpoint Stripe Checkout
│   │   └── product/       # API produit
│   ├── product/           # Page produit
│   ├── globals.css        # Styles globaux et variables CSS
│   ├── layout.tsx         # Layout racine avec header
│   └── page.tsx           # Page d'accueil
├── components/            # Composants React
│   ├── ProductCard.tsx   # Carte produit avec CTA
│   ├── ProductGallery.tsx # Galerie d'images
│   ├── Badges.tsx        # Badges (livraison, paiement)
│   ├── Scarcity.tsx      # Alerte stock faible
│   ├── SocialProof.tsx   # Preuve sociale
│   └── Reviews.tsx       # Section avis clients
├── lib/                   # Utilitaires
│   └── product.ts        # Données produit
├── __tests__/            # Tests unitaires
└── public/               # Assets statiques
```

## 🛠️ Scripts disponibles

- `npm run dev` : Démarre le serveur de développement
- `npm run build` : Build de production
- `npm run start` : Démarre le serveur de production
- `npm run lint` : Vérifie le code avec ESLint
- `npm run lint:fix` : Corrige automatiquement les erreurs ESLint
- `npm run format` : Formate le code avec Prettier
- `npm run test` : Lance les tests avec Vitest

## 📝 Fonctionnalités

- ✅ Page produit Shopify-like avec galerie d'images
- ✅ Badges de confiance (livraison offerte, paiement sécurisé)
- ✅ Preuve sociale (avis clients, stock faible)
- ✅ Stepper de quantité accessible au clavier
- ✅ Intégration Stripe Checkout
- ✅ SEO optimisé (métadonnées, Open Graph, JSON-LD)
- ✅ Images optimisées avec Next.js Image et placeholders LQIP
- ✅ Design responsive et accessible
- ✅ Tests unitaires

## 🔒 Sécurité

- Les clés Stripe secrètes ne sont jamais exposées au client
- Validation côté serveur des données de checkout
- Utilisation de variables d'environnement pour les secrets

## 📚 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Stripe](https://stripe.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vercel Deployment](https://vercel.com/docs)

## 📄 Licence

Ce projet est privé et propriétaire.
