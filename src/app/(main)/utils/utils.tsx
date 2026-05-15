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