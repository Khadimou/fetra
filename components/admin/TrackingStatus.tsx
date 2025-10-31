'use client';

import { useEffect, useState } from 'react';
import type {
  ColissimoApiResponse,
  ColissimoTrackingResponse,
  TrackingStatus as TStatus
} from '@/lib/types/colissimo';
import { isSuccessResponse, getSimplifiedStatus } from '@/lib/types/colissimo';

interface TrackingStatusProps {
  trackingNumber: string;
}

export default function TrackingStatus({ trackingNumber }: TrackingStatusProps) {
  const [tracking, setTracking] = useState<ColissimoTrackingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTracking() {
      try {
        setLoading(true);
        const res = await fetch(`/api/colissimo/tracking/${trackingNumber}`);
        const data: ColissimoApiResponse = await res.json();

        if (isSuccessResponse(data)) {
          setTracking(data);
        } else {
          setError(data.returnMessage);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (trackingNumber) {
      loadTracking();
    }
  }, [trackingNumber]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Suivi Colissimo</h3>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (!tracking) {
    return null;
  }

  const status = getSimplifiedStatus(tracking.shipment.timeline);
  const latestEvent = tracking.shipment.event[0]; // Events are anti-chronological

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Suivi Colissimo</h3>
          <p className="text-sm text-gray-500 mt-1">N° {trackingNumber}</p>
        </div>
        <a
          href={`https://www.laposte.fr/outils/suivre-vos-envois?code=${trackingNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-fetra-olive hover:underline"
        >
          Voir sur laposte.fr →
        </a>
      </div>

      {/* Status badge */}
      <div className="mb-6">
        <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
          status === 'delivered' ? 'bg-green-100 text-green-800' :
          status === 'out_for_delivery' ? 'bg-blue-100 text-blue-800' :
          status === 'available_for_pickup' ? 'bg-purple-100 text-purple-800' :
          status === 'in_transit' ? 'bg-yellow-100 text-yellow-800' :
          status === 'failed' ? 'bg-red-100 text-red-800' :
          status === 'returned' ? 'bg-orange-100 text-orange-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {status === 'delivered' ? 'Livré' :
           status === 'out_for_delivery' ? 'En cours de livraison' :
           status === 'available_for_pickup' ? 'Disponible en point relais' :
           status === 'in_transit' ? 'En transit' :
           status === 'failed' ? 'Échec de livraison' :
           status === 'returned' ? 'Retourné' :
           'En attente'}
        </span>
      </div>

      {/* Timeline */}
      <div className="space-y-3 mb-6">
        {tracking.shipment.timeline.map((step, index) => (
          <div key={step.id} className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <div className={`w-3 h-3 rounded-full ${
                step.status ? 'bg-fetra-olive' : 'bg-gray-300'
              }`}></div>
            </div>
            <div className="ml-4 flex-1">
              <p className={`text-sm font-medium ${
                step.status ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {step.shortLabel}
              </p>
              {step.longLabel && (
                <p className="text-xs text-gray-500 mt-1">{step.longLabel}</p>
              )}
              {step.date && (
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(step.date).toLocaleString('fr-FR')}
                </p>
              )}
            </div>
            {step.type === -1 && (
              <span className="ml-2 text-red-500 text-xs">⚠️</span>
            )}
          </div>
        ))}
      </div>

      {/* Latest event */}
      {latestEvent && (
        <div className="border-t pt-4">
          <p className="text-xs text-gray-500 mb-1">Dernier événement</p>
          <p className="text-sm text-gray-900">{latestEvent.label}</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(latestEvent.date).toLocaleString('fr-FR')}
          </p>
        </div>
      )}

      {/* Delivery info */}
      {tracking.shipment.deliveryDate && (
        <div className="border-t pt-4 mt-4">
          <p className="text-xs text-gray-500 mb-1">Date de livraison</p>
          <p className="text-sm text-gray-900">
            {new Date(tracking.shipment.deliveryDate).toLocaleString('fr-FR')}
          </p>
        </div>
      )}

      {/* Pickup point info */}
      {tracking.shipment.contextData?.removalPoint && (
        <div className="border-t pt-4 mt-4">
          <p className="text-xs text-gray-500 mb-1">Point de retrait</p>
          <p className="text-sm text-gray-900">
            {tracking.shipment.contextData.removalPoint.name}
          </p>
          <p className="text-xs text-gray-400">
            Type: {tracking.shipment.contextData.removalPoint.type}
          </p>
        </div>
      )}
    </div>
  );
}
