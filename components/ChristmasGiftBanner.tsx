export default function ChristmasGiftBanner() {
  return (
    <div className="bg-gradient-to-r from-red-600 via-green-700 to-red-600 rounded-2xl p-8 text-white relative overflow-hidden mb-8">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 text-6xl opacity-20">🎄</div>
      <div className="absolute bottom-0 left-0 text-6xl opacity-20">🎁</div>

      <div className="relative z-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-3xl">🎄</span>
          <h3 className="text-2xl md:text-3xl font-bold text-center">
            Le Cadeau Parfait pour Noël
          </h3>
          <span className="text-3xl">🎁</span>
        </div>

        <p className="text-center text-lg mb-6 text-white/90">
          Offrez un moment de bien-être unique • Livraison avant Noël garantie
        </p>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">✨</div>
            <h4 className="font-semibold mb-1">Cadeau Original</h4>
            <p className="text-sm text-white/80">Elle va adorer et l'utiliser tous les jours</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🎀</div>
            <h4 className="font-semibold mb-1">Prêt à Offrir</h4>
            <p className="text-sm text-white/80">Emballage soigné inclus</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">💝</div>
            <h4 className="font-semibold mb-1">Message Personnalisé</h4>
            <p className="text-sm text-white/80">Ajoutez votre mot doux au checkout</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm bg-white/20 backdrop-blur-sm inline-block px-4 py-2 rounded-full">
            ⏰ Commandez avant le 18 décembre pour une livraison garantie avant Noël
          </p>
        </div>
      </div>
    </div>
  );
}
