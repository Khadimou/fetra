'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TransactionType, TransactionCategory } from '@prisma/client';
import {
  exportToCSV,
  formatTransactionsForCSV,
  getTransactionCSVHeaders,
} from '@/lib/utils/csv-export';

interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: string;
  currency: string;
  description: string;
  transactionDate: string;
  orderId?: string;
  cjOrderId?: string;
  notes?: string;
  createdAt: string;
}

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  incomeByCategory: Record<string, number>;
  expensesByCategory: Record<string, number>;
  transactionCount: number;
}

interface MonthlyData {
  month: string;
  year: number;
  income: number;
  expenses: number;
  netProfit: number;
}

export default function FinancesPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Filters
  const [filterType, setFilterType] = useState<'ALL' | TransactionType>('ALL');
  const [filterPeriod, setFilterPeriod] = useState<'ALL' | 'THIS_MONTH' | 'LAST_MONTH' | 'THIS_YEAR'>('THIS_MONTH');

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
  }, [router, filterType, filterPeriod]);

  async function loadData() {
    try {
      setLoading(true);

      // Calculate date range based on filter
      const { startDate, endDate } = getDateRange(filterPeriod);
      const dateParams = startDate ? `&startDate=${startDate.toISOString()}&endDate=${endDate?.toISOString()}` : '';
      const typeParam = filterType !== 'ALL' ? `&type=${filterType}` : '';

      // Load transactions
      const transRes = await fetch(`/api/admin/transactions?limit=50${dateParams}${typeParam}`);
      if (transRes.ok) {
        const data = await transRes.json();
        setTransactions(data);
      }

      // Load summary
      const summaryRes = await fetch(`/api/admin/transactions?summary=true${dateParams}`);
      if (summaryRes.ok) {
        const data = await summaryRes.json();
        setSummary(data);
      }

      // Load monthly data
      const monthlyRes = await fetch(`/api/admin/transactions?monthly=true${dateParams}`);
      if (monthlyRes.ok) {
        const data = await monthlyRes.json();
        setMonthlyData(data);
      }
    } catch (err) {
      console.error('Error loading financial data:', err);
    } finally {
      setLoading(false);
    }
  }

  function getDateRange(period: string): { startDate?: Date; endDate?: Date } {
    const now = new Date();
    const endDate = now;

    switch (period) {
      case 'THIS_MONTH': {
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        return { startDate, endDate };
      }
      case 'LAST_MONTH': {
        const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        return { startDate, endDate: endOfLastMonth };
      }
      case 'THIS_YEAR': {
        const startDate = new Date(now.getFullYear(), 0, 1);
        return { startDate, endDate };
      }
      default:
        return {};
    }
  }

  function getCategoryLabel(category: TransactionCategory): string {
    const labels: Record<TransactionCategory, string> = {
      PRODUCT_SALE: 'Vente de produit',
      REFUND: 'Remboursement',
      CJ_DROPSHIPPING: 'CJ Dropshipping',
      STRIPE_FEES: 'Frais Stripe',
      PAYMENT_FEES: 'Frais de paiement',
      MARKETING_ADS: 'Publicité',
      MARKETING_INFLUENCER: 'Influenceurs',
      MARKETING_OTHER: 'Marketing autre',
      SHIPPING_COLISSIMO: 'Colissimo',
      SHIPPING_PACKAGING: 'Emballage',
      SHIPPING_OTHER: 'Livraison autre',
      SERVICES_HOSTING: 'Hébergement',
      SERVICES_DOMAIN: 'Nom de domaine',
      SERVICES_EMAIL: 'Service email',
      SERVICES_SUPPORT: 'Support client',
      SERVICES_OTHER: 'Service autre',
      INVENTORY_PURCHASE: 'Achat stock',
      OFFICE_SUPPLIES: 'Fournitures',
      PROFESSIONAL_FEES: 'Honoraires',
      TAX_VAT: 'TVA',
      OTHER: 'Autre',
    };
    return labels[category] || category;
  }

  function handleExportCSV() {
    if (transactions.length === 0) {
      alert('Aucune transaction à exporter');
      return;
    }

    const formattedData = formatTransactionsForCSV(transactions);
    const headers = getTransactionCSVHeaders();
    const filename = `fetra-transactions-${new Date().toISOString().split('T')[0]}.csv`;

    exportToCSV(formattedData, filename, headers);
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fetra-olive mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/admin')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Retour
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Finances</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exporter CSV
            </button>
            <button
              onClick={() => router.push('/admin/finances/new')}
              className="bg-fetra-olive text-white px-4 py-2 rounded-md hover:bg-fetra-olive/90"
            >
              + Nouvelle transaction
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-8 flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="ALL">Tous</option>
              <option value="INCOME">Revenus</option>
              <option value="EXPENSE">Dépenses</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value as any)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="THIS_MONTH">Ce mois</option>
              <option value="LAST_MONTH">Mois dernier</option>
              <option value="THIS_YEAR">Cette année</option>
              <option value="ALL">Tout</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Revenus</p>
              <p className="text-3xl font-bold text-green-600">
                {summary.totalIncome.toFixed(2)} €
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Dépenses</p>
              <p className="text-3xl font-bold text-red-600">
                {summary.totalExpenses.toFixed(2)} €
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Profit Net</p>
              <p className={`text-3xl font-bold ${summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {summary.netProfit.toFixed(2)} €
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Marge: {summary.totalIncome > 0 ? ((summary.netProfit / summary.totalIncome) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        )}

        {/* Monthly Chart */}
        {monthlyData.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Évolution mensuelle</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Mois</th>
                    <th className="text-right py-2">Revenus</th>
                    <th className="text-right py-2">Dépenses</th>
                    <th className="text-right py-2">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((month, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2 capitalize">{month.month} {month.year}</td>
                      <td className="text-right text-green-600">{month.income.toFixed(2)} €</td>
                      <td className="text-right text-red-600">{month.expenses.toFixed(2)} €</td>
                      <td className={`text-right font-semibold ${month.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {month.netProfit.toFixed(2)} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Transactions récentes</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fetra-olive mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Aucune transaction</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.transactionDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          transaction.type === 'INCOME'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type === 'INCOME' ? 'Revenu' : 'Dépense'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getCategoryLabel(transaction.category)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
                        transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'INCOME' ? '+' : '-'}{parseFloat(transaction.amount).toFixed(2)} {transaction.currency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
