"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import "bootstrap-icons/font/bootstrap-icons.css";

import {
  failureLoader,
  getLoginData,
  successLoader,
} from "../../utils/utils";
import { productView } from "@/app/(main)/utils/productApi";
import { addToCart } from "../../utils/cartApi";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stocks: number;
  image: string;
}

export default function ProductView() {

  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);

  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    fetchProductView();
  }, []);

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

    return <h2>Loading...</h2>;
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

      router.push("/cart");

    } catch (error:any) {

      console.log(error);

      failureLoader(error.message);

    }
  };

  return (
    <div className="flex justify-center items-center p-8">

      <div className="flex gap-5 border rounded-xl shadow-lg p-8 w-full max-w-5xl">

        <div className="relative w-[400px] h-[400px]">

          <img
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.image}`}
            alt={product.name}
            className="object-cover rounded-lg"
          />

        </div>

        <div className="flex flex-col gap-5 flex-1">

          <h2 className="text-3xl font-bold">
            {product.name}
          </h2>

          <p className="text-gray-600">
            {product.description}
          </p>

          <h3 className="text-2xl font-bold text-blue-600">
            ₹ {Number(product.price)}
          </h3>

          <div className="flex items-center gap-3">

            <button
              className="border px-4 py-2 rounded"
              onClick={minusCount}
            >
              <i className="bi bi-dash"></i>
            </button>

            <input
              className="border w-20 text-center py-2 rounded"
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
              className="border px-4 py-2 rounded"
              onClick={plusCount}
            >
              <i className="bi bi-plus"></i>
            </button>

          </div>

          <button
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            onClick={handleAddToCart}
            disabled={
              quantity === 0 ||
              product.stocks === 0
            }
          >
            Add to Cart
          </button>

        </div>

      </div>

    </div>
  );
}