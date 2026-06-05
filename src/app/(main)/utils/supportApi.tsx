import { axiosPost } from "./Api";

export const createChat=async(payload:unknown)=>{
    let data;
    try {
        data=await axiosPost("/support/create-ticket",payload);
    } catch (error) {
        return false
    }
    return data?.data;
}