"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import "bootstrap-icons/font/bootstrap-icons.css";

import {
  failureLoader,
  getLoginData,
  notifyCartUpdated,
  successLoader,
} from "../../utils/utils";
import { productView } from "@/app/(main)/utils/productApi";
import { addToCart } from "../../utils/cartApi";
import ReviewModal from "../../components/ReviewModal";
import ProductReviews from "../../components/ProductReviews";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stocks: number;
  image: string;
  rating:number;
}

export default function ProductView() {

  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);

  const [quantity, setQuantity] = useState<number>(0);
  const [rating, setRating] = useState(5);
  const [reviewRefresh, setReviewRefresh] = useState(0);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    fetchProductView();
  }, [rating]);

  useEffect(() => {
    if (showReviews) {
      document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showReviews]);

  const fetchProductView = async () => {

    try {

      const response = await productView(id);

      console.log("API RESPONSE", response);

      setProduct(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  const plusCount = () => {

    if (product && quantity < product.stocks) {

      setQuantity(quantity + 1);

    }
  };

  const minusCount = () => {

    if (quantity > 0) {

      setQuantity(quantity - 1);

    }
  };

  if (!product) {

    return <h2 className="p-10 text-center text-[#64748b]">Loading...</h2>;
  }

  const handleAddToCart = async () => {

    try {

      const userData = getLoginData();

      const orderData = {
        quantity: quantity,
        user: {
          id: userData._id,
        },
        product: {
          id: product._id,
        },
      };

      const response = await addToCart(orderData);

      console.log("Cart Added:", response);

      successLoader(response.message);
      notifyCartUpdated();

      router.push("/cart");

    } catch (error:any) {

      console.log(error);

      failureLoader(error.message);

    }
  };
  const handleModal=()=>{
     const modal = document.getElementById("my_modal_2") as HTMLDialogElement;
                modal?.showModal();
  }

  const handleView=()=>{
    setShowReviews(true);
  }

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-56px)] p-3 md:p-4">

      <div className="max-w-[1240px] mx-auto bg-white flex flex-col md:flex-row gap-6 p-4 md:p-6">

        <div className="md:sticky md:top-20 w-full md:w-[420px] shrink-0">

          <div className="border border-[#f0f0f0] p-6 flex items-center justify-center h-[400px]">
            <img
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.image}`}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>

        </div>

        <div className="flex flex-col gap-4 flex-1 pt-2">

          <h2 className="text-xl md:text-2xl font-medium text-[#0f172a]">
            {product.name}
          </h2>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 bg-[#10b981] text-white text-sm font-semibold px-2 py-0.5 rounded-sm">
              {product.rating || 0} ★
            </span>
            <span className="text-sm text-[#64748b]">
              {product.stocks > 0 ? `${product.stocks} in stock` : "Out of stock"}
            </span>
          </div>

          <p className="text-sm text-[#0f172a] leading-6">
            {product.description}
          </p>

          <div>
            <p className="text-xs text-[#64748b]">Special Price</p>
            <h3 className="text-3xl font-medium text-[#0f172a]">
              ₹{Number(product.price)}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium w-24">Quantity</span>

            <button
              className="border border-[#c2c2c2] w-9 h-9 rounded-full text-lg leading-none hover:shadow"
              onClick={minusCount}
            >
              <i className="bi bi-dash"></i>
            </button>

            <input
              className="border border-[#c2c2c2] w-16 text-center py-1.5"
              type="number"
              value={quantity}
              min="0"
              max={product.stocks}
              onChange={(e) => {

                const value = Number(e.target.value);

                if (value <= product.stocks) {

                  setQuantity(value);

                }
              }}
            />

            <button
              className="border border-[#c2c2c2] w-9 h-9 rounded-full text-lg leading-none hover:shadow"
              onClick={plusCount}
            >
              <i className="bi bi-plus"></i>
            </button>

          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button
              className="fk-yellow-btn flex-1 py-3.5 text-sm"
              onClick={handleAddToCart}
              disabled={
                quantity === 0 ||
                product.stocks === 0
              }
            >
              ADD TO CART
            </button>
            <button className="fk-orange-btn flex-1 py-3.5 text-sm"
          onClick={handleView}>
            VIEW REVIEWS
            </button>
          </div>
            <ReviewModal
            productId={product._id}
            setRating={setRating}
            rating={rating}
            reviewMode="add"
            onSuccess={() => setReviewRefresh((prev) => prev + 1)}/>
        </div>

      </div>

      {showReviews && (
      <div className="max-w-[1240px] mx-auto mt-3">
        <ProductReviews productId={product._id} refreshKey={reviewRefresh} />
      </div>
      )}

    </div>
  );
}
