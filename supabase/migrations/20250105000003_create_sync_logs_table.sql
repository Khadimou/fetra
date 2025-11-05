-- Migration: Create sync logs table
-- Description: Track product synchronization history with CJ Dropshipping

CREATE TABLE IF NOT EXISTS cj_sync_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_type TEXT NOT NULL, -- 'products', 'orders', 'tracking'
  status TEXT NOT NULL, -- 'started', 'success', 'failed', 'partial'

  -- Statistics
  items_processed INTEGER DEFAULT 0,
  items_created INTEGER DEFAULT 0,
  items_updated INTEGER DEFAULT 0,
  items_failed INTEGER DEFAULT 0,

  -- Details
  error_message TEXT,
  metadata JSONB, -- Any additional sync metadata (filters, params, etc.)

  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER -- Duration in milliseconds
);

-- Create indexes
CREATE INDEX idx_sync_logs_sync_type ON cj_sync_logs(sync_type);
CREATE INDEX idx_sync_logs_status ON cj_sync_logs(status);
CREATE INDEX idx_sync_logs_started_at ON cj_sync_logs(started_at DESC);

-- Add comments
COMMENT ON TABLE cj_sync_logs IS 'Logs for CJ Dropshipping synchronization operations';
COMMENT ON COLUMN cj_sync_logs.sync_type IS 'Type of sync: products, orders, or tracking';
COMMENT ON COLUMN cj_sync_logs.status IS 'Sync status: started, success, failed, or partial';
