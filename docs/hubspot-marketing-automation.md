# Guide: Automatisation Marketing avec HubSpot

## 🔐 Étape 1: Obtenir votre Access Token HubSpot

### 1.1 Créer une Private App

1. Connectez-vous à https://app.hubspot.com
2. Allez dans **Settings** (⚙️ en haut à droite) → **Integrations** → **Private Apps**
3. Cliquez sur **Create a private app**

### 1.2 Configuration de l'app

**Informations de base:**
- **Name:** FETRA E-commerce Integration
- **Description:** Integration for FETRA Beauty e-commerce platform

**Scopes (Permissions):**
Activez les permissions suivantes:

**CRM:**
- ✅ `crm.objects.contacts.read` - Lire les contacts
- ✅ `crm.objects.contacts.write` - Créer/Modifier les contacts

**Events:**
- ✅ `analytics.behavioral_events.send` - Envoyer des événements custom

### 1.3 Générer le token

1. Cliquez sur **Create app**
2. Copiez le **Access Token** (commence par `pat-...`)
3. ⚠️ **IMPORTANT:** Sauvegardez-le immédiatement, il ne sera plus visible après

### 1.4 Ajouter à votre .env.local

```bash
# HubSpot Private App Access Token
HUBSPOT_ACCESS_TOKEN=pat-...votre-token-ici

# HubSpot Portal ID (pour le tracking web)
NEXT_PUBLIC_HUBSPOT_ID=12345678
```

**Comment trouver le Portal ID:**
- Settings → Account Setup → Account Details → HubSpot Account ID

---

## ✅ Étape 2: Tester la connexion

```bash
npm run test
npx tsx scripts/test-integrations.ts
```

Vous devriez voir:
```
✅ HubSpot API connected successfully!
   Total contacts: 0
```

---

## 📊 Étape 3: Créer des propriétés personnalisées

Dans HubSpot, créez ces propriétés de contact pour suivre les commandes:

**Allez dans:** Settings → Data Management → Properties → Contact Properties

### Propriétés à créer:

1. **last_order_id**
   - Field type: Single-line text
   - Label: Dernier ID de commande
   - Description: Numéro de la dernière commande passée

2. **last_order_amount**
   - Field type: Number
   - Label: Montant dernière commande
   - Format: Currency (EUR)

3. **last_order_date**
   - Field type: Date picker
   - Label: Date dernière commande

4. **last_order_status**
   - Field type: Single-line text
   - Label: Statut dernière commande
   - Options: pending, paid, shipped, delivered

5. **last_tracking_number**
   - Field type: Single-line text
   - Label: Numéro de suivi

6. **total_orders**
   - Field type: Number
   - Label: Nombre total de commandes

7. **lifetime_value**
   - Field type: Number
   - Label: Valeur vie client (LTV)
   - Format: Currency (EUR)

---

## 🤖 Étape 4: Workflows d'Automatisation Marketing

### Workflow 1: Abandon de panier (Cart Abandonment)

**Objectif:** Relancer les clients qui ont commencé un checkout mais n'ont pas finalisé

**Configuration HubSpot:**

1. **Automation** → **Workflows** → **Create workflow**
2. **Type:** Contact-based
3. **Nom:** FETRA - Abandon de panier

**Déclencheur (Enrollment trigger):**
- Event: `pe_begin_checkout_event`
- Re-enrollment: After 24 hours

**Conditions:**
- Add delay: 1 hour
- If/then branch:
  - If `last_order_date` is unknown → Send email
  - If `last_order_date` is in last 1 hour → Do nothing (ils ont acheté)

**Actions:**
- Send email: "Oubliez-vous quelque chose ?"
- Add delay: 24 hours
- Send email: "Dernière chance - Offre spéciale"

**Template d'email:**
```
Objet: 🎁 Votre rituel beauté vous attend !

Bonjour [firstname],

Nous avons remarqué que vous avez ajouté notre Rituel Visage Liftant à votre panier mais n'avez pas finalisé votre commande.

[Bouton CTA: Finaliser ma commande]

En plus, profitez de -10% avec le code: BIENVENUE10

Ce code expire dans 24h !

À bientôt,
L'équipe FETRA BEAUTY
```

