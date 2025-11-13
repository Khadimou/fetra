import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import {
  createTransaction,
  getTransactions,
  getFinancialSummary,
  getMonthlyFinancialData,
} from "@/lib/db/transactions";
import { TransactionType, TransactionCategory } from "@prisma/client";

/**
 * GET /api/admin/transactions
 * List all transactions with optional filters
 */
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role === "CUSTOMER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") as TransactionType | null;
    const category = searchParams.get("category") as
      | TransactionCategory
      | null;
    const startDate = searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : undefined;
    const endDate = searchParams.get("endDate")
      ? new Date(searchParams.get("endDate")!)
      : undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const offset = searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : undefined;

    // Get summary or list based on query param
    const summary = searchParams.get("summary") === "true";
    const monthly = searchParams.get("monthly") === "true";

    if (summary) {
      const summaryData = await getFinancialSummary({ startDate, endDate });
      return NextResponse.json(summaryData);
    }

    if (monthly) {
      const monthlyData = await getMonthlyFinancialData({ startDate, endDate });
      return NextResponse.json(monthlyData);
    }

    const transactions = await getTransactions({
      type: type || undefined,
      category: category || undefined,
      startDate,
      endDate,
      limit,
      offset,
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/transactions
 * Create a new transaction
 */
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role === "CUSTOMER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const {
      type,
      category,
      amount,
      currency,
      description,
      transactionDate,
      orderId,
      cjOrderId,
      metadata,
      notes,
    } = body;

    // Validation
    if (!type || !category || !amount || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be positive" },
        { status: 400 }
      );
    }

    const transaction = await createTransaction({
      type,
      category,
      amount: parseFloat(amount),
      currency,
      description,
      transactionDate: transactionDate ? new Date(transactionDate) : undefined,
      orderId,
      cjOrderId,
      metadata,
      notes,
      createdBy: session.user.id,
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
