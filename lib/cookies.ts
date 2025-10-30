// lib/cookies.ts
export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

const COOKIE_NAME = 'fetra_consent';
const COOKIE_EXPIRES_DAYS = 365;

function setCookie(name: string, value: string, days = COOKIE_EXPIRES_DAYS) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + d.toUTCString();
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Lax${secure}`;
}

function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(';').shift()!);
  return null;
}

export function saveConsent(consent: ConsentState) {
  setCookie(COOKIE_NAME, JSON.stringify(consent));
}

export function readConsent(): ConsentState | null {
  const raw = getCookie(COOKIE_NAME);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

export function clearConsent() {
  setCookie(COOKIE_NAME, '', -1);
}

export function defaultConsent(): ConsentState {
  return {
    necessary: true,
    analytics: false,
    marketing: false,
    updatedAt: new Date().toISOString(),
  };
}
