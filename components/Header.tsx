import Image from 'next/image';

export default function Header({ cartCount = 0 }: { cartCount?: number }) {
  return (
    <header className="sticky top-0 backdrop-blur bg-white/70 border-b z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <a href="/collections" className="hover:text-black">
            Collections
          </a>
          <a href="/about" className="hover:text-black">
            À propos
          </a>
        </nav>
        <div className="mx-auto">
          <Image src="/fetra_logo.png" alt="FETRA" width={160} height={40} priority />
        </div>
        <div className="flex items-center gap-3">
          <button
            aria-label="Recherche"
            className="p-2 rounded-md focus-visible:ring-2 focus-visible:ring-fetra-pink/40"
          >
            🔍
          </button>
          <a
            href="/cart"
            aria-label="Panier"
            className="relative p-2 rounded-md focus-visible:ring-2 focus-visible:ring-fetra-olive/30"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-fetra-pink text-white text-xs rounded-full px-1.5">
                {cartCount}
              </span>
            )}
          </a>
        </div>
      </div>
    </header>
  );
}

