-- Migration: Create products table for CJ Dropshipping integration
-- Description: Stores product data synchronized from CJ Dropshipping API

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cj_product_id TEXT UNIQUE NOT NULL, -- The product ID from CJ (pid)
  cj_variant_id TEXT, -- The variant ID from CJ (vid) if applicable
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  images JSONB, -- Array of image URLs
  variants JSONB, -- Product variants (color, size, etc.)
  category TEXT,
  category_id TEXT, -- CJ category ID
  sku TEXT, -- Product or variant SKU
  weight NUMERIC(10, 2), -- Weight in kg
  dimensions JSONB, -- {length, width, height} in cm
  shipping_info JSONB, -- Shipping options and costs
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_products_cj_product_id ON products(cj_product_id);
CREATE INDEX idx_products_cj_variant_id ON products(cj_variant_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE products IS 'Products synchronized from CJ Dropshipping API';
