"use client";

import { useEffect, useState } from "react";
import { getProductReviews } from "../utils/viewReview";

interface ProductReviewsProps {
  productId?: string | null;
  refreshKey?: number;
}

export default function ProductReviews({ productId, refreshKey = 0 }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId) return;

      setLoading(true);
      const response = await getProductReviews(productId);

      if (response?.success) {
        setReviews(response.data || []);
      } else {
        setReviews([]);
      }
      setLoading(false);
    };

    fetchReviews();
  }, [productId, refreshKey]);

  const average =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((acc, cur) => acc + Number(cur.rating || 0), 0) /
            reviews.length) *
            10
        ) / 10
      : 0;

  return (
    <div id="reviews" className="bg-white">
      <div className="px-5 py-4 border-b border-[#f0f0f0] flex items-center justify-between">
        <h3 className="text-lg font-medium">Ratings & Reviews</h3>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-[#10b981] text-white text-sm font-semibold px-2 py-0.5 rounded-sm">
              {average} ★
            </span>
            <span className="text-sm text-[#64748b]">
              {reviews.length} review{reviews.length > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {loading && (
        <p className="p-5 text-sm text-[#64748b]">Loading reviews...</p>
      )}

      {!loading && reviews.length === 0 && (
        <p className="p-5 text-sm text-[#64748b]">
          No reviews yet for this product.
        </p>
      )}

      <div className="divide-y divide-[#f0f0f0]">
        {reviews.map((review, index) => (
          <div key={review._id || index} className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center gap-0.5 bg-[#10b981] text-white text-xs font-semibold px-1.5 py-0.5 rounded-sm">
                {review.rating} ★
              </span>
              <h4 className="font-medium text-sm">
                {review.user?.name || "Grabbuy Customer"}
              </h4>
            </div>
            {review.comment && (
              <p className="text-sm text-[#0f172a] mb-2">{review.comment}</p>
            )}
            {review.images?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {review.images.map((img: string, imgIndex: number) => (
                  <img
                    key={imgIndex}
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${img}`}
                    alt="review"
                    className="w-20 h-20 object-cover border border-[#f0f0f0]"
                  />
                ))}
              </div>
            )}
            <h3 className="text-xs text-[#64748b]">
              {review.createdAt
                ? new Date(review.createdAt).toLocaleDateString("en-GB")
                : ""}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
