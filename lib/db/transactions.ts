import prisma from "./prisma";
import {
  Transaction,
  TransactionType,
  TransactionCategory,
  Prisma,
} from "@prisma/client";

/**
 * Create a new transaction
 */
export async function createTransaction(data: {
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  currency?: string;
  description: string;
  transactionDate?: Date;
  orderId?: string;
  cjOrderId?: string;
  metadata?: Record<string, unknown>;
  notes?: string;
  createdBy?: string;
}): Promise<Transaction> {
  return prisma.transaction.create({
    data: {
      type: data.type,
      category: data.category,
      amount: new Prisma.Decimal(data.amount),
      currency: data.currency || "EUR",
      description: data.description,
      transactionDate: data.transactionDate || new Date(),
      orderId: data.orderId,
      cjOrderId: data.cjOrderId,
      metadata: data.metadata as Prisma.InputJsonValue,
      notes: data.notes,
      createdBy: data.createdBy,
    },
  });
}

/**
 * Get all transactions with optional filters
 */
export async function getTransactions(params?: {
  type?: TransactionType;
  category?: TransactionCategory;
  startDate?: Date;
  endDate?: Date;
  orderId?: string;
  limit?: number;
  offset?: number;
}): Promise<Transaction[]> {
  const where: Prisma.TransactionWhereInput = {};

  if (params?.type) {
    where.type = params.type;
  }

  if (params?.category) {
    where.category = params.category;
  }

  if (params?.orderId) {
    where.orderId = params.orderId;
  }

  if (params?.startDate || params?.endDate) {
    where.transactionDate = {};
    if (params.startDate) {
      where.transactionDate.gte = params.startDate;
    }
    if (params.endDate) {
      where.transactionDate.lte = params.endDate;
    }
  }

  return prisma.transaction.findMany({
    where,
    orderBy: {
      transactionDate: "desc",
    },
    take: params?.limit,
    skip: params?.offset,
  });
}

/**
 * Get a single transaction by ID
 */
export async function getTransaction(id: string): Promise<Transaction | null> {
  return prisma.transaction.findUnique({
    where: { id },
  });
}

/**
 * Update a transaction
 */
export async function updateTransaction(
  id: string,
  data: Partial<{
    type: TransactionType;
    category: TransactionCategory;
    amount: number;
    currency: string;
    description: string;
    transactionDate: Date;
    orderId: string;
    cjOrderId: string;
    metadata: Record<string, unknown>;
    notes: string;
  }>
): Promise<Transaction> {
  const updateData: Prisma.TransactionUpdateInput = {};

  if (data.type !== undefined) updateData.type = data.type;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.amount !== undefined)
    updateData.amount = new Prisma.Decimal(data.amount);
  if (data.currency !== undefined) updateData.currency = data.currency;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.transactionDate !== undefined)
    updateData.transactionDate = data.transactionDate;
  if (data.orderId !== undefined) updateData.orderId = data.orderId;
  if (data.cjOrderId !== undefined) updateData.cjOrderId = data.cjOrderId;
  if (data.metadata !== undefined) updateData.metadata = data.metadata as Prisma.InputJsonValue;
  if (data.notes !== undefined) updateData.notes = data.notes;

  return prisma.transaction.update({
    where: { id },
    data: updateData,
  });
}

/**
 * Delete a transaction
 */
export async function deleteTransaction(id: string): Promise<Transaction> {
  return prisma.transaction.delete({
    where: { id },
  });
}

/**
 * Get financial summary for a period
 */
export async function getFinancialSummary(params?: {
  startDate?: Date;
  endDate?: Date;
}): Promise<{
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  incomeByCategory: Record<string, number>;
  expensesByCategory: Record<string, number>;
  transactionCount: number;
}> {
  const where: Prisma.TransactionWhereInput = {};

  if (params?.startDate || params?.endDate) {
    where.transactionDate = {};
    if (params.startDate) {
      where.transactionDate.gte = params.startDate;
    }
    if (params.endDate) {
      where.transactionDate.lte = params.endDate;
    }
  }

  const transactions = await prisma.transaction.findMany({
    where,
  });

  let totalIncome = 0;
  let totalExpenses = 0;
  const incomeByCategory: Record<string, number> = {};
  const expensesByCategory: Record<string, number> = {};

  for (const transaction of transactions) {
    const amount = parseFloat(transaction.amount.toString());

    if (transaction.type === "INCOME") {
      totalIncome += amount;
      incomeByCategory[transaction.category] =
        (incomeByCategory[transaction.category] || 0) + amount;
    } else if (transaction.type === "EXPENSE") {
      totalExpenses += amount;
      expensesByCategory[transaction.category] =
        (expensesByCategory[transaction.category] || 0) + amount;
    }
  }

  const netProfit = totalIncome - totalExpenses;

  return {
    totalIncome,
    totalExpenses,
    netProfit,
    incomeByCategory,
    expensesByCategory,
    transactionCount: transactions.length,
  };
}

/**
 * Get monthly financial data
 */
export async function getMonthlyFinancialData(params?: {
  startDate?: Date;
  endDate?: Date;
}): Promise<
  Array<{
    month: string;
    year: number;
    income: number;
    expenses: number;
    netProfit: number;
  }>
> {
  const where: Prisma.TransactionWhereInput = {};

  if (params?.startDate || params?.endDate) {
    where.transactionDate = {};
    if (params.startDate) {
      where.transactionDate.gte = params.startDate;
    }
    if (params.endDate) {
      where.transactionDate.lte = params.endDate;
    }
  }

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: {
      transactionDate: "asc",
    },
  });

  const monthlyData: Record<
    string,
    { income: number; expenses: number; year: number; month: string }
  > = {};

  for (const transaction of transactions) {
    const date = new Date(transaction.transactionDate);
    const year = date.getFullYear();
    const month = date.toLocaleString("fr-FR", { month: "long" });
    const key = `${year}-${month}`;

    if (!monthlyData[key]) {
      monthlyData[key] = { income: 0, expenses: 0, year, month };
    }

    const amount = parseFloat(transaction.amount.toString());

    if (transaction.type === "INCOME") {
      monthlyData[key].income += amount;
    } else if (transaction.type === "EXPENSE") {
      monthlyData[key].expenses += amount;
    }
  }

  return Object.values(monthlyData).map((data) => ({
    ...data,
    netProfit: data.income - data.expenses,
  }));
}

/**
 * Automatically create transaction from order (called in webhook)
 */
export async function createTransactionFromOrder(
  orderId: string,
  orderAmount: number,
  stripeFees?: number
): Promise<Transaction[]> {
  const transactions: Transaction[] = [];

  // Create income transaction for the sale
  const incomeTransaction = await createTransaction({
    type: "INCOME",
    category: "PRODUCT_SALE",
    amount: orderAmount,
    description: `Vente de produit - Commande ${orderId}`,
    orderId: orderId,
  });
  transactions.push(incomeTransaction);

  // Create expense transaction for Stripe fees if provided
  if (stripeFees && stripeFees > 0) {
    const feeTransaction = await createTransaction({
      type: "EXPENSE",
      category: "STRIPE_FEES",
      amount: stripeFees,
      description: `Frais Stripe - Commande ${orderId}`,
      orderId: orderId,
    });
    transactions.push(feeTransaction);
  }

  return transactions;
}
