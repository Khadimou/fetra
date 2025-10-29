type Props = {
  rating?: number;
  reviewCount?: number;
};

export default function SocialProof({ rating = 4.8, reviewCount = 124 }: Props) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="mt-4 p-4 bg-fetra-olive/5 rounded-lg border border-fetra-olive/20 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
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
        <span className="text-sm font-semibold text-gray-900">{rating.toFixed(1)}</span>
        <span className="text-xs text-gray-600">({reviewCount} avis)</span>
      </div>
      <p className="text-xs text-gray-600">
        <span className="font-semibold text-fetra-pink">{Math.max(12, Math.floor(reviewCount / 3))} personnes</span> ont acheté ce mois-ci
      </p>
    </div>
  );
}

