import { axiosPost } from "./Api";

export const register=async(payload:unknown)=>{
    let data;
    try {
        data=await axiosPost('/api/register',payload)
    } catch (error) {
        return false
    }
    return data?.data;
}
export const login=async(payload:unknown)=>{
    let data;
    try {
        data=await axiosPost('/api/login',payload)
    } catch (error) {
        return false
    }
    return data?.data;
}