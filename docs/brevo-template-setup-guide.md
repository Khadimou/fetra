# Guide: Créer le Template Email Newsletter dans Brevo

## 📋 Étapes d'Installation

### 1. Accéder à Brevo

1. Connectez-vous à https://app.brevo.com
2. Allez dans **Campaigns** → **Templates**
3. Cliquez sur **New Template**

### 2. Configuration du Template

**Étape 1 : Informations de base**
- **Template name:** `Newsletter Welcome - Code Promo`
- **Template category:** Transactional
- **Subject line:** `🎉 Bienvenue chez FETRA BEAUTY - Votre code promo exclusif`

**Étape 2 : Design**
- Sélectionnez **"Paste your HTML"** ou **"Rich text editor"**
- Si vous choisissez HTML, copiez tout le contenu de `docs/brevo-newsletter-template.html`
- Collez-le dans l'éditeur

### 3. Variables Brevo à Configurer

Le template utilise ces variables (elles sont déjà dans le code) :

```
{{ params.PROMO_CODE }}    → Code promo généré (ex: NEWS-ABC123)
{{ params.EMAIL }}          → Email de l'abonné
{{ unsubscribe }}          → Lien de désinscription (automatique)
```

### 4. Tester le Template

**Test d'envoi :**
1. Cliquez sur **Preview**
2. Cliquez sur **Send a test**
3. Renseignez votre email
4. Dans les variables de test, ajoutez :
   ```json
   {
     "PROMO_CODE": "NEWS-TEST123",
     "EMAIL": "votre@email.com"
   }
   ```
5. Cliquez sur **Send**

### 5. Activer le Template

1. Cliquez sur **Save and activate**
2. Notez l'**ID du template** (affiché en haut : ex: Template #4)

### 6. Configurer dans FETRA

Ajoutez l'ID dans `.env.local` :

```bash
BREVO_TEMPLATE_NEWSLETTER_WELCOME=4
```

Remplacez `4` par votre ID réel.

---

## 🎨 Personnalisation

### Changer les Couleurs

Éditez le fichier HTML :

**Couleur principale (header/bouton):**
```css
background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
```

Remplacez par vos couleurs de marque :
```css
background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
```

**Couleur de la réduction:**
```css
border-left: 4px solid #38a169;  /* Vert */
```

### Ajouter Votre Logo

Remplacez la ligne 155 :
```html
<h1 class="logo">FETRA BEAUTY</h1>
```

Par :
```html
<img src="https://www.fetrabeauty.com/logo.png" alt="FETRA BEAUTY" style="max-width: 200px;">
```

### Changer les Liens Réseaux Sociaux

Lignes 261-265, remplacez les `#` par vos vraies URLs :
```html
<a href="https://facebook.com/fetrabeauty" class="social-link">📘</a>
<a href="https://instagram.com/fetrabeauty" class="social-link">📷</a>
<a href="https://twitter.com/fetrabeauty" class="social-link">🐦</a>
```

---

## ✅ Checklist de Validation

Avant d'activer, vérifiez :

- [ ] Le template s'affiche bien sur mobile (preview)
- [ ] La variable `{{ params.PROMO_CODE }}` s'affiche
- [ ] Le lien "Découvrir nos produits" fonctionne
- [ ] Le lien de désinscription fonctionne
- [ ] L'email de test est bien reçu
- [ ] Le code promo dans l'email est bien formaté
- [ ] Les couleurs correspondent à votre charte graphique

---

## 📧 Aperçu du Rendu

