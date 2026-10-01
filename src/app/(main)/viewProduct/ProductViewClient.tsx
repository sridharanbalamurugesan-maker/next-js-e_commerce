"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

import "bootstrap-icons/font/bootstrap-icons.css";

import {
  failureLoader,
  getLoginData,
  notifyCartUpdated,
  successLoader,
} from "../utils/utils";
import { productView } from "@/app/(main)/utils/productApi";
import { addToCart } from "../utils/cartApi";
import { getActiveAdvertisement } from "../utils/advertisementApi";
import { Address, getAddressesByUser } from "../utils/addressApi";
import AddressModal from "../components/AddressModal";
import ReviewModal from "../components/ReviewModal";
import ProductReviews from "../components/ProductReviews";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stocks: number;
  image: string;
  rating: number;
  brand?: string;
  numReviews?: number;
  isFreeShipping?: boolean;
  category?: { _id?: string; name?: string } | string;
}

const formatInr = (value: number) =>
  `₹${Number(value).toLocaleString("en-IN")}`;

const formatDeliveryDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

const addDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const discountFromId = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return 10 + (hash % 12);
};

const descriptionPoints = (text: string) => {
  const parts = text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [text.trim()].filter(Boolean);
};

const orderWindow = (now: Date) => {
  const cutoff = new Date(now);
  cutoff.setHours(20, 0, 0, 0);
  if (now.getTime() >= cutoff.getTime()) {
    cutoff.setDate(cutoff.getDate() + 1);
  }
  const diff = cutoff.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours} hrs ${mins} mins`;
};

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center text-[#f59e0b] text-sm leading-none">
      {[1, 2, 3, 4, 5].map((star) => {
        const icon =
          rating >= star
            ? "bi-star-fill"
            : rating >= star - 0.5
              ? "bi-star-half"
              : "bi-star";
        return <i key={star} className={`bi ${icon}`} />;
      })}
    </span>
  );
}

export default function ProductViewClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("id") as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [rating, setRating] = useState(5);
  const [reviewRefresh, setReviewRefresh] = useState(0);
  const [showReviews, setShowReviews] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState<Address | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [advertisement, setAdvertisement] = useState<Product | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let cancelled = false;

    const fetchProductView = async () => {
      try {
        const response = await productView(id);
        const nextProduct = response?.data as Product | undefined;
        if (cancelled || !nextProduct) return;
        setProduct(nextProduct);
        setQuantity((current) => {
          const maxQty = Math.min(Number(nextProduct.stocks) || 0, 10);
          if (maxQty === 0) return 0;
          if (current > 0) return Math.min(current, maxQty);
          return 1;
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchProductView();
    return () => {
      cancelled = true;
    };
  }, [id, rating]);

  useEffect(() => {
    setQuantity(1);
    setShowReviews(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadAddress = async () => {
      if (!getLoginData()) return;
      const response = await getAddressesByUser();
      if (response?.success) {
        const list: Address[] = response.data || [];
        const chosen = list.find((item) => item.isDefault) || list[0] || null;
        setDeliveryAddress(chosen);
      }
    };
    loadAddress();
  }, []);

  useEffect(() => {
    const loadAdvertisement = async () => {
      const response = await getActiveAdvertisement();
      if (response?.success && response.data) {
        setAdvertisement(response.data);
      } else {
        setAdvertisement(null);
      }
    };
    loadAdvertisement();
  }, []);

  useEffect(() => {
    if (showReviews) {
      document.getElementById("reviews")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [showReviews]);

  if (!product) {
    return <h2 className="p-10 text-center text-[#64748b]">Loading...</h2>;
  }

  const price = Number(product.price);
  const discount = discountFromId(product._id);
  const listPrice = Math.round(price / (1 - discount / 100));
  const maxQty = Math.min(product.stocks, 10);
  const imageSrc = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.image}`;
  const categoryName =
    product.category && typeof product.category === "object"
      ? product.category.name
      : "";
  const standardDate = addDays(product.isFreeShipping ? 3 : 5);
  const tomorrow = addDays(1);
  const showAd = Boolean(advertisement && advertisement._id !== product._id);
  const adPrice = showAd ? Number(advertisement?.price) : 0;
  const adDiscount = showAd ? discountFromId(advertisement?._id || "") : 0;
  const adListPrice = showAd
    ? Math.round(adPrice / (1 - adDiscount / 100))
    : 0;

  const handleAddToCart = async () => {
    const userData = getLoginData();
    if (!userData) {
      router.push(`/login?next=${encodeURIComponent(`/viewProduct?id=${product._id}`)}`);
      return;
    }
    try {
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

      successLoader(response.message);
      notifyCartUpdated();

      router.push("/cart");
    } catch (error: any) {
      console.log(error);
      failureLoader(error.message);
    }
  };

  const openReviews = () => {
    setShowReviews(true);
    document.getElementById("reviews")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const openAddressPicker = () => {
    if (!getLoginData()) {
      router.push("/login");
      return;
    }
    setShowAddressModal(true);
  };

  const handleAddressConfirm = async (addressId: string) => {
    const response = await getAddressesByUser();
    if (!response?.success) return;
    const list: Address[] = response.data || [];
    const chosen = list.find((item) => item._id === addressId) || null;
    if (chosen) setDeliveryAddress(chosen);
  };

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-56px)] p-3 md:p-4">
      {showAd && advertisement && (
        <button
          type="button"
          onClick={() => router.push(`/viewProduct?id=${advertisement._id}`)}
          className="max-w-[1240px] mx-auto mb-3 w-full bg-white border border-[#e2e8f0] rounded-sm px-4 py-3 flex items-center gap-4 text-left"
        >
          <img
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${advertisement.image}`}
            alt={advertisement.name}
            className="w-16 h-16 object-contain shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#0f172a] truncate">
              {advertisement.name}
            </p>
            <p className="text-sm text-[#64748b] truncate">
              {advertisement.description}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[#0f172a]">
              <span className="text-[#f43f5e] font-medium mr-1">
                -{adDiscount}%
              </span>
              <span className="font-medium">{formatInr(adPrice)}</span>
            </p>
            <p className="text-sm text-[#64748b] line-through">
              M.R.P.: {formatInr(adListPrice)}
            </p>
          </div>
          <span className="text-xs text-[#64748b] shrink-0 self-end">
            Sponsored
          </span>
        </button>
      )}
      <div className="max-w-[1240px] mx-auto bg-white p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="lg:sticky lg:top-20 w-full lg:w-[360px] shrink-0 self-start">
            <div className="aspect-square w-full bg-white border border-[#f0f0f0] p-6 flex items-center justify-center">
              <img
                src={imageSrc}
                alt={product.name}
                className="h-full w-full object-contain object-center"
              />
            </div>
            <div className="flex gap-2 mt-3">
              <div className="w-16 h-16 border-2 border-[#6366f1] p-1 bg-white">
                <img
                  src={imageSrc}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 flex-1 min-w-0 pt-1">
            <h1 className="text-xl md:text-[22px] font-medium text-[#0f172a] leading-7">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              {product.brand && (
                <Link
                  href={`/home?search=${encodeURIComponent(product.brand)}`}
                  className="text-[#6366f1] hover:underline"
                >
                  Visit the {product.brand} Store
                </Link>
              )}
              {/* {categoryName && (
                <span className="text-[#64748b]">{categoryName}</span>
              )} */}
            </div>

            <button
              type="button"
              onClick={openReviews}
              className="flex items-center gap-2 w-fit text-left"
            >
              <span className="text-sm font-medium text-[#0f172a]">
                {Number(product.rating || 0).toFixed(1)}
              </span>
              <StarRow rating={Number(product.rating || 0)} />
              <span className="text-sm text-[#6366f1] hover:underline">
                ({Number(product.numReviews || 0).toLocaleString("en-IN")})
              </span>
            </button>

            {Number(product.rating) >= 4 && (
              <span className="inline-flex w-fit items-center bg-[#1e1b4b] text-white text-xs font-semibold px-2 py-1">
                Grabbuy&apos;s Choice
              </span>
            )}

            <div className="flex items-baseline gap-2 flex-wrap">
              {discount > 0 && (
                <span className="text-2xl text-[#f43f5e] font-medium">
                  -{discount}%
                </span>
              )}
              <span className="text-3xl font-medium text-[#0f172a]">
                {formatInr(price)}
              </span>
            </div>
            <p className="text-sm text-[#64748b]">
              M.R.P.:{" "}
              <span className="line-through">{formatInr(listPrice)}</span>
            </p>
            <p className="text-sm text-[#0f172a]">Inclusive of all taxes</p>

            <div>
              <p className="text-sm font-medium text-[#0f172a] mb-2 flex items-center gap-1.5">
                <i className="bi bi-tags text-[#f59e0b]" />
                Offers
              </p>
              <div className="flex flex-wrap gap-2">
                <div className="border border-[#e2e8f0] rounded-sm px-3 py-2 min-w-[150px]">
                  <p className="text-sm font-medium">Cashback</p>
                  <p className="text-xs text-[#64748b]">
                    {product.isFreeShipping
                      ? "Free delivery on this order"
                      : "Cashback available on this order"}
                  </p>
                </div>
                <div className="border border-[#e2e8f0] rounded-sm px-3 py-2 min-w-[150px]">
                  <p className="text-sm font-medium">Bank Offer</p>
                  <p className="text-xs text-[#64748b]">
                    Extra savings on select cards
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[280px] shrink-0 self-start lg:sticky lg:top-20 border border-[#e2e8f0] rounded-sm p-4 flex flex-col gap-3">
            <p className="text-2xl font-medium text-[#0f172a]">
              {formatInr(price)}
            </p>

            <p className="text-sm text-[#0f172a] leading-6">
              {product.isFreeShipping ? (
                <span className="text-[#10b981] font-semibold">
                  FREE delivery
                </span>
              ) : (
                <span className="font-semibold">Delivery</span>
              )}{" "}
              <span className="font-semibold">
                {formatDeliveryDate(standardDate)}
              </span>
            </p>
            <p className="text-sm text-[#0f172a] leading-6">
              Or fastest delivery{" "}
              <span className="font-semibold">
                {formatDeliveryDate(tomorrow)}
              </span>
              . Order within {orderWindow(now)}
            </p>

            <button
              type="button"
              onClick={openAddressPicker}
              className="text-sm text-[#64748b] flex items-start gap-1.5 text-left hover:text-[#6366f1]"
            >
              <i className="bi bi-geo-alt mt-0.5" />
              <span>
                {deliveryAddress
                  ? `Delivering to ${deliveryAddress.city} ${deliveryAddress.pincode}`
                  : "Add a delivery location"}
              </span>
            </button>

            <p
              className={`text-lg font-medium ${
                product.stocks > 0 ? "text-[#10b981]" : "text-[#f43f5e]"
              }`}
            >
              {product.stocks > 0 ? "In stock" : "Out of stock"}
            </p>

            {maxQty > 0 && (
              <label className="text-sm text-[#0f172a] flex items-center gap-2">
                Quantity
                <select
                  className="border border-[#c2c2c2] bg-white px-2 py-1.5 text-sm"
                  value={quantity}
                  onChange={(event) => setQuantity(Number(event.target.value))}
                >
                  {Array.from({ length: maxQty }, (_, index) => index + 1).map(
                    (value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    )
                  )}
                </select>
              </label>
            )}

            <button
              className="w-full py-2.5 text-sm font-semibold uppercase tracking-wide rounded-sm bg-[#fbbf24] text-[#0f172a] hover:bg-[#f59e0b] disabled:opacity-55 disabled:cursor-not-allowed"
              onClick={handleAddToCart}
              disabled={quantity === 0 || product.stocks === 0}
            >
              Add to cart
            </button>
            <button
              className="w-full py-2.5 text-sm font-semibold uppercase tracking-wide rounded-sm bg-[#d97706] text-white hover:bg-[#b45309] disabled:opacity-55 disabled:cursor-not-allowed"
              onClick={handleAddToCart}
              disabled={quantity === 0 || product.stocks === 0}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto mt-3 bg-white p-4 md:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-5 border-b border-[#f0f0f0]">
          {[
            { icon: "bi-cash-coin", label: "Pay on Delivery" },
            { icon: "bi-arrow-repeat", label: "10 days Replacement" },
            { icon: "bi-truck", label: "Grabbuy Delivered" },
            { icon: "bi-receipt", label: "Inclusive of taxes" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center text-center gap-2">
              <span className="w-12 h-12 rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-[#0f172a] text-lg">
                <i className={`bi ${item.icon}`} />
              </span>
              <span className="text-xs sm:text-sm text-[#0f172a] leading-5">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="py-5 border-b border-[#f0f0f0]">
          <div className="grid grid-cols-[140px_1fr] gap-y-3 text-sm max-w-xl">
            {product.brand && (
              <>
                <span className="font-semibold text-[#0f172a]">Brand</span>
                <span className="text-[#0f172a]">{product.brand}</span>
              </>
            )}
            {categoryName && (
              <>
                <span className="font-semibold text-[#0f172a]">Category</span>
                <span className="text-[#0f172a]">{categoryName}</span>
              </>
            )}
          </div>
        </div>

        <div className="pt-5">
          <h2 className="text-lg font-semibold text-[#0f172a] mb-3">
            About this item
          </h2>
          <ul className="flex flex-col gap-2">
            {descriptionPoints(product.description).map((point, index) => (
              <li key={`${index}-${point}`} className="flex items-start gap-2 text-sm text-[#0f172a] leading-6">
                <i className="bi bi-check-circle-fill text-[#10b981] mt-1 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <AddressModal
        open={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onConfirm={handleAddressConfirm}
      />

      <ReviewModal
        productId={product._id}
        setRating={setRating}
        rating={rating}
        reviewMode="add"
        onSuccess={() => setReviewRefresh((prev) => prev + 1)}
      />

      {showReviews && (
        <div className="max-w-[1240px] mx-auto mt-3">
          <ProductReviews productId={product._id} refreshKey={reviewRefresh} />
        </div>
      )}
    </div>
  );
}
