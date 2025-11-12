'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type PromoCode = {
  id: string;
  code: string;
  type: string;
  discountType: string;
  discountValue: number;
  maxUses: number | null;
  currentUses: number;
  isActive: boolean;
  validFrom: string;
  validUntil: string | null;
  subscriberEmail: string | null;
  createdAt: string;
};

type Stats = {
  total: number;
  active: number;
  used: number;
  newsletter: number;
};

export default function PromoCodesAdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, used: 0, newsletter: 0 });
  const [showCreateForm, setShowCreateForm] = useState(false);

  // New code form
  const [newCode, setNewCode] = useState({
    code: '',
    type: 'CUSTOM',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    maxUses: 1,
    validDays: 30
  });

  // Check authentication
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/me');
        if (res.ok) {
          setIsAuthenticated(true);
          loadData();
        } else {
          router.push('/admin/login');
        }
      } catch (err) {
        router.push('/admin/login');
      }
    }

    checkAuth();
  }, [router]);

  // Load promo codes and stats
  async function loadData() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/promo-codes');
      if (res.ok) {
        const data = await res.json();
        setPromoCodes(data.promoCodes);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Load data error:', err);
    } finally {
      setLoading(false);
    }
  }

  // Create new promo code
  async function handleCreateCode(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch('/api/admin/promo-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCode)
      });

      if (res.ok) {
        alert('Code promo créé avec succès !');
        setShowCreateForm(false);
        setNewCode({
          code: '',
          type: 'CUSTOM',
          discountType: 'PERCENTAGE',
          discountValue: 10,
          maxUses: 1,
          validDays: 30
        });
        loadData();
      } else {
        const data = await res.json();
        alert(data.error || 'Erreur lors de la création');
      }
    } catch (err) {
      alert('Erreur lors de la création');
    }
  }

  // Deactivate code
  async function handleDeactivate(codeId: string) {
    if (!confirm('Désactiver ce code promo ?')) return;

    try {
      const res = await fetch(`/api/admin/promo-codes/${codeId}/deactivate`, {
        method: 'POST'
      });

      if (res.ok) {
        alert('Code désactivé');
        loadData();
      } else {
        alert('Erreur lors de la désactivation');
      }
    } catch (err) {
      alert('Erreur lors de la désactivation');
    }
  }

  // Delete code
  async function handleDelete(codeId: string) {
    if (!confirm('Supprimer définitivement ce code promo ?')) return;

    try {
      const res = await fetch(`/api/admin/promo-codes/${codeId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert('Code supprimé');
        loadData();
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fetra-olive"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/admin')}
            className="text-sm text-gray-600 hover:text-gray-900 mb-2"
          >
            ← Retour au dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Codes Promo</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Codes</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Actifs</p>
            <p className="text-3xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Utilisés</p>
            <p className="text-3xl font-bold text-blue-600">{stats.used}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Newsletter</p>
            <p className="text-3xl font-bold text-purple-600">{stats.newsletter}</p>
          </div>
        </div>

        {/* Create Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-fetra-olive text-white px-6 py-3 rounded-lg hover:bg-fetra-olive/90"
          >
            {showCreateForm ? 'Annuler' : '+ Créer un Code Promo'}
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Nouveau Code Promo</h2>
            <form onSubmit={handleCreateCode} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code *
                  </label>
                  <input
                    type="text"
                    value={newCode.code}
                    onChange={(e) => setNewCode({ ...newCode, code: e.target.value.toUpperCase() })}
                    placeholder="VIP20"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={newCode.type}
                    onChange={(e) => setNewCode({ ...newCode, type: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="CUSTOM">Custom</option>
                    <option value="VIP">VIP</option>
                    <option value="SEASONAL">Seasonal</option>
                    <option value="WELCOME">Welcome</option>
                    <option value="ABANDONED_CART">Abandoned Cart</option>
                    <option value="REFERRAL">Referral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de Réduction
                  </label>
                  <select
                    value={newCode.discountType}
                    onChange={(e) => setNewCode({ ...newCode, discountType: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="PERCENTAGE">Pourcentage (%)</option>
                    <option value="FIXED_AMOUNT">Montant Fixe (€)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valeur de Réduction *
                  </label>
                  <input
                    type="number"
                    value={newCode.discountValue}
                    onChange={(e) => setNewCode({ ...newCode, discountValue: parseFloat(e.target.value) })}
                    min="1"
                    max={newCode.discountType === 'PERCENTAGE' ? '100' : undefined}
                    step="0.01"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {newCode.discountType === 'PERCENTAGE' ? '% de réduction' : '€ de réduction'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Utilisations Maximum
                  </label>
                  <input
                    type="number"
                    value={newCode.maxUses || ''}
                    onChange={(e) => setNewCode({ ...newCode, maxUses: e.target.value ? parseInt(e.target.value) : 1 })}
                    min="1"
                    placeholder="Illimité"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Laissez vide pour illimité
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Validité (jours)
                  </label>
                  <input
                    type="number"
                    value={newCode.validDays}
                    onChange={(e) => setNewCode({ ...newCode, validDays: parseInt(e.target.value) })}
                    min="1"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Nombre de jours de validité
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto bg-fetra-olive text-white px-6 py-3 rounded-lg hover:bg-fetra-olive/90"
              >
                Créer le Code
              </button>
            </form>
          </div>
        )}

        {/* Promo Codes List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Réduction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {promoCodes.map((code) => (
                <tr key={code.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{code.code}</div>
                    {code.subscriberEmail && (
                      <div className="text-xs text-gray-500">{code.subscriberEmail}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {code.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {code.discountType === 'PERCENTAGE'
                      ? `${code.discountValue}%`
                      : `${code.discountValue}€`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {code.currentUses} / {code.maxUses || '∞'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {code.validUntil
                      ? new Date(code.validUntil).toLocaleDateString('fr-FR')
                      : 'Illimitée'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        code.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {code.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {code.isActive && (
                      <button
                        onClick={() => handleDeactivate(code.id)}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        Désactiver
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(code.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {promoCodes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun code promo pour le moment</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
