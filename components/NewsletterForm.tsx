'use client';
import { useState } from 'react';

type PromoCodeInfo = {
  code: string;
  discount: number;
  validUntil: string | null;
};

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [promoCode, setPromoCode] = useState<PromoCodeInfo | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setPromoCode(null);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: 'Merci pour ton inscription !', type: 'success' });
        if (data.promoCode) {
          setPromoCode(data.promoCode);
        }
        setEmail('');
      } else {
        setMessage({ text: data.error || 'Une erreur est survenue. Réessaye plus tard.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Erreur de connexion. Vérifie ta connexion internet.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {!promoCode ? (
        <>
          <p className="text-xs text-gray-500 mb-2">
            Reçois ton code promo de <span className="font-semibold text-fetra-olive">-15%</span> personnalisé
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              aria-label="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border rounded-md px-3 py-2 focus:ring-2 focus:ring-fetra-olive/30 focus:border-transparent transition-all"
              placeholder="Votre email"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-fetra-olive text-white hover:bg-fetra-olive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '...' : "S'inscrire"}
            </button>
          </form>
          {message && !promoCode && (
            <div className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message.text}
            </div>
          )}
        </>
      ) : (
        <div className="bg-gradient-to-r from-fetra-olive/10 to-fetra-pink/10 border-2 border-fetra-olive/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-semibold text-gray-900">Inscription confirmée !</p>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Ton code promo personnalisé a été envoyé par email
          </p>
          <div className="bg-white rounded-md p-3 border-2 border-dashed border-fetra-olive">
            <p className="text-xs text-gray-500 mb-1">Ton code exclusif :</p>
            <div className="flex items-center justify-between">
              <code className="text-lg font-bold text-fetra-olive tracking-wider">
                {promoCode.code}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(promoCode.code);
                  alert('Code copié !');
                }}
                className="text-xs bg-fetra-olive text-white px-3 py-1 rounded hover:bg-fetra-olive/90 transition-colors"
              >
                Copier
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              <span className="font-semibold text-fetra-olive">{promoCode.discount}% de réduction</span> sur ta première commande
              {promoCode.validUntil && (
                <> • Valable jusqu'au {new Date(promoCode.validUntil).toLocaleDateString('fr-FR')}</>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

