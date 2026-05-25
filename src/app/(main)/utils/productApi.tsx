import { axiosDelete, axiosGet, axiosPost, axiosPut } from "./Api";

export const getAllProduct=async(page=1,limit=5)=>{
    let data;
    try {
        data=await axiosGet(`/product/get-all-product?page=${page}&limit=${limit}`);
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