# Fixer la colonne ID de la table products

## Problème

La colonne `id` de la table `products` n'a pas de valeur par défaut, ce qui cause l'erreur "null value in column id violates not-null constraint".

## Solution : Vérifier et corriger la colonne ID

### Via Supabase Dashboard

1. **Allez sur [Supabase Dashboard](https://app.supabase.com)**
2. **Sélectionnez votre projet**
3. **Allez dans "SQL Editor"**
4. **Exécutez cette requête** :

```sql
-- Vérifier si la colonne id a une valeur par défaut
SELECT column_name, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'products' AND column_name = 'id';
```

Si `column_default` est NULL, exécutez :

```sql
-- Ajouter la valeur par défaut gen_random_uuid() à la colonne id
ALTER TABLE products
ALTER COLUMN id SET DEFAULT gen_random_uuid();
```

### Ou recréer la colonne avec la valeur par défaut

```sql
-- Supprimer et recréer la colonne id avec la valeur par défaut
ALTER TABLE products DROP COLUMN IF EXISTS id;
ALTER TABLE products ADD COLUMN id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
```

**⚠️ Attention :** Cette méthode supprimera toutes les données existantes dans la colonne `id`. Si vous avez déjà des produits, utilisez plutôt la première méthode.

## Alternative : Utiliser l'extension uuid-ossp

Si `gen_random_uuid()` ne fonctionne pas :

```sql
-- Activer l'extension uuid-ossp
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Modifier la colonne pour utiliser uuid_generate_v4()
ALTER TABLE products
ALTER COLUMN id SET DEFAULT uuid_generate_v4();
```

## Vérification

Après avoir appliqué la correction, testez la synchronisation :

1. Allez sur `/admin/cj/products`
2. Entrez "gua sha" dans le champ mot-clé
3. Cliquez sur "Synchroniser"
4. Les produits devraient être créés avec succès

## Note

Le code a été modifié pour générer manuellement un UUID lors de l'insertion, mais il est préférable que la colonne ait une valeur par défaut dans la base de données.

