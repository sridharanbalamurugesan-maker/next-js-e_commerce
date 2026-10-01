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
    try {
        const data=await axiosPost('/api/login',payload)
        return data?.data;
    } catch (error: any) {
        const message = error?.response?.data?.message || "Login failed";
        const err = new Error(message) as Error & { status?: number };
        err.status = error?.response?.status;
        throw err;
    }
}