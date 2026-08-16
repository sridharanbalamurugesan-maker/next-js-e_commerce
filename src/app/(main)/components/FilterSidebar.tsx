"use client";

import { useEffect, useMemo, useState } from "react";
import { filters } from "../utils/productApi";
import { getAllCategory } from "../utils/categoryApi";
import { failureLoader, HOME_RESET_EVENT, successLoader } from "../utils/utils";

type FilterType = {
  category: string;
  minPrice: string;
  maxPrice: string;
  rating: string;
  freeShipping: boolean;
};

const INITIAL_FILTER: FilterType = {
  category: "",
  minPrice: "",
  maxPrice: "",
  rating: "",
  freeShipping: false,
};

const RATING_LABELS = ["Any rating", "1★ & up", "2★ & up", "3★ & up", "4★ & up", "5★ only"];

export default function FilterProduct({ setProduct, setTotalPage }: any) {
  const [filter, setFilter] = useState<FilterType>(INITIAL_FILTER);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [priceError, setPriceError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catRes = await getAllCategory();
        if (catRes?.data) setCategories(catRes.data);
      } catch (err) {
        console.log(err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const resetFilter = () => {
      setFilter(INITIAL_FILTER);
      setPriceError("");
    };
    window.addEventListener(HOME_RESET_EVENT, resetFilter);
    return () => window.removeEventListener(HOME_RESET_EVENT, resetFilter);
  }, []);

  const activeCount = useMemo(() => {
    let count = 0;
    if (filter.category) count++;
    if (filter.rating) count++;
    if (filter.minPrice && filter.maxPrice) count++;
    if (filter.freeShipping) count++;
    return count;
  }, [filter]);

  const closeModal = () => {
    const modal = document.getElementById("my_modal_2") as HTMLDialogElement;
    modal?.close();
  };

  const handleRating = (value: number) => {
    setFilter((prev) => ({
      ...prev,
      rating: prev.rating === value.toString() ? "" : value.toString(),
    }));
  };

  const handlePrice = (type: "minPrice" | "maxPrice", value: string) => {
    setPriceError("");
    setFilter((prev) => ({ ...prev, [type]: value }));
  };

  const handleClear = () => {
    setFilter(INITIAL_FILTER);
    setPriceError("");
  };

  const validatePrice = (): boolean => {
    if (!filter.minPrice.trim() || !filter.maxPrice.trim()) {
      setPriceError("Both minimum and maximum price are required.");
      return false;
    }
    const min = Number(filter.minPrice);
    const max = Number(filter.maxPrice);
    if (isNaN(min) || isNaN(max) || min < 0 || max < 0) {
      setPriceError("Please enter valid price values.");
      return false;
    }
    if (min > max) {
      setPriceError("Minimum price cannot be greater than maximum price.");
      return false;
    }
    setPriceError("");
    return true;
  };

  const handleSearch = async () => {
    if (!validatePrice()) {
      failureLoader("Please fill in both min and max price.");
      return;
    }

    const query = new URLSearchParams();
    if (filter.category) query.append("category", filter.category);
    if (filter.rating) query.append("rating", filter.rating);
    query.append("minPrice", filter.minPrice);
    query.append("maxPrice", filter.maxPrice);
    if (filter.freeShipping) query.append("freeShipping", "true");
    query.append("page", "1");
    query.append("limit", "8");

    const response = await filters(query.toString());
    if (response?.success === true) {
      setProduct(response.data);
      successLoader(response.message);
    }
    setTotalPage(response?.pagination?.totalPage || 1);
    closeModal();
  };

  const priceInputClass = (field: "minPrice" | "maxPrice") =>
    `border rounded-md pl-7 pr-3 py-2.5 w-full text-sm focus:outline-none focus:ring-1 ${
      priceError && !filter[field].trim()
        ? "border-red-400 focus:border-red-400 focus:ring-red-400"
        : "border-[#e2e8f0] focus:border-[#6366f1] focus:ring-[#6366f1]"
    }`;

  return (
    <dialog id="my_modal_2" className="modal">
      <div className="modal-box p-0 max-w-md rounded-lg overflow-hidden shadow-xl">
        <div className="bg-gradient-to-r from-[#6366f1] to-[#4f46e5] px-5 py-4 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Filters</h3>
              <p className="text-xs text-white/70 mt-0.5">
                Refine your search results
              </p>
            </div>
            {activeCount > 0 && (
              <span className="bg-[#fcd34d] text-[#4f46e5] text-xs font-bold px-2.5 py-1 rounded-full">
                {activeCount} active
              </span>
            )}
          </div>
        </div>

        <div className="px-5 py-4 max-h-[60vh] overflow-y-auto space-y-5">
          {categories.length > 0 && (
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748b] mb-2">
                Category
              </h4>
              <select
                value={filter.category}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full border border-[#e2e8f0] rounded-md px-3 py-2.5 text-sm text-[#0f172a] bg-white focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </section>
          )}

          <section className="bg-[#f8fafc] rounded-lg p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748b] mb-1">
              Customer Rating
            </h4>
            <p className="text-sm font-medium text-[#0f172a] mb-3">
              {RATING_LABELS[Number(filter.rating) || 0]}
            </p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRating(star)}
                  className={`text-2xl transition-transform hover:scale-110 ${
                    star <= Number(filter.rating)
                      ? "text-[#f59e0b]"
                      : "text-[#cbd5e1]"
                  }`}
                  aria-label={`${star} star${star > 1 ? "s" : ""} and up`}
                >
                  ★
                </button>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748b] mb-2">
              Price Range <span className="text-red-500">*</span>
            </h4>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b] text-sm">
                  ₹
                </span>
                <input
                  className={priceInputClass("minPrice")}
                  type="number"
                  placeholder="Min *"
                  min="0"
                  required
                  value={filter.minPrice}
                  onChange={(e) => handlePrice("minPrice", e.target.value)}
                />
              </div>
              <span className="text-[#64748b] text-sm">to</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b] text-sm">
                  ₹
                </span>
                <input
                  className={priceInputClass("maxPrice")}
                  type="number"
                  placeholder="Max *"
                  min="0"
                  required
                  value={filter.maxPrice}
                  onChange={(e) => handlePrice("maxPrice", e.target.value)}
                />
              </div>
            </div>
            {priceError && (
              <p className="text-red-500 text-xs mt-2">{priceError}</p>
            )}
          </section>

          <section className="flex items-center justify-between bg-[#f8fafc] rounded-lg px-4 py-3">
            <div>
              <p className="text-sm font-medium text-[#0f172a]">Free Shipping</p>
              <p className="text-xs text-[#64748b]">Show only free delivery items</p>
            </div>
            <input
              type="checkbox"
              className="toggle toggle-sm toggle-primary"
              checked={filter.freeShipping}
              onChange={() =>
                setFilter((prev) => ({
                  ...prev,
                  freeShipping: !prev.freeShipping,
                }))
              }
            />
          </section>
        </div>

        <div className="border-t border-[#e2e8f0] px-5 py-4 flex items-center gap-3">
          <button
            type="button"
            onClick={handleClear}
            disabled={activeCount === 0 && !filter.minPrice && !filter.maxPrice}
            className="text-sm font-medium text-[#64748b] hover:text-[#6366f1] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Clear all
          </button>
          <div className="flex-1" />
          <button
            type="button"
            onClick={closeModal}
            className="btn btn-outline btn-sm px-6"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleSearch}
            className="btn btn-primary btn-sm px-6"
          >
            Apply Filters
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button aria-label="Close filter modal">close</button>
      </form>
    </dialog>
  );
}
