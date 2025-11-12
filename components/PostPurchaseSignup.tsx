"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

interface OrderDetails {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
}

export default function PostPurchaseSignup() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // Get order details from URL params
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (sessionId) {
      fetchOrderDetails(sessionId);
    }
  }, []);

  async function fetchOrderDetails(sessionId: string) {
    try {
      const response = await fetch(`/api/order-details?session_id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setOrderDetails({
          customerEmail: data.order.customerEmail || "",
          customerName: data.order.customerName || "",
          orderNumber: sessionId, // Use session ID as order reference
        });
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validation
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/customer/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: orderDetails?.customerEmail,
          password,
          name: orderDetails?.customerName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la création du compte");
      }

      setIsSuccess(true);

      // Auto-login the user
      const signInResult = await signIn("credentials", {
        email: orderDetails?.customerEmail,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        console.error("Auto-login failed:", signInResult.error);
        // Still redirect to customer login page
        setTimeout(() => {
          router.push("/login?redirect=/account");
        }, 2000);
      } else {
        // Redirect to dashboard after successful login
        setTimeout(() => {
          router.push("/account");
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Don't show if user is already logged in
  if (status === "authenticated") {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-blue-900">Vous êtes déjà connecté</h3>
            <p className="text-sm text-blue-700">
              Connecté en tant que {session?.user?.email}
            </p>
          </div>
          <a
            href="/account"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Voir mes commandes
          </a>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return null; // Don't show anything while loading order details
  }

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg text-green-900">Compte créé avec succès !</h3>
            <p className="text-sm text-green-700">Redirection vers votre espace client...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-fetra-olive/10 to-fetra-pink/10 border border-fetra-olive/20 rounded-2xl p-8 mb-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-fetra-olive/10 rounded-full mb-4">
            <svg className="w-8 h-8 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">Créez votre compte FETRA</h3>
          <p className="text-gray-600">
            Suivez votre commande en temps réel et accédez à votre historique d&apos;achats
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={orderDetails.customerEmail}
              disabled
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Name (read-only) */}
          <div>
            <label className="block text-sm font-medium mb-2">Nom complet</label>
            <input
              type="text"
              value={orderDetails.customerName}
              disabled
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Au moins 8 caractères"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fetra-olive/30"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirmer le mot de passe <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Retapez votre mot de passe"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fetra-olive/30"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Benefits */}
          <div className="bg-white/50 rounded-xl p-4 space-y-2">
            <p className="font-semibold text-sm">Avantages d&apos;un compte FETRA :</p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Suivi en temps réel de vos commandes
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Accès à l&apos;historique de vos achats
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Commandes futures plus rapides
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Offres exclusives et avant-premières
              </li>
            </ul>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-fetra-olive text-white rounded-xl font-semibold hover:bg-fetra-olive/90 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Création du compte..." : "Créer mon compte gratuit"}
          </button>

          <p className="text-xs text-center text-gray-500">
            En créant un compte, vous acceptez nos{" "}
            <a href="/legal/terms" className="text-fetra-olive hover:underline">
              Conditions d&apos;utilisation
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
}
