# Sécurité et Protection des Données (GDPR)

Ce document décrit les pratiques de sécurité et de protection des données personnelles pour le projet FETRA.

## 📋 Données Personnelles Collectées

### Types de données

Le projet collecte et traite les données personnelles suivantes :

1. **Données clients** :
   - Email (requis)
   - Nom complet (optionnel)
   - Adresse de livraison (lors du paiement via Stripe)
   
2. **Données de commande** :
   - ID de commande
   - Montant de la transaction
   - Date de commande
   - Statut de paiement

3. **Données de navigation** :
   - Événements analytics (via HubSpot tracking)
   - Événements e-commerce (begin_checkout, purchase)

## 🔒 Stockage des Données

### Stockage local

Les données suivantes sont stockées localement dans le répertoire `data/` :

1. **Commandes** (`data/orders.json`) :
   - Format : JSON
   - Contenu : Historique complet des commandes
   - Accès : Serveur uniquement (non accessible publiquement)

2. **Logs de webhooks** (`data/webhook-logs/`) :
   - Format : JSON par jour
   - Contenu : Événements webhooks Stripe
   - Disponible uniquement en mode développement
   - Accès : Serveur uniquement

⚠️ **Important** : Le répertoire `data/` est exclu du contrôle de version (`.gitignore`)

### Stockage tiers

Les données sont également synchronisées vers :

1. **HubSpot** :
   - Contacts avec email, nom, historique commandes
   - Événements de navigation et e-commerce
   - Rétention : Selon politique HubSpot

2. **Brevo (Sendinblue)** :
   - Contacts avec email, nom, dernière commande
   - Listes newsletter
   - Rétention : Selon politique Brevo

3. **Freshdesk** :
   - Tickets support avec email et contexte commande
   - Historique des demandes
   - Rétention : Selon politique Freshdesk

4. **Stripe** :
   - Données de paiement (carte bancaire, adresse)
   - Sessions de checkout
   - Rétention : Selon politique Stripe

## 🛡️ Mesures de Sécurité

### Sécurité des API

- ✅ Toutes les clés API sont stockées dans des variables d'environnement
- ✅ Les clés API ne sont jamais exposées côté client
- ✅ Validation des webhooks Stripe via signature (`STRIPE_WEBHOOK_SECRET`)
- ✅ Retry logic avec backoff exponentiel pour éviter la perte de données
- ✅ Authentification Basic Auth pour Freshdesk
- ✅ Endpoints API protégés (validation serveur)

### Sécurité du stockage

- ✅ Fichiers `data/` exclus du versioning Git
- ✅ Logs de webhooks disponibles uniquement en développement
- ✅ Pas d'accès HTTP direct aux fichiers de données
- ✅ Permissions fichiers gérées par le système de fichiers

### Communication

- ✅ HTTPS obligatoire en production (Vercel)
- ✅ Headers de sécurité configurés par Next.js
- ✅ Pas de transmission de données sensibles dans les URLs

## 👤 Droits des Utilisateurs (GDPR)

### Droit d'accès

Les utilisateurs peuvent demander l'accès à leurs données via :
- Email à : [votre-email-support]
- Page de contact : `/contact` ou `/support`

### Droit de rectification

Pour modifier des données personnelles :
1. Via le formulaire de support (`/api/support`)
2. Mise à jour automatique dans HubSpot et Brevo lors des nouvelles commandes

### Droit à l'effacement ("droit à l'oubli")

Pour supprimer les données personnelles :

#### 1. Données locales (orders.json)
```javascript
// Dans lib/db/orders.ts, ajouter une fonction :
export function deleteOrdersByEmail(email: string): boolean {
  // Lire orders.json
  // Filtrer et retirer toutes les commandes de cet email
  // Sauvegarder le fichier mis à jour
}
```

#### 2. HubSpot
- Via l'interface : **Contacts** → Chercher par email → **Actions** → **Delete contact**
- Via API : `DELETE https://api.hubapi.com/contacts/v1/contact/vid/{contact_id}`

#### 3. Brevo
- Via l'interface : **Contacts** → Chercher par email → **Delete**
- Via API : `DELETE https://api.brevo.com/v3/contacts/{email}`

