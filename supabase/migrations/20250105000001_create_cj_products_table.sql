-- Migration: Create products table for CJ Dropshipping integration
-- Description: Stores product data synchronized from CJ Dropshipping API

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  sku TEXT, -- Product or variant SKU
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add CJ-specific columns if they don't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS cj_product_id TEXT,
ADD COLUMN IF NOT EXISTS cj_variant_id TEXT,
ADD COLUMN IF NOT EXISTS images JSONB,
ADD COLUMN IF NOT EXISTS variants JSONB,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS category_id TEXT,
ADD COLUMN IF NOT EXISTS weight NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS dimensions JSONB,
ADD COLUMN IF NOT EXISTS shipping_info JSONB;

-- Create indexes for better query performance (only if columns exist)
CREATE INDEX IF NOT EXISTS idx_products_cj_product_id ON products(cj_product_id) WHERE cj_product_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_cj_variant_id ON products(cj_variant_id) WHERE cj_variant_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku) WHERE sku IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category) WHERE category IS NOT NULL;
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

-- Add comment
COMMENT ON TABLE products IS 'Products synchronized from CJ Dropshipping API';
