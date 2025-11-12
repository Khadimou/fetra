# Dépannage : Pas d'email après paiement 📧

## Problème : Le paiement réussit mais aucun email n'est envoyé

---

## 🔍 Diagnostic rapide

### Étape 1 : Vérifier si vous êtes en local ou en production

**En LOCAL (localhost:3000)** :
- Stripe ne peut PAS appeler votre webhook automatiquement
- Vous devez utiliser **Stripe CLI** pour écouter les webhooks

**En PRODUCTION (Vercel/fetrabeauty.com)** :
- Le webhook doit être configuré dans Stripe Dashboard
- L'URL doit pointer vers votre domaine de production

---

## ✅ Solution 1 : Configuration pour LOCAL (développement)

### A. Installer Stripe CLI

**Windows :**
```powershell
# Téléchargez depuis https://github.com/stripe/stripe-cli/releases/latest
# Ou avec Scoop :
scoop install stripe
```

**Mac/Linux :**
```bash
brew install stripe/stripe-cli/stripe
```

### B. Se connecter à Stripe

```bash
stripe login
```

Cela ouvrira votre navigateur pour autoriser l'accès.

### C. Écouter les webhooks en local

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Vous verrez :**
```
> Ready! You are using Stripe API Version [2024-xx-xx]. 
> Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

### D. Ajouter le secret dans .env.local

Copiez le secret affiché et ajoutez-le dans `.env.local` :

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### E. Redémarrer votre serveur Next.js

```bash
npm run dev
```

### F. Tester le paiement

1. Gardez `stripe listen` en cours d'exécution
2. Faites un paiement de test
3. Vérifiez les logs dans le terminal où `stripe listen` tourne
4. Vous devriez recevoir l'email !

---

## ✅ Solution 2 : Configuration pour PRODUCTION (Vercel)

### A. Configurer le webhook dans Stripe Dashboard

1. Connectez-vous à **Stripe Dashboard** : https://dashboard.stripe.com/
2. Allez dans **Developers** → **Webhooks**
3. Cliquez sur **Add endpoint**

**Configuration :**
```
URL du endpoint : https://fetrabeauty.com/api/webhooks/stripe
Description : Order confirmation emails
Version : Latest API version
```

**Événements à écouter :**
- ✅ `checkout.session.completed`
- ✅ `payment_intent.succeeded`

4. Cliquez sur **Add endpoint**

### B. Récupérer le signing secret

Après création, cliquez sur votre webhook et copiez le **Signing secret** (commence par `whsec_`)

### C. Ajouter le secret dans Vercel

1. Allez dans votre projet Vercel
2. **Settings** → **Environment Variables**
3. Ajoutez :
   ```
   STRIPE_WEBHOOK_SECRET = whsec_xxxxxxxxxxxxx
   ```

### D. Redéployer

Vercel redéploie automatiquement, mais vous pouvez forcer :
```bash
git push
```

Ou dans Vercel Dashboard : **Deployments** → **Redeploy**

### E. Tester le webhook

Dans Stripe Dashboard → Webhooks → Votre endpoint → **Send test webhook**

Choisissez `checkout.session.completed` et envoyez.

Vérifiez les logs dans Vercel : **Deployments** → Dernier deploy → **View Function Logs**

---

## ✅ Solution 3 : Vérifier les variables d'environnement Brevo

L'email de confirmation nécessite ces variables :

### Variables requises :

```bash
# API Brevo
BREVO_API_KEY=xkeysib-votre-clé

# Expéditeur
BREVO_SENDER_EMAIL=contact@fetrabeauty.com
BREVO_SENDER_NAME=FETRA BEAUTY

# Template de confirmation de commande
BREVO_TEMPLATE_ORDER_CONFIRM=2
```

### Vérifier dans Vercel :

1. **Settings** → **Environment Variables**
2. Vérifiez que toutes ces variables existent
3. Si manquantes, ajoutez-les et redéployez

---

## ✅ Solution 4 : Créer/Vérifier le template Brevo

### A. Vérifier que le template existe

1. Connectez-vous à **Brevo** : https://app.brevo.com
2. **Campaigns** → **Templates**
3. Cherchez un template "Confirmation de commande"

### B. Si le template n'existe pas, créez-le

**Type** : Transactional email template

**Objet** :
```
Merci {{ params.FIRSTNAME }} ! Nous préparons votre rituel FETRA (cmd {{ params.ORDERNUMBER }})
```

**Variables utilisées** :
- `{{ params.FIRSTNAME }}`
- `{{ params.ORDERNUMBER }}`
- `{{ params.ORDERDATE }}`
- `{{ params.ORDERTOTAL }}`
- `{{ params.CURRENCY }}`

**Contenu suggéré** :
```html
<h1>Merci pour votre commande !</h1>
<p>Bonjour {{ params.FIRSTNAME }},</p>
<p>Votre commande <strong>{{ params.ORDERNUMBER }}</strong> a bien été enregistrée.</p>

