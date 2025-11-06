/**
 * CJ Sync Button Component
 * Button with loading state for triggering CJ sync operations
 */

'use client';

import { useState } from 'react';

interface CjSyncButtonProps {
  onSync: () => Promise<void>;
  label?: string;
  loadingLabel?: string;
  className?: string;
  disabled?: boolean;
}

export default function CjSyncButton({
  onSync,
  label = 'Synchroniser',
  loadingLabel = 'Synchronisation...',
  className = '',
  disabled = false,
}: CjSyncButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    if (isLoading || disabled) return;

    try {
      setIsLoading(true);
      await onSync();
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSync}
      disabled={isLoading || disabled}
      className={`
        px-4 py-2 bg-fetra-olive text-white rounded-md
        hover:bg-fetra-olive/90 disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors flex items-center space-x-2
        ${className}
      `}
    >
      {isLoading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      )}
      <span>{isLoading ? loadingLabel : label}</span>
    </button>
  );
}
