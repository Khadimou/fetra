'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TransactionType, TransactionCategory } from '@prisma/client';

export default function NewTransactionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: 'EXPENSE' as TransactionType,
    category: 'OTHER' as TransactionCategory,
    amount: '',
    description: '',
    transactionDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const incomeCategories: TransactionCategory[] = ['PRODUCT_SALE', 'REFUND'];

  const expenseCategories: TransactionCategory[] = [
    'CJ_DROPSHIPPING',
    'STRIPE_FEES',
    'PAYMENT_FEES',
    'MARKETING_ADS',
    'MARKETING_INFLUENCER',
    'MARKETING_OTHER',
    'SHIPPING_COLISSIMO',
    'SHIPPING_PACKAGING',
    'SHIPPING_OTHER',
    'SERVICES_HOSTING',
    'SERVICES_DOMAIN',
    'SERVICES_EMAIL',
    'SERVICES_SUPPORT',
    'SERVICES_OTHER',
    'INVENTORY_PURCHASE',
    'OFFICE_SUPPLIES',
    'PROFESSIONAL_FEES',
    'TAX_VAT',
    'OTHER',
  ];

  function getCategoryLabel(category: TransactionCategory): string {
    const labels: Record<TransactionCategory, string> = {
      PRODUCT_SALE: 'Vente de produit',
      REFUND: 'Remboursement',
      CJ_DROPSHIPPING: 'CJ Dropshipping',
      STRIPE_FEES: 'Frais Stripe',
      PAYMENT_FEES: 'Frais de paiement',
      MARKETING_ADS: 'Publicité (Google Ads, Meta Ads)',
      MARKETING_INFLUENCER: 'Marketing influenceurs',
      MARKETING_OTHER: 'Marketing autre',
      SHIPPING_COLISSIMO: 'Frais Colissimo',
      SHIPPING_PACKAGING: 'Emballage',
      SHIPPING_OTHER: 'Livraison autre',
      SERVICES_HOSTING: 'Hébergement (Vercel, Supabase)',
      SERVICES_DOMAIN: 'Nom de domaine',
      SERVICES_EMAIL: 'Service email (Brevo)',
      SERVICES_SUPPORT: 'Support client (Freshdesk)',
      SERVICES_OTHER: 'Service autre',
      INVENTORY_PURCHASE: 'Achat de stock',
      OFFICE_SUPPLIES: 'Fournitures de bureau',
      PROFESSIONAL_FEES: 'Honoraires professionnels',
      TAX_VAT: 'TVA',
      OTHER: 'Autre',
    };
    return labels[category] || category;
  }

  const availableCategories = formData.type === 'INCOME' ? incomeCategories : expenseCategories;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la création de la transaction');
      }

      router.push('/admin/finances');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/admin/finances')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Retour
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Nouvelle transaction</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de transaction *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      type: 'INCOME',
                      category: 'PRODUCT_SALE'
                    });
                  }}
                  className={`p-4 border-2 rounded-lg text-center transition-colors ${
                    formData.type === 'INCOME'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">💰</div>
                  <div className="font-semibold">Revenu</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      type: 'EXPENSE',
                      category: 'OTHER'
                    });
                  }}
                  className={`p-4 border-2 rounded-lg text-center transition-colors ${
                    formData.type === 'EXPENSE'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">💸</div>
                  <div className="font-semibold">Dépense</div>
                </button>
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie *
              </label>
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as TransactionCategory })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fetra-olive"
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {getCategoryLabel(cat)}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Montant (€) *
              </label>
              <input
                type="number"
                id="amount"
                required
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fetra-olive"
                placeholder="49.90"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <input
                type="text"
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fetra-olive"
                placeholder="Ex: Campagne Google Ads novembre 2024"
              />
            </div>

            {/* Transaction Date */}
            <div>
              <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700 mb-1">
                Date de la transaction *
              </label>
              <input
                type="date"
                id="transactionDate"
                required
                value={formData.transactionDate}
                onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fetra-olive"
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optionnel)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fetra-olive"
                placeholder="Notes internes..."
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push('/admin/finances')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-fetra-olive text-white rounded-md hover:bg-fetra-olive/90 disabled:opacity-50"
              >
                {loading ? 'Création...' : 'Créer la transaction'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
