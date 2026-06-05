import { axiosGet, axiosPost } from "./Api";

export const forgotPass=async(payload:unknown)=>{
    let data;
    try {
        data=await axiosPost('/forgot/change-password',payload);
    } catch (error:any) {
        return error.message
    }
    return data?.data;
}
