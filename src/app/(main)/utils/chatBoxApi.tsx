import axios from "axios";
import { axiosGet, axiosPost, axiosPut } from "./Api";

export const sentMessage=async(payload:unknown)=>{
    let data;
    try {
        data=await axiosPost("/chatBox/post-message",payload);
    } catch (error) {
        return false;
    }
    return data?.data;
}
export const getMessage=async(id:any)=>{
let data;
try {
    data=await axiosGet(`/chatBox/get-all-message/${id}`);
} catch (error) {
    return false;
}
return data?.data;
}
export const updateTicketStatus=async(tickedId:string,status:string)=>{
    let data;
    try {
        data=await axiosPut(`/chatBox/ticket-status/${tickedId}`,{status});
    } catch (error) {
        return false;
    }
    return data?.data;
}