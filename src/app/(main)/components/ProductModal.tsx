"use client";

import { Autocomplete, TextField } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { get } from "http";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { getCategoryOptions } from "../utils/categoryApi";
import { createProduct, updateProduct } from "../utils/productApi";
import { failureLoader, successLoader } from "../utils/utils";

export default function ProductModal({handleReload,updateData}:any){
      interface Product{
        _id?:string;
        name:string;
        price:number|string;
        description:string;
        stocks:number|string;
        category:CategoryOption|null;
        image:File|string|null;
    }
    interface CategoryOption{
    id:string;
    name:string;
}
    const [ProductData,setProductData]=useState<Product|null>(null)
   const [categories,setCategories]=useState<CategoryOption[]>([])
    const validationSchema=Yup.object({
        name:Yup.string().required("Enter the Product Name"),
        price:Yup.number().required("Enter the price"),
        description:Yup.string().required("Enter the description"),
        stocks:Yup.number().required("Enter the stocks"),
        category:Yup.object().required("select the category"),
        image:Yup.mixed().required("Insert A Image")
    })
      const initialValues:Product = {
    name: "",
    price:"",
    description: "",
    stocks:"",
    category:null,
    image: ""
  };
  useEffect(() => {

    const loadCategory = async () => {

        const response = await getCategoryOptions();

        if(response.success === true){

            const categoryOption = response.data.map((item:any) => ({
                id: item.id,
                name: item.name
            }));

            console.log("categoryOptions",categoryOption,"response?.data",response?.data);
            setCategories(categoryOption);
        }
    };

    loadCategory();

}, []);
useEffect(()=>{
        if(updateData){
            console.log("Product Edit data",updateData);
            setProductData({
                name:updateData.name,
                price:updateData.price,
                description:updateData.description,
                stocks:updateData.stocks,
                category: updateData?.category?{name: updateData.category.name,id: updateData.category._id}:null,
                image:null
            })
        }
        else{
            setProductData({
                name:"",
                price:"",
                description:"",
                stocks:"",
                category:null,
                image:null
            })
        }
},[updateData])
    const handleSubmit=async(values:any)=>{
        try {
            const formData=new FormData();
            formData.append("name",values.name);
            formData.append("price",values.price);
            formData.append("description",values.description);
            formData.append("stocks",values.stocks);
            formData.append("category",values.category.id);
            if(values.image){
            formData.append("image",values.image);
        }
        let response
        if(updateData){
            response=await updateProduct(updateData._id,formData)
        }
        else{
            response=await createProduct(formData);
        }
        if(response.success===true){
            handleReload();
            successLoader(response.message);
        }
        else{
            failureLoader(response.message);
        }
        } catch (error:any) {
            failureLoader(error.message);
        }
    }
    return(
    <>
    <dialog id="my_modal_2" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add Product</h3>
        <Formik
        initialValues={ProductData||initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}>
             {({ setFieldValue,values }) => (
            <Form className="space-y-5">
                     <div>
                     <label className="block mb-2 font-medium">
                      Product Name
                     </label>
                    <Field type="text" name="name" placeholder="Enter the categoryName"
                     className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                    </div> 
                    <div>
                     <label className="block mb-2 font-medium">
                      Price
                     </label>
                    <Field type="text" name="price" placeholder="Enter the categoryName"
                     className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                    />
                    <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
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
                      Stocks
                     </label>
                    <Field type="text" name="stocks" placeholder="Enter the categoryName"
                     className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                    />
                    <ErrorMessage name="stocks" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">
                      Category
                     </label>                   
                     <Autocomplete
                disablePortal                 
                options={categories}
                getOptionLabel={(option) => option.name || ""}
                isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                }
                value={values.category}
                onChange={(event, newValue) => {
                    setFieldValue("category", newValue);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder="Select Category"
                    />
                )}
            />
        <ErrorMessage name="categoryName" component="div" className="error"/>
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
    </>)
}