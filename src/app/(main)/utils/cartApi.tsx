import { axiosDelete, axiosGet, axiosPost } from "./Api";

export const addToCart=async(payload:unknown)=>{
    let data;
    try {
        data=await axiosPost("/order/add-cart",payload);
    } catch (error) {
        return false;
    }
    return data?.data;
}
export const getCartByUser=async(id:string)=>{
    let data;
    try {
        data=await axiosGet(`/order/get-cart-by-user/${id}`);
    } catch (error) {
        return false
    }
    return data?.data;
}
export const deleteById=async(id:string)=>{
    let data;
    try {
        data=await axiosDelete(`/order/delete-cart/${id}`)
    } catch (error) {
        return false
    }
    return data?.data;
}