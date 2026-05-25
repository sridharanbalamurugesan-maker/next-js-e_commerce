"use client";

import { useEffect, useState } from "react";
import { getProductReviews } from "../utils/viewReview";
import { useSearchParams } from "next/navigation";
import { failureLoader } from "../utils/utils";

export default function ViewReview() {

    const [reviews, setReviews] = useState<any[]>([]);
    const searchParams = useSearchParams();
    const productId =  searchParams.get("productId");

    useEffect(() => {

        const fetchReviews = async () => {

            if (!productId) {
                failureLoader("Product ID Not Visible");
                return;
            }

            const response = await getProductReviews(productId);

            if (response.success) {
                setReviews(response.data);
            }
        };

        fetchReviews();

    }, [productId]);

    return (
        <>
            <h3 className="flex justify-center items-center text-2xl font-bold mb-5">
                Review Page
            </h3>

            <div className="space-y-4">

                {reviews.map((review, index) => (

                    <div
                        key={index}
                     className="border p-6 rounded-lg shadow flex flex-col items-center text-center"
                    >

                        <h4 className="font-semibold">
                            {review.user?.name}
                        </h4>

                        <div className="text-yellow-400 text-2xl">
                            {"★".repeat(review.rating)}
                        </div>
                        <div>
                        <h3> {new Date(review.createdAt).toLocaleDateString("en-GB")}</h3>
                        </div>
                        <div>
                        <h3> {review.comment}</h3>
                        </div>

                    </div>

                ))}

            </div>
        </>
    );
}