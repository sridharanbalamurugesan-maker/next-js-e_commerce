"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductReviews from "../components/ProductReviews";

function ViewReviewContent() {
    const searchParams = useSearchParams();
    const productId = searchParams.get("productId");

    return (
        <div className="bg-[#f8fafc] min-h-[calc(100vh-56px)] p-4">
            <div className="max-w-[800px] mx-auto">
                <ProductReviews productId={productId} />
            </div>
        </div>
    );
}

export default function ViewReview() {
    return (
        <Suspense fallback={<p className="p-10 text-center text-[#64748b]">Loading reviews...</p>}>
            <ViewReviewContent />
        </Suspense>
    );
}
