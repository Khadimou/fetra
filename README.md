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

## 🖼️ Pipeline d'images

### Images optimisées

Les images produits sont stockées dans `/public/optimized_images/` avec leurs placeholders LQIP (Low Quality Image Placeholder).

### Structure des images

Dans `lib/product.ts`, les images sont définies avec leur source et leur placeholder LQIP :

```typescript
images: [
  { 
    src: '/optimized_images/main_1200.webp', 
    lqip: 'data:image/webp;base64,...' 
  }
]
```

### Régénérer les LQIP

Pour générer de nouveaux placeholders LQIP à partir d'images :

1. **Option 1 : Utiliser un outil en ligne** comme [plaiceholder.co](https://plaiceholder.co/)
2. **Option 2 : Utiliser sharp** (Node.js) :
   ```bash
   npm install sharp
   ```
   ```javascript
   const sharp = require('sharp');
   const { base64 } = await sharp('image.webp')
     .resize(20)
     .blur(10)
     .toBuffer()
     .then(buffer => `data:image/webp;base64,${buffer.toString('base64')}`);
   ```
3. **Option 3 : Utiliser next/image** avec `placeholder="blur"` - Next.js génère automatiquement les placeholders si vous utilisez `import` pour les images statiques

Les placeholders LQIP sont encodés en base64 et ajoutés directement dans `lib/product.ts` pour un chargement instantané.

## 🚀 Démarrage

### Installation

```bash
npm install
```

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet (copiez `.env.example`) :

```env
# URL de base de l'application
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Clés Stripe (obtenez-les sur https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# HubSpot (tracking et CRM)
HUBSPOT_API_KEY=your_hubspot_api_key_here
HUBSPOT_API_BASE=https://api.hubapi.com
NEXT_PUBLIC_HUBSPOT_ID=your_hubspot_portal_id_here

# Brevo (email marketing, ex-Sendinblue)
BREVO_API_KEY=your_brevo_api_key_here
BREVO_API_BASE=https://api.brevo.com

# Freshdesk (support client)
FRESHDESK_API_KEY=your_freshdesk_api_key_here
FRESHDESK_DOMAIN=yourcompany.freshdesk.com
FRESHDESK_API_BASE=https://{domain}.freshdesk.com

# Optional analytics
SENTRY_DSN=
GA_MEASUREMENT_ID=
```

## ⚙️ Configuration des intégrations tierces

### HubSpot (Marketing & CRM)

1. **Créez un compte HubSpot** sur [hubspot.com](https://hubspot.com)
2. **Obtenez votre Portal ID** :
   - Allez dans **Settings** → **Account Setup** → **Account Defaults**
   - Notez votre **Hub ID** (Portal ID)
3. **Obtenez votre API Key** :
   - Allez dans **Settings** → **Integrations** → **API Key**
   - Générez une nouvelle clé API
4. **Configurez les variables** :
   - `NEXT_PUBLIC_HUBSPOT_ID` : Votre Portal ID (pour le tracking snippet)
   - `HUBSPOT_API_KEY` : Votre clé API (pour les appels serveur)

**Utilisation** : Le tracking HubSpot est automatiquement injecté dans toutes les pages pour suivre les visiteurs et créer des contacts.

### Brevo (Email Marketing)

1. **Créez un compte Brevo** sur [brevo.com](https://brevo.com) (ex-Sendinblue)
2. **Obtenez votre API Key** :
   - Allez dans **SMTP & API** → **API Keys**
   - Générez une nouvelle clé API v3
3. **Créez une liste de contacts** :
   - Allez dans **Contacts** → **Lists**
   - Créez une liste "Newsletter" et notez son ID
4. **Configurez les variables** :
   - `BREVO_API_KEY` : Votre clé API v3

**Utilisation** : Le formulaire newsletter utilise l'API Brevo pour ajouter les contacts et envoyer des emails de bienvenue automatiques.

### Freshdesk (Support Client)

1. **Créez un compte Freshdesk** sur [freshdesk.com](https://freshdesk.com)
2. **Obtenez votre domaine** :
   - Votre URL Freshdesk : `yourcompany.freshdesk.com`
3. **Obtenez votre API Key** :
   - Allez dans **Profile Settings** → **API Key**
   - Copiez votre clé API
4. **Configurez les variables** :
   - `FRESHDESK_DOMAIN` : Votre sous-domaine (ex: `yourcompany`)
   - `FRESHDESK_API_KEY` : Votre clé API

**Utilisation** : Permet de créer des tickets support directement depuis l'application et d'afficher un widget de support.

### Stripe (Paiements)

Voir la section [Configuration Stripe](#-configuration-stripe) ci-dessous.

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
2. Ajoutez toutes les variables nécessaires :
   - `NEXT_PUBLIC_BASE_URL` : URL de production (ex: `https://votre-domaine.vercel.app`)
   - `STRIPE_SECRET_KEY` : Clé secrète Stripe (mode production/test)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` : Clé publique Stripe (mode production/test)
3. Sélectionnez les environnements concernés (Production, Preview, Development)
4. **Important** : Redéployez l'application après avoir ajouté/modifié les variables

### Configuration du domaine personnalisé (www.fetrabeauty.com)

Le projet est configuré pour utiliser `www.fetrabeauty.com` comme domaine canonique avec redirections automatiques non-www → www et HTTP → HTTPS.

#### 1. Ajouter le domaine dans Vercel

1. **Allez dans** Settings → Domains
2. **Ajoutez** `www.fetrabeauty.com` comme domaine principal
3. **Ajoutez** `fetrabeauty.com` (racine) avec redirection vers www

#### 2. Configuration DNS

⚠️ **Important** : Ne modifiez PAS les nameservers si votre domaine utilise Google Workspace (Gmail). Ajoutez uniquement les enregistrements DNS suivants :

**Enregistrements à ajouter** (chez votre registrar : Squarespace, Google Domains, etc.) :

| Type  | Nom/Host | Valeur/Cible | TTL |
|-------|----------|--------------|-----|
| CNAME | www | cname.vercel-dns.com. | 3600 |
| A | @ | 76.76.21.21 | 3600 |

**Note** : Si votre registrar ne permet pas d'enregistrement A sur la racine (@), vous pouvez :
- Utiliser uniquement le CNAME `www` → Vercel gérera la redirection racine → www
- Ou utiliser un enregistrement ALIAS/ANAME si disponible

**⚠️ Important - Google Workspace** :
- **NE TOUCHEZ PAS** aux enregistrements MX existants (mail)
- **NE TOUCHEZ PAS** aux nameservers si vous utilisez Gmail
- Ajoutez **UNIQUEMENT** les enregistrements A et CNAME ci-dessus

#### 3. Vérification DNS

Après avoir ajouté les enregistrements DNS :

```bash
# Vérifier le CNAME www
nslookup www.fetrabeauty.com

# Vérifier l'enregistrement A racine
nslookup fetrabeauty.com

# Vérifier le certificat SSL (après propagation DNS)
curl -I https://www.fetrabeauty.com/status
```

La propagation DNS peut prendre de 5 minutes à 48 heures selon les registrars.

#### 4. Certificat SSL automatique

- **Vercel provisionne automatiquement** un certificat SSL Let's Encrypt une fois que les enregistrements DNS sont vérifiés
- Vérifiez dans Vercel Dashboard → Settings → Domains que le statut est ✅ "Valid"
- Le middleware (`middleware.ts`) force automatiquement HTTPS

#### 5. Redirections automatiques

Le projet inclut :
- **middleware.ts** : Force `www.fetrabeauty.com` et HTTPS (308 permanent redirect)
- **vercel.json** : Headers HSTS pour la sécurité
- Redirection `fetrabeauty.com` → `www.fetrabeauty.com` (308)
- Redirection `http://` → `https://` (308)

#### 6. Tester les redirections

```bash
# Test redirection non-www → www
curl -I http://fetrabeauty.com
# Devrait rediriger vers https://www.fetrabeauty.com

# Test redirection HTTP → HTTPS
curl -I http://www.fetrabeauty.com
# Devrait rediriger vers https://www.fetrabeauty.com

# Test page de statut
curl https://www.fetrabeauty.com/status
```

#### 7. Mise à jour des variables d'environnement

Après configuration du domaine, mettez à jour :

```env
NEXT_PUBLIC_BASE_URL=https://www.fetrabeauty.com
```

Et redéployez sur Vercel.

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

### Test des Webhooks Stripe en local

Pour tester les webhooks Stripe en développement local :

1. **Installez Stripe CLI** :
   ```bash
   # Windows (avec Scoop)
   scoop install stripe
   
   # macOS (avec Homebrew)
   brew install stripe/stripe-cli/stripe
   ```

2. **Authentifiez-vous** :
   ```bash
   stripe login
   ```

3. **Écoutez les webhooks** :
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Copiez le webhook secret** affiché et ajoutez-le dans `.env.local` :
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

5. **Testez un paiement** et vérifiez les logs dans la console Stripe CLI

## 🚀 Guide de configuration POC (Proof of Concept)

### Checklist complète pour démarrer

#### 1. Configuration de base
- [ ] Cloner le dépôt : `git clone git@github.com:Khadimou/fetra.git`
- [ ] Installer les dépendances : `npm install`
- [ ] Copier `.env.example` vers `.env.local`
- [ ] Démarrer le serveur : `npm run dev`

#### 2. Configuration HubSpot

1. **Créer un compte** sur [hubspot.com](https://hubspot.com) (compte gratuit disponible)
2. **Obtenir le Portal ID** :
   - Allez dans **Settings** → **Account Setup** → **Account Defaults**
   - Notez votre **Hub ID** (Portal ID)
   - Ajoutez dans `.env.local` : `NEXT_PUBLIC_HUBSPOT_ID=votre_portal_id`
3. **Obtenir l'API Key** :
   - Allez dans **Settings** → **Integrations** → **API Key**
   - Générez une nouvelle clé
   - Ajoutez dans `.env.local` : `HUBSPOT_API_KEY=votre_cle_api`
4. **Vérifier le tracking** :
   - Visitez votre site en local
   - Vérifiez dans HubSpot **Reports** → **Analytics Tools** → **Traffic Analytics**

#### 3. Configuration Brevo (Sendinblue)

1. **Créer un compte** sur [brevo.com](https://brevo.com) (gratuit jusqu'à 300 emails/jour)
2. **Obtenir l'API Key** :
   - Allez dans **SMTP & API** → **API Keys**
   - Générez une clé API v3
   - Ajoutez dans `.env.local` : `BREVO_API_KEY=votre_cle_api`
3. **Créer une liste de contacts** :
   - Allez dans **Contacts** → **Lists**
   - Créez une liste "Newsletter" ou "Customers"
   - Notez l'ID de la liste (visible dans l'URL : `/lists/ID`)
4. **Configurer la liste dans le code** :
   - Ouvrez `app/api/newsletter/route.ts`
   - Ligne 27, remplacez `listIds: [2]` par `listIds: [VOTRE_ID]`
5. **Tester l'inscription newsletter** :
   - Utilisez le formulaire dans le footer
   - Vérifiez dans Brevo **Contacts** → votre liste

#### 4. Configuration Freshdesk

1. **Créer un compte** sur [freshdesk.com](https://freshdesk.com) (essai gratuit 21 jours)
2. **Obtenir le domaine** :
   - Votre URL Freshdesk : `votredomaine.freshdesk.com`
   - Ajoutez dans `.env.local` : `FRESHDESK_DOMAIN=votredomaine.freshdesk.com`
3. **Obtenir l'API Key** :
   - Allez dans **Profile Settings** → **API Key**
   - Copiez votre clé API
   - Ajoutez dans `.env.local` : `FRESHDESK_API_KEY=votre_cle_api`
4. **Tester la création de ticket** :
   ```bash
   curl -X POST http://localhost:3000/api/support \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test message"}'
   ```
   - Vérifiez dans Freshdesk **Tickets** → **All tickets**

#### 5. Configuration Stripe Webhooks

1. **Créer un compte** Stripe (mode test)
2. **Configurer les clés** dans `.env.local`
3. **Installer Stripe CLI** (voir section ci-dessus)
4. **Démarrer le forwarding** :
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
5. **Faire un test de paiement** :
   - Ajoutez un produit au panier
   - Utilisez la carte test `4242 4242 4242 4242`
   - Vérifiez les logs Stripe CLI
6. **Vérifier la synchronisation** :
   - Vérifiez dans HubSpot : nouveau contact créé avec détails commande
   - Vérifiez dans Brevo : contact ajouté à la liste
   - Vérifiez dans `data/orders.json` : commande sauvegardée

#### 6. Vérification des données

**HubSpot** :
- **Contacts** → cherchez par email → vérifiez les propriétés :
  - `last_order_id`
  - `last_order_amount`
  - `last_order_date`
- **Activity** → vérifiez les événements `begin_checkout`

**Brevo** :
- **Contacts** → cherchez par email → vérifiez les attributs :
  - `LAST_ORDER_ID`
  - `LAST_ORDER_AMOUNT`
  - `LAST_ORDER_DATE`

**Freshdesk** :
- **Tickets** → vérifiez la création automatique

**Fichiers locaux** :
- `data/orders.json` → historique des commandes

#### 7. Tests automatisés

```bash
# Lancer tous les tests
npm run test

# Tests spécifiques
npm run test -- newsletter.test.ts
npm run test -- webhook.test.ts
```

### 🔧 Commandes utiles pour le POC

```bash
# Démarrer le serveur de développement
npm run dev

# Tester les webhooks Stripe en local
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Lancer les tests
npm run test

# Vérifier les erreurs de lint
npm run lint

# Formater le code
npm run format

# Build de production (pour tester)
npm run build
```

### 📊 Endpoints API disponibles

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/newsletter` | POST | Inscription newsletter (Brevo) |
| `/api/support` | POST | Création ticket Freshdesk |
| `/api/webhooks/stripe` | POST | Webhook Stripe (checkout, payment) |
| `/api/events/begin_checkout` | POST | Tracking événement checkout |
| `/api/checkout` | POST | Création session Stripe Checkout |
| `/api/product` | GET | Récupération produit |

### 🐛 Debugging

- **Logs HubSpot** : Vérifiez la console serveur (`npm run dev`)
- **Logs Brevo** : Vérifiez la console serveur
- **Logs Stripe** : Utilisez `stripe listen` pour voir les webhooks en temps réel
- **Logs Freshdesk** : Vérifiez la console serveur
- **Logs commandes** : Consultez `data/orders.json`

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
│   ├── product.ts        # Données produit
│   └── analytics.ts      # Fonctions analytics (dataLayer)
├── __tests__/            # Tests unitaires
└── public/               # Assets statiques
    └── optimized_images/ # Images optimisées avec LQIP
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
