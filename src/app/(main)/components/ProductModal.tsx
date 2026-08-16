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
        brand:string;
        isFreeShipping:boolean;
        image:File|string|null;
    }
    interface CategoryOption{
    id:string;
    name:string;
}
 const initialValues:Product = {
    name: "",
    price:"",
    description: "",
    stocks:"",
    category:null,
    brand:"",
    isFreeShipping:false,
    image: ""
  };
    const [ProductData,setProductData]=useState<Product>(initialValues)
   const [categories,setCategories]=useState<CategoryOption[]>([])
    const validationSchema=Yup.object({
        name:Yup.string().required("Enter the Product Name"),
        price:Yup.number().required("Enter the price"),
        description:Yup.string().required("Enter the description"),
        stocks:Yup.number().required("Enter the stocks"),
        category:Yup.object().required("select the category"),
        brand:Yup.string().required("Enter the Brand"),
        image:Yup.mixed().required("Insert A Image")
    })
     
  console.log("BASE URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
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
                brand:updateData.brand,
                isFreeShipping:updateData.isFreeShipping,
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
                brand:"",
                isFreeShipping:false,
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
            formData.append("brand",values.brand);
            formData.append("isFreeShipping",values.isFreeShipping.toString());
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
            const modal = document.getElementById(
                    "my_modal_2"
                    ) as HTMLDialogElement;
                    modal.close();
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
      <div className="modal-box rounded-sm">
        <h3 className="font-medium text-lg text-[#0f172a] mb-4">Add Product</h3>
        <Formik
        initialValues={ProductData||initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}>
             {({ setFieldValue,values }) => (
            <Form className="space-y-5">
                     <div>
                     <label className="block mb-1 text-xs text-[#64748b] uppercase tracking-wide">
                      Product Name
                     </label>
                    <Field type="text" name="name" placeholder="Enter the categoryName"
                     className="fk-input"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                    </div> 
                    <div>
                     <label className="block mb-1 text-xs text-[#64748b] uppercase tracking-wide">
                      Price
                     </label>
                    <Field type="text" name="price" placeholder="Enter the categoryName"
                     className="fk-input"
                    />
                    <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
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
                      Stocks
                     </label>
                    <Field type="text" name="stocks" placeholder="Enter the categoryName"
                     className="fk-input"
                    />
                    <ErrorMessage name="stocks" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                     <div>
                     <label className="block mb-1 text-xs text-[#64748b] uppercase tracking-wide">
                      Brand
                     </label>
                    <Field type="text" name="brand" placeholder="Enter the BrandName"
                     className="fk-input"
                    />
                    <ErrorMessage name="brand" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                     <div>
                     <label className="block mb-1 text-xs text-[#64748b] uppercase tracking-wide">
                      Free Shipping
                     </label>

                     <label  className="flex items-center gap-3 cursor-pointer">
                    <Field name="isFreeShipping">
                            {({ field, form }: any) => (
                                <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                checked={field.value || false}
                                onChange={(e) =>
                                    form.setFieldValue(
                                    "isFreeShipping",
                                    e.target.checked
                                    )
                                }
                                />
                            )}
                      </Field>
                     <span>Available </span>  
                     </label> 
                    <ErrorMessage name="isFreeShipping" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div>
                        <label className="block mb-1 text-xs text-[#64748b] uppercase tracking-wide">
                      Category
                     </label>                   
                     <Autocomplete
                disablePortal                 
                options={categories}
                getOptionLabel={(option) => option.name || ""}
                isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                }
                value={values.category || null}
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
    </>)
}