'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

type ReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  productSku: string;
  onSuccess?: () => void;
};

export default function ReviewModal({ isOpen, onClose, productSku, onSuccess }: ReviewModalProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    authorName: session?.user?.name || '',
    authorEmail: session?.user?.email || '',
    rating: 5,
    comment: ''
  });

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productSku,
          ...formData
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || 'Merci pour votre avis !');
        setFormData({
          authorName: '',
          authorEmail: '',
          rating: 5,
          comment: ''
        });
        onSuccess?.();
        onClose();
      } else {
        alert(data.error || 'Erreur lors de l\'envoi de votre avis');
      }
    } catch (error) {
      alert('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Écrire un avis</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <svg
                    className={`w-8 h-8 ${
                      star <= formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre nom *
            </label>
            <input
              type="text"
              required
              value={formData.authorName}
              onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fetra-olive/30"
              placeholder="Prénom Nom"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre email *
            </label>
            <input
              type="email"
              required
              value={formData.authorEmail}
              onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fetra-olive/30"
              placeholder="email@exemple.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              Votre email ne sera pas publié
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre avis *
            </label>
            <textarea
              required
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fetra-olive/30 resize-none"
              placeholder="Partagez votre expérience avec ce produit..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-fetra-olive text-white rounded-lg hover:bg-fetra-olive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Envoi...' : 'Publier mon avis'}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Votre avis sera publié après validation par notre équipe
          </p>
        </form>
      </div>
    </div>
  );
}
