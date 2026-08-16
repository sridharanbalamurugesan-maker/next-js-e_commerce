"use client";

import { useState } from "react";
import { createChat } from "../utils/supportApi";
import { failureLoader, successLoader } from "../utils/utils";


export default function ChatModal() {

    const [subject, setSubject] = useState("");
    const [category, setCategory] = useState("Order Issues");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const handleClick=async()=>{
        const formData=new FormData();
        formData.append("subject",subject);
        formData.append("category",category);
        formData.append("description",description);
        if (image) {
        formData.append("image",image);
        }
       const response=await createChat(formData);
       if(response.success==true){
        successLoader("Ticket created");
        setDescription("");
        setCategory("");
        setDescription("");
        setSubject("");
        setImage(null);
         (document.getElementById("support") as HTMLDialogElement).close();
       }
       else{
        failureLoader(response.message);
       }
    }
  return (
    <>
      <dialog id="support" className="modal">
        <div className="modal-box w-11/12 max-w-2xl rounded-sm p-8">
          <h3 className="text-xl font-medium mb-6 text-[#0f172a]">
            Help Centre
          </h3>
          <div className="mb-4">
            <label className="label">
              <span className="label-text font-semibold">Subject</span>
              <span className="text-red-500 text-xl">*</span>
            </label>

            <input
              type="text"
              placeholder="Enter the subject"
              className="input input-bordered w-full"
              value={subject}
              onChange={(e)=>setSubject(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="label">
              <span className="label-text font-semibold">Category</span>
              <span className="text-red-500 text-xl">*</span>
            </label>

            <select 
            className="select select-bordered w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}>
              <option>Order Issues</option>
              <option>Payment Issue</option>
              <option>Refund</option>
              <option>Delivery</option>
              <option>Account Problem</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="label">
              <span className="label-text font-semibold">Description</span>
              <span className="text-red-500 text-xl">*</span>
            </label>

            <textarea
              className="textarea textarea-bordered w-full h-32"
              placeholder="Write your description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="label">
              <span className="label-text font-semibold">
                Upload Image
              </span>
            </label>

            <input
              type="file"
              className="file-input file-input-bordered w-full"
               onChange={(e) => {
                if (e.target.files?.[0]) {
                  setImage(e.target.files[0]);
                }
              }}
            />
          </div>

          <div className="flex justify-end gap-4">

            <button className="fk-orange-btn px-8 py-2.5 text-sm" onClick={handleClick}>
              Submit
            </button>

            <form method="dialog">
              <button className="btn btn-outline">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}