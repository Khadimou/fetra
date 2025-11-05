# CJ Dropshipping Integration - Quick Start

Guide rapide pour déployer l'intégration CJ Dropshipping en 10 minutes.

## ✅ Checklist de déploiement

### Étape 1: Prérequis (5 min)

- [ ] Compte CJ Dropshipping créé
- [ ] `CJ_CLIENT_ID` et `CJ_CLIENT_SECRET` obtenus
- [ ] Projet Supabase créé sur [supabase.com](https://supabase.com)
- [ ] Supabase CLI installé: `npm install -g supabase`

### Étape 2: Configuration locale (2 min)

```bash
# 1. Créer le fichier .env.local
cd /home/user/fetra/supabase
cp .env.example .env.local

# 2. Éditer .env.local avec vos credentials
nano .env.local
```

Remplir avec vos valeurs :
```bash
CJ_CLIENT_ID=votre_client_id
CJ_CLIENT_SECRET=votre_client_secret
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
```

### Étape 3: Appliquer les migrations (1 min)

```bash
# 1. Se connecter à Supabase
supabase login

# 2. Lier votre projet
supabase link --project-ref votre-project-ref

# 3. Appliquer les migrations SQL
supabase db push
```

**Résultat attendu**: 3 tables créées (`products`, `orders`, `cj_sync_logs`)

### Étape 4: Déployer les Edge Functions (2 min)

```bash
# 1. Configurer les secrets
supabase secrets set CJ_CLIENT_ID=votre_client_id
supabase secrets set CJ_CLIENT_SECRET=votre_client_secret

# 2. Déployer les fonctions
supabase functions deploy sync-cj-products --no-verify-jwt
supabase functions deploy create-cj-order --no-verify-jwt
supabase functions deploy get-cj-tracking --no-verify-jwt
```

**Résultat attendu**: 3 Edge Functions déployées et accessibles

### Étape 5: Tester l'intégration (1 min)

```bash
# Test 1: Synchroniser 5 produits K-Beauty
curl -X POST "https://votre-projet.supabase.co/functions/v1/sync-cj-products" \
  -H "Authorization: Bearer VOTRE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"keyWord":"Gua Sha","pageSize":5,"maxPages":1}'
```

**Résultat attendu**:
```json
{
  "success": true,
  "stats": {
    "processed": 5,
    "created": 5,
    "updated": 0,
    "failed": 0
  }
}
```

```bash
# Test 2: Vérifier les produits en base
# Via Supabase Dashboard → Table Editor → products
# Vous devriez voir 5 produits avec les infos CJ
```

## 🚀 Mise en production

### Option A: Cron automatique (Recommandé)

Créer un cron job pour synchroniser les produits quotidiennement :

```sql
-- Dans Supabase SQL Editor
SELECT cron.schedule(
  'sync-cj-products-daily',
  '0 2 * * *', -- Tous les jours à 2h du matin
  $$
  SELECT net.http_post(
    url := 'https://votre-projet.supabase.co/functions/v1/sync-cj-products',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key')
    ),
    body := '{"keyWord": "K-Beauty", "maxPages": 10}'::jsonb
  );
  $$
);
```

### Option B: GitHub Actions

Créer `.github/workflows/sync-cj-products.yml` :

```yaml
name: Sync CJ Products Daily
on:
  schedule:
    - cron: '0 2 * * *'
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Sync Products
        run: |
          curl -X POST "${{ secrets.SUPABASE_URL }}/functions/v1/sync-cj-products" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{"keyWord":"K-Beauty","maxPages":10}'
```

## 📊 Monitoring

### Dashboard Supabase

1. **Logs**: Dashboard → Edge Functions → Logs
2. **Métriques**: Dashboard → Edge Functions → Invocations
3. **Sync logs**: Table Editor → `cj_sync_logs`

### Requête SQL utile

```sql
-- Voir les dernières synchronisations
SELECT
  sync_type,
  status,
  items_processed,
  items_created,
  items_updated,
  items_failed,
  duration_ms,
  started_at
FROM cj_sync_logs
ORDER BY started_at DESC
LIMIT 20;
```

## 🐛 Dépannage rapide

### Erreur: "Failed to get CJ access token"

**Cause**: Credentials invalides

**Solution**:
```bash
# Vérifier les secrets
supabase secrets list

# Reconfigurer si nécessaire
supabase secrets set CJ_CLIENT_ID=nouveau_client_id
supabase secrets set CJ_CLIENT_SECRET=nouveau_secret
```

### Erreur: "Table products does not exist"

**Cause**: Migrations non appliquées

**Solution**:
```bash
supabase db push
```

### Erreur: "CJ API returned error: 429 Too Many Requests"

**Cause**: Rate limit dépassé

**Solution**: Réduire `maxPages` ou augmenter l'intervalle entre les syncs

### Les produits ne se synchronisent pas

**Debug**:
```bash
# 1. Vérifier les logs Edge Function
# Dashboard → Edge Functions → sync-cj-products → Logs

# 2. Tester manuellement
supabase functions serve sync-cj-products --env-file .env.local
```

## 📚 Prochaines étapes

1. **Intégrer au frontend**: Voir `docs/cj-dropshipping-integration.md`
2. **Configurer les webhooks**: Recevoir les notifications CJ en temps réel
3. **Automatiser les commandes**: Connecter le checkout à `create-cj-order`
4. **Afficher le tracking**: Créer une page de suivi avec `get-cj-tracking`

## 🔗 Ressources

- [README complet](./README.md)
- [Documentation détaillée](../docs/cj-dropshipping-integration.md)
- [API CJ Dropshipping](https://developers.cjdropshipping.com/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

---

**Support**: En cas de problème, consulter les logs Supabase ou créer une issue sur GitHub.
