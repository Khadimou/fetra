# Guide de Migration : Prisma + NextAuth

Ce guide vous explique comment finaliser la migration de FETRA vers Prisma + PostgreSQL + NextAuth.

## 📋 Checklist Complète

### ✅ Déjà fait
- [x] Installation des dépendances (Prisma, NextAuth, bcrypt, @prisma/client, @auth/prisma-adapter)
- [x] Schéma Prisma complet (User, Customer, Order, OrderItem, ShippingInfo)
- [x] Client Prisma singleton (`lib/db/prisma.ts`)
- [x] Configuration NextAuth (`lib/auth/auth.config.ts` + API route)
- [x] Nouvelle implémentation de `lib/db/orders.ts` avec Prisma
- [x] Script de seed (`prisma/seed.ts`)
- [x] Page de login admin mise à jour

### ⏳ À faire

1. **Setup PostgreSQL**
2. **Créer et appliquer les migrations**
3. **Mettre à jour les variables d'environnement**
4. **Exécuter le seed**
5. **Mettre à jour les pages et API routes**
6. **Tester le système**

---

## 1️⃣ Setup PostgreSQL

Vous avez **3 options** :

### Option A : Local (avec Docker) - Recommandé pour développement

```bash
# 1. Installer Docker Desktop (si pas déjà fait)
# https://www.docker.com/products/docker-desktop

# 2. Démarrer PostgreSQL
docker run --name fetra-postgres \
  -e POSTGRES_PASSWORD=fetra123 \
  -e POSTGRES_USER=fetra \
  -e POSTGRES_DB=fetra \
  -p 5432:5432 \
  -d postgres:16

# 3. Connection string à ajouter dans .env.local
DATABASE_URL="postgresql://fetra:fetra123@localhost:5432/fetra?schema=public"
```

### Option B : Vercel Postgres - Recommandé pour production

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Onglet **Storage** → **Create Database** → **Postgres**
4. Copiez la `DATABASE_URL` → Ajoutez dans `.env.local`

### Option C : Supabase - Alternative gratuite

1. Créez un compte sur https://supabase.com
2. Créez un nouveau projet
3. Allez dans **Settings** → **Database** → **Connection string**
4. Mode: **Direct connection** (pour Prisma)
5. Copiez l'URL → Ajoutez dans `.env.local`

---

## 2️⃣ Configurer les variables d'environnement

Créez/modifiez votre `.env.local` :

```bash
# Database
DATABASE_URL="postgresql://..." # Votre connection string

# NextAuth
NEXTAUTH_SECRET="votre_secret_genere"
# Générer avec: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Reste des variables (Stripe, Brevo, etc.)
# ... (garder les existantes)
```

**Générer NEXTAUTH_SECRET** :
```bash
# Sur Mac/Linux
openssl rand -base64 32

# Sur Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

## 3️⃣ Créer et appliquer les migrations Prisma

```bash
# 1. Générer le client Prisma
npx prisma generate

# 2. Créer la migration initiale
npx prisma migrate dev --name init

# Cela va :
# - Créer toutes les tables
# - Générer le client TypeScript
# - Appliquer les migrations

# 3. (Optionnel) Voir la base de données
npx prisma studio
# Ouvre une interface web sur http://localhost:5555
```

Si vous rencontrez des erreurs, vérifiez :
- ✅ PostgreSQL est bien démarré
- ✅ La `DATABASE_URL` est correcte
- ✅ Le port 5432 n'est pas déjà utilisé

---

## 4️⃣ Exécuter le seed (créer l'admin)

```bash
npx prisma db seed
```

Vous devriez voir :
```
✅ Admin user created: admin@fetrabeauty.com
✅ Sample customer created: client@example.com
🎉 Seed completed successfully!

📝 Login credentials:
   Email: admin@fetrabeauty.com
   Password: admin123

⚠️  IMPORTANT: Change the admin password in production!
```

---

## 5️⃣ Mettre à jour les fichiers restants

### A. Ajouter SessionProvider dans le layout

**Créez `app/providers.tsx`** :
```tsx
'use client';

import { SessionProvider } from 'next-auth/react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

