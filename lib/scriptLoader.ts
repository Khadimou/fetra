// lib/scriptLoader.ts
export function loadScript(src: string, attrs: Record<string, string> = {}) {
  return new Promise<HTMLScriptElement>((resolve, reject) => {
    if (typeof document === 'undefined') return reject(new Error('No document'));
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
    if (existing) return resolve(existing);
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    Object.keys(attrs).forEach((k) => s.setAttribute(k, attrs[k]));
    s.onload = () => resolve(s);
    s.onerror = (e) => reject(e);
    document.head.appendChild(s);
  });
}
