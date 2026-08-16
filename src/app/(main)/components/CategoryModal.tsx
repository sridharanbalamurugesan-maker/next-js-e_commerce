"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { createCategory, updateCategory } from "../utils/categoryApi";
import { failureLoader, successLoader } from "../utils/utils";


export default function CategoryModal({handleReload,updateData}:any){
    interface AddCategoryModal{
        categoryName:string;
        description:string;
        image:any;
    }
    const [categoryData,setCategoryData]=useState<AddCategoryModal>();
    const validationSchema=Yup.object({
        categoryName:Yup.string().required("Enter the category Name"),
        description:Yup.string().required("Enter the description"),
        image:Yup.mixed().required("Insert image")
    })
      const initialValues: AddCategoryModal = {
    categoryName: "",
    description: "",
    image: "",
  };
    useEffect(()=>{
        if(updateData){
            
            setCategoryData({ 
            categoryName: updateData.name,
            description: updateData.description,
            image:null,
        });
        }
        else{
            setCategoryData({
                categoryName:"",
                description:"",
                image:""
            })
        }
    },[updateData])

    const handleSubmit=async(values:any)=>{
            try {
                const formData=new FormData();
                formData.append("name",values.categoryName);
                formData.append("description",values.description);
                if(values.image){
                    formData.append("image",values.image);
                }
                let response;
                if(updateData){
                    response=await updateCategory(updateData._id,formData);
                }
                else{
                    response=await createCategory(formData);
                }
                if(response.success==true){
                    successLoader(response.message);
                    handleReload();
                }
                else{
                    failureLoader(response.message);
                }
            } catch (error:any) {
                failureLoader(error.message)
            }
    }
         
    return(
    <>
<dialog id="my_modal_2" className="modal">
  <div className="modal-box rounded-sm">
    <h3 className="font-medium text-lg text-[#0f172a] mb-4">Add category</h3>
    <Formik
    initialValues={categoryData||initialValues}
    validationSchema={validationSchema}
    enableReinitialize
    onSubmit={handleSubmit}>
         {({ setFieldValue }) => (
        <Form className="space-y-5">
                 <div>
                 <label className="block mb-1 text-xs text-[#64748b] uppercase tracking-wide">
                  Category Name
                 </label>
                <Field type="text" name="categoryName" placeholder="Enter the categoryName"
                 className="fk-input"
                />
                <ErrorMessage name="categoryName" component="div" className="text-red-500 text-sm mt-1" />
                </div> 
                <div>
                 <label className="block mb-1 text-xs text-[#64748b] uppercase tracking-wide">
                  description
                 </label>
                <Field type="text" name="description" placeholder="Enter the description"
                 className="fk-input"
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                 <label className="block mb-1 text-xs text-[#64748b] uppercase tracking-wide">
                  image
                 </label>
                <input type="file" name="image" placeholder="Insert a Image"
                 className="w-full border border-[#e2e8f0] px-3 py-2 text-sm"
                 onChange={(event) => {
                 setFieldValue("image", event.currentTarget.files?.[0]);
                  }}
                />
                <ErrorMessage name="image" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <button
              type="submit"
              className="fk-orange-btn w-full py-3 text-sm"
            >
              submit
            </button>
        </Form>
         )}
    </Formik>
  </div>
  <form method="dialog" className="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
    </>
    )
}