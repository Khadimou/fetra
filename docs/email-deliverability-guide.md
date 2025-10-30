# Guide de Délivrabilité des Emails 📧

## Pourquoi vos emails arrivent en spam ?

Quand vous commencez à envoyer des emails depuis un nouveau domaine ou une nouvelle configuration, les fournisseurs d'emails (Gmail, Outlook, etc.) ne vous font pas encore confiance. C'est normal au début !

---

## ✅ Solutions pour améliorer la délivrabilité

### 1. Configurer les enregistrements DNS (PRIORITAIRE)

Ces configurations permettent d'authentifier vos emails et de prouver que vous êtes bien l'expéditeur légitime.

#### A. Configuration SPF (Sender Policy Framework)

Ajoutez cet enregistrement TXT dans votre DNS :

```
Type: TXT
Nom: @
Valeur: v=spf1 include:spf.brevo.com ~all
```

#### B. Configuration DKIM (DomainKeys Identified Mail)

Dans Brevo :
1. Allez dans **Settings** → **Senders & IP**
2. Cliquez sur votre domaine `fetrabeauty.com`
3. Suivez les instructions pour configurer DKIM
4. Copiez les enregistrements DNS fournis par Brevo
5. Ajoutez-les dans votre DNS (chez votre hébergeur de domaine)

Format typique :
```
Type: TXT
Nom: mail._domainkey
Valeur: [clé fournie par Brevo]
```

#### C. Configuration DMARC (Domain-based Message Authentication)

Ajoutez cet enregistrement TXT :

```
Type: TXT
Nom: _dmarc
Valeur: v=DMARC1; p=none; rua=mailto:dmarc@fetrabeauty.com
```

**🔧 Où configurer le DNS ?**
- Si domaine chez **OVH** : Manager → Domaines → Zone DNS
- Si domaine chez **GoDaddy** : Gérer le domaine → DNS
- Si domaine chez **Namecheap** : Domain List → Manage → Advanced DNS
- Si vous utilisez **Vercel** : Vous pouvez gérer le DNS directement

---

### 2. Vérifier votre domaine dans Brevo

1. Connectez-vous à **Brevo**
2. Allez dans **Settings** → **Senders & IP**
3. Ajoutez votre domaine `fetrabeauty.com`
4. Suivez le processus de vérification

**Statut attendu :**
- ✅ Domain verified
- ✅ SPF configured
- ✅ DKIM configured

---

### 3. Configurer un email d'expéditeur professionnel

Au lieu de `contact@fetrabeauty.com`, utilisez :
- `hello@fetrabeauty.com`
- `bienvenue@fetrabeauty.com`
- `newsletter@fetrabeauty.com`

**Important :** Assurez-vous que cette adresse existe et peut recevoir des emails !

Dans votre `.env` :
```bash
BREVO_SENDER_EMAIL=hello@fetrabeauty.com
BREVO_SENDER_NAME=FETRA Beauty
```

---

### 4. Améliorer le contenu de l'email

#### ❌ Éviter ces erreurs courantes :

- Trop de majuscules : `ACHETEZ MAINTENANT!!!`
- Trop de points d'exclamation : `Incroyable!!!!`
- Mots spam : "gratuit", "urgent", "cliquez ici"
- Trop d'emojis (max 2-3 par email)
- Liens raccourcis (bit.ly, etc.)
- Pièces jointes lourdes
- Ratio texte/images déséquilibré

#### ✅ Bonnes pratiques :

- **Ratio texte/image** : 60% texte / 40% images
- **Liens** : Utilisez des URLs complètes de votre domaine
- **Alt text** : Ajoutez des descriptions aux images
- **Bouton de désabonnement** : Toujours présent et visible
- **Adresse physique** : Ajoutez votre adresse dans le footer

---

### 5. Warm-up de votre domaine (Échauffement)

Les nouveaux expéditeurs doivent monter progressivement en volume :

**Semaine 1 :** Envoyez 20-50 emails/jour
**Semaine 2 :** Envoyez 100-200 emails/jour
**Semaine 3 :** Envoyez 500-1000 emails/jour
**Semaine 4+** : Volume normal

Brevo propose un service de **Warm-up automatique** dans les paramètres.

---

### 6. Demander à vos utilisateurs de whitelister vos emails

Dans votre email de bienvenue, ajoutez :

```
📬 Pour être sûr(e) de recevoir nos prochains emails :
- Ajoutez hello@fetrabeauty.com à vos contacts
- Si cet email est dans vos spams, cliquez sur "Pas un spam"
```

---

### 7. Surveiller votre réputation d'expéditeur

