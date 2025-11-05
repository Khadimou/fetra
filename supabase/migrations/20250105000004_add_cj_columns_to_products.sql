-- Migration: Add CJ Dropshipping columns to existing products table
-- Description: Adds missing columns for CJ Dropshipping integration

-- Add CJ-specific columns if they don't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS cj_product_id TEXT,
ADD COLUMN IF NOT EXISTS cj_variant_id TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS category_id TEXT,
ADD COLUMN IF NOT EXISTS images JSONB,
ADD COLUMN IF NOT EXISTS variants JSONB,
ADD COLUMN IF NOT EXISTS weight NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS dimensions JSONB,
ADD COLUMN IF NOT EXISTS shipping_info JSONB;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_products_cj_product_id ON products(cj_product_id) WHERE cj_product_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_cj_variant_id ON products(cj_variant_id) WHERE cj_variant_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category) WHERE category IS NOT NULL;

-- Add unique constraint on cj_product_id if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'products_cj_product_id_key'
    ) THEN
        ALTER TABLE products ADD CONSTRAINT products_cj_product_id_key UNIQUE (cj_product_id);
    END IF;
END $$;

