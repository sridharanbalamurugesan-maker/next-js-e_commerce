"use client";

import { useEffect, useState } from "react";
import { forgotPass } from "../(main)/utils/forgotPasswordApi";
import { getLoginData, successLoader } from "../(main)/utils/utils";
import { useRouter } from "next/navigation";

export default function ForgotPage(){
    const [email,setEmail]=useState<string>('');
    const [user, setUser] = useState<any>(null);
    const router=useRouter();
    useEffect(()=>{
        const loginUser=getLoginData();
        setUser(loginUser);
    },[])
    const handleSubmit=async(e:any)=>{
        e.preventDefault();
         if (!email.trim()) {
         alert("Please enter your email");
         return;
          }
          const payload={
            email:email
          }
    const response=await forgotPass(payload);
    console.log("forgotPassword",response);
    if(response.success){
            successLoader(response.message);
    }
            setEmail("");

    };
    const handleClick=()=>{
        if(user){
            router.push('/home')
        }
        else{
            router.push('/login');
        }
    };
    return(
    <div className="flex items-center justify-center min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 border rounded-lg w-96">
             <h2 className="text-2xl font-semibold text-center">Forgot Password</h2>
             <div>
                 <label className="flex items-center justify-center">Email</label>
    <input  className="input input-bordered w-full" type="email" value={email}  placeholder="Enter your email" onChange={(e)=>{setEmail(e.target.value)}}/>
             </div>
            
            <button type="submit" className="btn btn-primary">Send Reset Link</button>
            <button type="button" className="btn btn-primary" onClick={handleClick}>{user?"Home":"Login"}</button>
        </form>
    </div>
    )
}