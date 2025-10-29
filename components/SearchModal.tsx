"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      // Pour l'instant, redirige vers la page produit
      router.push("/product");
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="min-h-screen px-4 flex items-start justify-center pt-20">
        <div className="bg-white rounded-2xl max-w-2xl w-full brand-shadow">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Rechercher</h2>
            <button
              onClick={onClose}
              aria-label="Fermer la recherche"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search input */}
          <form onSubmit={handleSearch} className="p-4">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                autoFocus
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fetra-olive/30 text-lg"
              />
            </div>
          </form>

          {/* Quick suggestions */}
          <div className="p-4 border-t">
            <p className="text-sm text-gray-500 mb-3">Suggestions populaires</p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  router.push("/product");
                  onClose();
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Rituel Visage Liftant</span>
              </button>
              <button
                onClick={() => {
                  router.push("/product");
                  onClose();
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Quartz Rose</span>
              </button>
              <button
                onClick={() => {
                  router.push("/product");
                  onClose();
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Huile Régénérante</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