#### 4. Freshdesk
- Via l'interface : **Admin** → **Contacts** → Chercher par email → **Delete**
- Tickets associés peuvent être anonymisés ou supprimés

#### 5. Stripe
- Stripe conserve les données de paiement selon les obligations légales
- Les données clients peuvent être supprimées : **Customers** → **Delete customer**

### Droit à la portabilité

Les données peuvent être exportées en JSON via :
- Fichier local : `data/orders.json`
- HubSpot : Export CSV depuis l'interface
- Brevo : Export CSV depuis l'interface
- Stripe : Export API ou dashboard

### Droit d'opposition

Les utilisateurs peuvent s'opposer au traitement :
- Marketing : Désinscription newsletter via lien dans email
- Tracking : Désactivation du tracking HubSpot (cookie banner requis en production)

## 🗑️ Politique de Rétention

### Données recommandées de rétention

| Type de données | Durée de rétention | Action après expiration |
|-----------------|-------------------|-------------------------|
| Commandes (orders.json) | 2 ans | Suppression automatique ou archivage |
| Logs webhooks | 30 jours | Suppression automatique |
| Contacts HubSpot | Indéterminé | Nettoyage manuel annuel |
| Contacts Brevo | Indéterminé | Nettoyage manuel annuel |
| Tickets Freshdesk | 1 an après résolution | Archivage ou suppression |

### Script de nettoyage automatique (à implémenter)

```javascript
// lib/db/cleanup.ts
export function cleanupOldData() {
  // Supprimer orders.json > 2 ans
  // Supprimer webhook logs > 30 jours
}
```

Exécuter via cron job ou script manuel :
```bash
npm run cleanup
```

## 📝 Conformité GDPR

### Checklist de conformité

- [ ] **Base légale** : Consentement utilisateur ou intérêt légitime
- [ ] **Transparence** : Politique de confidentialité visible
- [ ] **Minimisation** : Collecte uniquement des données nécessaires
- [ ] **Limitation de durée** : Politique de rétention définie
- [ ] **Intégrité** : Sécurité des données (HTTPS, env vars)
- [ ] **Responsabilité** : Documentation des traitements
- [ ] **Droits des utilisateurs** : Procédures d'accès, rectification, effacement
- [ ] **Notification de violation** : Procédure en cas de fuite de données

### Actions requises pour la production

1. **Ajouter une page de politique de confidentialité** (`/privacy-policy`)
2. **Ajouter un banner de consentement cookies** (pour HubSpot tracking)
3. **Implémenter un formulaire de demande de données** (`/data-request`)
4. **Implémenter un script de nettoyage automatique**
5. **Configurer des alertes en cas d'erreur d'API** (Sentry, etc.)
6. **Documenter les sous-traitants** (HubSpot, Brevo, Freshdesk, Stripe)

## 🚨 Procédure en Cas de Violation de Données

1. **Identifier la violation** :
   - Type de données exposées
   - Nombre d'utilisateurs affectés
   - Cause de la violation

2. **Contenir la violation** :
   - Isoler le système compromis
   - Changer les clés API si nécessaire
   - Bloquer l'accès non autorisé

3. **Notifier** :
   - Autorité de contrôle (CNIL en France) sous 72h
   - Utilisateurs affectés si risque élevé
   - Documentation de l'incident

4. **Corriger** :
   - Patcher la vulnérabilité
   - Audit de sécurité complet
   - Mise à jour des procédures

## 📞 Contact

Pour toute question relative à la protection des données :
- Email : [votre-email-dpo]
- Page de contact : `/support`

## 📚 Ressources

- [RGPD (GDPR) - CNIL](https://www.cnil.fr/fr/reglement-europeen-protection-donnees)
- [HubSpot GDPR](https://legal.hubspot.com/privacy-policy)
- [Brevo GDPR](https://www.brevo.com/legal/privacypolicy/)
- [Stripe Privacy](https://stripe.com/privacy)
- [Freshdesk GDPR](https://www.freshworks.com/gdpr/)

---

**Note** : Ce document est un guide de base. Consultez un avocat spécialisé en protection des données pour une conformité complète à votre juridiction.

**Dernière mise à jour** : October 2025

