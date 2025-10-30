// components/OrderDetails.tsx
'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface OrderDetails {
  sessionId: string;
  customerEmail?: string;
  customerName?: string;
  amountTotal: number;
  currency: string;
  paymentStatus: string;
  orderDate: string;
  items: Array<{
    name: string;
    quantity: number;
    amount: number;
  }>;
  shippingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    postal_code?: string;
    country?: string;
  } | null;
}

export default function OrderDetails() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/order-details?session_id=${sessionId}`);
        const data = await response.json();

        if (data.success) {
          setOrderDetails(data.order);
        } else {
          setError(data.error || 'Erreur inconnue');
        }
      } catch (err) {
        console.error('Erreur chargement commande:', err);
        setError('Erreur de connexion');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [sessionId]);

  if (!sessionId || error) {
    return null; // Pas d'affichage si pas de session_id ou erreur
  }

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 brand-shadow mb-8">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-fetra-olive/20 border-t-fetra-olive rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des détails de votre commande...</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return null;
  }

  const orderDate = new Date(orderDetails.orderDate);
  const estimatedDelivery = new Date(orderDate);
  estimatedDelivery.setDate(orderDate.getDate() + 5); // +5 jours ouvrés

  return (
    <div className="bg-white rounded-3xl p-8 brand-shadow mb-8">
      <h3 className="text-2xl font-bold mb-6 text-center">📋 Récapitulatif de votre commande</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Détails commande */}
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-fetra-olive mb-2">Informations de commande</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Numéro :</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {orderDetails.sessionId.slice(-8).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date :</span>
                <span>{orderDate.toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Statut :</span>
                <span className="text-green-600 font-semibold">✅ Payé</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total :</span>
                <span className="font-bold text-lg">{orderDetails.amountTotal.toFixed(2)} {orderDetails.currency}</span>
              </div>
            </div>
          </div>

          {orderDetails.customerEmail && (
            <div>
              <h4 className="font-semibold text-fetra-olive mb-2">Confirmation par email</h4>
              <div className="text-sm">
                <p className="text-gray-600">
                  Un email de confirmation a été envoyé à :
                </p>
                <p className="font-medium text-fetra-olive">
                  {orderDetails.customerEmail}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Produits commandés */}
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-fetra-olive mb-2">Produits commandés</h4>
            <div className="space-y-3">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-fetra-olive/10 rounded-lg flex items-center justify-center">
                      <span className="text-fetra-olive font-bold">{item.quantity}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">Quantité : {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{item.amount.toFixed(2)} €</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-fetra-olive/10 to-fetra-pink/10 rounded-lg border border-fetra-olive/20">
            <h4 className="font-semibold text-fetra-olive mb-2">🚚 Livraison estimée</h4>
            <p className="text-sm">
              <strong>{estimatedDelivery.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</strong>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              (Sous réserve d&apos;expédition sous 48h)
            </p>
          </div>
        </div>
      </div>

      {orderDetails.shippingAddress && (
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-semibold text-fetra-olive mb-3">📍 Adresse de livraison</h4>
          <div className="bg-gray-50 p-4 rounded-lg text-sm">
            {orderDetails.customerName && <p className="font-medium">{orderDetails.customerName}</p>}
            {orderDetails.shippingAddress.line1 && <p>{orderDetails.shippingAddress.line1}</p>}
            {orderDetails.shippingAddress.line2 && <p>{orderDetails.shippingAddress.line2}</p>}
            <p>{orderDetails.shippingAddress.postal_code} {orderDetails.shippingAddress.city}</p>
            {orderDetails.shippingAddress.country && (
              <p className="text-gray-600">{orderDetails.shippingAddress.country.toUpperCase()}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
