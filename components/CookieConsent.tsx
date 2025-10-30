// components/CookieConsent.tsx
'use client';
import { useEffect, useState } from 'react';
import { readConsent, saveConsent, defaultConsent, ConsentState, clearConsent } from '@/lib/cookies';

export default function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const c = readConsent();
    if (c) {
      setConsent(c);
      if (c.analytics) window.dispatchEvent(new CustomEvent('consent-analytics'));
      if (c.marketing) window.dispatchEvent(new CustomEvent('consent-marketing'));
    }
  }, []);

  function acceptAll() {
    const c = { ...defaultConsent(), analytics: true, marketing: true, updatedAt: new Date().toISOString() };
    saveConsent(c);
    setConsent(c);
    window.dispatchEvent(new CustomEvent('consent-analytics'));
    window.dispatchEvent(new CustomEvent('consent-marketing'));
  }

  function rejectAll() {
    const c = { ...defaultConsent(), analytics: false, marketing: false, updatedAt: new Date().toISOString() };
    saveConsent(c);
    setConsent(c);
  }

  function savePreferences(analytics: boolean, marketing: boolean) {
    const c = { ...defaultConsent(), analytics, marketing, updatedAt: new Date().toISOString() };
    saveConsent(c);
    setConsent(c);
    if (analytics) window.dispatchEvent(new CustomEvent('consent-analytics'));
    if (marketing) window.dispatchEvent(new CustomEvent('consent-marketing'));
    setOpen(false);
  }

  // If consent exists, do not display floating manage button (access via footer/page links if any)
  if (consent) {
    return null;
  }

  // Banner when no consent
  return (
    <>
      <div className="fixed left-4 right-4 bottom-6 md:left-8 md:right-auto md:bottom-8 z-50">
        <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 text-sm text-gray-800">
            Nous utilisons des cookies pour améliorer votre expérience. Acceptez-vous les cookies analytics et marketing ?
            <div className="mt-2 text-xs text-gray-500">Vous pouvez gérer vos préférences à tout moment.</div>
          </div>

          <div className="flex gap-2 items-center">
            <button onClick={rejectAll} className="px-4 py-2 rounded-md border">Refuser</button>
            <button onClick={() => setOpen(true)} className="px-4 py-2 rounded-md border bg-white">Gérer</button>
            <button onClick={acceptAll} className="px-4 py-2 rounded-full bg-fetra-olive text-white">Accepter tout</button>
          </div>
        </div>
      </div>

      {open && <PreferencesModal defaultConsent={defaultConsent()} onClose={()=>setOpen(false)} onSave={savePreferences} />}
    </>
  );
}

function PreferencesModal({ defaultConsent, onClose, onSave }: { defaultConsent: ConsentState; onClose: ()=>void; onSave: (a:boolean,b:boolean)=>void }) {
  const [analytics, setAnalytics] = useState<boolean>(defaultConsent.analytics);
  const [marketing, setMarketing] = useState<boolean>(defaultConsent.marketing);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl p-6">
        <h3 className="text-lg font-semibold">Préférences de cookies</h3>
        <p className="text-sm text-gray-600 mt-2">Choisissez les cookies que vous autorisez.</p>

        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Cookies nécessaires</div>
              <div className="text-xs text-gray-500">Indispensables au fonctionnement du site.</div>
            </div>
            <div className="text-sm text-gray-500">Toujours activés</div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Analytics</div>
              <div className="text-xs text-gray-500">Statistiques anonymes (Google Analytics)</div>
            </div>
            <label className="inline-flex items-center gap-2">
              <input id="pref-analytics" checked={analytics} onChange={(e)=>setAnalytics(e.target.checked)} type="checkbox" className="w-5 h-5" />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Marketing</div>
              <div className="text-xs text-gray-500">Publicités et retargeting</div>
            </div>
            <label className="inline-flex items-center gap-2">
              <input id="pref-marketing" checked={marketing} onChange={(e)=>setMarketing(e.target.checked)} type="checkbox" className="w-5 h-5" />
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md border">Annuler</button>
          <button onClick={() => onSave(analytics, marketing)} className="px-4 py-2 rounded-full bg-fetra-olive text-white">Sauvegarder</button>
        </div>

        <div className="mt-4 text-xs text-gray-400">
          <button onClick={() => { clearConsent(); window.location.reload(); }} className="underline">Réinitialiser le consentement</button>
        </div>
      </div>
    </div>
  );
}
