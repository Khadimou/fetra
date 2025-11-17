# Guide Complet : Stratégie Google Ads pour FETRA BEAUTY

Ce guide vous accompagne de A à Z pour mettre en place une stratégie Google Ads performante pour FETRA.

---

## 📋 Table des matières

1. [Création du compte Google Ads](#1-création-du-compte-google-ads)
2. [Configuration du suivi des conversions](#2-configuration-du-suivi-des-conversions)
3. [Intégration technique du tracking](#3-intégration-technique-du-tracking)
4. [Stratégie de campagnes recommandée](#4-stratégie-de-campagnes-recommandée)
5. [Mots-clés et stratégie SEA](#5-mots-clés-et-stratégie-sea)
6. [Budget et enchères](#6-budget-et-enchères)
7. [Création des annonces](#7-création-des-annonces)
8. [Remarketing et retargeting](#8-remarketing-et-retargeting)
9. [Métriques et optimisation](#9-métriques-et-optimisation)

---

## 1. Création du compte Google Ads

### Étape 1 : Créer le compte

1. Rendez-vous sur [ads.google.com](https://ads.google.com)
2. Cliquez sur "Commencer maintenant"
3. Connectez-vous avec le compte Google que vous voulez utiliser (conseil : créez un compte dédié `ads@fetrabeauty.com`)
4. Suivez l'assistant de configuration :
   - **Objectif principal** : Sélectionnez "Ventes" ou "Prospects"
   - **Site web** : `https://www.fetrabeauty.com`
   - **Nom de l'entreprise** : FETRA BEAUTY

### Étape 2 : Passer en mode Expert

⚠️ **Important** : L'assistant par défaut est simplifié mais limitant.

1. En bas de la page, cliquez sur "Passer en mode Expert"
2. Sélectionnez "Créer un compte sans campagne pour l'instant"
3. Confirmez les informations de facturation

### Étape 3 : Configuration de la facturation

1. Allez dans **Outils et paramètres** > **Facturation**
2. Ajoutez vos informations de paiement (carte bancaire professionnelle recommandée)
3. Définissez votre pays de facturation : **France**
4. Devise : **EUR (€)**

---

## 2. Configuration du suivi des conversions

### Qu'est-ce qu'une conversion ?

Pour FETRA, les conversions importantes sont :
- ✅ **Achat** (conversion principale)
- 📦 **Début de commande** (begin_checkout)
- 🛒 **Ajout au panier** (add_to_cart)
- 📧 **Inscription newsletter** (lead)

### Créer les conversions dans Google Ads

1. Allez dans **Outils et paramètres** > **Mesure** > **Conversions**
2. Cliquez sur **+ Nouvelle action de conversion**
3. Sélectionnez **Site web**

#### Conversion #1 : Achat (PRIORITAIRE)

**Paramètres :**
- **Nom** : "Achat - FETRA"
- **Catégorie** : Achat
- **Valeur** : Utiliser des valeurs différentes pour chaque conversion
- **Nombre** : Une seule
- **Fenêtre de conversion (clics)** : 30 jours
- **Fenêtre de conversion (impressions)** : 1 jour
- **Inclure dans "Conversions"** : ✅ Oui
- **Modèle d'attribution** : Basé sur les données (ou au dernier clic si peu de données)

**Après validation, notez :**
- **ID de conversion** (format : `AW-XXXXXXXXXX`)
- **Libellé de conversion** (format : `AbCdEfGhIj`)

➡️ Ces informations iront dans vos variables d'environnement :
```
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL=AbCdEfGhIj
```

#### Conversion #2 : Début de commande

Répétez l'opération avec :
- **Nom** : "Début de commande - FETRA"
- **Catégorie** : Ajouter au panier
- **Valeur** : Ne pas utiliser de valeur
- **Inclure dans "Conversions"** : ❌ Non (conversion secondaire)

➡️ Notez le label : `NEXT_PUBLIC_GOOGLE_ADS_BEGIN_CHECKOUT_LABEL`

#### Conversion #3 : Ajout au panier

- **Nom** : "Ajout au panier - FETRA"
- **Catégorie** : Ajouter au panier
- **Inclure dans "Conversions"** : ❌ Non

➡️ Notez le label : `NEXT_PUBLIC_GOOGLE_ADS_ADD_TO_CART_LABEL`

#### Conversion #4 : Inscription newsletter

- **Nom** : "Inscription newsletter - FETRA"
- **Catégorie** : Soumettre le formulaire de contact
- **Inclure dans "Conversions"** : ❌ Non

➡️ Notez le label : `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL`

---

## 3. Intégration technique du tracking

### Ajouter les variables d'environnement

Ajoutez dans votre fichier `.env.local` :

```bash
# Google Ads Conversion Tracking
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL=AbCdEfGhIj
NEXT_PUBLIC_GOOGLE_ADS_BEGIN_CHECKOUT_LABEL=YourLabelHere
NEXT_PUBLIC_GOOGLE_ADS_ADD_TO_CART_LABEL=YourLabelHere
NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL=YourLabelHere
```

### Vérifier l'installation

✅ Le tracking est déjà installé automatiquement ! Les fichiers suivants ont été créés :
- `lib/google-ads/index.ts` - Utilitaires de tracking
- `components/GoogleAdsScript.tsx` - Script de tracking (chargé dans le layout)
- `components/GoogleAdsConversion.tsx` - Tracking des achats (page success)

### Tester le tracking

1. **Installez Google Tag Assistant** ([Chrome Extension](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk))

2. **Testez en mode développement** :
   ```bash
   npm run dev
   ```

3. **Simulez un achat** :
   - Acceptez les cookies marketing
   - Ajoutez un produit au panier
   - Complétez le checkout avec une carte de test Stripe : `4242 4242 4242 4242`
   - Vérifiez que la page de succès se charge

4. **Vérifiez dans Google Ads** :
   - Allez dans **Conversions** > Sélectionnez "Achat - FETRA"
   - Dans l'onglet "Diagnostic", vous devriez voir les conversions de test (peut prendre 24h)

---

## 4. Stratégie de campagnes recommandée

### Structure de compte recommandée

```
📁 Compte Google Ads : FETRA BEAUTY
│
├── 🎯 Campagne 1 : SEARCH - Marque (Always-On)
│   ├── Groupe d'annonces : FETRA Exact
│   └── Groupe d'annonces : FETRA Broad Match
│
├── 🎯 Campagne 2 : SEARCH - Produits Beauté (Main)
│   ├── Groupe d'annonces : Rituel Visage
│   ├── Groupe d'annonces : Gua Sha + Rose Quartz
│   ├── Groupe d'annonces : K-Beauty
│   └── Groupe d'annonces : Cadeaux Beauté
│
├── 🎯 Campagne 3 : SEARCH - Concurrents (Agressive)
│   └── Groupe d'annonces : Marques concurrentes
│
├── 🎯 Campagne 4 : SHOPPING - Catalogue Produits
│   └── Flux produit Google Merchant Center
│
├── 🎯 Campagne 5 : DISPLAY - Remarketing (Retargeting)
│   ├── Visiteurs du site (30 jours)
│   └── Abandons de panier (14 jours)
│
└── 🎯 Campagne 6 : PMAX - Performance Max (Automatisée)
    └── Tous les emplacements (Search, Display, YouTube, Gmail)
```

### Calendrier de lancement recommandé

**Semaine 1-2 :**
- ✅ Campagne SEARCH - Marque
- ✅ Campagne SEARCH - Produits Beauté

**Semaine 3-4 :**
- ✅ Campagne SHOPPING
- ✅ Campagne DISPLAY - Remarketing

**Mois 2+ :**
- ✅ Campagne PMAX (après avoir collecté des données)
- ✅ Campagne Concurrents (si budget le permet)

---

## 5. Mots-clés et stratégie SEA

### Campagne 1 : SEARCH - Marque

**Objectif** : Protéger votre marque et capter les recherches intentionnées.

**Mots-clés (Exact Match)** :
```
[fetra]
[fetra beauty]
[fetrabeauty]
[fetra rituel]
[fetra gua sha]
[www fetra beauty]
[fetra avis]
```

**Budget recommandé** : 5-10€/jour
**CPC Max** : 0,50€ (probablement très bas car peu de concurrence)

---

### Campagne 2 : SEARCH - Produits Beauté ⭐ (PRINCIPALE)

**Objectif** : Capter les recherches de produits beauté et rituels.

#### Groupe d'annonces #1 : Rituel Visage

**Mots-clés (Phrase Match & Broad Match Modifier)** :
```
"rituel visage"
"rituel beauté visage"
"routine visage liftant"
"soin visage naturel"
"massage visage anti-âge"
"rituel soin visage"
+rituel +visage +lifting
+routine +beauté +visage
```

**Budget** : 20-30€/jour
**CPC Max** : 1,00-2,00€

---

#### Groupe d'annonces #2 : Gua Sha + Rose Quartz

**Mots-clés** :
```
"gua sha"
"gua sha visage"
"rouleau jade"
"rouleau quartz rose"
"pierre gua sha"
"kit gua sha"
"accessoire massage visage"
"gua sha effet"
"acheter gua sha"
"gua sha pas cher"
+gua +sha +quartz +rose
+rouleau +massage +visage
```

**Budget** : 15-25€/jour
**CPC Max** : 0,80-1,50€

---

#### Groupe d'annonces #3 : K-Beauty

**Mots-clés** :
```
"k beauty"
"beauté coréenne"
"soin coréen visage"
"routine k beauty"
"produit beauté coréen"
"cosmétique coréenne"
+skincare +coréen
+k +beauty +france
```

**Budget** : 10-20€/jour
**CPC Max** : 1,00-1,80€

---

#### Groupe d'annonces #4 : Cadeaux Beauté (Saisonnier)

**Mots-clés (Activer surtout Nov-Déc et fêtes)** :
```
"cadeau beauté femme"
"coffret beauté"
"idée cadeau soin visage"
"coffret rituel beauté"
"cadeau noël beauté"
"cadeau anniversaire femme beauté"
"cadeau saint valentin"
+cadeau +beauté +original
+coffret +soin +visage
```

**Budget** : 20-40€/jour (Nov-Déc), 5-10€/jour (reste de l'année)
**CPC Max** : 1,20-2,50€

---

### Campagne 3 : SEARCH - Concurrents

**⚠️ Attention** : Campagne agressive, à utiliser avec parcimonie.

**Mots-clés concurrents potentiels** :
```
"sephora gua sha"
"nocibé rituel visage"
"yves rocher massage visage"
"clarins rituel"
[concurrent marque] (sans nommer directement dans l'annonce)
```

**Budget** : 10-15€/jour
**CPC Max** : 1,50-3,00€ (plus cher car concurrentiel)

**Note** : Ne jamais utiliser la marque concurrent directement dans votre annonce (illégal). Utilisez uniquement comme mot-clé de déclenchement.

---

### Mots-clés négatifs (à ajouter partout)

Excluez les recherches non pertinentes pour économiser du budget :

```
-gratuit
-diy
-maison
-tutoriel
-comment faire
-pdf
-livre
-occasion
-seconde main
-leboncoin
-aliexpress
-temu
-shein
-amazon (si vous ne vendez pas sur Amazon)
-contrefaçon
-fake
-pas cher
-discount
-solde (sauf si vous faites des soldes)
```

---

## 6. Budget et enchères

### Budget quotidien recommandé

**Phase de lancement (Mois 1-2)** :
```
Campagne Marque :        5-10€/jour
Campagne Produits :     30-50€/jour
Campagne Shopping :     15-25€/jour
Campagne Remarketing :  10-15€/jour
────────────────────────────────────
TOTAL :                 60-100€/jour
Budget mensuel :       ~1 800-3 000€
```

**Phase d'optimisation (Mois 3+)** :
```
Campagne Marque :        10€/jour
Campagne Produits :     50-80€/jour
Campagne Shopping :     25-40€/jour
Campagne Remarketing :  15-25€/jour
Campagne PMAX :         30-50€/jour
────────────────────────────────────
TOTAL :                130-205€/jour
Budget mensuel :      ~3 900-6 150€
```

### Stratégies d'enchères recommandées

**Phase 1 (0-30 jours)** - Collecte de données :
- 🎯 **Maximiser les clics** avec CPC max manuel
- Objectif : Collecter ~30 conversions minimum

**Phase 2 (30-60 jours)** - Optimisation :
- 🎯 **Maximiser les conversions**
- Google Ads optimise automatiquement pour avoir le plus de conversions

**Phase 3 (60+ jours)** - Performance :
- 🎯 **CPA cible** (Coût par acquisition)
- Objectif : CPA ≤ 30-50€ (pour un panier moyen de 49,90€)

**Phase 4 (90+ jours)** - Rentabilité :
- 🎯 **ROAS cible** (Retour sur dépense publicitaire)
- Objectif : ROAS ≥ 300% (3€ de CA pour 1€ de pub)

---

## 7. Création des annonces

### Campagne SEARCH - Annonces textuelles

Google Ads utilise des **Annonces responsives** (Responsive Search Ads).
Vous fournissez jusqu'à 15 titres et 4 descriptions, Google teste les meilleures combinaisons.

#### Groupe : Rituel Visage

**Titres (15 max, 30 caractères)** :
```
1. Rituel Visage Liftant FETRA
2. Kit Gua Sha + Huile Naturelle
3. Beauté Naturelle & Éclat
4. -30% Premier Achat
5. Livraison Gratuite en France
6. Résultats Visibles en 7 Jours
7. Gua Sha en Quartz Rose
8. Rituel K-Beauty Authentique
9. Soin Visage Anti-Âge
10. Offre de Lancement FETRA
11. Massage Facial Professionnel
12. Produits Naturels Certifiés
13. 4.8★ - 500+ Avis Clients
14. Testé Dermatologiquement
15. Satisfait ou Remboursé 14J
```

**Descriptions (4 max, 90 caractères)** :
```
1. Découvrez le Rituel Visage Liftant FETRA : Gua Sha + Huile naturelle. Livraison offerte !
2. Kit complet pour un lifting naturel à domicile. Résultats visibles dès 7 jours. Commandez maintenant !
3. Soin visage inspiré de la K-Beauty. Pierre de quartz rose + huile bio. -30% pour votre 1ère commande.
4. Rituel beauté complet : massage, lifting, éclat. Satisfait ou remboursé sous 14 jours.
```

**URL finale** : `https://www.fetrabeauty.com/product`
**URL d'affichage** : `fetrabeauty.com/Rituel-Visage`

---

#### Groupe : Gua Sha

**Titres** :
```
1. Gua Sha en Quartz Rose - FETRA
2. Pierre Authentique & Naturelle
3. Massage Visage Anti-Rides
4. Kit Complet Gua Sha + Huile
5. Livraison Gratuite 48h
6. Effet Lifting Immédiat
7. Gua Sha Authentique K-Beauty
8. -25% Offre Découverte
9. Testé & Approuvé 4.8★
10. Gua Sha Visage Professionnel
11. Pierre de Quartz Rose Véritable
12. Résultats Dès la 1ère Utilisation
13. Guide d'Utilisation Offert
14. Garantie Satisfaction 14 Jours
15. Made in Korea - Import Direct
```

---

### Extensions d'annonces (À ACTIVER OBLIGATOIREMENT)

#### Extensions d'accroche (Callouts)
```
✅ Livraison Gratuite
✅ Retour 14 Jours
✅ Paiement Sécurisé
✅ Service Client 7j/7
✅ Produits Naturels
✅ Testés Dermatologiquement
✅ 500+ Avis Positifs
✅ Satisfait ou Remboursé
```

#### Extensions de liens annexes (Sitelinks)
```
1. Notre Rituel Visage → /product
2. Avis Clients → /product#reviews
3. Guide d'Utilisation → /blog
4. À Propos → /about
5. Livraison & Retours → /shipping
6. FAQ → /faq
```

#### Extension de prix
```
Rituel Visage Liftant - 49,90€
Gua Sha Seul - 29,90€
Kit Complet - 49,90€ (au lieu de 59,90€)
```

#### Extension de promotion
```
Offre de lancement : -30% avec le code FETRA30
Livraison gratuite pour toute commande
Retour gratuit sous 14 jours
```

---

## 8. Remarketing et retargeting

Le remarketing permet de cibler les visiteurs qui n'ont pas acheté.

### Audiences à créer

#### Audience 1 : Visiteurs du site (30 jours)
- **Durée de rétention** : 30 jours
- **URL** : fetrabeauty.com/*
- **Taille minimum** : 100 visiteurs

**Annonce Display** :
```
Visuel : Image du kit FETRA avec CTA "Je commande"
Message : "Vous avez visité FETRA ? Profitez de -20% avec le code BIENVENUE20"
CTA : "Découvrir l'offre"
```

---

#### Audience 2 : Abandons de panier (14 jours) ⭐ PRIORITAIRE
- **URL** : fetrabeauty.com/cart
- **Durée** : 14 jours
- **Budget** : 15-20€/jour

**Annonce Display** :
```
Visuel : Image du panier avec produits FETRA
Message : "Vous avez oublié quelque chose ? 🛒 -15% sur votre commande"
CTA : "Finaliser ma commande"
```

**Annonce Gmail** :
```
Objet : "Votre panier FETRA vous attend"
Message : "Finalisez votre commande et profitez de -15% avec le code PANIER15"
```

---

#### Audience 3 : Visiteurs de la page produit (sans achat)
- **URL** : fetrabeauty.com/product
- **Durée** : 21 jours

---

#### Audience 4 : Clients (liste d'exclusion + upsell)
- **Utilisation 1** : Exclure des campagnes d'acquisition
- **Utilisation 2** : Créer des campagnes d'upsell (produits complémentaires)

---

### Campagne Display - Remarketing

**Paramètres** :
- **Type** : Display
- **Objectif** : Conversions
- **Enchères** : CPA cible (30-40€)
- **Formats** : Annonces responsive + Image
- **Réseau** : Display uniquement (pas de partenaires de recherche)

**Budget** : 10-20€/jour

**Annonces** :
- 5 visuels différents (formats : carré, horizontal, vertical)
- Message : Offre spéciale remarketing (-15% à -20%)
- CTA fort : "J'en profite", "Je commande", "Découvrir"

---

## 9. Métriques et optimisation

### KPIs principaux à suivre

| Métrique | Objectif (Mois 1-3) | Objectif (Mois 3+) |
|----------|---------------------|-------------------|
| **CTR (Taux de clic)** | ≥ 3% | ≥ 5% |
| **CPC (Coût par clic)** | ≤ 2,00€ | ≤ 1,50€ |
| **Taux de conversion** | ≥ 2% | ≥ 3-5% |
| **CPA (Coût par acquisition)** | ≤ 60€ | ≤ 30-40€ |
| **ROAS (Retour sur investissement)** | ≥ 150% | ≥ 300% |
| **Quality Score** | ≥ 6/10 | ≥ 8/10 |

### Optimisations hebdomadaires

**Chaque lundi matin** :
1. ✅ Vérifiez les mots-clés avec 0 conversion → Pause ou baisse enchère
2. ✅ Ajoutez les termes de recherche performants comme mots-clés
3. ✅ Ajoutez les termes non pertinents en mots-clés négatifs
4. ✅ Vérifiez le budget : campagnes limitées par le budget ?
5. ✅ Testez de nouvelles variantes d'annonces

**Chaque mois** :
1. 📊 Analysez les conversions par appareil (mobile vs desktop)
2. 📊 Analysez les conversions par heure/jour
3. 📊 Ajustez les enchères selon la performance
4. 📊 Testez de nouvelles audiences remarketing

---

## 🎯 Checklist de lancement

Avant de lancer vos premières campagnes :

### Configuration technique
- [ ] Variables d'environnement Google Ads ajoutées
- [ ] Conversions créées dans Google Ads
- [ ] Tracking testé avec Google Tag Assistant
- [ ] Compte Google Merchant Center créé (pour Shopping)
- [ ] Flux de produits configuré

### Campagnes
- [ ] Campagne Marque créée et activée
- [ ] Campagne Produits créée avec 3-4 groupes d'annonces
- [ ] Extensions d'annonces configurées (callouts, sitelinks, prix)
- [ ] Mots-clés négatifs ajoutés
- [ ] Budget quotidien défini

### Suivi
- [ ] Google Analytics relié à Google Ads
- [ ] Objectifs de conversion configurés
- [ ] Rapports automatiques configurés (hebdomadaires)

---

## 🚀 Résumé : Plan d'action immédiat

**Jour 1 : Configuration**
1. Créer le compte Google Ads
2. Configurer les conversions (Achat + Begin Checkout + Add to Cart + Newsletter)
3. Ajouter les variables d'environnement dans `.env.local`
4. Tester le tracking

**Jour 2-3 : Création campagnes**
1. Créer Campagne Marque (5-10€/jour)
2. Créer Campagne Produits avec 4 groupes d'annonces (30-50€/jour)
3. Configurer les extensions d'annonces
4. Ajouter mots-clés négatifs

**Semaine 2 : Remarketing**
1. Créer les audiences remarketing
2. Créer Campagne Display Remarketing (10-15€/jour)
3. Préparer les visuels display

**Semaine 3-4 : Shopping**
1. Créer compte Google Merchant Center
2. Créer flux de produits
3. Lancer Campagne Shopping (15-25€/jour)

**Mois 2+ : Optimisation**
1. Analyser les performances
2. Optimiser les enchères
3. Passer en stratégie CPA cible
4. Lancer Campagne Performance Max

---

## 📞 Besoin d'aide ?

Si vous avez des questions sur la configuration technique ou la stratégie :

- 💬 **Support technique** : Demandez à Claude Code
- 📚 **Documentation Google Ads** : [support.google.com/google-ads](https://support.google.com/google-ads)
- 🎓 **Formation gratuite** : Google Skillshop - "Google Ads Search Certification"

---

## 📈 Ressources complémentaires

- [Google Keyword Planner](https://ads.google.com/home/tools/keyword-planner/) - Recherche de mots-clés
- [Google Merchant Center](https://merchants.google.com/) - Pour les campagnes Shopping
- [Google Analytics](https://analytics.google.com/) - Suivi des performances
- [Google Tag Manager](https://tagmanager.google.com/) - Gestion des tags (déjà installé sur FETRA)

---

**Dernière mise à jour** : Janvier 2025
**Version** : 1.0
**Auteur** : Claude Code pour FETRA BEAUTY
