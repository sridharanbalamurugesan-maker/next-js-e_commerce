"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getLoginData, HOME_RESET_EVENT, notifySearchCleared } from "../utils/utils";
import { getAllProduct } from "../utils/productApi";
import { getAllCategory } from "../utils/categoryApi";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";


interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  stocks: number;
  image: string;
  rating:number;

  category: {
    _id: string;
    name: string;
  };
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const [products, setProduct] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    getLoginData();
    fetchProducts(page, selectedCategory, search);
    fetchCategories();
  }, [page, selectedCategory, search]);
  useEffect(() => {
  console.log("BASE URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
}, []);

  useEffect(() => {
    const resetHome = () => {
      setSelectedCategory(null);
      setPage(1);
      fetchProducts(1, null, "");
    };
    window.addEventListener(HOME_RESET_EVENT, resetHome);
    return () => {
      window.removeEventListener(HOME_RESET_EVENT, resetHome);
    };
  }, []);

  const fetchProducts = async (currentPage: number, category: string | null, keyword: string | null) => {
    try {
      const response = await getAllProduct(currentPage, 8, category, keyword);

      setProduct(response.data || []);

      setTotalPage(response.pagination?.totalPage || 1);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getAllCategory();
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

    const handleCategory = (categoryId: string | null) => {
        setSelectedCategory(categoryId);
        setPage(1);
        if (search) {
          router.replace("/home");
          notifySearchCleared();
        }
    };

    const handleOpen=()=>{
        const modal = document.getElementById("my_modal_2") as HTMLDialogElement;
                modal?.showModal();
    }

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-56px)]">

      <div className="bg-white shadow-sm">
        <div className="max-w-[1240px] mx-auto px-4 py-3 flex items-center justify-center gap-2 overflow-x-auto">
          <button
            className={`shrink-0 px-4 py-2 text-sm font-medium rounded-sm ${
              selectedCategory === null
                ? "bg-[#6366f1] text-white"
                : "bg-[#f8fafc] text-[#0f172a] hover:text-[#6366f1]"
            }`}
            onClick={() => handleCategory(null)}
          >
            All
          </button>

          {categories?.map((cat) => (
            <button
              key={cat._id}
              className={`shrink-0 px-4 py-2 text-sm font-medium rounded-sm whitespace-nowrap ${
                selectedCategory === cat._id
                  ? "bg-[#6366f1] text-white"
                  : "bg-[#f8fafc] text-[#0f172a] hover:text-[#6366f1]"
              }`}
              onClick={() =>
                handleCategory(cat._id)
              }
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 py-4">
        <div className="bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white rounded-sm px-6 py-8 mb-4 flex items-center justify-between">
          <div>
            <p className="text-[#fcd34d] text-sm font-medium italic mb-1">Explore Plus ★</p>
            <h2 className="text-2xl md:text-3xl font-semibold">Big Savings on Top Brands</h2>
            <p className="text-white/80 mt-1 text-sm">Shop electronics, fashion and more at the best prices</p>
          </div>
          <span className="hidden md:block italic font-extrabold text-4xl opacity-90">Grabbuy</span>
        </div>
        <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-medium text-[#0f172a]">
              {search ? `Results for "${search}"` : "Deals of the Day"}
            </h2>
            <button className="btn btn-primary btn-sm" onClick={handleOpen}>Filter</button>
        </div>

        <div className="bg-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">

            {products?.length > 0 ? products.map((product) => (
              <ProductCard
                product={product}
                key={product._id}
              />
            )) : (
              <p className="col-span-4 text-center text-[#64748b] py-10">
                {search ? `No products found for "${search}".` : "No products found in this category."}
              </p>
            )}

          </div>
        </div>
          <FilterSidebar
          setProduct={setProduct}
          setTotalPage={setTotalPage}/>
       {totalPage > 1 &&  (
  <div className="mt-6 flex gap-2 justify-center items-center pb-6">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-white border border-[#e2e8f0] text-sm disabled:opacity-50 hover:border-[#6366f1]"
          >
            Prev
          </button>

          {[...Array(totalPage)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-2 text-sm border ${
                page === i + 1
                  ? "bg-[#6366f1] text-white border-[#6366f1]"
                  : "bg-white border-[#e2e8f0] hover:border-[#6366f1]"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPage}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-white border border-[#e2e8f0] text-sm disabled:opacity-50 hover:border-[#6366f1]"
          >
            Next
          </button>

        </div>
       )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<p className="p-10 text-center text-[#64748b]">Loading...</p>}>
      <HomeContent />
    </Suspense>
  );
}
