import { axiosPost } from "./Api";

export const makePayment=async(payload:unknown)=>{
    let data;
    try {
        data=await axiosPost(`/payment/create`,payload);
    } catch (error) {
      return false
    }
    return data?.data;
}