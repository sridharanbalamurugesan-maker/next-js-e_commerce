import { axiosGet, axiosPost } from "./Api";

export const resetPassword=async(token:unknown,password:unknown)=>{
    let data;
    try {
        data=await axiosPost(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reset-password/${token}`,{password})
        return data?.data;
    } catch (error:any) {
        return error?.response?.data;
    }
    
}
export const logedinUserResetPassword=async(password:unknown)=>{
    let data;
    try {
        data=await axiosPost('/api/reset-password',password);
        return data?.data;
    } catch (error:any) {
         return error?.response?.data;
    }
}
export  const validateToken=async(token:unknown)=>{
    let data;
    try {
        data=await axiosGet(`/forgot/validate-reset-token/${token}`);
         return data?.data;
    } catch (error:any) {
        return error?.response?.data;
    }
   
}