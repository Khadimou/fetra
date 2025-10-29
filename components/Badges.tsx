export default function Badges() {
  return (
    <div className="flex flex-wrap gap-3 mt-4">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-fetra-olive/10 text-fetra-olive text-xs font-semibold rounded-full">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Livraison offerte
      </div>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-fetra-pink/10 text-fetra-pink text-xs font-semibold rounded-full">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Retour gratuit
      </div>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Paiement sécurisé
      </div>
    </div>
  );
}

