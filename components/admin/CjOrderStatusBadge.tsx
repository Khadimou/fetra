/**
 * CJ Order Status Badge Component
 * Displays a colored badge for CJ order status
 */

import { CJOrderStatus } from '@/lib/types/cj';

interface CjOrderStatusBadgeProps {
  status: CJOrderStatus;
  className?: string;
}

const statusConfig: Record<
  CJOrderStatus,
  { label: string; colorClass: string }
> = {
  pending: {
    label: 'En attente',
    colorClass: 'bg-gray-100 text-gray-800',
  },
  processing: {
    label: 'En préparation',
    colorClass: 'bg-blue-100 text-blue-800',
  },
  shipped: {
    label: 'Expédiée',
    colorClass: 'bg-green-100 text-green-800',
  },
  delivered: {
    label: 'Livrée',
    colorClass: 'bg-green-100 text-green-900',
  },
  cancelled: {
    label: 'Annulée',
    colorClass: 'bg-red-100 text-red-800',
  },
};

export default function CjOrderStatusBadge({
  status,
  className = '',
}: CjOrderStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.colorClass} ${className}`}
    >
      {config.label}
    </span>
  );
}
