# Guide pour obtenir les variables d'environnement Supabase

## 📍 Où trouver les variables dans le dashboard Supabase

### Étape 1 : Accéder à ton projet Supabase

1. Va sur [supabase.com](https://supabase.com)
2. Connecte-toi à ton compte
3. Sélectionne ton projet (ou crée-en un nouveau)

### Étape 2 : Obtenir les variables

1. **Dans le menu latéral**, clique sur **"Settings"** (⚙️ Paramètres)
2. **Clique sur "API"** dans le sous-menu

### Étape 3 : Copier les variables

Tu verras plusieurs sections :

#### 🔗 **Project URL**
- C'est ton `NEXT_PUBLIC_SUPABASE_URL`
- Format : `https://xxxxx.supabase.co`
- Copie cette URL complète

#### 🔑 **Project API keys**

**1. `anon` `public` key** (clé anonyme)
- C'est ton `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Cette clé est publique et peut être utilisée côté client
- Format : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**2. `service_role` `secret` key** (clé de service)
- C'est ton `SUPABASE_SERVICE_ROLE_KEY`
- ⚠️ **ATTENTION** : Cette clé est **SENSIBLE** et ne doit **JAMAIS** être exposée côté client
- Elle donne accès complet à ta base de données
- Utilise-la uniquement dans les routes API serveur
- Format : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 Configuration dans `.env.local`

Ajoute ces variables dans ton fichier `.env.local` :

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ton-projet-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔒 Sécurité

- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Peut être publique (préfixe `NEXT_PUBLIC_`)
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Peut être publique (préfixe `NEXT_PUBLIC_`)
- ❌ `SUPABASE_SERVICE_ROLE_KEY` - **NE JAMAIS** exposer côté client
- ❌ Ne jamais commiter `.env.local` dans Git (déjà dans `.gitignore`)

## 📸 Où trouver dans le dashboard

```
Dashboard Supabase
├── [Ton Projet]
    ├── Settings (⚙️)
        ├── API
            ├── Project URL ← NEXT_PUBLIC_SUPABASE_URL
            ├── Project API keys
                ├── anon public ← NEXT_PUBLIC_SUPABASE_ANON_KEY
                └── service_role secret ← SUPABASE_SERVICE_ROLE_KEY
```

## 🔍 Vérification

Pour vérifier que tes variables sont bien configurées :

```bash
# Vérifier que les variables sont chargées
node -e "console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌')"
```

Ou dans ton code Next.js :
```typescript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configuré' : '❌ Manquant');
console.log('Service Role Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Configuré' : '❌ Manquant');
```

## ⚠️ Important

- Après avoir ajouté/modifié les variables dans `.env.local`, **redémarre le serveur** (`npm run dev`)
- Les variables avec le préfixe `NEXT_PUBLIC_` sont accessibles côté client
- Les autres variables ne sont accessibles que côté serveur (routes API)

