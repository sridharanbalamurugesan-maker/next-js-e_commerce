import { useRouter } from "next/navigation"

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating:number;
}

interface ProductCardProps {
  product: Product;
}
export default function({product}:ProductCardProps){
    const router=useRouter();
    const handleClick=()=>{
        router.push(`/viewProduct/${product._id}`)
    }
    return(
    <>
     <div
      className="bg-white p-3 cursor-pointer hover:shadow-lg transition duration-200 w-full h-full"
      onClick={handleClick}
    >

      <div className="h-[180px] flex items-center justify-center mb-3">
        <img
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.image}`}
          alt={product.name}
          width={250}
          height={150}
          className="max-h-[180px] w-auto object-contain"
        />
      </div>

      <h4 className="text-sm text-[#0f172a] font-medium line-clamp-2 min-h-[40px]">
        {product.name}
      </h4>

      <p className="text-xs text-[#64748b] mt-1 line-clamp-2">
        {product.description}
      </p>

      <div className="flex items-center gap-2 mt-2">
        <span className="inline-flex items-center gap-0.5 bg-[#10b981] text-white text-[12px] font-semibold px-1.5 py-0.5 rounded-sm">
          {product.rating || 0} ★
        </span>
      </div>

      <h3 className="text-lg font-semibold text-[#0f172a] mt-2">
        ₹{product.price}
      </h3>
    </div>
    </>
)
}
