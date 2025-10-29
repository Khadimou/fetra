'use client';
import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: 'Merci ! Vérifie ta boîte mail pour confirmer ton inscription.', type: 'success' });
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
      {message && (
        <div className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}

