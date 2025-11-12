# Fonctionnalité: Comptes clients et suivi de commandes

## Vue d'ensemble

Cette fonctionnalité permet aux clients de créer un compte après leur achat pour suivre leurs commandes en temps réel. Les commandes passées avant la création du compte sont automatiquement liées au compte si l'email correspond.

## Fonctionnalités

### 1. Création de compte post-achat
- **Où**: Page de succès (`/success`)
- **Composant**: `PostPurchaseSignup`
- **UX**:
  - Email et nom pré-remplis depuis la commande
  - Seulement un mot de passe requis (min 8 caractères)
  - Auto-connexion après création
  - Redirection automatique vers le dashboard

### 2. Dashboard client
- **URL**: `/account/orders`
- **Accès**: Requiert authentification (NextAuth)
- **Affichage**:
  - Liste de toutes les commandes du client
  - Détails de chaque commande (produits, montant, statut)
  - Informations de livraison et tracking
  - Statuts en temps réel

### 3. Liaison automatique des commandes
- Toutes les commandes avec le même email sont automatiquement liées au compte
- Fonctionne même si les commandes ont été passées avant la création du compte

## Architecture

### API Endpoints

#### `POST /api/customer/signup`
Crée un nouveau compte client et lie les commandes existantes.

**Requête**:
```json
{
  "email": "client@example.com",
  "password": "motdepasse123",
  "name": "Jean Dupont"
}
```

**Réponse**:
```json
{
  "success": true,
  "message": "Compte créé avec succès",
  "user": {
    "id": "user_id",
    "email": "client@example.com",
    "name": "Jean Dupont"
  },
  "ordersLinked": 2
}
```

#### `GET /api/customer/orders`
Récupère toutes les commandes du client connecté.

**Headers**:
- Requiert session NextAuth valide

**Réponse**:
```json
{
  "orders": [
    {
      "id": "order_id",
      "orderNumber": "FETRA-ABC123",
      "status": "shipped",
      "amount": 49.90,
      "currency": "eur",
      "createdAt": "2025-01-15T10:30:00Z",
      "items": [...],
      "shipping": {...}
    }
  ]
}
```

### Composants

#### `PostPurchaseSignup`
- **Localisation**: `components/PostPurchaseSignup.tsx`
- **Props**: Aucune (récupère les données via URL params)
- **État**:
  - Masqué si l'utilisateur est déjà connecté
  - Affiche un message de succès après création
  - Auto-login et redirection

#### Dashboard
- **Localisation**: `app/[locale]/account/orders/page.tsx`
- **Authentification**: Protégé par NextAuth
- **Fonctionnalités**:
  - Liste paginée des commandes
  - Filtrage par statut
  - Lien vers tracking Colissimo

## Statuts de commande

| Statut | Label | Description |
|--------|-------|-------------|
| `pending` | En attente | Paiement en attente |
| `paid` | Payée | Paiement confirmé |
| `processing` | En préparation | Commande en cours de préparation |
| `shipped` | Expédiée | Colis expédié avec numéro de suivi |
| `delivered` | Livrée | Colis livré au client |
| `cancelled` | Annulée | Commande annulée |

## Workflow utilisateur

### Premier achat (sans compte)
1. Client passe une commande → paiement Stripe
2. Redirection vers `/success?session_id=...`
3. Affichage du composant `PostPurchaseSignup`
4. Client crée un compte (email pré-rempli)
5. Auto-connexion et redirection vers `/account/orders`
6. Visualisation de sa commande récente

### Achats suivants (avec compte)
1. Client se connecte avant de commander (optionnel)
2. Passe une commande
3. Redirection vers `/success`
4. Si connecté: affiche "Voir mes commandes"
5. Si non connecté: affiche le formulaire de création de compte

### Consultation des commandes
1. Aller sur `/account/orders` (ou se connecter depuis `/admin/login`)
2. Voir toutes les commandes avec détails
3. Cliquer sur un numéro de suivi pour suivre le colis

## Sécurité

### Authentification
- Utilise NextAuth v4 avec provider `credentials`
- Mot de passe hashé avec bcrypt (10 rounds)
- Sessions JWT stockées en cookie sécurisé

### Autorisation
- Les clients ne peuvent voir que leurs propres commandes
- Vérification de la session sur chaque requête API
- Correspondance email client ↔ commandes vérifiée côté serveur

### Validation
- Mot de passe minimum 8 caractères
- Email validé et normalisé (lowercase)
- Vérification d'email unique avant création

## Améliorations futures

### Court terme
- [ ] Envoyer email de bienvenue après création de compte
- [ ] Permettre la modification du profil (nom, email, mot de passe)
- [ ] Ajouter un bouton "Racheter" pour recommander le même produit

### Moyen terme
- [ ] Historique de points fidélité
- [ ] Codes promo personnalisés pour les clients fidèles
- [ ] Notifications email pour changement de statut
- [ ] Export PDF de la facture

### Long terme
- [ ] Programme de parrainage
- [ ] Wishlist / Liste d'envies
- [ ] Gestion des adresses multiples
- [ ] Intégration avec HubSpot pour le scoring client

## Tests

### Test du flux complet
1. Passer une commande sans compte
2. Sur la page de succès, créer un compte
3. Vérifier la redirection vers `/account/orders`
4. Vérifier que la commande apparaît dans la liste
5. Se déconnecter et se reconnecter
6. Vérifier que la commande est toujours visible

### Test de liaison automatique
1. Passer 2 commandes sans compte avec le même email
2. Créer un compte avec cet email
3. Vérifier que les 2 commandes sont visibles dans le dashboard

### Test de sécurité
1. Créer un compte avec email A
2. Essayer d'accéder aux commandes d'un autre email B
3. Vérifier que seules les commandes de A sont visibles

## Dépannage

### Le formulaire de création ne s'affiche pas
- Vérifier que l'utilisateur n'est pas déjà connecté
- Vérifier que `session_id` est présent dans l'URL
- Vérifier les logs console pour les erreurs d'API

### Les commandes ne sont pas liées
- Vérifier que l'email est exactement le même (casse comprise)
- Vérifier que les commandes ont bien un `customerId` dans la DB
- Vérifier les logs de l'API `/api/customer/signup`

### Auto-login échoue
- Vérifier que le mot de passe est correct
- Vérifier la configuration NextAuth dans `.env.local`
- Vérifier que `NEXTAUTH_SECRET` est configuré

## Support

Pour toute question ou problème:
- 📧 Email: dev@fetrabeauty.com
- 📚 Documentation NextAuth: https://next-auth.js.org
- 📚 Documentation Prisma: https://www.prisma.io/docs
