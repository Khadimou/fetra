# Fix : Webhook Stripe retourne 307 (Redirect) 🔧

## Problème

Votre webhook Stripe échoue avec un code HTTP **307 Temporary Redirect** au lieu de **200 Success**.

```json
{
  "redirect": "https://fetrabeauty.com/api/webhooks/stripe",
  "status": "307"
}
```

**Cause** : Vercel redirige automatiquement entre `www.fetrabeauty.com` et `fetrabeauty.com`. Stripe considère les redirections comme des échecs.

---

## ✅ Solution 1 : Utiliser l'URL correcte dans Stripe (RAPIDE)

### Étape 1 : Trouver l'URL qui ne redirige pas

Testez les deux URLs :

**Option A - Sans www :**
```bash
curl -I https://fetrabeauty.com/api/webhooks/stripe
```

**Option B - Avec www :**
```bash
curl -I https://www.fetrabeauty.com/api/webhooks/stripe
```

**Cherchez dans la réponse :**
- ✅ `HTTP/2 405` ou `HTTP/2 401` = **BON** (pas de redirection)
- ❌ `HTTP/2 307` = **MAUVAIS** (redirection active)

### Étape 2 : Mettre à jour le webhook dans Stripe

1. Allez sur : https://dashboard.stripe.com/webhooks
2. Cliquez sur votre webhook existant
3. Cliquez sur **...** (menu) → **Update details**
4. **Changez l'URL** vers celle qui ne redirige pas :
   - Si Option A fonctionne : `https://fetrabeauty.com/api/webhooks/stripe`
   - Si Option B fonctionne : `https://www.fetrabeauty.com/api/webhooks/stripe`
5. **Save**

### Étape 3 : Tester

Dans Stripe Dashboard → Webhooks → Votre endpoint → **Send test webhook**

Choisissez `checkout.session.completed` et envoyez.

**Résultat attendu :**
```json
{
  "status": "200",
  "received": true
}
```

---

## ✅ Solution 2 : Configurer Vercel pour ne pas rediriger les webhooks

### Option A : Dans Vercel Dashboard (Recommandé)

1. Allez dans votre projet Vercel
2. **Settings** → **Domains**
3. Vous verrez vos domaines listés :
   - `fetrabeauty.com`
   - `www.fetrabeauty.com`

**Configuration recommandée :**
- **Domaine principal** : `fetrabeauty.com` (sans www)
- **Domaine secondaire** : `www.fetrabeauty.com` → Redirige vers principal

4. Utilisez le domaine principal dans Stripe : `https://fetrabeauty.com/api/webhooks/stripe`

### Option B : Middleware Next.js pour bypass les webhooks

Si vous voulez que les deux URLs fonctionnent, créez un middleware :

**Créez `middleware.ts` à la racine :**

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Don't redirect webhook URLs
  if (request.nextUrl.pathname.startsWith('/api/webhooks')) {
    return NextResponse.next();
  }

  // Redirect www to non-www for other pages
  const hostname = request.headers.get('host');
  if (hostname?.startsWith('www.')) {
    const newUrl = request.nextUrl.clone();
    newUrl.host = hostname.replace('www.', '');
    return NextResponse.redirect(newUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and images
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

Puis commitez et déployez :
```bash
git add middleware.ts
git commit -m "Add middleware to prevent webhook redirects"
git push
```

---

## ✅ Solution 3 : Créer un domaine dédié pour les webhooks (Avancé)

Si vous avez beaucoup de webhooks, créez un sous-domaine :

1. Ajoutez `api.fetrabeauty.com` dans Vercel
2. Configurez le webhook Stripe : `https://api.fetrabeauty.com/api/webhooks/stripe`

Avantages :
- Pas de conflit www/non-www
- Meilleure organisation
- Rate limiting séparé

---

## 🧪 Tester la solution

### Test 1 : Curl direct

```bash
curl -X POST https://fetrabeauty.com/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"type":"checkout.session.completed"}'
```

**Attendu :**
- Code HTTP : `200` ou `401` (pas 307)
- Body : `{"error":"Invalid signature"}` (c'est normal sans la signature Stripe)

### Test 2 : Depuis Stripe Dashboard

1. **Developers** → **Webhooks** → Votre endpoint
2. **Send test webhook**
3. Type : `checkout.session.completed`
4. **Send test webhook**

**Attendu :**
```
✓ Test webhook sent successfully
Status: 200
Response: {"received":true}
```

### Test 3 : Paiement réel

1. Faites un paiement de test (0,90€)
2. Vérifiez les logs Stripe : **Webhooks** → Votre endpoint → **Logs**
3. Le dernier événement doit être : ✅ **Succeeded**

---

## 🔍 Debug : Voir les logs détaillés

### Dans Vercel

1. **Deployments** → Dernier déploiement
2. **View Function Logs**
3. Filtrez par `webhooks/stripe`

Cherchez :
```
✅ Order confirmation email sent: dioprassoul@gmail.com
```

Ou en cas d'erreur :
```
❌ Order confirmation email error: [message]
```

### Dans Stripe

1. **Developers** → **Webhooks**
2. Cliquez sur votre endpoint
3. Onglet **Logs**
4. Regardez le dernier événement

**Bon :**
```
✓ checkout.session.completed
  Status: 200
  Response: {"received":true}
```

**Mauvais :**
```
✗ checkout.session.completed
  Status: 307
  Response: {"redirect":"https://..."}
```

---

## 📋 Checklist de résolution

- [ ] Testé les deux URLs (avec et sans www) avec curl
- [ ] Identifié l'URL qui ne redirige pas (retourne 405/401 au lieu de 307)
- [ ] Mis à jour l'URL du webhook dans Stripe Dashboard
- [ ] Testé avec "Send test webhook" dans Stripe
- [ ] Vérifié que le statut est 200 (pas 307)
- [ ] Fait un paiement de test de 0,90€
- [ ] Reçu l'email de confirmation
- [ ] Vérifié les logs Vercel (confirmation email sent)

---

## ❓ FAQ

**Q : Pourquoi 307 et pas 200 ?**  
R : Vercel redirige automatiquement www ↔ non-www. Stripe ne suit pas les redirections.

**Q : Dois-je configurer les deux domaines (avec et sans www) ?**  
R : Non, configurez uniquement celui qui ne redirige pas dans Stripe.

**Q : Le webhook fonctionne en local mais pas en production**  
R : Normal, en local il n'y a pas de redirection www. Suivez les solutions ci-dessus.

**Q : J'ai changé l'URL mais ça ne marche toujours pas**  
R : Attendez 1-2 minutes pour la propagation. Testez avec "Send test webhook" dans Stripe.

**Q : Que faire si les deux URLs redirigent ?**  
R : Utilisez la Solution 2 (middleware) ou contactez le support Vercel.

---

## 🎯 Résumé : Action immédiate

**En 3 minutes :**

1. Testez : `https://fetrabeauty.com/api/webhooks/stripe` (sans www)
2. Allez dans Stripe Dashboard → Webhooks → Modifiez l'URL
3. Utilisez : `https://fetrabeauty.com/api/webhooks/stripe`
4. Testez avec "Send test webhook"
5. Faites un paiement de test → Email reçu ! ✅

---

**Dernière mise à jour** : 30 octobre 2025

