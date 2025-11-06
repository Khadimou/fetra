/**
 * CJ Tracking Info Component
 * Displays tracking information and history for CJ orders
 */

'use client';

import { CJTrackingInfo } from '@/lib/types/cj';
import CjOrderStatusBadge from './CjOrderStatusBadge';

interface CjTrackingInfoProps {
  tracking: CJTrackingInfo;
}

export default function CjTrackingInfo({ tracking }: CjTrackingInfoProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {/* Order Info */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Commande CJ #{tracking.orderNum}
          </h3>
          <p className="text-sm text-gray-600">ID CJ: {tracking.orderId}</p>
        </div>
        <CjOrderStatusBadge status={tracking.orderStatus} />
      </div>

      {/* Tracking Details */}
      <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
        {tracking.trackingNumber && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Numéro de suivi</p>
            <p className="text-sm font-medium text-gray-900">
              {tracking.trackingNumber}
            </p>
          </div>
        )}
        {tracking.logisticName && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Transporteur</p>
            <p className="text-sm font-medium text-gray-900">
              {tracking.logisticName}
            </p>
          </div>
        )}
        <div>
          <p className="text-xs text-gray-500 mb-1">Date de création</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date(tracking.createTime).toLocaleDateString('fr-FR')}
          </p>
        </div>
        {tracking.shippingTime && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Date d'expédition</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(tracking.shippingTime).toLocaleDateString('fr-FR')}
            </p>
          </div>
        )}
        {tracking.deliveredTime && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Date de livraison</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(tracking.deliveredTime).toLocaleDateString('fr-FR')}
            </p>
          </div>
        )}
      </div>

      {/* Tracking Events */}
      {tracking.trackingEvents && tracking.trackingEvents.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Historique de suivi
          </h4>
          <div className="space-y-3">
            {tracking.trackingEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 text-sm"
              >
                <div className="flex-shrink-0 w-2 h-2 mt-1.5 bg-fetra-olive rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">
                        {event.description}
                      </p>
                      {event.location && (
                        <p className="text-gray-600 text-xs mt-1">
                          {event.location}
                        </p>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs whitespace-nowrap ml-4">
                      {new Date(event.time).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No tracking events */}
      {(!tracking.trackingEvents || tracking.trackingEvents.length === 0) && (
        <div className="text-center py-4 text-gray-500 text-sm">
          Aucun événement de suivi disponible
        </div>
      )}
    </div>
  );
}
