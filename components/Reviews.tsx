"use client";

type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
};

const mockReviews: Review[] = [
  {
    id: "1",
    author: "Sophie M.",
    rating: 5,
    comment: "Produit incroyable ! Ma peau est beaucoup plus ferme après seulement 2 semaines d'utilisation. Le rouleau en quartz est très agréable à utiliser.",
    date: "2024-01-15",
  },
  {
    id: "2",
    author: "Marie L.",
    rating: 5,
    comment: "Excellent rapport qualité-prix. L'huile est très nourrissante et le kit complet permet un rituel vraiment relaxant.",
    date: "2024-01-10",
  },
  {
    id: "3",
    author: "Claire D.",
    rating: 4,
    comment: "Très satisfaite, même si je trouve que le rouleau pourrait être un peu plus grand. Le résultat est visible rapidement.",
    date: "2024-01-05",
  },
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
}

export default function Reviews({ averageRating = 4.8, reviewCount = 124 }: { averageRating?: number; reviewCount?: number }) {
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.5;

  return (
    <div className="mt-8 bg-white p-6 rounded-xl brand-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold mb-2">Avis clients</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < fullStars
                      ? "text-yellow-400 fill-current"
                      : i === fullStars && hasHalfStar
                      ? "text-yellow-400 fill-current opacity-50"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
            <span className="text-sm text-gray-600">({reviewCount} avis)</span>
          </div>
        </div>
        <button className="px-4 py-2 bg-fetra-olive text-white rounded-lg hover:bg-fetra-olive/90 transition-colors focus:outline-none focus:ring-2 focus:ring-fetra-olive/30 text-sm font-medium">
          Écrire un avis
        </button>
      </div>

      <div className="space-y-4">
        {mockReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold">{review.author}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(review.date)}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

