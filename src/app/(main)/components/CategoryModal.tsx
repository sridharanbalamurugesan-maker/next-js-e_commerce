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
  <div className="modal-box">
    <h3 className="font-bold text-lg">Add category</h3>
    <Formik
    initialValues={categoryData||initialValues}
    validationSchema={validationSchema}
    enableReinitialize
    onSubmit={handleSubmit}>
         {({ setFieldValue }) => (
        <Form className="space-y-5">
                 <div>
                 <label className="block mb-2 font-medium">
                  Category Name
                 </label>
                <Field type="text" name="categoryName" placeholder="Enter the categoryName"
                 className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />
                <ErrorMessage name="categoryName" component="div" className="text-red-500 text-sm mt-1" />
                </div> 
                <div>
                 <label className="block mb-2 font-medium">
                  description
                 </label>
                <Field type="text" name="description" placeholder="Enter the description"
                 className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                 <label className="block mb-2 font-medium">
                  image
                 </label>
                <input type="file" name="image" placeholder="Insert a Image"
                 className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                 onChange={(event) => {
                 setFieldValue("image", event.currentTarget.files?.[0]);
                  }}
                />
                <ErrorMessage name="image" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
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