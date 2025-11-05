# Appliquer les migrations Supabase

## Problème : Colonne 'category' introuvable

L'erreur indique que la colonne `category` n'existe pas dans la table `products` de Supabase, même si elle est définie dans la migration.

## Solution : Appliquer les migrations

### Option 1 : Via Supabase CLI (recommandé)

```bash
# Appliquer toutes les migrations
npx supabase db push

# Ou depuis la racine du projet
cd supabase
npx supabase db push
```

### Option 2 : Via Supabase Dashboard

1. **Allez sur [Supabase Dashboard](https://app.supabase.com)**
2. **Sélectionnez votre projet** (`tjylxwnvrsopauibqkje`)
3. **Allez dans "SQL Editor"**
4. **Collez le contenu de la migration** :
   ```sql
   -- Migration: Create products table for CJ Dropshipping integration
   CREATE TABLE IF NOT EXISTS products (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     cj_product_id TEXT UNIQUE NOT NULL,
     cj_variant_id TEXT,
     name TEXT NOT NULL,
     description TEXT,
     price NUMERIC(10, 2) NOT NULL,
     stock INTEGER NOT NULL DEFAULT 0,
     images JSONB,
     variants JSONB,
     category TEXT,
     category_id TEXT,
     sku TEXT,
     weight NUMERIC(10, 2),
     dimensions JSONB,
     shipping_info JSONB,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   -- Create indexes
   CREATE INDEX IF NOT EXISTS idx_products_cj_product_id ON products(cj_product_id);
   CREATE INDEX IF NOT EXISTS idx_products_cj_variant_id ON products(cj_variant_id);
   CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
   CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
   CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
   
   -- Create updated_at trigger
   CREATE OR REPLACE FUNCTION update_updated_at_column()
   RETURNS TRIGGER AS $$
   BEGIN
     NEW.updated_at = NOW();
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;
   
   DROP TRIGGER IF EXISTS update_products_updated_at ON products;
   CREATE TRIGGER update_products_updated_at
     BEFORE UPDATE ON products
     FOR EACH ROW
     EXECUTE FUNCTION update_updated_at_column();
   ```
5. **Cliquez sur "Run"**

### Option 3 : Ajouter uniquement la colonne manquante

Si la table existe déjà mais que la colonne `category` manque :

```sql
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category TEXT;
```

## Vérifier que la table existe

Dans Supabase Dashboard → SQL Editor :

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products';
```

Vous devriez voir toutes les colonnes, y compris `category`.

## Après avoir appliqué la migration

1. **Redéployez l'Edge Function** (optionnel, mais recommandé) :
   ```bash
   npx supabase functions deploy sync-cj-products
   ```

2. **Testez la synchronisation** depuis `/admin/cj/products`

## Migrations disponibles

- `20250105000001_create_cj_products_table.sql` - Crée la table `products`
- `20250105000002_create_cj_orders_table.sql` - Crée la table `cj_orders` (si applicable)
- `20250105000003_create_sync_logs_table.sql` - Crée la table `cj_sync_logs` (si applicable)

