import { axiosDelete, axiosGet, axiosPost, axiosPut } from "./Api";

export const getAllCategory=async()=>{
    let data;
    try {
        data=await axiosGet("/category/get-all-categories")
    } catch (error) {
        return false;
    }
    return data?.data
}
export const createCategory=async(payload:unknown)=>{
let data;
  try {
    data=await axiosPost("/category/create-category",payload);
  } catch (error) {
    return false
  }
  return data?.data
}
export const updateCategory=async(id:string,payload:unknown)=>{
    let data;
    try {
        data=await axiosPut(`/category/category-edit/${id}`,payload);
    } catch (error) {
        return false
    }
    return data?.data
}
export const deleteCategory=async(id:string)=>{
    let data;
    try {
        data=await axiosDelete(`/category/delete-category/${id}`)
    } catch (error) {
     return false   
    }
    return data?.data;
}
export const getCategoryOptions=async()=>{
    let data;
    try {
        data=await axiosGet("/category/get-category-options")
    } catch (error) {
        return false;
    }
    return data?.data;
}