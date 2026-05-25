"use client";
import { useEffect, useState } from "react";
import {postReview } from "../utils/productApi";
import { successLoader, failureLoader } from "../utils/utils";
import { editOrder } from "../utils/order";

export default function Review({productId,rating,setRating,reviewMode}:any) {
  
const [comment, setComment] = useState("");

useEffect(() => {
   setComment("");
}, []);

  const handleSubmit = async () => {
    let response;
    try {
      if(reviewMode==="add"){
          response = await postReview(productId,{rating,comment});
      }
      else if(reviewMode==='edit'){
        response=await editOrder(productId,{rating,comment})
      }
    
    if(response.success==true) {
        successLoader(response.message);
      }}
     catch (err: any) {
      failureLoader(err.message);
    }
  }
  const handleRating=(values:number)=>{
       setRating(values);
        };
  const handleClose=()=>{
    setComment("");
  }

  return (
    <dialog id="my_modal_2" className="modal">
      <form method="dialog" className="modal-box">

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
        star <= rating
          ? "text-yellow-400"
          : "text-gray-300"
      }`}
    >
      ★
    </button>
  ))}
</div>
        <div className="mt-4">

  <textarea
    className="textarea textarea-bordered w-full"
    placeholder="Write your comment..."
    value={comment}
    onChange={(e) => setComment(e.target.value)}
  />

</div>

        <button className="btn btn-primary w-full" onClick={handleSubmit} style={{marginTop:10}} >
          {reviewMode === "edit"
    ? "Edit Review"
    : "Submit Review"}
        </button>
      </div>
      <div className="flex justify-center">
  <button  className="btn btn-outline px-6"style={{marginTop:10}} onClick={handleClose}>Close</button>
</div>
      </form>
    </dialog>
  );
}