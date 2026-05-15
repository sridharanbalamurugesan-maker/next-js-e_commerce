"use client";

import { useEffect, useState } from "react";
import { getLoginData } from "../utils/utils";
import { getAllProduct } from "../utils/productApi";
import { getAllCategory } from "../utils/categoryApi";
import ProductCard from "../components/ProductCard";


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

  category: {
    _id: string;
    name: string;
  };
}

export default function Home() {
  const [products, setProduct] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  useEffect(() => {
    getLoginData();
    fetchProducts(page);
    fetchCategories();
  }, [page]);
  useEffect(() => {
  console.log("BASE URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
}, []);

  const fetchProducts = async (currentPage: number) => {
    try {
      const response = await getAllProduct(currentPage, 8);

      setProduct(response.data);

      setTotalPage(response.pagination.totalPage);
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

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category._id === selectedCategory)
    : products;

  return (
    <div className="p-5">

      <div className="mb-5">
    <h2 className="text-3xl font-bold mb-5"> Home</h2>
        <div className="flex flex-wrap gap-3">
          <button
            className={`px-4 py-2 rounded border ${
              selectedCategory === null
                ? "bg-blue-600 text-white"
                : "bg-white"
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>

          {categories?.map((cat) => (
            <button
              key={cat._id}
              className={`px-4 py-2 rounded border ${
                selectedCategory === cat._id
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
              onClick={() =>
                setSelectedCategory(cat._id)
              }
            >
              {cat.name}
            </button>
          ))}

        </div>

        <hr className="my-5" />
      </div>

      <div>

        <h3 className="text-2xl font-semibold mb-5">
          Products
        </h3>

        <div
          className="flex flex-wrap gap-5"
        >

          {filteredProducts?.map((product) => (
            <ProductCard
              product={product}
              key={product._id}
            />
          ))}

        </div>

        <div
          className="mt-8 flex gap-3 justify-center"
        >

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPage)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 border rounded ${
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPage}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
}