### Sur Desktop
```
┌─────────────────────────────────────────┐
│            FETRA BEAUTY                  │ ← Header sombre
├─────────────────────────────────────────┤
│                                          │
│  🎉 Bienvenue dans la famille FETRA !   │
│                                          │
│  Merci de vous être inscrit...          │
│                                          │
│  ┌───────────────────────────────────┐  │
│  │  Votre code promo exclusif        │  │
│  │                                   │  │
│  │      NEWS-ABC123                  │  │ ← Code en gros
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                          │
│  Ce que vous obtenez :                   │
│  🎁 15% de réduction                     │
│  ⏰ Valable 30 jours                     │
│  🔒 Usage unique                         │
│                                          │
│  [Découvrir nos produits]                │ ← Bouton CTA
│                                          │
│  ⚠️ Code expire dans 30 jours           │
│                                          │
├─────────────────────────────────────────┤
│           FETRA BEAUTY                   │ ← Footer
│     La beauté naturelle révélée          │
│                                          │
│  Site web | À propos | Contact           │
│  📘 📷 🐦                                │
└─────────────────────────────────────────┘
```

---

## 🆘 Dépannage

### Problème : Variable non remplacée

**Symptôme :** L'email affiche `{{ params.PROMO_CODE }}` au lieu du code

**Solution :**
1. Vérifiez que la variable est écrite exactement comme : `{{ params.PROMO_CODE }}`
2. Vérifiez que le template est de type **Transactional**
3. Testez l'envoi avec des données de test

### Problème : Email non reçu

**Solution :**
1. Vérifiez les logs Brevo : **Transactional** → **Logs**
2. Vérifiez que l'email n'est pas dans les spams
3. Vérifiez que `BREVO_API_KEY` est valide

### Problème : Design cassé sur mobile

**Solution :**
1. Le template est responsive, vérifiez dans l'éditeur Brevo
2. Testez l'envoi sur votre mobile
3. Ajustez les media queries si nécessaire (à la fin du CSS)

---

## 📊 Variables Disponibles dans Brevo

### Variables Système Brevo

Ces variables sont automatiques :
```
{{ contact.EMAIL }}          → Email du contact
{{ contact.FIRSTNAME }}      → Prénom (si existant)
{{ contact.LASTNAME }}       → Nom (si existant)
{{ unsubscribe }}           → Lien de désinscription
{{ update_profile }}        → Lien de mise à jour profil
```

### Variables Custom FETRA

Envoyées par l'API :
```
{{ params.PROMO_CODE }}     → Code promo généré
{{ params.EMAIL }}          → Email (redondant mais utile)
{{ params.HAS_PROMO }}      → "true" ou "false"
```

---

## 🔄 Versions Alternatives

### Version Simple (Sans Images)

Si vous voulez une version plus légère :
- Supprimez les gradients
- Utilisez uniquement du texte
- Gardez le code promo en surbrillance

### Version Avec Produit

Ajoutez une section produit recommandé :
```html
<div style="text-align: center; margin: 30px 0;">
    <img src="https://www.fetrabeauty.com/product.jpg"
         alt="Rituel Visage"
         style="max-width: 100%; border-radius: 8px;">
    <h3>Découvrez notre best-seller</h3>
    <p>Rituel Visage Liftant - 49.90€</p>
    <a href="https://www.fetrabeauty.com/product">Voir le produit</a>
</div>
```

---

## 📈 Optimisation

### Meilleurs Pratiques

1. **Objet de l'email:**
   - Court (< 50 caractères)
   - Incluez un emoji attractif
   - Mentionnez la réduction : "Votre code -15% 🎁"

2. **Preview text:**
   - Définissez un texte d'aperçu engageant
   - Ex: "NEWS-ABC123 : votre code exclusif pour -15% !"

3. **Call-to-Action:**
   - Un seul CTA principal clair
   - Couleur contrastée
   - Texte actionnable ("Découvrir", "J'en profite")

4. **Mobile-first:**
   - 70% des emails sont lus sur mobile
   - Testez toujours sur plusieurs appareils
   - Police min 14px

---

## 🎯 KPIs à Suivre

Dans Brevo Dashboard → Statistics :

1. **Taux d'ouverture** : Objectif > 25%
2. **Taux de clic** : Objectif > 3%
3. **Taux de conversion** : Codes utilisés / Emails envoyés

---

**Besoin d'aide ?** Consultez la documentation Brevo : https://developers.brevo.com/docs
