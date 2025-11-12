# Guide: Codes Promo Personnalisés pour Abonnés Newsletter

## 🎯 Vue d'ensemble

Votre système génère automatiquement des codes promo **uniques et personnalisés** pour chaque personne qui s'abonne à votre newsletter. Ces codes sont exclusifs aux abonnés et ne peuvent être utilisés qu'une seule fois.

---

## ✨ Fonctionnalités

### Génération Automatique
- ✅ Code unique créé à chaque inscription newsletter
- ✅ Format : `NEWS-ABC123` (6 caractères aléatoires)
- ✅ **15% de réduction** par défaut
- ✅ Valide pendant **30 jours**
- ✅ **Usage unique** par abonné

### Validation Sécurisée
- ✅ Validation côté serveur (impossible à contourner)
- ✅ Vérification de l'expiration
- ✅ Limite d'utilisation respectée
- ✅ Codes désactivables par admin

### Intégration Complète
- ✅ Email de bienvenue avec le code
- ✅ Application automatique au panier
- ✅ Décompte d'utilisation après paiement
- ✅ Tracking HubSpot + Brevo

---

## 🚀 Workflow Complet

```
┌─────────────────────────────────────────────────┐
│ 1. Utilisateur s'inscrit à la newsletter       │
│    → Formulaire sur le site                     │
│    → POST /api/newsletter                       │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ 2. Système génère un code promo unique         │
│    → Code: NEWS-A7B3X9                          │
│    → Réduction: 15%                             │
│    → Validité: 30 jours                         │
│    → Usage: 1 fois maximum                      │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ 3. Email de bienvenue envoyé (Brevo)           │
│    → "Voici votre code exclusif: NEWS-A7B3X9"  │
│    → Template avec design personnalisé          │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ 4. Client utilise le code au checkout          │
│    → Saisit NEWS-A7B3X9 dans le panier         │
│    → Validation en temps réel                   │
│    → 15% appliqué au total                      │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ 5. Après paiement Stripe réussi                 │
│    → Webhook incrémente le compteur             │
│    → Code marqué comme "utilisé"                │
│    → Plus réutilisable                          │
└─────────────────────────────────────────────────┘
```

---

## 📊 Structure Base de Données

### Table: `promo_codes`

```prisma
model PromoCode {
  id              String         // ID unique
  code            String         // NEWS-A7B3X9 (unique)
  type            PromoCodeType  // NEWSLETTER, VIP, SEASONAL...

  // Réduction
  discountType    DiscountType   // PERCENTAGE, FIXED_AMOUNT
  discountValue   Decimal        // 15 (pour 15%)

  // Limites
  maxUses         Int?           // 1 (usage unique)
  currentUses     Int            // Compteur d'utilisations
  isActive        Boolean        // true/false

  // Validité
  validFrom       DateTime       // Date de création
  validUntil      DateTime?      // +30 jours

  // Lien abonné
  subscriberEmail String?        // email@example.com
}
```

### Types de Codes

```typescript
enum PromoCodeType {
  NEWSLETTER      // Pour abonnés newsletter (auto)
  WELCOME         // Code de bienvenue général
  VIP             // Clients VIP fidèles
  SEASONAL        // Soldes saisonnières
  ABANDONED_CART  // Récupération panier abandonné
  REFERRAL        // Programme de parrainage
  CUSTOM          // Codes manuels admin
}

enum DiscountType {
  PERCENTAGE      // 15% de réduction
  FIXED_AMOUNT    // 10€ de réduction
  FREE_SHIPPING   // Livraison gratuite
}
```

---

## 🛠 Configuration

### 1. Template Email Brevo

Créez un template dans Brevo avec ces variables :

```
{{ EMAIL }}        → email du subscriber
{{ PROMO_CODE }}   → code généré (NEWS-ABC123)
{{ HAS_PROMO }}    → "true" si code généré
```

**Exemple de template :**

```html
<html>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">

    <h1 style="color: #2d3748;">🎉 Bienvenue chez FETRA BEAUTY !</h1>

    <p style="font-size: 16px; color: #4a5568;">
      Merci de vous être inscrit à notre newsletter !
    </p>

    <p style="font-size: 16px; color: #4a5568;">
      Pour vous remercier, voici votre <strong>code promo exclusif</strong> :
    </p>

    <div style="background: #f7fafc; border-left: 4px solid #4299e1; padding: 20px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #718096;">Votre code :</p>
      <p style="margin: 10px 0 0 0; font-size: 28px; font-weight: bold; color: #2d3748; letter-spacing: 2px;">
        {{ PROMO_CODE }}
      </p>
    </div>

    <ul style="font-size: 14px; color: #718096; line-height: 1.8;">
      <li>✅ <strong>15% de réduction</strong> sur votre première commande</li>
      <li>✅ Valable pendant <strong>30 jours</strong></li>
      <li>✅ <strong>Usage unique</strong></li>
    </ul>

    <a href="https://www.fetrabeauty.com/products"
       style="display: inline-block; background: #2d3748; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
      Découvrir nos produits
    </a>

    <p style="margin-top: 30px; font-size: 12px; color: #a0aec0;">
      Ce code expire le {{ EXPIRY_DATE }}
    </p>
  </div>
</body>
</html>
```

