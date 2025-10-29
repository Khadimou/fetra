"use client";
import { useState, useEffect } from "react";

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem("fetra_newsletter_popup");
    
    if (!hasSeenPopup) {
      // Show popup after 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  function handleClose() {
    setIsOpen(false);
    localStorage.setItem("fetra_newsletter_popup", "true");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) {
      // Here you would normally send to your newsletter service
      console.log("Newsletter signup:", email);
      setIsSubmitted(true);
      
      // Show success message then close
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 relative brand-shadow transform transition-all">
        <button
          onClick={handleClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isSubmitted ? (
          <>
            <div className="text-center mb-6">
              <div className="inline-block bg-gradient-to-r from-fetra-olive to-fetra-pink text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                🎁 Offre Exclusive
              </div>
              <h2 className="text-2xl font-bold mb-2">-10% sur votre première commande</h2>
              <p className="text-gray-600 text-sm">
                Inscrivez-vous à notre newsletter et recevez immédiatement votre code promo ainsi que nos conseils beauté exclusifs.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fetra-olive/30 transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-fetra-olive to-fetra-pink text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95"
              >
                Je récupère mes -10%
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              En vous inscrivant, vous acceptez de recevoir nos emails. Désinscription possible à tout moment.
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Merci !</h3>
            <p className="text-gray-600">
              Votre code promo <span className="font-bold text-fetra-olive">BIENVENUE10</span> a été envoyé à votre email.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

