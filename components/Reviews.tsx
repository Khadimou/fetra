"use client";
import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import ReviewModal from './ReviewModal';

type Review = {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
  isVerifiedBuyer: boolean;
};

// Map next-intl locale codes to full locale strings for date formatting
const localeMap: Record<string, string> = {
  fr: 'fr-FR',
  en: 'en-US',
  pt: 'pt-PT',
};

function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
}

export default function Reviews({ productSku }: { productSku: string }) {
  const t = useTranslations('Reviews');
  const localeCode = useLocale();
  const dateLocale = localeMap[localeCode] || 'fr-FR';

  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.5;

  async function loadReviews() {
    try {
      const res = await fetch(`/api/reviews?productSku=${productSku}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
        setReviewCount(data.totalCount);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, [productSku]);

  return (
    <div className="mt-8 bg-white p-6 rounded-xl brand-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold mb-2">{t('title')}</h2>
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
            <span className="text-sm text-gray-600">{t('reviewCount', { count: reviewCount })}</span>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-fetra-olive text-white rounded-lg hover:bg-fetra-olive/90 transition-colors focus:outline-none focus:ring-2 focus:ring-fetra-olive/30 text-sm font-medium"
        >
          {t('writeReview')}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fetra-olive mx-auto"></div>
          <p className="mt-2 text-gray-600 text-sm">Chargement des avis...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucun avis pour le moment</p>
          <p className="text-sm text-gray-400 mt-2">Soyez le premier à donner votre avis !</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{review.authorName}</p>
                    {review.isVerifiedBuyer && (
                      <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Achat vérifié
                      </span>
                    )}
                  </div>
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
                    <span className="text-xs text-gray-500">{formatDate(review.createdAt, dateLocale)}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productSku={productSku}
        onSuccess={loadReviews}
      />
    </div>
  );
}
