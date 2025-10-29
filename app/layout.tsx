import "./globals.css";
import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "FETRA  Rituel Visage Liftant",
  description:
    "Rituel Visage Liftant : Kit Quartz Rose 3-en-1 & Huile Régénérante  Livraison offerte",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-fetra-olive focus:text-white focus:rounded-md">
          Aller au contenu principal
        </a>
        <Header cartCount={0} />
        <main id="main-content" className="bg-gray-50 min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
