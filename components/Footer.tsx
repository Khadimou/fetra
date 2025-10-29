import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
        <div>
          <div className="mb-4 scale-90 origin-left">
            <Logo />
          </div>
          <p className="text-gray-600">Rituel Visage • Livraison offerte • Retour 14 jours</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Aide</h4>
          <ul className="space-y-2">
            <li>
              <a href="/shipping">Livraison</a>
            </li>
            <li>
              <a href="/returns">Retour</a>
            </li>
            <li>
              <a href="/faq">FAQ</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Newsletter</h4>
          <form className="flex gap-2">
            <input
              aria-label="email"
              className="flex-1 border rounded-md px-3 py-2"
              placeholder="Votre email"
              type="email"
            />
            <button className="px-4 py-2 rounded-md bg-fetra-olive text-white">
              S'inscrire
            </button>
          </form>
          <div className="mt-4 flex gap-3 items-center text-xs">
            <div className="flex items-center gap-2">
              <span>🔒</span> Paiement sécurisé
            </div>
            <div className="flex items-center gap-2">
              <span>🚚</span> Livraison
            </div>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 py-4">
        © {new Date().getFullYear()} FETRA — Tous droits réservés
      </div>
    </footer>
  );
}

