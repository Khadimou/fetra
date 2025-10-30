# Email Automation - FETRA

Ce document explique le système d'envoi automatique d'emails via Brevo.

## Configuration

### Variables d'environnement requises

```bash
# Brevo (Sendinblue) Email Marketing & Transactional
BREVO_API_KEY=xkeysib-...
BREVO_SENDER_EMAIL=contact@fetrabeauty.com
BREVO_SENDER_NAME=FETRA BEAUTY
BREVO_TEMPLATE_ORDER_CONFIRM=2
BREVO_TEMPLATE_SHIPPED=3
BREVO_TEMPLATE_NEWSLETTER_WELCOME=4
```

### Templates Brevo configurés

1. **Template ID 2** - Confirmation de commande
   - Objet: `Merci {{ params.FIRSTNAME }} ! Nous préparons votre rituel FETRA (cmd {{ params.ORDERNUMBER }})`
   - Variables: `FIRSTNAME`, `ORDERNUMBER`, `ORDERDATE`, `ORDERTOTAL`, `CURRENCY`

2. **Template ID 3** - Commande expédiée
   - Objet: `En route vers vous ! Suivi de votre colis FETRA`
   - Variables: `FIRSTNAME`, `ORDERNUMBER`, `TRACKINGURL`

3. **Template ID 4** - Bienvenue newsletter (à créer)
   - Objet: `Bienvenue dans la communauté FETRA ! 🌿`
   - Variables: `EMAIL`
   - Contenu suggéré: Message de bienvenue, présentation de la marque, code promo optionnel

## Fonctionnement automatique

### 1. Email de confirmation (automatique)

L'email de confirmation est envoyé **automatiquement** après chaque paiement réussi via le webhook Stripe (`checkout.session.completed`).

**Données envoyées:**
- `FIRSTNAME`: Prénom du client
- `ORDERNUMBER`: Numéro de commande formaté (ex: `FETRA-ABC12345`)
- `ORDERDATE`: Date au format français (ex: `30/10/2025`)
- `ORDERTOTAL`: Montant formaté (ex: `49,90`)
- `CURRENCY`: Devise (`€`)

### 2. Email d'expédition (manuel)

L'email d'expédition doit être déclenché manuellement via l'API quand vous expédiez la commande.

**Endpoint:** `POST /api/orders/ship`

**Payload:**
```json
{
  "orderId": "cs_test_abc123...",
  "customerEmail": "client@example.com",
  "customerName": "John Doe",
  "trackingNumber": "3S123456789",
  "carrier": "colissimo"
}
```

**Carriers supportés:**
- `colissimo` / `laposte` → URL La Poste
- `mondial` / `relay` → URL Mondial Relay
- `ups` → URL UPS
- `dhl` → URL DHL
- Autre → URL générique AfterShip

## Test des emails

### Test via Brevo (recommandé)
1. Allez dans Brevo → Templates → "Confirmation de commande"
2. Cliquez "Aperçu et test"
3. Activez "Ajouter des données JSON transactionnelles"
4. Collez le JSON de test:
```json
{
  "params": {
    "FIRSTNAME": "John",
    "ORDERNUMBER": "FETRA-TEST123",
    "ORDERDATE": "30/10/2025",
    "ORDERTOTAL": "49,90",
    "CURRENCY": "€"
  }
}
```

### Test via l'API (développement)
```bash
# Test email confirmation (ne pas utiliser en production)
curl -X POST http://localhost:3000/api/test/email-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User"
  }'

# Test email expédition
curl -X POST http://localhost:3000/api/orders/ship \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "cs_test_123",
    "customerEmail": "test@example.com",
    "customerName": "Test User",
    "trackingNumber": "3S123456789",
    "carrier": "colissimo"
  }'
```

## Monitoring et logs

### Logs de succès
```
✅ Order confirmation email sent: customer@example.com
✅ Shipping confirmation email sent: { email: customer@example.com, orderId: cs_abc123, trackingNumber: 3S123456789, carrier: colissimo }
```

### Logs d'erreur
```
❌ Order confirmation email error: BREVO_TEMPLATE_ORDER_CONFIRM not configured
❌ Shipping confirmation email error: BREVO_API_KEY not configured
```

### Intégration Sentry
Les erreurs d'envoi d'email sont automatiquement capturées par Sentry avec le contexte (orderId, email, etc.).

## Workflow recommandé

1. **Commande payée** → Email de confirmation automatique ✅
2. **Commande préparée** → (Optionnel) Email "Commande en préparation"
3. **Commande expédiée** → Appelez `/api/orders/ship` → Email avec tracking ✅
4. **Commande livrée** → (Futur) Email de satisfaction/avis

## Dépannage

### Email de confirmation non envoyé
- Vérifiez les logs du webhook Stripe
- Vérifiez que `BREVO_TEMPLATE_ORDER_CONFIRM=2`
- Testez manuellement l'API Brevo

### Email d'expédition non envoyé
- Vérifiez le payload de `/api/orders/ship`
- Vérifiez que `BREVO_TEMPLATE_SHIPPED=3`
- Le `trackingNumber` et `carrier` sont-ils corrects ?

### Template Brevo non trouvé
```bash
# Lister tous les templates
curl -X GET "https://api.brevo.com/v3/smtp/templates?templateStatus=true" \
  -H "api-key: YOUR_BREVO_API_KEY"
```

## Évolutions futures

- Email de livraison confirmée
- Email de demande d'avis (J+7)
- Email de relance panier abandonné
- Segmentation Brevo par type de client
