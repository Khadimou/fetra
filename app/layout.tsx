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
        <header className="p-6 border-b bg-white">
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            <Image src="/logo.svg" alt="FETRA" width={160} height={40} priority />
            <nav className="ml-auto text-sm text-gray-600">Livraison offerte  Retour 14 jours</nav>
          </div>
        </header>
        <main className="bg-gray-50 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
