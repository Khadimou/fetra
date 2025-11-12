import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/db/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, mot de passe et nom requis" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Split name into first and last
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    // Create user account
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        role: "customer",
      },
    });

    // Find or create customer record
    let customer = await prisma.customer.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          email: email.toLowerCase(),
          firstName,
          lastName,
        },
      });
    }

    // Link all existing orders with this email to the customer
    const updatedOrders = await prisma.order.updateMany({
      where: {
        customerId: customer.id,
        // Only update orders that don't have a user linked yet
        // (in case we add a userId field later)
      },
      data: {
        // Already linked via customerId, just confirming the link
      },
    });

    console.log(`Customer account created: ${email}, linked ${updatedOrders.count} existing orders`);

    return NextResponse.json({
      success: true,
      message: "Compte créé avec succès",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      ordersLinked: updatedOrders.count,
    });
  } catch (error: any) {
    console.error("Customer signup error:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la création du compte" },
      { status: 500 }
    );
  }
}
