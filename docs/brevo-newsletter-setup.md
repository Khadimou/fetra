# Configuration du Template Newsletter dans Brevo

## 📧 Template de Bienvenue Newsletter

Ce guide vous explique comment configurer l'email de bienvenue pour les nouveaux abonnés à votre newsletter.

---

## Étape 1 : Créer le template dans Brevo

1. **Connectez-vous à Brevo** : https://app.brevo.com
2. Allez dans **Campaigns** → **Templates**
3. Cliquez sur **Create a new template**
4. Choisissez **Transactional email template**

---

## Étape 2 : Configuration du template

### 2.1 Informations générales

- **Nom du template** : Newsletter - Bienvenue
- **Objet de l'email** : `Bienvenue dans la communauté FETRA ! 🌿`
- **Type** : Transactional

### 2.2 Contenu HTML

1. Sélectionnez **Edit in HTML**
2. Copiez-collez le contenu du fichier `email-template-newsletter-welcome.html`
3. **Important** : Remplacez les URL des réseaux sociaux par vos vraies URLs :
   - Instagram : `https://www.instagram.com/fetra_beauty/`
   - Facebook : `https://www.facebook.com/fetra_beauty`
   - TikTok : `https://www.tiktok.com/@fetra_beauty`

### 2.3 Variables utilisées

Le template utilise une seule variable :
- `{{ params.EMAIL }}` : L'adresse email de l'abonné (utilisée dans le footer)

### 2.4 Expéditeur

Configurez l'expéditeur par défaut :
- **Nom** : FETRA BEAUTY
- **Email** : contact@fetrabeauty.com (ou votre adresse vérifiée dans Brevo)

---

## Étape 3 : Tester le template

1. Cliquez sur **Preview** pour voir le rendu
2. Utilisez **Send a test email** pour recevoir un aperçu dans votre boîte mail
3. Vérifiez que :
   - ✅ Le logo s'affiche correctement
   - ✅ Le code promo est bien visible
   - ✅ Les liens fonctionnent
   - ✅ L'email est responsive (vérifier sur mobile)

---

## Étape 4 : Sauvegarder et noter l'ID

1. Cliquez sur **Save**
2. **Notez l'ID du template** qui apparaît (ex: Template #4, #5, etc.)

---

## Étape 5 : Configuration dans votre application

### 5.1 Ajoutez la variable d'environnement

Dans votre fichier `.env` (ou sur Vercel) :

```bash
BREVO_TEMPLATE_NEWSLETTER_WELCOME=4
```

Remplacez `4` par l'ID réel de votre template Brevo.

### 5.2 Variables Brevo requises

Assurez-vous que ces variables sont configurées :

```bash
# API Brevo
BREVO_API_KEY=xkeysib-votre-clé-api

# Expéditeur
BREVO_SENDER_EMAIL=contact@fetrabeauty.com
BREVO_SENDER_NAME=FETRA BEAUTY

# Templates
BREVO_TEMPLATE_NEWSLETTER_WELCOME=4
BREVO_TEMPLATE_ORDER_CONFIRM=2
BREVO_TEMPLATE_SHIPPED=3
```

### 5.3 Redémarrez votre application

- **En local** : Redémarrez votre serveur Next.js
- **Sur Vercel** : Redéployez votre application

---

## Étape 6 : Test en conditions réelles

1. Allez sur votre site : https://fetrabeauty.com
2. Inscrivez-vous à la newsletter avec un email de test
3. Vérifiez que vous recevez bien l'email de bienvenue

---

## 🎨 Personnalisation du template

### Modifier les couleurs

La couleur principale est `#8B7355` (olive/taupe). Pour la changer :
- Recherchez `#8B7355` dans le HTML
- Remplacez par votre couleur de marque

### Modifier le code promo

Dans le template HTML, ligne ~123, modifiez :
```html
<div class="promo-code">BIENVENUE10</div>
```

Et dans Stripe, créez le code promo correspondant :
1. Allez dans **Products** → **Coupons**
2. Créez un coupon `BIENVENUE10` : 10% de réduction
3. Ajoutez une limite de durée (ex: 30 jours après création)
4. Minimum d'achat : 35€

### Ajouter votre logo

Remplacez l'URL du logo (ligne ~61) :
```html
<img src="https://fetrabeauty.com/fetra_logo.png" alt="FETRA Beauty Logo">
```

---

## 📊 Suivi et Analytics

Dans Brevo, vous pouvez suivre :
- Taux d'ouverture des emails
- Clics sur les liens (CTA, réseaux sociaux)
- Utilisation du code promo

Allez dans **Statistics** → Sélectionnez votre template

---

## ❓ Dépannage

### L'email ne part pas
- Vérifiez que `BREVO_API_KEY` est correcte
- Vérifiez que l'ID du template est bon
- Consultez les logs dans votre console serveur

### Le logo ne s'affiche pas
- Assurez-vous que l'URL du logo est publique
- Vérifiez que l'image existe sur votre domaine
- Utilisez une URL absolue (pas de chemin relatif)

### Le code promo ne fonctionne pas
- Créez le coupon dans Stripe Dashboard
- Vérifiez qu'il n'est pas expiré
- Testez le code sur votre checkout

---

## 📧 Support

Si vous rencontrez des problèmes :
1. Consultez la documentation Brevo : https://developers.brevo.com/
2. Vérifiez vos logs serveur
3. Testez l'envoi via l'API Brevo directement

---

**Dernière mise à jour** : Octobre 2025

