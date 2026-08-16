"use client";
import { useEffect, useRef, useState } from "react";
import {getReview, postReview } from "../utils/productApi";
import { successLoader, failureLoader } from "../utils/utils";
import { editOrder } from "../utils/order";

type ReviewImage = {
  file: File | null;
  preview: string;
  path?: string;
};

export default function Review({productId,rating,setRating,reviewMode="add",onSuccess}:any) {
  
const [comment, setComment] = useState("");
const [images, setImages] = useState<ReviewImage[]>([]);
const [existingReview, setExistingReview] = useState<any>(null);
const fileInputRef = useRef<HTMLInputElement>(null);

const clearImages = () => {
   setImages((prev) => {
     prev.forEach((img) => {
       if (img.file) URL.revokeObjectURL(img.preview);
     });
     return [];
   });
   if (fileInputRef.current) {
     fileInputRef.current.value = "";
   }
};

useEffect(() => {
   const loadReview = async () => {
     setComment("");
     clearImages();
     setExistingReview(null);

     if (!productId) return;

     const response = await getReview(productId);
     if (response?.success && response.data) {
       const review = response.data;
       setExistingReview(review);
       setComment(review.comment || "");
       if (review.rating) {
         setRating(Number(review.rating));
       }
       if (review.images?.length) {
         setImages(
           review.images.map((path: string) => ({
             file: null,
             preview: `${process.env.NEXT_PUBLIC_API_BASE_URL}/${path}`,
             path,
           }))
         );
       }
     }
   };

   loadReview();
}, [productId, reviewMode]);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setImages((prev) => {
      const remaining = 5 - prev.length;
      const next = files.slice(0, remaining).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      return [...prev, ...next];
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const target = prev[index];
      if (target?.file) URL.revokeObjectURL(target.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const isEdit = reviewMode === "edit" || !!existingReview;

  const handleSubmit = async () => {
    let response;
    try {
      const formData = new FormData();
      formData.append("rating", String(rating));
      formData.append("comment", comment);

      const existingImages = images
        .filter((img) => img.path && !img.file)
        .map((img) => img.path as string);
      formData.append("existingImages", JSON.stringify(existingImages));

      images.forEach((img) => {
        if (img.file) {
          formData.append("images", img.file);
        }
      });

      if(isEdit){
        response=await editOrder(productId, formData)
      }
      else {
          response = await postReview(productId, formData);
      }
    
    if(response?.success==true) {
        successLoader(response.message);
        onSuccess?.();
      } else {
        failureLoader(response?.message || "Failed to submit review");
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
    clearImages();
    setExistingReview(null);
  }

  return (
    <dialog id="my_modal_2" className="modal">
      <form method="dialog" className="modal-box rounded-sm">

             <div>
  <h3 className="text-lg font-medium mb-3 text-[#0f172a]">
    {isEdit ? "Edit your review" : "Rate this product"}
  </h3>

   <div className="flex gap-1">
  {[1,2,3,4,5].map((star)=>(
    <button
      key={star}
      type="button"
      onClick={() => handleRating(star)}
      className={`text-3xl ${
        star <= rating
          ? "text-[#f59e0b]"
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

        <div className="mt-4">
          <p className="text-sm font-medium text-[#0f172a] mb-1">Add photos</p>
          <p className="text-xs text-[#64748b] mb-3">You can upload up to 5 images (jpeg, png, webp)</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            multiple
            className="hidden"
            onChange={handleImages}
          />

          <div className="flex flex-wrap gap-3">
            {images.map((img, index) => (
              <div key={`${img.path || img.preview}-${index}`} className="relative w-20 h-20 border border-[#e2e8f0]">
                <img
                  src={img.preview}
                  alt="review"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#0f172a] text-white text-xs leading-5"
                  onClick={() => removeImage(index)}
                >
                  ✕
                </button>
              </div>
            ))}

            {images.length < 5 && (
              <button
                type="button"
                className="w-20 h-20 border border-dashed border-[#6366f1] text-[#6366f1] text-xs font-medium flex flex-col items-center justify-center gap-1"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="text-xl leading-none">+</span>
                Add photo
              </button>
            )}
          </div>
        </div>

        <button className="fk-orange-btn w-full py-3 text-sm" onClick={handleSubmit} style={{marginTop:10}} >
          {isEdit
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