---

### Workflow 2: Post-Achat - Série de bienvenue

**Objectif:** Engager les nouveaux clients et les transformer en fidèles

**Configuration:**

1. **Déclencheur:**
   - Property: `last_order_date` is known
   - Re-enrollment: Never

2. **Séquence:**

**J+1:** Email de remerciement
```
Objet: 💝 Merci pour votre confiance !

Bonjour [firstname],

Merci d'avoir choisi FETRA BEAUTY !

Votre colis est en préparation et sera expédié sous 24-48h.

En attendant, découvrez:
- 📹 Tutoriel vidéo: Comment utiliser votre Rituel
- 💆 Guide des techniques de massage facial
- 🌟 Conseils pour optimiser vos résultats

[Bouton: Accéder au guide]
```

**J+7:** Demande d'avis
```
Objet: ⭐ Partagez votre expérience FETRA

Bonjour [firstname],

Cela fait une semaine que vous avez reçu votre Rituel Visage Liftant.

Nous aimerions connaître votre avis ! Prenez 2 minutes pour partager votre expérience.

[Bouton: Laisser un avis]

En cadeau: -15% sur votre prochaine commande avec le code FIDELITE15
```

**J+30:** Cross-sell / Up-sell
```
Objet: 🌸 Découvrez notre nouvelle collection

Bonjour [firstname],

Vous avez adoré notre Rituel Visage Liftant ?

Découvrez notre nouvelle gamme de soins complémentaires:
- Sérum anti-âge au rétinol
- Crème de nuit régénérante
- Masque purifiant au charbon

[Bouton: Découvrir la collection]

Offre exclusive: -20% avec votre code VIPFETRA
```

---

### Workflow 3: Réactivation des clients inactifs

**Objectif:** Réengager les clients qui n'ont pas acheté depuis longtemps

**Configuration:**

1. **Déclencheur:**
   - `last_order_date` is more than 3 months ago
   - Re-enrollment: After 6 months

2. **Email:**
```
Objet: 🎁 On s'est manqué ! -25% rien que pour vous

Bonjour [firstname],

Cela fait un moment qu'on ne vous a pas vu...

On a pensé à vous avec une offre spéciale:
-25% sur TOUT le site avec le code RETOUR25

Valable 48h seulement !

[Bouton: J'en profite]

Besoin d'aide pour choisir ? Notre équipe est là pour vous conseiller.
```

---

### Workflow 4: Programme de fidélité

**Objectif:** Récompenser les clients fidèles

**Configuration:**

1. **Déclencheur:**
   - `total_orders` is equal to 3

2. **Actions:**
   - Ajouter à la liste: "VIP Clients"
   - Envoyer email de bienvenue VIP
   - Créer une tâche: "Envoyer cadeau VIP"

**Email VIP:**
```
Objet: 👑 Bienvenue dans le Club VIP FETRA !

Bonjour [firstname],

Félicitations ! Vous venez de rejoindre notre cercle exclusif des clients VIP.

Vos avantages:
✨ -20% permanent sur toutes vos commandes
🎁 Cadeau surprise à chaque commande
📦 Livraison express offerte
🌟 Accès anticipé aux nouvelles collections
💬 Support prioritaire

Votre code VIP personnel: [vip_code]

Merci de votre fidélité !
```

---

## 📈 Étape 5: Créer des segments

**Marketing** → **Lists** → **Create list**

### Segments recommandés:

1. **Nouveaux clients (J-7)**
   - `last_order_date` is in last 7 days
   - `total_orders` equals 1

2. **Clients fidèles**
   - `total_orders` is greater than or equal to 3
   - Usage: Offres VIP, early access

3. **High value customers**
   - `lifetime_value` is greater than 150 EUR
   - Usage: Cadeaux personnalisés

