"use client"

import { useEffect, useState } from "react";
import { filters } from "../utils/productApi";
import { successLoader } from "../utils/utils";
import { Modal } from "@mui/material";

  type FilterType = {
    category: string;
    brand: string[];
    minPrice: string;
    maxPrice: string;
    rating: string;
    freeShipping: boolean;
};
export default function FilterProduct({setProduct, setTotalPage}:any){
    const [filter,setFilter]=useState<FilterType>({
        category:"",
        brand:[],
        minPrice:"",
        maxPrice:"",
        rating:"",
        freeShipping:false,
    });
    const handleRating=(values:number)=>{
        setFilter((prev)=>({
            ...prev,
            rating:values.toString(),
        }));
    }
    const handlePrice=(type:string,values:string)=>{
        setFilter((prev)=>({
            ...prev,
            [type]:values,
        }))
    }
    const handleFreeShipping = () => {
        setFilter((prev) => ({
           ...prev,
    freeShipping: !prev.freeShipping,
  }));
};
    useEffect(()=>{
        
    },[])
    const handleSearch=async()=>{
        const query=new URLSearchParams();
        if(filter.category) query.append("category",filter.category);
        if(filter.rating) query.append("rating",filter.rating);
        if(filter.minPrice) query.append("minPrice",filter.minPrice);
        if(filter.maxPrice) query.append("maxPrice",filter.maxPrice);
        if(filter.freeShipping) query.append("freeShipping","true");
        if (filter.brand.length > 0){
        query.append("brand", filter.brand.join(","));
          }
          const response= await filters(query.toString());
          if(response.success==true){
            setProduct(response.data);
            successLoader(response.message);
          }
          setTotalPage(response.pagination?.totalPage||1);
          console.log("Filter response",response);
          ///close a modal
          const modal = document.getElementById("my_modal_2") as HTMLDialogElement;
                      modal.close();
    }
    return(
    <>
     <dialog id="my_modal_2" className="modal">
      <form  method="dialog" className="modal-box">
        <div>
  <h3 className="text-xl font-semibold mb-3">
    Customer Rating
  </h3>

   <div className="flex gap-1">
  {[1,2,3,4,5].map((star)=>(
    <button
      key={star}
      type="button"
      onClick={() => handleRating(star)}
      className={`text-3xl ${
        star <= Number(filter.rating)
          ? "text-yellow-400"
          : "text-gray-300"
      }`}
    >
      ★
    </button>
  ))}
</div>
</div>
       <div  className="mt-6">
        <h3>Price</h3>
        <input className="border p-2 mb-3" 
            type="number"
            placeholder="Min"
            onChange={(e) => handlePrice("minPrice", e.target.value)}
        />
        <input className="border p-2 mb-3"
            type="number"
            placeholder="Max"
            onChange={(e) => handlePrice("maxPrice", e.target.value)}
        />
    </div>
    <div className="mt-6">
  <label className="flex items-center gap-3 cursor-pointer">

    <span>Free Shipping</span>

    <input
      type="checkbox"
      className="toggle toggle-primary"
      checked={filter.freeShipping}
      onChange={handleFreeShipping}
    />

  </label>
</div>
     <div className="flex justify-between mt-10">
    <button type="button" className="btn btn-primary" onClick={handleSearch} style={{marginTop:10}} >
      Find
    </button>
    <button className="btn btn-primary" style={{marginTop:10}}>Close</button>
  </div>
    </form>
    </dialog>
    </>
    );
}