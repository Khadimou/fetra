"use client";

export default function MobilePurchaseBar({ price, onBuy }: { price: string; onBuy: () => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 border-t p-3 md:hidden flex items-center gap-3">
      <div className="flex-1">
        <div className="text-sm text-gray-500">Rituel Visage</div>
        <div className="font-semibold text-lg">{price} €</div>
      </div>
      <button onClick={onBuy} className="px-6 py-2 rounded-full bg-fetra-olive text-white font-semibold">
        Acheter
      </button>
    </div>
  );
}
