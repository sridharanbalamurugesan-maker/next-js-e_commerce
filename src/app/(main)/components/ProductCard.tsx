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
      className="border rounded-lg p-4 shadow-md cursor-pointer hover:shadow-lg transition duration-300 w-[250px]"
      onClick={handleClick}
    >

      <img
        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.image}`}
        alt={product.name}
        width={250}
        height={150}
        className="w-full h-[150px] object-cover rounded-md"
      />

      <h4 className="text-lg font-semibold mt-3">
        {product.name}
      </h4>

      <p className="text-gray-600 mt-2">
        {product.description}
      </p>

      <h3 className="text-xl font-bold text-blue-600 mt-3">
        ₹{product.price}
      </h3>
        <h3>Rating:{product.rating}</h3>
    </div>
    </>
)
}