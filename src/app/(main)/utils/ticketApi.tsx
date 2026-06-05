import { axiosGet } from "./Api";

export const getAllUserTickets=async()=>{
    let data;
    try {
        data=await axiosGet('/ticket/my-ticket');
    } catch (error) {
        return false;
    }
    return data?.data;
}
export const getAllAdminTickets=async()=>{
    let data;
    try {
        data=await axiosGet('/ticket/all-ticket');
    } catch (error) {
        return false;
    }
    return data?.data;
}