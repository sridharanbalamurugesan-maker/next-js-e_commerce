import { axiosGet } from "./Api";

export const  getProductReviews=async(id:string)=>{
    let data;
    try {
        data=await axiosGet(`/reviews/get-all-review/${id}`);
    } catch (error) {
        return false;
    }
    return data?.data;
}