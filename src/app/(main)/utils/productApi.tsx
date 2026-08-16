import { axiosDelete, axiosGet, axiosPost, axiosPut } from "./Api";

export const getAllProduct=async(page=1,limit=8,category?:string|null,search?:string|null)=>{
    let data;
    try {
        let url=`/product/get-all-product?page=${page}&limit=${limit}`;
        if(category){
            url+=`&category=${category}`;
        }
        if(search){
            url+=`&search=${encodeURIComponent(search)}`;
        }
        data=await axiosGet(url);
    } catch (error) {
        return false
    }
    return data?.data;
}
export const createProduct=async(payload:unknown)=>{
   let data;
   try {
    data=await axiosPost("/product/create-product",payload);
   } catch (error) {
    return false;
   }
   return data?.data;
}
export const updateProduct=async(id:string,payload:unknown)=>{
    let data;
    try {
        data=await axiosPut(`/product/product-edit/${id}`,payload)
    } catch (error) {
        return false
    }
    return data?.data;
}
export const deleteProduct=async(id:string)=>{
    let data;
    try {
        data=await axiosDelete(`/product/product-delete/${id}`)
    } catch (error) {
        return false;
    }
    return data?.data;
}
export const productView=async(id:string)=>{
        let data;
        try {
            data=await axiosGet(`/product/product-view/${id}`)
        } catch (error) {
            return false
        }
        return data?.data;
}
export const filters=async(payload:string)=>{
    let data;
    try {
        data=await axiosGet(`/product/filter-products?${payload}`);
    } catch (error) {
        return false
    }
    return data?.data;
}
export const postReview=async(id:string,payload:unknown)=>{
  let data;
  try {
    data=await axiosPost(`/product/post-review/${id}`,payload)
  } catch (error) {
    return false
  }
  return data?.data;
}
export const getReview=async(id:string)=>{
    let data;
    try {
        data=await axiosGet(`/product/get-review/${id}`)
    } catch (error) {
        return false
    }
    return data?.data;
}