4. **Clients à risque**
   - `last_order_date` is between 3 and 6 months ago
   - Usage: Réengagement

5. **Abandons de panier**
   - Event `pe_begin_checkout_event` occurred in last 24 hours
   - `last_order_date` is unknown
   - Usage: Relance immédiate

---

## 🎯 Étape 6: Tracking des performances

### KPIs à suivre dans HubSpot:

1. **Taux d'ouverture des emails:** > 25%
2. **Taux de clic:** > 3%
3. **Taux de conversion abandon de panier:** > 15%
4. **Taux de réachat (repeat rate):** > 30%
5. **Lifetime Value moyen:** Objectif 200€

### Dashboard recommandé:

**Reports** → **Dashboards** → **Create dashboard**

Widgets à ajouter:
- Nouveaux contacts ce mois
- Total des commandes (via `last_order_amount`)
- LTV moyen des clients
- Performance des workflows
- Taux d'engagement des emails

---

## 🚀 Étape 7: Tests et optimisation

### Tests A/B recommandés:

1. **Sujet des emails:**
   - Avec emoji vs sans emoji
   - Question vs affirmation

2. **Timing d'envoi:**
   - 1h après abandon vs 3h après abandon
   - Matin (9h) vs soir (18h)

3. **Offres:**
   - -10% vs -15%
   - Livraison gratuite vs réduction

4. **CTA:**
   - "Finaliser ma commande" vs "Je profite de l'offre"

---

## ⚡ Quick Wins (Actions rapides)

### Semaine 1:
- ✅ Configurer l'accès API HubSpot
- ✅ Créer les propriétés personnalisées
- ✅ Tester l'envoi de données depuis le site

### Semaine 2:
- ✅ Créer le workflow d'abandon de panier
- ✅ Créer les templates d'email
- ✅ Tester le workflow avec une vraie commande

### Semaine 3:
- ✅ Lancer le workflow post-achat
- ✅ Créer les segments
- ✅ Configurer le dashboard de suivi

### Semaine 4:
- ✅ Analyser les premiers résultats
- ✅ Optimiser les emails
- ✅ Lancer les workflows de réactivation

---

## 📚 Ressources

### Documentation HubSpot:
- Workflows: https://knowledge.hubspot.com/workflows
- Email Marketing: https://knowledge.hubspot.com/email
- Contact Properties: https://knowledge.hubspot.com/properties

### Best Practices:
- Fréquence d'envoi: Max 2 emails/semaine par contact
- Toujours inclure un lien de désinscription
- Tester sur mobile (70% des emails sont lus sur mobile)
- Personnaliser au-delà du prénom (historique d'achat, préférences)

---

## 🆘 Dépannage

### Les contacts ne se créent pas dans HubSpot
1. Vérifiez que `HUBSPOT_ACCESS_TOKEN` est bien configuré
2. Vérifiez les scopes de votre Private App
3. Regardez les logs serveur pour les erreurs HubSpot

### Les événements ne sont pas trackés
1. Vérifiez que l'event API scope est activé
2. Vérifiez que l'email du client existe bien dans HubSpot
3. Les événements peuvent prendre 15-30 min à apparaître

### Les workflows ne se déclenchent pas
1. Vérifiez que les contacts sont bien enrôlés (enrollment)
2. Vérifiez les conditions d'enrollment
3. Vérifiez que le workflow est bien activé (ON)

---

## 💡 Idées avancées

### Intégration avec WhatsApp Business
- Notifications de commande via WhatsApp
- Support client conversationnel

### Chatbot HubSpot
- Assistance 24/7 sur le site
- Qualification des leads
- Recommandations produits

### Scoring des leads
- Attribuer des points selon les actions
- Prioriser les contacts "hot"
- Personnaliser les offres

### Attribution marketing
- Tracker la source de chaque commande
- ROI par canal (Google Ads, Facebook, Email)
- Optimiser le budget marketing

---

**Besoin d'aide ?** Contactez le support HubSpot ou consultez l'Academy HubSpot pour des formations gratuites.
