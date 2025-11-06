# Configurer OAuth sur Vercel

Ce guide explique comment ajouter les variables d'environnement OAuth (Google et Apple) sur Vercel pour que l'authentification sociale fonctionne en production.

## Variables d'environnement requises

Vous devez configurer ces variables dans Vercel Dashboard :

```bash
# Google OAuth
GOOGLE_CLIENT_ID=votre_google_client_id
GOOGLE_CLIENT_SECRET=votre_google_client_secret

# Apple Sign In
APPLE_CLIENT_ID=com.fetrabeauty.web.service
APPLE_CLIENT_SECRET=eyJhbGci... (le JWT généré)
```

## Étapes pour configurer sur Vercel

### 1. Accéder aux variables d'environnement

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet **fetra**
3. Cliquez sur **Settings** dans le menu du haut
4. Cliquez sur **Environment Variables** dans le menu latéral

### 2. Ajouter Google OAuth

Ajoutez ces deux variables :

**Variable 1 : GOOGLE_CLIENT_ID**
- **Key** : `GOOGLE_CLIENT_ID`
- **Value** : Copiez votre Client ID depuis Google Cloud Console
  - Format : `123456789-abc123def456.apps.googleusercontent.com`
- **Environment** : Cochez **Production**, **Preview**, et **Development**
- Cliquez sur **Save**

**Variable 2 : GOOGLE_CLIENT_SECRET**
- **Key** : `GOOGLE_CLIENT_SECRET`
- **Value** : Copiez votre Client Secret depuis Google Cloud Console
  - Format : `GOCSPX-your_secret_here`
- **Environment** : Cochez **Production**, **Preview**, et **Development**
- Cliquez sur **Save**

### 3. Ajouter Apple Sign In

Ajoutez ces deux variables :

**Variable 1 : APPLE_CLIENT_ID**
- **Key** : `APPLE_CLIENT_ID`
- **Value** : `com.fetrabeauty.web.service`
- **Environment** : Cochez **Production**, **Preview**, et **Development**
- Cliquez sur **Save**

**Variable 2 : APPLE_CLIENT_SECRET**
- **Key** : `APPLE_CLIENT_SECRET`
- **Value** : Copiez le JWT généré par le script `generate-apple-secret.js`
  - Format : `eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlA5M1J...` (très long)
  - **IMPORTANT** : Copiez la valeur COMPLÈTE du JWT
- **Environment** : Cochez **Production**, **Preview**, et **Development**
- Cliquez sur **Save**

### 4. Redéployer

Après avoir ajouté toutes les variables :

1. Allez dans l'onglet **Deployments**
2. Cliquez sur les **trois points** (•••) à côté du dernier déploiement
3. Cliquez sur **Redeploy**
4. Confirmez en cliquant sur **Redeploy**

Le site sera redéployé avec les nouvelles variables d'environnement.

## Vérifier que ça fonctionne

### Test Google OAuth

1. Allez sur `https://fetrabeauty.com/login`
2. Cliquez sur le bouton **Google**
3. Vous devriez être redirigé vers Google pour vous authentifier
4. Après authentification, vous devriez être redirigé vers `/account`

### Test Apple Sign In

1. Allez sur `https://fetrabeauty.com/login`
2. Cliquez sur le bouton **Apple**
3. Vous devriez être redirigé vers Apple pour vous authentifier
4. Après authentification, vous devriez être redirigé vers `/account`

## Erreurs courantes

### Error: "Configuration"

**Cause** : Les variables d'environnement ne sont pas configurées sur Vercel

**Solution** :
1. Vérifiez que toutes les variables sont bien ajoutées dans Vercel Dashboard
2. Vérifiez qu'il n'y a pas d'espaces avant/après les valeurs
3. Redéployez le site après avoir ajouté les variables

### Error: "OAuthCallback"

**Cause** : L'URL de callback n'est pas configurée dans Google/Apple

**Solution** :

**Pour Google :**
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services > Credentials
3. Cliquez sur votre OAuth Client ID
4. Ajoutez `https://fetrabeauty.com/api/auth/callback/google` dans **Authorized redirect URIs**
5. Sauvegardez

**Pour Apple :**
1. Allez sur [Apple Developer Portal](https://developer.apple.com/account)
2. Certificates, Identifiers & Profiles > Identifiers
3. Sélectionnez votre Service ID
4. Cliquez sur **Configure** à côté de Sign In with Apple
5. Ajoutez `https://fetrabeauty.com/api/auth/callback/apple` dans **Return URLs**
6. Sauvegardez

### Error: "OAuthAccountNotLinked"

**Cause** : L'email est déjà utilisé avec un autre mode de connexion

**Solution** :
- Si l'utilisateur s'est inscrit avec email/password, il doit se connecter avec email/password
- Si l'utilisateur s'est inscrit avec Google, il doit se connecter avec Google
- Les comptes ne peuvent pas être fusionnés automatiquement (limitation de sécurité)

## Variables d'environnement complètes

Voici toutes les variables OAuth à configurer sur Vercel :

```bash
# Google OAuth (à configurer)
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_secret_here

# Apple Sign In (à configurer)
APPLE_CLIENT_ID=com.fetrabeauty.web.service
APPLE_CLIENT_SECRET=eyJhbGci...very_long_jwt_token

# NextAuth (déjà configuré normalement)
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://fetrabeauty.com
```

## Notes importantes

1. **Sensibilité à la casse** : Les noms de variables sont sensibles à la casse
2. **Espaces** : Pas d'espaces avant ou après les valeurs
3. **JWT Apple** : Expire tous les 6 mois, à régénérer avec `node generate-apple-secret.js`
4. **Environments** : Configurez pour Production ET Preview pour tester avant le déploiement
5. **Redéploiement** : Toujours redéployer après avoir modifié les variables

## Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs Vercel : Dashboard > Deployments > [Dernier déploiement] > Function Logs
2. Testez en local avec les mêmes variables dans `.env.local`
3. Consultez `docs/oauth-setup.md` pour la configuration Google/Apple