### 2. Variables d'Environnement

Ajoutez dans votre `.env.local` :

```bash
# Template ID Brevo pour email newsletter
BREVO_TEMPLATE_NEWSLETTER_WELCOME=4

# Stripe (pour tracking usage des codes)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 💻 Utilisation Admin

### Créer un Code Promo Manuel

```typescript
import { createCustomPromoCode } from '@/lib/promo-codes';
import { PromoCodeType, DiscountType } from '@prisma/client';

// Code VIP 20% permanent
const vipCode = await createCustomPromoCode({
  code: 'VIP20',
  type: PromoCodeType.VIP,
  discountType: DiscountType.PERCENTAGE,
  discountValue: 20,
  maxUses: null, // Illimité
  validUntil: null // Pas d'expiration
});

// Code soldes -25% limité à 100 utilisations
const saleCode = await createCustomPromoCode({
  code: 'SOLDES25',
  type: PromoCodeType.SEASONAL,
  discountType: DiscountType.PERCENTAGE,
  discountValue: 25,
  maxUses: 100,
  validUntil: new Date('2025-02-01')
});

// Code parrainage -10€
const referralCode = await createCustomPromoCode({
  code: 'PARRAIN10',
  type: PromoCodeType.REFERRAL,
  discountType: DiscountType.FIXED_AMOUNT,
  discountValue: 10,
  maxUses: 1
});
```

### Lister les Codes Actifs

```typescript
import { getActivePromoCodes } from '@/lib/promo-codes';

const codes = await getActivePromoCodes();
console.log(codes);
```

### Désactiver un Code

```typescript
import { deactivatePromoCode } from '@/lib/promo-codes';

await deactivatePromoCode('code-id-here');
```

---

## 🔍 API Endpoints

### POST `/api/promo-code/validate`

Valide un code promo.

**Request:**
```json
{
  "code": "NEWS-A7B3X9"
}
```

**Response (succès):**
```json
{
  "success": true,
  "promoCode": {
    "id": "clxyz123",
    "code": "NEWS-A7B3X9",
    "type": "NEWSLETTER",
    "discountType": "PERCENTAGE",
    "discountValue": 15,
    "subscriberEmail": "client@example.com"
  }
}
```

**Response (erreur):**
```json
{
  "error": "Ce code promo a expiré"
}
```

### POST `/api/newsletter`

S'abonner à la newsletter (génère le code promo).

**Request:**
```json
{
  "email": "nouveau@client.com"
}
```

**Response:**
```json
{
  "ok": true,
  "data": { ... },
  "promoCode": {
    "code": "NEWS-A7B3X9",
    "discount": 15,
    "validUntil": "2025-02-11T10:00:00.000Z"
  }
}
```

---

## 📈 Tracking & Analytics

### HubSpot

Quand un code promo est utilisé, HubSpot reçoit ces données :

```javascript
{
  email: "client@example.com",
  last_promo_code: "NEWS-A7B3X9",
  last_promo_discount: 15,
  last_order_amount: 42.41, // Après réduction
  original_order_amount: 49.90 // Avant réduction
}
```

### Brevo

Attributs mis à jour :

```javascript
{
  HAS_USED_PROMO: true,
  LAST_PROMO_CODE: "NEWS-A7B3X9",
  SIGNUP_DATE: "2025-01-12"
}
```

---

## 🧪 Tester le Système

### 1. Inscription Newsletter

```bash
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

Résultat attendu :
```json
{
  "ok": true,
  "promoCode": {
    "code": "NEWS-XYZ789",
    "discount": 15,
    "validUntil": "2025-02-11..."
  }
}
```

### 2. Vérifier l'Email

Connectez-vous à Brevo → Logs → Transactional Emails

Vous devriez voir un email envoyé à `test@example.com` avec le code.

### 3. Valider le Code

```bash
curl -X POST http://localhost:3000/api/promo-code/validate \
  -H "Content-Type: application/json" \
  -d '{"code":"NEWS-XYZ789"}'
```

### 4. Tester le Checkout

1. Ajoutez un produit au panier
2. Sur la page checkout, saisissez `NEWS-XYZ789`
3. Cliquez "Appliquer"
4. Vérifiez que 15% est déduit
5. Finalisez le paiement (carte test Stripe: `4242 4242 4242 4242`)
6. Vérifiez dans la base que `currentUses` est passé à `1`

---

## 🎨 Personnalisation

### Changer le Pourcentage de Réduction

