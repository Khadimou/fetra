-- Migration: Create orders table for CJ Dropshipping integration
-- Description: Stores order data and tracks CJ Dropshipping order status

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  cj_order_id TEXT UNIQUE, -- The order ID from CJ Dropshipping
  order_number TEXT UNIQUE NOT NULL, -- Internal order reference
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',

  -- Shipping information
  shipping_address JSONB NOT NULL, -- {name, address, address2, city, province, country, countryCode, zip, phone, email}

  -- Order items
  items JSONB NOT NULL, -- Array of {product_id, cj_product_id, cj_variant_id, quantity, price, name}

  -- Tracking information
  tracking_number TEXT,
  tracking_url TEXT,
  logistic_name TEXT,

  -- Timestamps
  cj_order_created_at TIMESTAMPTZ, -- When order was created in CJ
  cj_shipped_at TIMESTAMPTZ, -- When CJ shipped the order
  cj_delivered_at TIMESTAMPTZ, -- When order was delivered

  -- Additional data
  notes TEXT,
  metadata JSONB, -- Any additional metadata

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance (only if columns exist)
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_cj_order_id ON orders(cj_order_id) WHERE cj_order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number) WHERE order_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status) WHERE status IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number) WHERE tracking_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Create updated_at trigger
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create order status enum constraint (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'orders_status_check'
    ) THEN
        ALTER TABLE orders
          ADD CONSTRAINT orders_status_check
          CHECK (status IN ('pending', 'processing', 'payment_confirmed', 'shipped', 'delivered', 'cancelled', 'failed'));
    END IF;
END $$;

-- Add comments
COMMENT ON TABLE orders IS 'Orders synchronized with CJ Dropshipping API';
COMMENT ON COLUMN orders.status IS 'Order status: pending, processing, payment_confirmed, shipped, delivered, cancelled, failed';
COMMENT ON COLUMN orders.items IS 'Array of order items with product details';
COMMENT ON COLUMN orders.shipping_address IS 'Complete shipping address information';
