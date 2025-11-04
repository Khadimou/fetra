// app/cookie-policy/page.tsx
export default function CookiePolicyPage() {
  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-semibold">Politique de cookies</h1>
      <p className="mt-4 text-sm text-gray-700">
        Ce site utilise des cookies nécessaires au fonctionnement, et des cookies facultatifs pour analytics et marketing. Vous pouvez gérer vos préférences via le bouton « Gérer les cookies ».
      </p>
      <section className="mt-6">
        <h2 className="font-medium">Cookies nécessaires</h2>
        <p className="text-sm text-gray-600">Description...</p>
      </section>
      <section className="mt-4">
        <h2 className="font-medium">Cookies analytics</h2>
        <p className="text-sm text-gray-600">Description...</p>
      </section>
    </main>
  );
}