**Mettez à jour `app/layout.tsx`** :
```tsx
import { AuthProvider } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          {/* ... reste du code ... */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### B. Mettre à jour `app/admin/page.tsx`

Remplacez :
```tsx
// Ancien
useEffect(() => {
  async function checkAuth() {
    try {
      const res = await fetch('/api/admin/me');
      // ...
    }
  }
  checkAuth();
}, [router]);
```

Par :
```tsx
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function AdminDashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/admin/login');
    }
  });

  if (status === 'loading') {
    return <div>Chargement...</div>;
  }

  // ... reste du code
}
```

### C. Mettre à jour `app/admin/orders/[orderId]/page.tsx`

Même changement :
```tsx
import { useSession } from 'next-auth/react';

export default function OrderDetail() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/admin/login');
    }
  });

  // ... reste du code
}
```

### D. Supprimer les anciennes API routes admin

```bash
# Ces fichiers ne sont plus nécessaires avec NextAuth
rm app/api/admin/login/route.ts
rm app/api/admin/logout/route.ts
rm app/api/admin/me/route.ts
```

### E. Mettre à jour `app/api/admin/orders/route.ts`

```tsx
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { getAllOrders } from '@/lib/db/orders';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const orders = await getAllOrders();
    return NextResponse.json({ orders, total: orders.length });
  } catch (error: any) {
    console.error('Get orders error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
```

### F. Mettre à jour `app/api/admin/orders/[orderId]/route.ts`

```tsx
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { getOrder } from '@/lib/db/orders';

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { orderId } = params;
    const order = await getOrder(orderId);

    if (!order) {
      return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Get order error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
```

### G. Mettre à jour `app/api/webhooks/stripe/route.ts`

Remplacez les imports et les fonctions:
```tsx
import { upsertCustomer, createOrder, updateOrderStatus } from '@/lib/db/orders';
import { OrderStatus } from '@prisma/client';

// Dans la fonction POST, remplacez saveOrder() par:

// 1. Créer ou récupérer le customer
const nameParts = customerName.split(' ');
const customer = await upsertCustomer(customerEmail, {
  firstName: nameParts[0] || '',
  lastName: nameParts.slice(1).join(' ') || ''
});

// 2. Créer la commande
const order = await createOrder({
  customerId: customer.id,
  amount: amountTotal,
  currency: session.currency || 'eur',
  stripeSessionId: session.id,
  stripePaymentIntent: session.payment_intent as string || undefined,
  items: [
    {
      productSku: 'FETRA-RIT-001',
      productName: 'Rituel Visage Liftant',
      quantity: 1,
      unitPrice: amountTotal
    }
  ],
  metadata: {
    paymentStatus: session.payment_status
  }
});

// 3. Marquer comme payée
await updateOrderStatus(order.id, OrderStatus.PAID);
```

### H. Mettre à jour `app/api/orders/[orderId]/ship/route.ts`

```tsx
import { markAsShipped } from '@/lib/db/orders';
import { ShippingCarrier } from '@prisma/client';

// Dans handleShip, remplacez l'appel par:
const order = await markAsShipped(orderId, {
  trackingNumber,
  carrier: ShippingCarrier.COLISSIMO,
  recipientName: order.customer.firstName + ' ' + order.customer.lastName,
  recipientEmail: order.customer.email,
  street: 'À définir', // TODO: Récupérer depuis Stripe checkout
  city: 'À définir',
  postalCode: '00000',
  country: 'FR'
});
```

---

## 6️⃣ Tester le système

### Test 1 : Connexion admin
```bash
# 1. Démarrer le serveur
npm run dev

# 2. Aller sur http://localhost:3000/admin/login
# Email: admin@fetrabeauty.com
# Password: admin123

# ✅ Vous devriez être redirigé vers /admin
```

### Test 2 : Liste des commandes
```
# ✅ La page admin doit afficher une liste vide (ou des commandes existantes)
```

### Test 3 : Créer une commande
```bash
# 1. Passez une commande de test sur le site
# 2. Vérifiez dans Prisma Studio
npx prisma studio
# 3. La commande doit apparaître dans le dashboard admin
```

### Test 4 : Marquer comme expédiée
```
# 1. Cliquez sur une commande
# 2. Entrez un numéro de tracking: 8K00009775862
# 3. Cliquez "Marquer comme expédiée"
# ✅ Statut passe à "Shipped"
# ✅ Widget de tracking s'affiche
# ✅ Email envoyé au client
```

---

## 🔧 Dépannage

### Erreur : "Can't reach database server"
```bash
# Vérifier que PostgreSQL est bien démarré
docker ps # Doit afficher fetra-postgres

# Redémarrer si nécessaire
docker start fetra-postgres
```

### Erreur : "Prisma Client not generated"
```bash
npx prisma generate
```

### Erreur : "NEXTAUTH_SECRET is missing"
```bash
# Générer et ajouter dans .env.local
openssl rand -base64 32
```

### Erreur : "Invalid credentials" lors du login
```bash
# Re-exécuter le seed
npx prisma db seed
```

### Erreur TypeScript après migration
```bash
# Regénérer le client Prisma
npx prisma generate

# Redémarrer le serveur TypeScript
# Dans VSCode: Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

---

## 📝 Commandes utiles

```bash
# Voir les tables de la base de données
npx prisma studio

# Créer une nouvelle migration après modification du schéma
npx prisma migrate dev --name nom_de_la_migration

# Appliquer les migrations en production
npx prisma migrate deploy

# Reset complet de la base (⚠️ EFFACE TOUTES LES DONNÉES)
npx prisma migrate reset

# Format du schéma Prisma
npx prisma format

# Valider le schéma
npx prisma validate
```

---

## 🚀 Déploiement sur Vercel

1. **Ajoutez les variables d'environnement dans Vercel** :
   - `DATABASE_URL` (from Vercel Postgres or Supabase)
   - `NEXTAUTH_SECRET` (généré avec openssl)
   - `NEXTAUTH_URL` (https://www.fetrabeauty.com)

2. **Pushez sur GitHub** :
```bash
git add .
git commit -m "Migrate to Prisma + NextAuth"
git push
```

3. **Vercel va automatiquement** :
   - Installer les dépendances
   - Générer le client Prisma (`npx prisma generate` via postinstall)
   - Builder l'application

4. **Après le déploiement, exécutez le seed** :
```bash
# Option A: Via Vercel CLI
vercel env pull
npx prisma db seed

# Option B: Créez l'admin via Prisma Studio
# 1. Ouvrez Prisma Studio en local avec la DATABASE_URL de production
# 2. Créez manuellement l'utilisateur avec mot de passe hashé
```

---

## ⚠️ Important : Ancien système vs Nouveau système

### Fichiers supprimés/remplacés
- ❌ `lib/auth/admin.ts` (ancien) → ✅ `lib/auth/auth.config.ts` (NextAuth)
- ❌ `lib/db/orders.backup.ts` (ancien JSON) → ✅ `lib/db/orders.ts` (Prisma)
- ❌ `/api/admin/login` → ✅ `/api/auth/[...nextauth]`
- ❌ `data/orders.json` → ✅ PostgreSQL

### Migration des anciennes commandes
Si vous avez des commandes dans `data/orders.json`, créez un script de migration :

```typescript
// scripts/migrate-old-orders.ts
import prisma from '../lib/db/prisma';
import fs from 'fs';

async function migrate() {
  const oldOrders = JSON.parse(fs.readFileSync('data/orders.json', 'utf-8'));

  for (const old of oldOrders) {
    const customer = await prisma.customer.upsert({
      where: { email: old.email },
      create: { email: old.email },
      update: {}
    });

    await prisma.order.create({
      data: {
        orderNumber: old.id,
        customerId: customer.id,
        amount: old.amount,
        currency: old.currency,
        status: old.status === 'paid' ? 'PAID' : 'PENDING',
        createdAt: new Date(old.createdAt),
        // ... mapper les autres champs
      }
    });
  }
}

migrate();
```

---

Besoin d'aide ? Consultez :
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation NextAuth](https://next-auth.js.org)
- [CLAUDE.md](../CLAUDE.md) - Architecture du projet