Éditez `app/api/newsletter/route.ts`:

```typescript
// Ligne 75 - changez 15 par votre pourcentage
promoCode = await createNewsletterPromoCode(email, 20, 30); // 20% au lieu de 15%
```

### Changer la Durée de Validité

```typescript
// Ligne 75 - changez 30 par votre nombre de jours
promoCode = await createNewsletterPromoCode(email, 15, 60); // 60 jours au lieu de 30
```

### Autoriser Plusieurs Utilisations

Éditez `lib/promo-codes.ts` ligne 58:

```typescript
maxUses: 3, // Au lieu de 1
```

---

## 🛡️ Sécurité

### Protections en Place

✅ **Validation serveur obligatoire** - Impossible de contourner côté client
✅ **Vérification d'expiration** - Codes expirés automatiquement refusés
✅ **Limite d'utilisation** - Un code = un usage (configurable)
✅ **Désactivation admin** - Codes révocables à tout moment
✅ **Traçabilité** - Chaque utilisation est loggée

### Best Practices

- ⚠️ Ne JAMAIS générer de codes prévisibles (ex: `NEWS-000001`)
- ⚠️ Ne JAMAIS accepter un code expiré même si l'utilisateur insiste
- ⚠️ Logger toutes les tentatives de validation pour détecter les abus
- ⚠️ Limiter le nombre de tentatives par IP (anti brute-force)

---

## 📊 KPIs à Suivre

### Dashboards Recommandés

**1. Taux de Conversion Newsletter → Achat**
```sql
SELECT
  COUNT(DISTINCT subscriber_email) as subscribers,
  COUNT(DISTINCT CASE WHEN current_uses > 0 THEN subscriber_email END) as buyers,
  ROUND(COUNT(DISTINCT CASE WHEN current_uses > 0 THEN subscriber_email END) * 100.0 / COUNT(DISTINCT subscriber_email), 2) as conversion_rate
FROM promo_codes
WHERE type = 'NEWSLETTER';
```

**2. Codes les Plus Utilisés**
```sql
SELECT
  type,
  COUNT(*) as total_codes,
  SUM(current_uses) as total_uses,
  AVG(current_uses) as avg_uses_per_code
FROM promo_codes
GROUP BY type
ORDER BY total_uses DESC;
```

**3. Revenu Généré vs Remise Accordée**
```sql
-- TODO: À intégrer avec la table Orders
SELECT
  COUNT(*) as orders_with_promo,
  SUM(amount) as total_revenue,
  SUM(amount * discount_rate) as total_discount
FROM orders
WHERE promo_code_id IS NOT NULL;
```

---

## 🆘 Dépannage

### Problème: Les codes ne sont pas générés

**Solutions :**
1. Vérifiez que `npx prisma db push` a bien créé la table `promo_codes`
2. Vérifiez les logs serveur : `npx tsx scripts/test-integrations.ts`
3. Testez manuellement la création :
   ```bash
   npm run test -- promo-codes
   ```

### Problème: Email sans code promo

**Solutions :**
1. Vérifiez que `BREVO_TEMPLATE_NEWSLETTER_WELCOME` est configuré
2. Vérifiez que le template Brevo contient `{{ PROMO_CODE }}`
3. Vérifiez les logs Brevo dans le dashboard

### Problème: Code refusé au checkout

**Solutions :**
1. Vérifiez l'expiration : `SELECT * FROM promo_codes WHERE code = 'NEWS-XYZ789'`
2. Vérifiez le compteur : `current_uses` ne doit pas dépasser `max_uses`
3. Vérifiez que `is_active = true`

---

## 🚀 Prochaines Étapes

### Fonctionnalités Futures

**1. Interface Admin**
- [ ] Dashboard des codes promo
- [ ] Créer/éditer/supprimer des codes
- [ ] Statistiques d'utilisation en temps réel

**2. Codes Avancés**
- [ ] Codes avec minimum d'achat (ex: -20% si > 50€)
- [ ] Codes cumulables
- [ ] Codes liés à des produits spécifiques

**3. Gamification**
- [ ] Codes cachés dans les emails
- [ ] Codes de parrainage (invitez 3 amis = -30%)
- [ ] Programme de fidélité avec niveaux

---

## 📚 Ressources

### Fichiers Importants

- `lib/promo-codes.ts` - Utilitaires de gestion des codes
- `app/api/promo-code/validate/route.ts` - API de validation
- `app/api/newsletter/route.ts` - Génération auto des codes
- `app/api/checkout/route.ts` - Application des réductions
- `app/api/webhooks/stripe/route.ts` - Décompte d'utilisation
- `lib/integrations/brevo.ts` - Email avec code promo

### Documentation Externe

- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Brevo Transactional Email API](https://developers.brevo.com/reference/sendtransacemail)

---

**Besoin d'aide ?** Consultez les logs serveur ou contactez le support technique.