#### Outils gratuits pour vérifier :

- **Mail-Tester** : https://www.mail-tester.com/
  → Envoyez un test et obtenez un score sur 10
  
- **MXToolbox** : https://mxtoolbox.com/SuperTool.aspx
  → Vérifiez si votre domaine est blacklisté
  
- **Google Postmaster Tools** : https://postmaster.google.com/
  → Surveillez votre réputation auprès de Gmail

#### Score cible :
- ✅ **Mail-Tester** : 8/10 ou plus
- ✅ **Spam Assassin** : Moins de 5 points
- ✅ **Blacklist** : Aucune

---

### 8. Dans Brevo : Activer le Tracking intelligemment

Dans votre template Brevo :

**Activez :**
- ✅ Opens tracking (ouvertures)
- ✅ Clicks tracking (clics)

**Mais modérez :**
- ⚠️ Évitez trop de tracking pixels (1 seul suffit)

---

### 9. Segmentez vos contacts

Ne pas envoyer d'emails à :
- ❌ Adresses emails invalides
- ❌ Utilisateurs qui n'ont jamais ouvert vos emails (après 6 mois)
- ❌ Adresses qui ont bounced (rebondies)

Dans Brevo, nettoyez régulièrement votre liste.

---

### 10. Testez vos emails avant l'envoi

#### A. Utilisez Mail-Tester

1. Allez sur https://www.mail-tester.com/
2. Copiez l'adresse email de test fournie
3. Envoyez votre template Brevo à cette adresse
4. Vérifiez votre score (objectif : 8/10 minimum)

#### B. Testez sur plusieurs boîtes mail

Envoyez des tests à :
- Gmail
- Outlook/Hotmail
- Yahoo Mail
- ProtonMail

---

## 🚀 Plan d'action immédiat

### Priorité 1 (À faire maintenant)

1. ✅ Configurez **SPF** dans votre DNS
2. ✅ Configurez **DKIM** dans Brevo + DNS
3. ✅ Vérifiez votre domaine dans Brevo
4. ✅ Testez avec Mail-Tester (score minimum 7/10)

### Priorité 2 (Cette semaine)

5. ✅ Configurez **DMARC**
6. ✅ Activez le warm-up dans Brevo
7. ✅ Inscrivez-vous à Google Postmaster Tools
8. ✅ Ajoutez le message "Ajoutez-nous à vos contacts" dans l'email

### Priorité 3 (Ce mois)

9. ✅ Surveillez les métriques (taux d'ouverture, bounces)
10. ✅ Nettoyez votre liste de contacts
11. ✅ Testez différentes heures d'envoi
12. ✅ A/B testez vos objets d'emails

---

## 📊 Métriques à surveiller

### Taux cibles :

| Métrique | Bon | Moyen | Mauvais |
|----------|-----|-------|---------|
| **Taux d'ouverture** | > 20% | 15-20% | < 15% |
| **Taux de clic** | > 3% | 1-3% | < 1% |
| **Bounce rate** | < 2% | 2-5% | > 5% |
| **Désabonnements** | < 0.5% | 0.5-1% | > 1% |
| **Spam complaints** | < 0.1% | 0.1-0.3% | > 0.3% |

---

## ❓ FAQ

### Q: Combien de temps avant que mes emails n'arrivent plus en spam ?
**R:** Avec SPF/DKIM/DMARC configurés : 24-48h. Avec warm-up complet : 2-4 semaines.

### Q: Mes emails arrivent en spam sur Gmail mais pas sur Outlook
**R:** Chaque fournisseur a ses propres filtres. Inscrivez-vous à Google Postmaster Tools pour comprendre pourquoi.

### Q: Puis-je acheter une liste d'emails ?
**R:** ❌ NON ! C'est le meilleur moyen d'être blacklisté. Utilisez uniquement des contacts opt-in.

### Q: Dois-je utiliser un service d'envoi dédié ?
**R:** Brevo est largement suffisant. Pour de gros volumes (>50k emails/mois), considérez SendGrid ou Amazon SES.

---

## 🛠️ Ressources utiles

- **Documentation Brevo** : https://help.brevo.com/
- **SPF Record Check** : https://mxtoolbox.com/spf.aspx
- **DKIM Check** : https://mxtoolbox.com/dkim.aspx
- **Email Testing** : https://www.mail-tester.com/
- **Blacklist Check** : https://mxtoolbox.com/blacklists.aspx

---

**Dernière mise à jour :** Octobre 2025

💡 **Besoin d'aide ?** N'hésitez pas à contacter le support Brevo, ils sont très réactifs !

