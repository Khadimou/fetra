# Comment voir les logs des Edge Functions Supabase

## Méthode 1 : Via Supabase Dashboard (recommandé)

1. **Allez sur [Supabase Dashboard](https://app.supabase.com)**
2. **Sélectionnez votre projet** (`tjylxwnvrsopauibqkje`)
3. **Allez dans "Edge Functions"** dans le menu de gauche
4. **Sélectionnez la fonction** `sync-cj-products`
5. **Cliquez sur l'onglet "Logs"**
6. **Vous verrez les logs en temps réel**

## Méthode 2 : Via Supabase CLI (si disponible)

```bash
# Lister les fonctions
npx supabase functions list

# Voir les logs (la syntaxe peut varier selon la version)
# Note: La commande exacte peut différer selon la version de Supabase CLI
```

**Note :** La commande `supabase functions logs` n'existe pas dans toutes les versions de Supabase CLI. Utilisez le Dashboard pour voir les logs.

## Méthode 3 : Via l'API Supabase (avancé)

Vous pouvez aussi voir les logs via l'API Supabase, mais c'est plus complexe.

## Conseils pour déboguer

1. **Vérifiez les logs dans le Dashboard** après avoir lancé une synchronisation
2. **Cherchez les erreurs** en filtrant par niveau (ERROR, WARN)
3. **Vérifiez les messages de console.log** pour voir le flux d'exécution
4. **Vérifiez la structure des réponses API** si vous voyez des erreurs de parsing

## Exemple de logs à vérifier

Dans les logs, vous devriez voir :
- ✅ `Requesting new CJ access token`
- ✅ `CJ access token obtained, expires in X seconds`
- ✅ `CJ API call: GET /product/listV2?keyWord=...`
- ✅ `Found X products (total: Y)`
- ✅ `✓ Synced product: ...`

Si vous voyez des erreurs :
- ❌ `CJ API error: ...` - Problème d'authentification ou d'API
- ❌ `Invalid API response: ...` - Structure de réponse inattendue
- ❌ `Failed to sync product ...` - Erreur lors de la sauvegarde

