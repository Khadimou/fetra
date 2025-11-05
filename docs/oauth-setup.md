# Configuration OAuth (Google & Apple Sign In)

Ce guide vous explique comment configurer l'authentification sociale avec Google et Apple pour votre application FETRA.

## Variables d'environnement requises

Ajoutez ces variables dans votre fichier `.env.local` :

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Apple Sign In
APPLE_CLIENT_ID=your_apple_client_id_here
APPLE_CLIENT_SECRET=your_apple_client_secret_here
```

---

## Configuration Google OAuth

### 1. Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API "Google+ API" (si elle n'est pas déjà activée)

### 2. Configurer l'écran de consentement OAuth

1. Dans le menu, allez à **APIs & Services > OAuth consent screen**
2. Sélectionnez **External** comme type d'utilisateur
3. Remplissez les informations requises :
   - **App name** : FETRA Beauty
   - **User support email** : contact@fetrabeauty.com
   - **Developer contact** : votre email
4. Ajoutez les scopes nécessaires :
   - `userinfo.email`
   - `userinfo.profile`
5. Sauvegardez et continuez

### 3. Créer des identifiants OAuth

1. Allez à **APIs & Services > Credentials**
2. Cliquez sur **Create Credentials > OAuth client ID**
3. Sélectionnez **Web application**
4. Configurez :
   - **Name** : FETRA Web Client
   - **Authorized JavaScript origins** :
     - `http://localhost:3000` (développement)
     - `https://fetrabeauty.com` (production)
   - **Authorized redirect URIs** :
     - `http://localhost:3000/api/auth/callback/google` (développement)
     - `https://fetrabeauty.com/api/auth/callback/google` (production)
5. Cliquez sur **Create**
6. Copiez le **Client ID** et le **Client Secret**

### 4. Ajouter les credentials dans .env.local

```bash
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_secret_here
```

---

## Configuration Apple Sign In

### 1. Créer un App ID

1. Allez sur [Apple Developer Portal](https://developer.apple.com/account)
2. Allez à **Certificates, Identifiers & Profiles > Identifiers**
3. Cliquez sur **+** pour créer un nouvel identifiant
4. Sélectionnez **App IDs** et cliquez sur **Continue**
5. Configurez :
   - **Description** : FETRA Beauty Web
   - **Bundle ID** : `com.fetrabeauty.web` (ou votre propre identifiant)
   - Cochez **Sign In with Apple**
6. Cliquez sur **Continue** puis **Register**

### 2. Créer un Service ID

1. Retournez à **Identifiers** et cliquez sur **+**
2. Sélectionnez **Services IDs** et cliquez sur **Continue**
3. Configurez :
   - **Description** : FETRA Beauty Web Service
   - **Identifier** : `com.fetrabeauty.web.service`
4. Cochez **Sign In with Apple**
5. Cliquez sur **Configure** à côté de Sign In with Apple
6. Configurez les domaines :
   - **Primary App ID** : Sélectionnez l'App ID créé précédemment
   - **Domains and Subdomains** : `fetrabeauty.com`
   - **Return URLs** :
     - `http://localhost:3000/api/auth/callback/apple` (développement)
     - `https://fetrabeauty.com/api/auth/callback/apple` (production)
7. Sauvegardez et enregistrez

### 3. Créer une clé privée

1. Allez à **Certificates, Identifiers & Profiles > Keys**
2. Cliquez sur **+** pour créer une nouvelle clé
3. Configurez :
   - **Key Name** : FETRA Apple Sign In Key
   - Cochez **Sign In with Apple**
   - Cliquez sur **Configure** et sélectionnez votre Primary App ID
4. Cliquez sur **Continue** puis **Register**
5. **IMPORTANT** : Téléchargez la clé `.p8` - vous ne pourrez plus la télécharger après
6. Notez le **Key ID** affiché

### 4. Générer le Client Secret (JWT)

Le client secret pour Apple est un JWT que vous devez générer. Voici un exemple de script Node.js :

```javascript
// generate-apple-secret.js
const jwt = require('jsonwebtoken');
const fs = require('fs');

const privateKey = fs.readFileSync('AuthKey_XXXXXXXXXX.p8', 'utf8');

const token = jwt.sign({}, privateKey, {
  algorithm: 'ES256',
  expiresIn: '180d', // 6 mois (max)
  audience: 'https://appleid.apple.com',
  issuer: 'B447359FDU', // Trouvez votre Team ID dans Membership
  subject: 'com.fetrabeauty.web.service', // Votre Service ID
  keyid: 'P93RWF29VZ' // Le Key ID de votre clé .p8
});

console.log('Apple Client Secret (JWT):');
console.log(token);
```

Exécutez le script :
```bash
npm install jsonwebtoken
node generate-apple-secret.js
```

### 5. Ajouter les credentials dans .env.local

```bash
APPLE_CLIENT_ID=com.fetrabeauty.web.service
APPLE_CLIENT_SECRET=eyJhbGciOiJFUzI1NiIsImtpZCI6I... (le JWT généré)
```

**Note** : Le JWT expire après 6 mois maximum. Vous devrez le régénérer régulièrement.

---

## Test en développement

1. Ajoutez les variables d'environnement dans `.env.local`
2. Redémarrez votre serveur de développement :
   ```bash
   npm run dev
   ```
3. Allez sur `http://localhost:3000/signup` ou `http://localhost:3000/login`
4. Cliquez sur "Google" ou "Apple" pour tester l'authentification

---

## Flux d'authentification

1. L'utilisateur clique sur "Google" ou "Apple"
2. NextAuth redirige vers le provider OAuth
3. L'utilisateur s'authentifie et autorise l'application
4. Le provider redirige vers `/api/auth/callback/[provider]`
5. NextAuth crée ou récupère l'utilisateur dans Supabase
6. Un Customer est automatiquement créé (via le callback `signIn`)
7. L'utilisateur est redirigé vers `/account`

---

## Troubleshooting

### Erreur "redirect_uri_mismatch" (Google)
- Vérifiez que l'URL de callback est exactement celle configurée dans Google Cloud Console
- Format : `http://localhost:3000/api/auth/callback/google`

### Erreur "invalid_client" (Apple)
- Vérifiez que le JWT n'est pas expiré
- Vérifiez que le Service ID correspond à `APPLE_CLIENT_ID`
- Vérifiez que le Team ID et Key ID sont corrects

### L'utilisateur est créé mais pas le Customer
- Vérifiez les logs du serveur pour voir les erreurs du callback `signIn`
- Le Customer est créé automatiquement lors de la première connexion OAuth

---

## Sécurité

- **Ne committez jamais** vos client secrets dans Git
- Utilisez des variables d'environnement pour toutes les credentials
- Régénérez le JWT Apple tous les 6 mois (ou moins)
- En production, utilisez HTTPS pour toutes les redirections OAuth
