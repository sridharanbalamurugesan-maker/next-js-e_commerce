import { axiosGet, axiosPut } from "./Api";

export const getAllUsers=async()=>{
    let data;
    try {
        data=await axiosGet("/api/get-all-users");
    } catch (error) {
        return false;
    }
    return data?.data;
}
export const blockUser=async(id:string,{})=>{
    let data;
    try {
        data= await axiosPut(`/api/block-user/${id}`,{});
    } catch (error) {
     return false;   
    }
    return data?.data;
}
export const getProfile=async()=>{
    let data;
    try {
        data=await axiosGet("/api/get-profile");
    } catch (error) {
        return false;
    }
    return data?.data;
}
export const updateProfile=async(payload:unknown)=>{
    let data;
    try {
        data=await axiosPut("/api/update-profile",payload);
    } catch (error) {
        return false;
    }
    return data?.data;
}