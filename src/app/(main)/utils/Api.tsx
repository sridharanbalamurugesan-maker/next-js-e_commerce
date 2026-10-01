import axios from 'axios'

const api=axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_BASE_URL||"https://api-ecommerce.softean.com"
})
console.log("BASE URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
api.interceptors.request.use((req)=>{
    if (typeof window !== "undefined"){
    const token=localStorage.getItem("token");
    if(token){
        req.headers.Authorization=`Bearer ${token}`;
    }}
    return req;
});
api.interceptors.response.use((res)=>res,(error)=>{
    console.log("INTERCEPTOR ERROR:", error.response);
    const status = error.response?.status;
    const url = error.config?.url || "";
    const isLoginRequest = url.includes("/api/login");
    if(typeof window !== "undefined" && status===401 && !isLoginRequest){
        localStorage.removeItem("token");
        window.location.href="/login"
    }
    return Promise.reject(error);
})

export const axiosPost=(url:string,data:unknown)=>{
    return api.post(url,data);
}

export const axiosGet=(url:string)=>{
    return api.get(url);
}

export const axiosPut=(url:string,data:unknown)=>{
    return api.put(url,data);
}

export const axiosDelete=(url:string)=>{
    return api.delete(url);
}