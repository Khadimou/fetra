/**
 * Export data to CSV file
 */
export function exportToCSV(
  data: Record<string, any>[],
  filename: string,
  headers?: Record<string, string>
): void {
  if (data.length === 0) {
    alert('Aucune donnée à exporter');
    return;
  }

  // Get headers from first object if not provided
  const keys = Object.keys(data[0]);
  const headerRow = headers
    ? keys.map((key) => headers[key] || key)
    : keys;

  // Create CSV content
  const csvContent = [
    headerRow.join(','), // Header row
    ...data.map((row) =>
      keys
        .map((key) => {
          const value = row[key];
          // Handle null/undefined
          if (value === null || value === undefined) return '';
          // Handle strings with commas or quotes
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(',')
    ),
  ].join('\n');

  // Create blob and download
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Format transaction data for CSV export
 */
export function formatTransactionsForCSV(transactions: any[]): Record<string, any>[] {
  return transactions.map((t) => ({
    date: new Date(t.transactionDate).toLocaleDateString('fr-FR'),
    type: t.type === 'INCOME' ? 'Revenu' : 'Dépense',
    category: t.category,
    description: t.description,
    amount: parseFloat(t.amount).toFixed(2),
    currency: t.currency,
    orderId: t.orderId || '',
    cjOrderId: t.cjOrderId || '',
    notes: t.notes || '',
  }));
}

/**
 * Get CSV headers for transactions
 */
export function getTransactionCSVHeaders(): Record<string, string> {
  return {
    date: 'Date',
    type: 'Type',
    category: 'Catégorie',
    description: 'Description',
    amount: 'Montant',
    currency: 'Devise',
    orderId: 'ID Commande',
    cjOrderId: 'ID Commande CJ',
    notes: 'Notes',
  };
}
