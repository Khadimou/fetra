# Guide: Résoudre l'erreur Brevo API Key 401

## Problème
```
Brevo API error (401): {"message":"API Key is not enabled","code":"unauthorized"}
```

## Cause
La clé API Brevo dans `.env.local` n'est pas activée ou a expiré.

## Solution

### 1. Accéder aux API Keys Brevo
1. Connectez-vous à https://app.brevo.com
2. Allez dans **Settings** (Paramètres) → **API Keys** (Clés API)
3. Trouvez votre clé API actuelle ou créez-en une nouvelle

### 2. Vérifier le statut de la clé
- ✅ **Active** : La clé est utilisable
- ❌ **Disabled** : La clé est désactivée
- ⚠️ **Expired** : La clé a expiré

### 3. Régénérer une nouvelle clé (recommandé)
1. Cliquez sur **Create a new API key** (Créer une nouvelle clé API)
2. Donnez-lui un nom descriptif : `fetra-production`
3. Copiez la clé générée (commence par `xkeysib-...`)
4. ⚠️ **IMPORTANT** : Sauvegardez-la immédiatement, elle ne sera plus visible après

### 4. Mettre à jour `.env.local`
```bash
# Brevo (Sendinblue)
BREVO_API_KEY=xkeysib-NOUVELLE_CLE_ICI
BREVO_API_BASE=https://api.brevo.com
BREVO_SENDER_EMAIL=contact@fetrabeauty.com
BREVO_SENDER_NAME=FETRA BEAUTY
BREVO_TEMPLATE_ORDER_CONFIRM=2
BREVO_TEMPLATE_SHIPPED=3
```

### 5. Vérifier les templates d'email
Dans Brevo Dashboard:
1. Allez dans **Campaigns** → **Templates**
2. Vérifiez que les templates existent:
   - Template ID **2** : Order Confirmation
   - Template ID **3** : Shipping Confirmation
3. Si les templates n'existent pas, créez-les ou mettez à jour les IDs dans `.env.local`

### 6. Tester l'envoi d'email
Après avoir mis à jour la clé:
1. Redémarrez le serveur de dev : `npm run dev`
2. Passez une commande test
3. Vérifiez les logs pour confirmer l'envoi

## Vérification du compte Brevo

### Plan gratuit vs payant
- **Plan gratuit** : 300 emails/jour, accès API limité
- **Plan Lite** : Email illimité, accès API complet
- **Plan Business** : Fonctionnalités avancées

Si vous êtes sur le plan gratuit et dépassez la limite, upgrader vers Lite (9€/mois).

### Vérifier le quota
1. Dashboard Brevo → **Statistics**
2. Vérifiez le nombre d'emails envoyés aujourd'hui
3. Si quota dépassé, attendez minuit ou upgrader le plan

## Alternative temporaire: Email basique sans template

Si vous voulez tester rapidement sans templates Brevo, vous pouvez utiliser l'envoi d'email simple:

```typescript
// Dans webhook Stripe
await sendCustomEmail(
  customer.email,
  'Confirmation de commande - FETRA BEAUTY',
  `
    <h1>Merci pour votre commande !</h1>
    <p>Bonjour ${customer.name},</p>
    <p>Votre commande #${orderNumber} a bien été reçue.</p>
    <p>Montant total : ${amount} €</p>
    <p>À bientôt,<br>L'équipe FETRA BEAUTY</p>
  `,
  `Merci pour votre commande ! Votre commande #${orderNumber} a été reçue.`,
  customer.name
);
```

## Support Brevo
Si le problème persiste:
- 📧 Email: support@brevo.com
- 💬 Chat: Disponible dans le dashboard
- 📚 Documentation: https://developers.brevo.com

## Checklist finale
- [ ] Nouvelle clé API générée dans Brevo
- [ ] `.env.local` mis à jour avec la nouvelle clé
- [ ] Templates d'email créés (IDs 2 et 3)
- [ ] Serveur redémarré
- [ ] Test de commande effectué
- [ ] Email de confirmation reçu
