import { Suspense } from "react";
import ProductViewClient from "./ProductViewClient";

export default function ProductViewPage() {
  return (
    <Suspense fallback={<h2 className="p-10 text-center text-[#64748b]">Loading Product...</h2>}>
      <ProductViewClient />
    </Suspense>
  );
}
