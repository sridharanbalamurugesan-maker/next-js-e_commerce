import { axiosGet, axiosPut } from "./Api";

export const orderStatusChange=async(id:string,payload:unknown)=>{
    let data;
    try {
        data=await axiosPut(`/payment/order-status/${id}`,payload);
    } catch (error) {
        return false;
    }
    return data?.data;
}
export const getAllOrder=async()=>{
    let data;
    try {
        data=await axiosGet('/my-order/get-all-order');
    } catch (error) {
        return false;
    }
    return data?.data;
}
export const editOrder=async(id:string,payload:unknown)=>{
    let data;
    try {
        data=await axiosPut(`/my-order/edit-order/${id}`,payload);
    } catch (error) {
        return false;
    }
    return data?.data;
}