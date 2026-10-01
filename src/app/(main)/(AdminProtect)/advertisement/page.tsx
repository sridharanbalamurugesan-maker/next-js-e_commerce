"use client";

import { useEffect, useState } from "react";
import { getAllProduct } from "../../utils/productApi";
import {
  clearAdvertisement,
  getActiveAdvertisement,
  setAdvertisement,
} from "../../utils/advertisementApi";
import { failureLoader, successLoader } from "../../utils/utils";

interface AdProduct {
  _id: string;
  name: string;
  price: number;
  brand?: string;
  image: string;
}

export default function AdvertisementPage() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<AdProduct[]>([]);
  const [current, setCurrent] = useState<AdProduct | null>(null);

  const loadCurrent = async () => {
    const response = await getActiveAdvertisement();
    if (response?.success) {
      setCurrent(response.data || null);
    }
  };

  const loadProducts = async (keyword = "") => {
    const response = await getAllProduct(1, 8, null, keyword || null);
    if (response?.success) {
      setProducts(response.data || []);
    }
  };

  useEffect(() => {
    loadCurrent();
    loadProducts();
  }, []);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    loadProducts(search.trim());
  };

  const handleSet = async (productId: string) => {
    const response = await setAdvertisement(productId);
    if (response?.success) {
      setCurrent(response.data || null);
      successLoader(response.message || "Advertisement saved");
      return;
    }
    failureLoader(response?.message || "Failed to save advertisement");
  };

  const handleRemove = async () => {
    const response = await clearAdvertisement();
    if (response?.success) {
      setCurrent(null);
      successLoader(response.message || "Advertisement removed");
      return;
    }
    failureLoader(response?.message || "Failed to remove advertisement");
  };

  return (
    <div className="w-full p-4 bg-[#f8fafc] min-h-[calc(100vh-56px)]">
      <div className="max-w-[1240px] mx-auto bg-white">
        <div className="px-5 py-4 border-b border-[#f0f0f0]">
          <h2 className="text-lg font-medium">Advertisement</h2>
        </div>

        <div className="p-5 border-b border-[#f0f0f0]">
          <p className="text-sm font-medium mb-3">Current banner</p>
          {current ? (
            <div className="flex items-center gap-4">
              <img
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${current.image}`}
                alt={current.name}
                className="w-16 h-16 object-contain border border-[#f0f0f0]"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{current.name}</p>
                <p className="text-sm text-[#64748b]">
                  ₹{Number(current.price).toLocaleString("en-IN")}
                </p>
              </div>
              <button
                type="button"
                className="border border-[#f43f5e] text-[#f43f5e] px-4 py-2 text-sm"
                onClick={handleRemove}
              >
                Remove
              </button>
            </div>
          ) : (
            <p className="text-sm text-[#64748b]">No advertisement set.</p>
          )}
        </div>

        <form onSubmit={handleSearch} className="p-5 flex gap-2">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
            className="flex-1 border border-[#e2e8f0] px-3 py-2 text-sm outline-none"
          />
          <button type="submit" className="fk-orange-btn px-5 py-2 text-sm">
            Search
          </button>
        </form>

        <div className="px-5 pb-5 flex flex-col gap-3">
          {products.map((product) => (
            <div
              key={product._id}
              className="flex items-center gap-4 border border-[#f0f0f0] p-3"
            >
              <img
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.image}`}
                alt={product.name}
                className="w-14 h-14 object-contain"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{product.name}</p>
                <p className="text-sm text-[#64748b]">
                  {product.brand ? `${product.brand} · ` : ""}₹
                  {Number(product.price).toLocaleString("en-IN")}
                </p>
              </div>
              <button
                type="button"
                className="fk-yellow-btn px-4 py-2 text-sm"
                onClick={() => handleSet(product._id)}
              >
                Set as banner
              </button>
            </div>
          ))}
          {products.length === 0 && (
            <p className="text-sm text-[#64748b]">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
