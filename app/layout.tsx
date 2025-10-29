import "./globals.css";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FETRA  Rituel Visage Liftant",
  description:
    "Rituel Visage Liftant : Kit Quartz Rose 3-en-1 & Huile Régénérante  Livraison offerte",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <nav className="text-sm text-gray-600 hidden md:flex items-center gap-4">
                <span>Livraison offerte</span>
                <span>•</span>
                <span>Retour 14 jours</span>
              </nav>
              
              <div className="flex-1 flex justify-center">
                <Image src="/logo.svg" alt="FETRA" width={160} height={40} priority className="h-8 w-auto" />
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  aria-label="Panier (0 articles)"
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-fetra-olive/30"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="absolute top-0 right-0 w-5 h-5 bg-fetra-pink text-white text-xs font-semibold rounded-full flex items-center justify-center">0</span>
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="bg-gray-50 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