<div style="background: #f4f4f4; padding: 20px; border-radius: 8px;">
  <p><strong>Détails de la commande :</strong></p>
  <p>Date : {{ params.ORDERDATE }}</p>
  <p>Montant : {{ params.ORDERTOTAL }} {{ params.CURRENCY }}</p>
</div>

<p>Nous préparons votre colis avec soin. Vous recevrez un email avec le suivi d'expédition dès l'envoi.</p>

<p>À très bientôt,<br>L'équipe FETRA Beauty</p>
```

### C. Noter l'ID du template

Après création, notez l'ID (ex: 2, 3, etc.) et mettez-le dans :
```bash
BREVO_TEMPLATE_ORDER_CONFIRM=2
```

---

## 🔧 Debug : Vérifier les logs

### En LOCAL :

Dans votre terminal où tourne `npm run dev`, vous devriez voir :
```
Order confirmation email sent: client@example.com
```

Si vous voyez :
```
Order confirmation email error: BREVO_TEMPLATE_ORDER_CONFIRM not configured
```
→ Le template n'est pas configuré.

### En PRODUCTION (Vercel) :

1. **Vercel Dashboard** → Votre projet
2. **Deployments** → Dernier déploiement
3. **View Function Logs**
4. Filtrez par `api/webhooks/stripe`

Cherchez :
- ✅ `Order confirmation email sent: ...`
- ❌ `Order confirmation email error: ...`

---

## 🧪 Test rapide avec Stripe CLI

Même en production, vous pouvez tester le webhook localement :

```bash
# 1. Déclencher un événement de test
stripe trigger checkout.session.completed

# Ou créer une vraie session de test
stripe checkout sessions create \
  --success-url="https://fetrabeauty.com/success" \
  --line-items[][price_data][currency]=eur \
  --line-items[][price_data][product_data][name]="Test Product" \
  --line-items[][price_data][unit_amount]=90 \
  --line-items[][quantity]=1 \
  --mode=payment
```

---

## 📋 Checklist de dépannage

Cochez chaque élément :

### Pour LOCAL :
- [ ] Stripe CLI est installé
- [ ] `stripe listen --forward-to localhost:3000/api/webhooks/stripe` est en cours
- [ ] `STRIPE_WEBHOOK_SECRET` est dans `.env.local`
- [ ] `BREVO_API_KEY` est configurée
- [ ] `BREVO_TEMPLATE_ORDER_CONFIRM` est configurée
- [ ] Serveur Next.js redémarré après avoir ajouté les variables

### Pour PRODUCTION :
- [ ] Webhook configuré dans Stripe Dashboard
- [ ] URL du webhook : `https://fetrabeauty.com/api/webhooks/stripe`
- [ ] Événement `checkout.session.completed` activé
- [ ] `STRIPE_WEBHOOK_SECRET` ajouté dans Vercel
- [ ] `BREVO_API_KEY` dans Vercel
- [ ] `BREVO_TEMPLATE_ORDER_CONFIRM` dans Vercel
- [ ] Application redéployée après les changements

---

## 💡 Test avec mode développement (bypass webhook)

Si vous voulez tester l'envoi d'email sans passer par Stripe, créez un endpoint de test :

Créez `app/api/test/order-email/route.ts` :

```typescript
import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/integrations/brevo';

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    
    await sendOrderConfirmationEmail(
      email || 'test@example.com',
      name || 'Test User',
      {
        orderNumber: 'FETRA-TEST1234',
        orderDate: '30/10/2025',
        orderTotal: '0,90',
        currency: '€'
      }
    );

    return NextResponse.json({ ok: true, message: 'Email sent!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

Testez avec curl ou Postman :
```bash
curl -X POST https://0fa5d0e0758d.ngrok-free.app//api/test/order-email \
  -H "Content-Type: application/json" \
  -d '{"email":"votreemail@example.com","name":"Votre Nom"}'
```

---

## ❓ Questions fréquentes

**Q : Combien de temps prend le webhook pour s'exécuter ?**
R : Généralement < 2 secondes. L'email devrait arriver quasi instantanément.

**Q : Le webhook fonctionne en test mode ?**
R : Oui, Stripe test mode supporte les webhooks.

**Q : Puis-je voir l'historique des webhooks ?**
R : Oui, dans Stripe Dashboard → Developers → Webhooks → Cliquez sur votre endpoint → Logs

**Q : L'email part mais arrive en spam**
R : Consultez `docs/email-deliverability-guide.md` pour configurer SPF/DKIM/DMARC

---

**Dernière mise à jour** : Octobre 2025

