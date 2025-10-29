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
        <Header cartCount={0} />
        <main className="bg-gray-50 min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
