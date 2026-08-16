import { toast } from 'react-toastify'

export const successLoader=(text:string)=>{
    return toast.success(text, {
                    position: "top-center",
                    autoClose: 3000
                });

}
export const failureLoader=(text:string)=>{
          return toast.error(text, {
              position: "top-center",
              autoClose: 3000
              });
}
export const setLoginData=(jsonData:any)=>{
    try {
          if(!jsonData){
        return null
    }
    localStorage.setItem("userData",JSON.stringify(jsonData));
    return true
    }
     catch (error) {
         console.log("setLoginData error", error);
        return null;
    }
}
export const getLoginData=()=>{
    try {
        
        const userData=localStorage.getItem("userData");
        if(!userData){
            return null
        }
        return JSON.parse(userData);
    } catch (error) {
          console.log("getLoginData error", error);
        return null;
    }
}
export const removeLoginData=()=>{
    try {
        localStorage.removeItem("userData");
        return true
    } catch (error) {
        console.log("removeLoginData",error)
        return null;
    }
}

export const CART_UPDATED_EVENT = "cart-updated";
export const HOME_RESET_EVENT = "home-reset";
export const SEARCH_CLEARED_EVENT = "search-cleared";
export const PROFILE_UPDATED_EVENT = "profile-updated";

export const DEFAULT_PROFILE_IMAGE =
  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

export const getProfileImageUrl = (image?: string | null) => {
    const trimmed = typeof image === "string" ? image.trim() : "";
    if (!trimmed) {
        return DEFAULT_PROFILE_IMAGE;
    }
    if (trimmed.startsWith("http")) {
        return trimmed;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    return `${baseUrl}/${trimmed}`;
}

export const notifyProfileUpdated = () => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
    }
}

export const notifySearchCleared = () => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(SEARCH_CLEARED_EVENT));
    }
}

export const notifyHomeReset = () => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(HOME_RESET_EVENT));
    }
}

export const notifyCartUpdated = () => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(CART_UPDATED_EVENT));
    }
}